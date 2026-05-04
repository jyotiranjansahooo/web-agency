'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default function PageTransition() {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        // The key is the secret sauce. When the route changes, the key changes,
        // forcing Framer Motion to restart the animation from the beginning.
        key={pathname}
        
        // 1. Start off-screen at the bottom
        initial={{ y: '100%' }} 
        
        // 2. Define the keyframes: [Start, Move to center, Hold in center, Move off top]
        animate={{ 
          y: ['100%', '0%', '0%', '-100%'] 
        }}
        
        // 3. Sync the timing with the keyframes
        transition={{ 
          duration: 1.2, 
          times: [0, 0.4, 0.7, 1], // 0-40% slide in, 40-70% pause, 70-100% slide out
          ease: 'easeInOut' 
        }}
        
        className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950 pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <Sparkles className="w-12 h-12 text-white animate-pulse" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}