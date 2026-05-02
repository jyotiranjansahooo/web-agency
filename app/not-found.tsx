"use client";

import AnimatedButton from "./components/btn";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function NotFound() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLHeadingElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!contentRef.current || !numberRef.current) return;

    const ctx = gsap.context(() => {
      // Fade in content
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );

      // Floating 404
      gsap.to(numberRef.current, {
        y: -8,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef); // ✅ important fix

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center min-h-screen overflow-hidden px-4"
      style={{
        background: "linear-gradient(to bottom, #0f766e, #e0f2fe)",
      }}
    >
      {/* BIG BACKGROUND 404 */}
      <h1
        ref={numberRef}
        className="
          absolute font-bold select-none pointer-events-none
          text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[20rem]
          blur-sm
        "
        style={{
          color: "white",
          opacity: 0.2,
          lineHeight: 1,
        }}
      >
        404
      </h1>

      {/* CONTENT */}
      <div
        ref={contentRef}
        className="
          relative z-10 text-center
          max-w-md sm:max-w-lg md:max-w-xl
        "
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-3">
          Sorry, that page could not be found
        </h2>

        <p className="text-sm sm:text-base text-gray-200 mb-6">
          The requested page either doesn’t exist or you don’t have access to it.
        </p>

        <AnimatedButton href="/">
          Go Back
        </AnimatedButton>
      </div>
    </div>
  );
}