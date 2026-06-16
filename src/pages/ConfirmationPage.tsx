import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useOrderStore } from '@/store/orderStore';
import { paymentMethods } from '@/store/data';

export function ConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = useOrderStore((s) => s.getOrderById(orderId ?? ''));
  if (!order) return (<main className="min-h-screen pt-28 px-6 flex items-center justify-center"><div className="text-center"><span className="text-6xl block mb-4">{'\u274C'}</span><h1 className="text-2xl font-bold mb-4">{'\u0627\u0644\u0637\u0644\u0628 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F'}</h1><Link to="/" className="text-[var(--color-diamond)] underline">{'\u0627\u0644\u0639\u0648\u062F\u0629'}</Link></div></main>);
  const payment = paymentMethods.find((p) => p.method === order.paymentMethod);
  return (
    <main className="min-h-screen pt-28 px-6 pb-20">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="text-center mb-8">
          <span className="text-7xl block mb-4">{'\u2705'}</span>
          <h1 className="text-3xl font-bold mb-2">{'\u062A\u0645 \u062A\u0633\u062C\u064A\u0644 \u0637\u0644\u0628\u0643 \u0628\u0646\u062C\u0627\u062D!'}</h1>
          <p className="text-white/50">{'\u0633\u064A\u062A\u0645 \u0627\u0644\u062A\u0648\u0635\u064A\u0644 \u062E\u0644\u0627\u0644 1-5 \u062F\u0642\u0627\u0626\u0642'}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-2xl glass space-y-4">
          <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/50">{'\u0631\u0642\u0645 \u0627\u0644\u0637\u0644\u0628'}</span><span className="font-mono font-bold text-[var(--color-diamond)]">{order.id}</span></div>
          <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/50">{'\u0627\u0644\u062A\u0637\u0628\u064A\u0642'}</span><span className="font-bold">{order.app.toUpperCase()}</span></div>
          <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/50">{'\u0627\u0644\u0643\u0645\u064A\u0629'}</span><span className="font-bold">{order.package.diamonds.toLocaleString('ar-EG')} {'\u0623\u0644\u0645\u0627\u0633\u0629'}</span></div>
          <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/50">{'\u0627\u0644\u0645\u0628\u0644\u063A'}</span><span className="font-bold text-[var(--color-accent)] text-xl">${order.package.price}</span></div>
          <div className="flex justify-between py-2 border-b border-white/10"><span className="text-white/50">{'\u0627\u0644\u0645\u0639\u0631\u0641'}</span><span className="font-mono">{order.userId}</span></div>
          <div className="flex justify-between py-2"><span className="text-white/50">{'\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u062F\u0641\u0639'}</span><span className="font-bold">{payment?.icon} {payment?.labelAr}</span></div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 p-4 rounded-xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-center">
          <p className="text-sm text-white/70 mb-2">{'\u0623\u0631\u0633\u0644 \u0627\u0644\u0645\u0628\u0644\u063A \u0625\u0644\u0649:'}</p>
          <p className="font-mono text-[var(--color-diamond)] text-lg" dir="ltr">{payment?.address}</p>
        </motion.div>
        <div className="flex gap-4 mt-8">
          <Link to="/" className="flex-1 py-4 rounded-xl glass text-center font-bold">{'\u0627\u0644\u0639\u0648\u062F\u0629'}</Link>
          <a href="https://wa.me/966XXXXXXXXX" target="_blank" rel="noopener noreferrer" className="flex-1 py-4 rounded-xl bg-green-600 text-center font-bold">{'\u0648\u0627\u062A\u0633\u0627\u0628'} {'\u{1F4F1}'}</a>
        </div>
      </div>
    </main>
  );
}
