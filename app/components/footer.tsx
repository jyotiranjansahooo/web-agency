"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Skeleton = () => {
  return (
    <div className="animate-pulse flex flex-col items-center justify-center gap-6 py-16">
      <div className="h-6 w-40 bg-green-200 rounded" />
      <div className="h-4 w-64 bg-green-100 rounded" />
      <div className="flex gap-4 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-8 w-8 bg-green-200 rounded-full" />
        ))}
      </div>
    </div>
  );
};

const Footer = () => {
  useEffect(() => {
    gsap.from(".footer-item", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: ".footer",
        start: "top 85%",
      },
    });
  }, []);

  const isLoading = false;

  if (isLoading) return <Skeleton />;

  return (
    <footer className="footer flex justify-center w-full bg-linear-to-b from-[#03420f] via-[#156225] to-[#41784e] text-green-900 py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-10">

        {/* Brand */}
        <motion.div
          className="footer-item"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl! font-bold mt-4! font-serif text-gray-300">
            @Orivon Agency
          </h2>
          <p className="mt-4 text-sm md:text-base text-white max-w-md mx-auto">
            Crafting modern, high-performance digital experiences with clean design and smooth interactions.
          </p>
        </motion.div>

        {/* Links */}
        <motion.div
          className="footer-item flex flex-wrap justify-center gap-6 text-sm md:text-base"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {['Home', 'Services', 'Projects', 'Contact'].map((link) => (
            <span
              key={link}
              className="cursor-pointer text-gray-300 hover:text-green-600 transition font-medium"
            >
              {link}
            </span>
          ))}
        </motion.div>

        {/* Contact */}
        <motion.div
          className="footer-item flex flex-col items-center gap-3 text-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 text-gray-300">
            <Mail size={16} /> hello@orivon.dev
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Phone size={16} /> +91 98765 43210
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin size={16} /> India
          </div>
        </motion.div>

        {/* Socials */}
        <motion.div
          className="footer-item flex gap-5 mt-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {[Github, Linkedin, Twitter].map((Icon, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.25, rotate: 5 }}
              className="p-2! rounded-full bg-green-100 hover:bg-green-200 text-gray-400 cursor-pointer transition"
            >
              <Icon size={18} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom */}
        <div className="text-xs text-gray-400  font-bold mt-4! mb-4! ">
          © {new Date().getFullYear()} ORIVON Agency. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
