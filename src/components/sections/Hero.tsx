import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { Link } from 'react-router-dom';

export function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!statsRef.current) return;
    animate(statsRef.current.querySelectorAll('.stat-number'), {
      innerHTML: (_el: Element, i: number) => { const v = [5000, 65, 3]; return [0, v[i] ?? 0]; },
      round: 1, easing: 'inOutExpo', duration: 2000, delay: stagger(200, { start: 1000 }),
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: 1, type: 'spring' }} className="text-8xl mb-8">{'\u{1F48E}'}</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-gradient">{'\u0623\u0631\u062E\u0635 \u0623\u0644\u0645\u0627\u0633\u0627\u062A'}</span><br />
          <span className="text-white/90">{'\u0641\u064A \u0627\u0644\u0648\u0637\u0646 \u0627\u0644\u0639\u0631\u0628\u064A'}</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-xl md:text-2xl text-white/60 mb-10 max-w-2xl mx-auto">
          {'\u0648\u0641\u0651\u0631 \u062D\u062A\u0649'} <span className="text-[var(--color-accent)] font-bold">65%</span> {'\u0639\u0644\u0649 \u0634\u062D\u0646 \u0627\u0644\u0623\u0644\u0645\u0627\u0633\u0627\u062A \u0644\u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u0637\u0628\u064A\u0642\u0627\u062A'}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="flex flex-wrap justify-center gap-4 mb-16">
          <Link to="/order" className="px-8 py-4 rounded-2xl bg-gradient-to-l from-[var(--color-primary)] to-[var(--color-diamond)] text-white font-bold text-lg hover:scale-105 transition-transform">{'\u0627\u0637\u0644\u0628 \u0627\u0644\u0622\u0646'}</Link>
          <Link to="/track" className="px-8 py-4 rounded-2xl glass text-white font-bold text-lg hover:border-[var(--color-primary)] transition-colors">{'\u062A\u062A\u0628\u0639 \u0637\u0644\u0628\u0643'}</Link>
        </motion.div>
        <motion.div ref={statsRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center"><div className="stat-number text-3xl font-bold text-[var(--color-diamond)]">0</div><div className="text-sm text-white/50 mt-1">{'\u0639\u0645\u064A\u0644 \u0633\u0639\u064A\u062F'}</div></div>
          <div className="text-center"><div className="stat-number text-3xl font-bold text-[var(--color-accent)]">0</div><div className="text-sm text-white/50 mt-1">% {'\u062E\u0635\u0645'}</div></div>
          <div className="text-center"><div className="stat-number text-3xl font-bold text-[var(--color-primary-light)]">0</div><div className="text-sm text-white/50 mt-1">{'\u062F\u0642\u0627\u0626\u0642 \u062A\u0648\u0635\u064A\u0644'}</div></div>
        </motion.div>
      </div>
    </section>
  );
}
