import { motion } from 'framer-motion';
import { apps } from '@/store/data';
import { useOrderStore } from '@/store/orderStore';
import type { AppType } from '@/types';

export function AppSelector() {
  const { selectedApp, setSelectedApp } = useOrderStore();
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-bold text-center mb-4">{'\u0627\u062E\u062A\u0631 \u0627\u0644\u062A\u0637\u0628\u064A\u0642'}</motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-white/50 text-center mb-12">{'\u0646\u062F\u0639\u0645 \u062C\u0645\u064A\u0639 \u062A\u0637\u0628\u064A\u0642\u0627\u062A \u0627\u0644\u0628\u062B \u0648\u0627\u0644\u062A\u0648\u0627\u0635\u0644'}</motion.p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {apps.map((app, i) => (
            <motion.button key={app.id} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedApp(app.id as AppType)}
              className={`relative p-6 rounded-2xl transition-all ${selectedApp === app.id ? 'glass glow border-[var(--color-primary)]' : 'glass hover:border-white/20'}`}>
              {selectedApp === app.id && <motion.div layoutId="app-sel" className="absolute inset-0 rounded-2xl border-2 border-[var(--color-primary)]" transition={{ type: 'spring', stiffness: 200, damping: 20 }} />}
              <span className="text-4xl block mb-3">{app.icon}</span>
              <span className="font-bold text-lg">{app.nameAr}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
