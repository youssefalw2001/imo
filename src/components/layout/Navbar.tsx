import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', labelAr: '\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629' },
  { path: '/order', labelAr: '\u0627\u0637\u0644\u0628 \u0627\u0644\u0622\u0646' },
  { path: '/track', labelAr: '\u062A\u062A\u0628\u0639 \u0637\u0644\u0628\u0643' },
];

export function Navbar() {
  const location = useLocation();
  return (
    <motion.nav initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <motion.span className="text-3xl" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>{'\u{1F48E}'}</motion.span>
          <span className="text-2xl font-bold text-gradient">{'\u0627\u0644\u0645\u0627\u0633\u0629'}</span>
        </Link>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="relative px-4 py-2 text-sm font-medium transition-colors hover:text-[var(--color-diamond)]">
              {location.pathname === item.path && <motion.div layoutId="nav-ind" className="absolute inset-0 rounded-xl bg-[var(--color-primary)]/20 border border-[var(--color-primary)]/40" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
              <span className="relative z-10">{item.labelAr}</span>
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
