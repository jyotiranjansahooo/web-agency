"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".footer-item",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden bg-[#e6f2e6] text-gray-800 px-6 md:px-16 py-16"
    >
      {/* Glass Bubble Background */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/30" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
        className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10"
      >
        {/* Brand */}
        <div className="footer-item space-y-4">
          <h2 className="text-2xl font-bold">Your Agency</h2>
          <p className="text-sm text-gray-600">
            Building modern, high-performance digital experiences.
          </p>
        </div>

        {/* Links */}
        <div className="footer-item">
          <h3 className="font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            {["Home", "Services", "Projects", "Contact"].map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 hover:translate-x-1 transition"
              >
                {item} <ArrowUpRight size={14} />
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-item space-y-3 text-sm">
          <h3 className="font-semibold mb-4">Contact</h3>
          <div className="flex items-center gap-2">
            <Mail size={16} /> hello@agency.com
          </div>
          <div className="flex items-center gap-2">
            <Phone size={16} /> +91 00000 00000
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} /> India
          </div>
        </div>

        {/* CTA */}
        <div className="footer-item">
          <h3 className="font-semibold mb-4">Let’s build</h3>
          <button className="px-5 py-3 rounded-xl bg-black text-white hover:scale-105 transition">
            Start a Project
          </button>
        </div>
      </motion.div>

      {/* Bottom */}
      <div className="relative z-10 mt-16 border-t border-gray-300 pt-6 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} Your Agency</p>
        <p className="text-gray-500">Crafted with precision</p>
      </div>
    </footer>
  );
}
