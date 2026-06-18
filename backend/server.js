const express = require('express');
const http = require('http');
const https = require('https');
const { Server } = require('socket.io');
const crypto = require('crypto');
const seedrandom = require('seedrandom');
const bs58 = require('bs58');
const { Connection, Keypair, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, sendAndConfirmTransaction } = require('@solana/web3.js');

const b58dec = b => (typeof bs58.decode === 'function' ? bs58.decode : bs58.default.decode)(b);
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// ── Config (set these as env vars on Render) ──────────────────────────────────
const PRIVY_APP_ID = process.env.PRIVY_APP_ID || 'cm826jprh00ntnjodv1etxlfl';
const HOT_WALLET_KEY = process.env.HOT_WALLET_PRIVATE_KEY || null;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://rugs.fun';
const SOLANA_RPC = process.env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'changeme';

// ── Solana hot wallet ─────────────────────────────────────────────────────────
let hotWallet = null;
let conn = null;

function initWallet() {
  conn = new Connection(SOLANA_RPC, 'confirmed');
  if (HOT_WALLET_KEY) {
    hotWallet = Keypair.fromSecretKey(b58dec(HOT_WALLET_KEY));
    console.log(`[WALLET] ${hotWallet.publicKey}`);
  } else {
    hotWallet = Keypair.generate();
    console.log(`[WALLET] Ephemeral: ${hotWallet.publicKey} (set HOT_WALLET_PRIVATE_KEY)`);
  }
}

async function getBalance() {
  try { return (await conn.getBalance(hotWallet.publicKey)) / LAMPORTS_PER_SOL; } catch { return 0; }
}

async function sendSol(to, sol) {
  const tx = new Transaction().add(SystemProgram.transfer({
    fromPubkey: hotWallet.publicKey, toPubkey: new PublicKey(to),
    lamports: Math.floor(sol * LAMPORTS_PER_SOL)
  }));
  const sig = await sendAndConfirmTransaction(conn, tx, [hotWallet]);
  console.log(`[SEND] ${sol} SOL → ${to} | ${sig}`);
  return sig;
}

// ── Socket.IO ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: CORS_ORIGIN, methods: ['GET','POST'], credentials: true },
  transports: ['websocket', 'polling']
});

app.use(express.json());

// ── REST ──────────────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  res.json({ ok: true, wallet: hotWallet?.publicKey.toString(), balance: await getBalance(), players: players.size, phase: gamePhase });
});

app.get('/api/balance', async (req, res) => {
  res.json({ wallet: hotWallet?.publicKey.toString(), sol: await getBalance() });
});

// Withdraw to any wallet (requires ADMIN_SECRET)
app.post('/api/withdraw', async (req, res) => {
  const { to, amount, secret } = req.body || {};
  if (secret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try { res.json({ ok: true, sig: await sendSol(to, parseFloat(amount)) }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Player store ──────────────────────────────────────────────────────────────
const players = new Map();

// ── Crate rewards (from rugs.fun source) ─────────────────────────────────────
const CRATE_REWARDS = {
  tier0:[0.001,0.02], tier1:[0.005,1], tier2:[0.025,10], tier3:[0.1,25],
  tier4:[0.2,35], tier5:[0.5,50], tier6:[1,75], tier7:[2,100],
  tier8:[5,150], tier9:[10,250], tier10:[25,500],
  daily_or_rakeback:[0.001,0.5], referral:[0.01,2]
};
const roll = t => { const [a,b]=CRATE_REWARDS[t]||[0.001,0.01]; return { type:'cash', amount:parseFloat((a+Math.random()*(b-a)).toFixed(3)) }; };

// ── Game engine (exact formula from rugs.fun source code) ─────────────────────
function buildGame(gameId) {
  const seed = crypto.randomBytes(32).toString('hex');
  const seedHash = crypto.createHash('sha256').update(seed).digest('hex');
  const isV7 = gameId?.length===36 && gameId[14]==='7';
  const rng = seedrandom(isV7 ? seed : seed+'-'+gameId);
  const prices=[1]; let p=1, mn=1;
  for(let i=0;i<100000;i++){
    if(rng()<0.005||p<=0){prices.push(Math.max(0,mn*0.02));break;}
    if(rng()<1e-5&&p<=100)p*=10;
    else{
      const d=rng()<0.125?(0.15+rng()*0.10)*(rng()>.5?1:-1):-0.02+rng()*0.05+0.005*Math.min(10,Math.sqrt(p))*(2*rng()-1);
      p=Math.max(0,p*(1+d));
    }
    if(p<mn)mn=p; prices.push(p);
  }
  return { seed, seedHash, prices, peak:Math.max(...prices), gameId };
}

// ── Game loop ─────────────────────────────────────────────────────────────────
let cur=null, prices=[], tick=0, gamePhase='waiting';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

async function loop(){
  while(true){
    const id=crypto.randomUUID(), g=buildGame(id);
    cur=g; prices=g.prices; gamePhase='preround'; tick=0;
    io.emit('game:standard:phase',{phase:'preround',gameId:id,price:1,provablyFair:{serverSeedHash:g.seedHash}});
    await sleep(3000);
    gamePhase='round';
    io.emit('game:standard:phase',{phase:'round',gameId:id,price:1});
    for(let i=0;i<prices.length;i++){
      tick=i;
      io.emit('game:standard:tick',{t:i,p:prices.slice(Math.max(0,i-9),i+1),g:id});
      await sleep(250);
      if(prices[i]<=0.02)break;
    }
    gamePhase='crash';
    io.emit('game:standard:phase',{phase:'crash',gameId:id,price:prices[tick],peakMultiplier:g.peak,provablyFair:{serverSeed:g.seed,serverSeedHash:g.seedHash}});
    await sleep(2500);
  }
}

// ── JWT decode ────────────────────────────────────────────────────────────────
function decodeJwt(t){ try{ const p=t.split('.'); return JSON.parse(Buffer.from(p[1],'base64url').toString()); }catch{return null;} }

// ── Socket events ─────────────────────────────────────────────────────────────
io.on('connection', socket => {
  let p=null;
  socket.on('authenticate', async({token})=>{
    const payload=decodeJwt(token);
    if(!payload){socket.emit('authError',{error:'Invalid'});return;}
    p={id:payload.sub||'unknown',balance:0,crateKeys:{tier0:5,tier1:1}};
    players.set(socket.id,p);
    socket.emit('authenticated',{success:true,playerId:p.id});
    socket.emit('playerUpdate',{id:p.id,cash:p.balance,bonusBalance:0});
  });
  socket.on('game:standard:subscribe',()=>{
    if(cur) socket.emit('game:standard:phase',{phase:gamePhase,gameId:cur.gameId,price:prices[tick]||1,provablyFair:{serverSeedHash:cur.seedHash}});
    socket.emit('game:standard:stats',{recentGames:[],online:io.engine.clientsCount});
  });
  socket.on('game:standard:test:getState',()=>{
    if(cur&&gamePhase==='preround') socket.emit('game:standard:test:getState',{serverSeed:cur.seed,serverSeedHash:cur.seedHash,gameId:cur.gameId});
  });
  socket.on('getCrateInfo',(cb)=>{
    const r={success:true,crateKeys:p?.crateKeys||{}};
    typeof cb==='function'?cb(r):socket.emit('crateInfo',r);
  });
  socket.on('getDailyCrateStatus',(cb)=>{
    const r={success:true,nextAvailableAt:Date.now()-1000,rakebackCrates:1,xpRakeback:100};
    typeof cb==='function'?cb(r):socket.emit('dailyCrateStatus',r);
  });
  socket.on('openCrate',(type,cb)=>{
    if(!p){const e={success:false,error:'Not authed'};typeof cb==='function'&&cb(e);return;}
    const daily=['daily_or_rakeback'];
    if(!daily.includes(type)&&!(p.crateKeys[type]>0)){const e={success:false,error:'No keys'};typeof cb==='function'&&cb(e);return;}
    if(!daily.includes(type))p.crateKeys[type]--;
    const reward=roll(type);
    p.balance+=reward.amount;
    players.set(socket.id,p);
    socket.emit('playerUpdate',{id:p.id,cash:p.balance});
    console.log(`[CRATE] ${p.id} ${type} +${reward.amount}`);
    const r={success:true,reward};
    typeof cb==='function'?cb(r):socket.emit('crateOpened',r);
  });
  socket.on('disconnect',()=>players.delete(socket.id));
});

// ── Start ─────────────────────────────────────────────────────────────────────
initWallet();
server.listen(PORT,()=>{ console.log(`rugs-backend :${PORT}`); loop().catch(console.error); });
