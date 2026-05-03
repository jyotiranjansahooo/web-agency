"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import gsap from "gsap";

export default function Loading() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(
        {},
        {
          duration: 2.5,
          ease: "power2.out",
          onUpdate: function () {
            const p = Math.round(this.progress() * 100);
            setProgress(p);

            if (progressRef.current) {
              progressRef.current.style.width = `${p}%`;
            }
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f1f14] px-4">
      <div className="w-full max-w-md text-center">
        
        {/* Icon + Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-3 mb-8"
        >
          <Leaf className="w-10 h-10 text-[#7fbf7f]" />
          <h1 className="text-xl font-semibold text-[#d8f3dc] tracking-wide">
            Brewing Experience...
          </h1>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-[#1b4332] rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-linear-to-r from-[#6a994e] to-[#a7c957] transition-all duration-200"
            style={{ width: "0%" }}
          />
        </div>

        {/* Percentage */}
        <motion.p
          key={progress}
          initial={{ opacity: 0.4, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-sm text-[#b7e4c7] font-medium"
        >
          {progress}%
        </motion.p>

        {/* Animated dots */}
        <div className="flex justify-center gap-1 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-[#95d5b2] rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}