import { motion } from 'framer-motion';
const features = [
  { icon: '\u26A1', title: '\u062A\u0648\u0635\u064A\u0644 \u0641\u0648\u0631\u064A', desc: '\u062E\u0644\u0627\u0644 1-5 \u062F\u0642\u0627\u0626\u0642' },
  { icon: '\u{1F6E1}\uFE0F', title: '\u0622\u0645\u0646 100%', desc: '\u0644\u0627 \u0646\u062D\u062A\u0627\u062C \u0643\u0644\u0645\u0629 \u0627\u0644\u0633\u0631' },
  { icon: '\u{1F4B0}', title: '\u0623\u0631\u062E\u0635 \u0627\u0644\u0623\u0633\u0639\u0627\u0631', desc: '\u0623\u0642\u0644 \u0645\u0646 \u0623\u064A \u0645\u0646\u0627\u0641\u0633' },
  { icon: '\u{1F30D}', title: '\u062C\u0645\u064A\u0639 \u0627\u0644\u062F\u0648\u0644', desc: '\u0646\u062F\u0639\u0645 \u0643\u0644 \u0627\u0644\u062F\u0648\u0644 \u0627\u0644\u0639\u0631\u0628\u064A\u0629' },
  { icon: '\u{1F4F1}', title: '\u062F\u0639\u0645 24/7', desc: '\u0641\u0631\u064A\u0642 \u062F\u0639\u0645 \u0639\u0631\u0628\u064A' },
  { icon: '\u{1F504}', title: '\u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0645\u0636\u0645\u0648\u0646', desc: '\u0636\u0645\u0627\u0646 \u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0643\u0627\u0645\u0644' },
];
export function Features() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl font-bold text-center mb-12">
          {'\u0644\u0645\u0627\u0630\u0627'} <span className="text-gradient">{'\u0627\u0644\u0645\u0627\u0633\u0629'}</span>?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="p-6 rounded-2xl glass text-center">
              <span className="text-4xl block mb-4">{f.icon}</span>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-white/50">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
