"use client";
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function GlassCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn('glass-card', className)}
    >
      {children}
    </motion.div>
  );
}

