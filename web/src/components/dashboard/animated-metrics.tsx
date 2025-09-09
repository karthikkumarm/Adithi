"use client";
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Metric } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

function useCounter(value: number, durationMs = 1200) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setDisplay(Math.round(value * (t * (2 - t))));
      if (t < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);
  return display;
}

export function AnimatedMetrics({ items, currency = true }: { items: Metric[]; currency?: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AnimatePresence>
        {items.map((m, idx) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.5, ease: 'easeOut' }}
            className={cn('glass-card p-5')}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-apple-gray-600">{m.label}</p>
                <p className="mt-2 text-2xl font-semibold">
                  {currency ? formatCurrency(useCounter(m.value)) : useCounter(m.value)}
                </p>
              </div>
              <motion.div whileHover={{ rotate: 6 }} className="rounded-lg p-2 bg-white/60">
                {m.delta && m.delta >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-apple-green" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-apple-red" />
                )}
              </motion.div>
            </div>
            {typeof m.delta === 'number' && (
              <p className={cn('mt-3 text-sm', m.delta >= 0 ? 'text-apple-green' : 'text-apple-red')}>{m.delta >= 0 ? '+' : ''}{m.delta}% vs last week</p>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

