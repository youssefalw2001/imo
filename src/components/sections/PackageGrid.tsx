import { motion, AnimatePresence } from 'framer-motion';
import { apps } from '@/store/data';
import { useOrderStore } from '@/store/orderStore';
import { useNavigate } from 'react-router-dom';

export function PackageGrid() {
  const { selectedApp, setSelectedPackage } = useOrderStore();
  const navigate = useNavigate();
  const currentApp = apps.find((a) => a.id === selectedApp);
  if (!currentApp) return null;
  return (
    <AnimatePresence mode="wait">
      <motion.section key={selectedApp} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} className="py-10 px-6">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-10">{'\u0628\u0627\u0642\u0627\u062A'} {currentApp.nameAr}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentApp.packages.map((pkg, i) => (
              <motion.div key={pkg.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -8, scale: 1.02 }}
                className={`relative p-6 rounded-3xl glass cursor-pointer ${pkg.popular ? 'border-[var(--color-accent)] glow-gold' : ''} ${pkg.bestValue ? 'border-[var(--color-diamond)] glow' : ''}`}
                onClick={() => { setSelectedPackage(pkg); navigate('/order'); }}>
                {pkg.popular && <div className="absolute -top-3 right-6 px-4 py-1 bg-[var(--color-accent)] rounded-full text-xs font-bold text-black">{'\u0627\u0644\u0623\u0643\u062B\u0631 \u0637\u0644\u0628\u0627\u064B'} ⭐</div>}
                {pkg.bestValue && <div className="absolute -top-3 right-6 px-4 py-1 bg-[var(--color-diamond)] rounded-full text-xs font-bold text-black">{'\u0623\u0641\u0636\u0644 \u0642\u064A\u0645\u0629'} {'\u{1F48E}'}</div>}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{currentApp.icon}</span>
                  <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold">-{pkg.discount}%</div>
                </div>
                <div className="mb-4"><div className="text-3xl font-bold text-white">{pkg.diamonds.toLocaleString('ar-EG')}</div><div className="text-white/50 text-sm">{'\u0623\u0644\u0645\u0627\u0633\u0629'}</div></div>
                <div className="flex items-end gap-3"><span className="text-2xl font-bold text-[var(--color-diamond)]">${pkg.price}</span><span className="text-sm text-white/40 line-through">${pkg.originalPrice}</span></div>
                <motion.div className="mt-4 w-full py-3 rounded-xl bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-primary-dark)] text-center font-bold" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{'\u0627\u0634\u062A\u0631\u064A \u0627\u0644\u0622\u0646'}</motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
