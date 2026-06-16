import { motion } from 'framer-motion';
import { useOrderStore } from '@/store/orderStore';
import type { OrderStatus } from '@/types';

const sl: Record<string, { label: string; color: string }> = {
  pending: { label: '\u0628\u0627\u0646\u062A\u0638\u0627\u0631', color: 'text-yellow-400 bg-yellow-500/20' },
  paid: { label: '\u062A\u0645 \u0627\u0644\u062F\u0641\u0639', color: 'text-blue-400 bg-blue-500/20' },
  processing: { label: '\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630', color: 'text-purple-400 bg-purple-500/20' },
  delivered: { label: '\u062A\u0645 \u0627\u0644\u062A\u0648\u0635\u064A\u0644', color: 'text-green-400 bg-green-500/20' },
  failed: { label: '\u0641\u0634\u0644', color: 'text-red-400 bg-red-500/20' },
};
const flow: OrderStatus[] = ['pending', 'paid', 'processing', 'delivered'];

export function AdminPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const totalRev = orders.filter((o) => o.status === 'delivered').reduce((s, o) => s + o.package.price, 0);
  const advance = (id: string, cur: OrderStatus) => { const i = flow.indexOf(cur); if (i < flow.length - 1) { const next = flow[i + 1]; if (next) updateOrderStatus(id, next); } };

  return (
    <main className="min-h-screen pt-28 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold mb-8">{'\u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645'} {'\u{1F39B}\uFE0F'}</motion.h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-2xl glass text-center"><div className="text-3xl font-bold text-[var(--color-diamond)]">{orders.length}</div><div className="text-sm text-white/50 mt-1">{'\u0625\u062C\u0645\u0627\u0644\u064A'}</div></div>
          <div className="p-5 rounded-2xl glass text-center"><div className="text-3xl font-bold text-yellow-400">{orders.filter((o) => o.status === 'pending').length}</div><div className="text-sm text-white/50 mt-1">{'\u0628\u0627\u0646\u062A\u0638\u0627\u0631'}</div></div>
          <div className="p-5 rounded-2xl glass text-center"><div className="text-3xl font-bold text-green-400">{orders.filter((o) => o.status === 'delivered').length}</div><div className="text-sm text-white/50 mt-1">{'\u062A\u0645 \u0627\u0644\u062A\u0648\u0635\u064A\u0644'}</div></div>
          <div className="p-5 rounded-2xl glass text-center"><div className="text-3xl font-bold text-[var(--color-accent)]">${totalRev.toFixed(2)}</div><div className="text-sm text-white/50 mt-1">{'\u0627\u0644\u0625\u064A\u0631\u0627\u062F\u0627\u062A'}</div></div>
        </div>
        <div className="rounded-2xl glass overflow-hidden">
          <div className="p-4 border-b border-white/10"><h2 className="text-xl font-bold">{'\u0627\u0644\u0637\u0644\u0628\u0627\u062A'}</h2></div>
          {orders.length === 0 ? <div className="p-12 text-center text-white/40">{'\u{1F4E6}'} {'\u0644\u0627 \u062A\u0648\u062C\u062F \u0637\u0644\u0628\u0627\u062A'}</div> : (
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-white/10 text-white/50"><th className="p-4 text-right">#</th><th className="p-4 text-right">{'\u0627\u0644\u062A\u0637\u0628\u064A\u0642'}</th><th className="p-4 text-right">{'\u0627\u0644\u0643\u0645\u064A\u0629'}</th><th className="p-4 text-right">{'\u0627\u0644\u0645\u0628\u0644\u063A'}</th><th className="p-4 text-right">{'\u0627\u0644\u062D\u0627\u0644\u0629'}</th><th className="p-4 text-right">{'\u0625\u062C\u0631\u0627\u0621'}</th></tr></thead>
              <tbody>{orders.map((o) => (<tr key={o.id} className="border-b border-white/5 hover:bg-white/5"><td className="p-4 font-mono text-xs">{o.id}</td><td className="p-4 font-bold">{o.app.toUpperCase()}</td><td className="p-4">{o.package.diamonds.toLocaleString('ar-EG')}</td><td className="p-4 text-[var(--color-accent)] font-bold">${o.package.price}</td><td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${sl[o.status]?.color}`}>{sl[o.status]?.label}</span></td><td className="p-4">{o.status !== 'delivered' && o.status !== 'failed' && <button onClick={() => advance(o.id, o.status)} className="px-3 py-1 rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-primary-light)] text-xs font-bold">{'\u062A\u0642\u062F\u064A\u0645 \u2192'}</button>}</td></tr>))}</tbody>
            </table></div>
          )}
        </div>
      </div>
    </main>
  );
}
