import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/store/orderStore';
import { apps, paymentMethods } from '@/store/data';
import type { PaymentMethod } from '@/types';

export function OrderPage() {
  const navigate = useNavigate();
  const { selectedApp, selectedPackage, setSelectedApp, setSelectedPackage, createOrder } = useOrderStore();
  const [step, setStep] = useState<1 | 2 | 3>(selectedPackage ? 2 : 1);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [error, setError] = useState('');
  const currentApp = apps.find((a) => a.id === selectedApp);

  const handleSubmit = () => {
    if (!userId.trim()) { setError('\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0645\u0639\u0631\u0641 \u0627\u0644\u062D\u0633\u0627\u0628'); return; }
    if (!selectedPayment) { setError('\u064A\u0631\u062C\u0649 \u0627\u062E\u062A\u064A\u0627\u0631 \u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639'); return; }
    setError('');
    const order = createOrder(userId, selectedPayment, email, phone);
    navigate(`/confirmation/${order.id}`);
  };

  return (
    <main className="min-h-screen pt-28 px-6 pb-20">
      <div className="max-w-3xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-center mb-2">{'\u0627\u0637\u0644\u0628 \u0623\u0644\u0645\u0627\u0633\u0627\u062A\u0643'}</motion.h1>
        <p className="text-white/50 text-center mb-10">{'\u0627\u062A\u0628\u0639 \u0627\u0644\u062E\u0637\u0648\u0627\u062A'}</p>
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (<div key={s} className="flex items-center gap-2"><div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s ? 'bg-[var(--color-primary)]' : 'bg-white/10 text-white/40'}`}>{s}</div>{s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-[var(--color-primary)]' : 'bg-white/10'}`} />}</div>))}
        </div>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-8">
              <div><h3 className="text-xl font-bold mb-4">{'\u0627\u062E\u062A\u0631 \u0627\u0644\u062A\u0637\u0628\u064A\u0642'}</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {apps.map((app) => (<button key={app.id} onClick={() => setSelectedApp(app.id)} className={`p-4 rounded-xl text-center transition-all ${selectedApp === app.id ? 'glass border-[var(--color-primary)] glow' : 'glass hover:border-white/20'}`}><span className="text-2xl block">{app.icon}</span><span className="text-xs mt-1 block">{app.nameAr}</span></button>))}
                </div>
              </div>
              {currentApp && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><h3 className="text-xl font-bold mb-4">{'\u0627\u062E\u062A\u0631 \u0627\u0644\u0628\u0627\u0642\u0629'}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentApp.packages.map((pkg) => (<button key={pkg.id} onClick={() => setSelectedPackage(pkg)} className={`p-4 rounded-xl text-center transition-all ${selectedPackage?.id === pkg.id ? 'glass border-[var(--color-primary)] glow' : 'glass hover:border-white/20'}`}><div className="text-xl font-bold">{pkg.diamonds.toLocaleString('ar-EG')}</div><div className="text-xs text-white/50">{'\u0623\u0644\u0645\u0627\u0633\u0629'}</div><div className="text-lg font-bold text-[var(--color-diamond)] mt-2">${pkg.price}</div><div className="text-xs text-green-400">-{pkg.discount}%</div></button>))}
                </div>
              </motion.div>}
              {selectedPackage && <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => setStep(2)} className="w-full py-4 rounded-2xl bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-diamond)] font-bold text-lg">{'\u0627\u0644\u062A\u0627\u0644\u064A \u2190'}</motion.button>}
            </motion.div>
          )}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
              {selectedPackage && <div className="p-4 rounded-xl glass text-center"><span className="font-bold text-[var(--color-diamond)]">{selectedPackage.diamonds.toLocaleString('ar-EG')} {'\u0623\u0644\u0645\u0627\u0633\u0629'}</span> — <span className="font-bold text-[var(--color-accent)]">${selectedPackage.price}</span></div>}
              <div><label className="block text-sm font-medium mb-2">{'\u0645\u0639\u0631\u0641 \u0627\u0644\u062D\u0633\u0627\u0628'} *</label><input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)] focus:outline-none" /></div>
              <div><label className="block text-sm font-medium mb-2">{'\u0627\u0644\u0628\u0631\u064A\u062F'} ({'\u0627\u062E\u062A\u064A\u0627\u0631\u064A'})</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)] focus:outline-none" dir="ltr" /></div>
              <div><label className="block text-sm font-medium mb-2">{'\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641'} ({'\u0627\u062E\u062A\u064A\u0627\u0631\u064A'})</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+966..." className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)] focus:outline-none" dir="ltr" /></div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl glass font-bold">{'\u2192 \u0627\u0644\u0631\u062C\u0648\u0639'}</button>
                <button onClick={() => { if (!userId.trim()) { setError('\u064A\u0631\u062C\u0649 \u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0645\u0639\u0631\u0641'); return; } setError(''); setStep(3); }} className="flex-1 py-4 rounded-xl bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-diamond)] font-bold text-lg">{'\u0627\u0644\u062A\u0627\u0644\u064A \u2190'}</button>
              </div>
            </motion.div>
          )}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-6">
              <h3 className="text-xl font-bold mb-4">{'\u0627\u062E\u062A\u0631 \u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentMethods.map((pm) => (<button key={pm.method} onClick={() => setSelectedPayment(pm.method)} className={`p-4 rounded-xl text-right flex items-center gap-3 transition-all ${selectedPayment === pm.method ? 'glass border-[var(--color-primary)] glow' : 'glass hover:border-white/20'}`}><span className="text-2xl">{pm.icon}</span><div><div className="font-bold">{pm.labelAr}</div><div className="text-xs text-white/40">{pm.label}</div></div></button>))}
              </div>
              {selectedPayment && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-xl glass"><p className="text-sm text-white/70 mb-2">{paymentMethods.find((p) => p.method === selectedPayment)?.instructionsAr}</p><div className="p-3 rounded-lg bg-black/30 font-mono text-sm text-[var(--color-diamond)]" dir="ltr">{paymentMethods.find((p) => p.method === selectedPayment)?.address}</div></motion.div>}
              {error && <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-sm">{error}</div>}
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl glass font-bold">{'\u2192 \u0627\u0644\u0631\u062C\u0648\u0639'}</button>
                <button onClick={handleSubmit} className="flex-1 py-4 rounded-xl bg-gradient-to-l from-[var(--color-accent)] to-[var(--color-gold)] text-black font-bold text-lg">{'\u062A\u0623\u0643\u064A\u062F \u0627\u0644\u0637\u0644\u0628'} ✓</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
