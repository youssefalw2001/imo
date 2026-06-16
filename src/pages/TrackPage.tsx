import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrderStore } from '@/store/orderStore';
import type { Order } from '@/types';

const sl: Record<string, { label: string; color: string }> = {
  pending: { label: '\u0628\u0627\u0646\u062A\u0638\u0627\u0631 \u0627\u0644\u062F\u0641\u0639', color: 'text-yellow-400 bg-yellow-500/20' },
  paid: { label: '\u062A\u0645 \u0627\u0644\u062F\u0641\u0639', color: 'text-blue-400 bg-blue-500/20' },
  processing: { label: '\u0642\u064A\u062F \u0627\u0644\u062A\u0646\u0641\u064A\u0630', color: 'text-purple-400 bg-purple-500/20' },
  delivered: { label: '\u062A\u0645 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u2713', color: 'text-green-400 bg-green-500/20' },
  failed: { label: '\u0641\u0634\u0644', color: 'text-red-400 bg-red-500/20' },
};

export function TrackPage() {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<Order | null | undefined>(undefined);
  const getOrderById = useOrderStore((s) => s.getOrderById);
  const handleSearch = () => { setResult(getOrderById(searchId.trim()) ?? null); };

  return (
    <main className="min-h-screen pt-28 px-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl font-bold text-center mb-2">{'\u062A\u062A\u0628\u0639 \u0637\u0644\u0628\u0643'}</motion.h1>
        <p className="text-white/50 text-center mb-10">{'\u0623\u062F\u062E\u0644 \u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628'}</p>
        <div className="flex gap-3">
          <input type="text" value={searchId} onChange={(e) => setSearchId(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} placeholder="ORD-XXXXXX-XXXX" className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:border-[var(--color-primary)] focus:outline-none font-mono" dir="ltr" />
          <button onClick={handleSearch} className="px-8 py-4 rounded-xl bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-diamond)] font-bold">{'\u0628\u062D\u062B'} {'\u{1F50D}'}</button>
        </div>
        {result === null && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 rounded-xl glass text-center"><span className="text-4xl block mb-3">{'\u{1F50D}'}</span><p className="text-white/60">{'\u0644\u0645 \u064A\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0637\u0644\u0628'}</p></motion.div>}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 rounded-2xl glass space-y-4">
            <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/50">{'\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628'}</span><span className="font-mono font-bold text-[var(--color-diamond)]">{result.id}</span></div>
            <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/50">{'\u0627\u0644\u0643\u0645\u064A\u0629'}</span><span className="font-bold">{result.package.diamonds.toLocaleString('ar-EG')}</span></div>
            <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/50">{'\u0627\u0644\u0645\u0628\u0644\u063A'}</span><span className="font-bold text-[var(--color-accent)]">${result.package.price}</span></div>
            <div className="flex justify-between py-2"><span className="text-white/50">{'\u0627\u0644\u062D\u0627\u0644\u0629'}</span><span className={`px-3 py-1 rounded-full text-sm font-bold ${sl[result.status]?.color}`}>{sl[result.status]?.label}</span></div>
          </motion.div>
        )}
      </div>
    </main>
  );
}
