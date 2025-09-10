'use client';

import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-nexus-gradient cyber-grid flex items-center justify-center">
      <motion.div
        className="flex flex-col items-center space-y-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="relative"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-20 h-20 rounded-full border-4 border-accent-cyan border-t-transparent animate-spin" />
          <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-accent-neon border-b-transparent animate-spin" 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </motion.div>

        {/* PayFlow Logo */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-text-primary neon-text mb-2">
            PayFlow
          </h1>
          <p className="text-text-secondary">
            Loading your payment universe...
          </p>
        </motion.div>

        {/* Loading Bars */}
        <motion.div
          className="flex space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-8 bg-accent-cyan rounded-full"
              animate={{
                scaleY: [1, 2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}