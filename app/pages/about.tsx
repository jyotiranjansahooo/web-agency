"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Leaf, Rocket, Users } from "lucide-react";

export default function About() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);

    gsap.from(".hero-title", {
      y: 80,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(".hero-sub", {
      y: 40,
      opacity: 0,
      delay: 0.3,
      duration: 1,
    });

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6F4EA] flex flex-col gap-6 p-6 animate-pulse">
        <div className="h-10 bg-green-200 rounded w-1/3" />
        <div className="h-6 bg-green-200 rounded w-2/3" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-green-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E6F4EA] text-gray-800 px-6 md:px-16 py-16">
      {/* HERO */}
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="hero-title text-4xl md:text-6xl font-bold leading-tight">
          We Build Modern Digital Experiences
        </h1>
        <p className="hero-sub mt-6 text-lg md:text-xl text-gray-600">
          A creative web agency crafting high-performance, beautiful, and
          scalable products for forward-thinking brands.
        </p>
      </section>

      {/* FEATURES */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
          >
            <feature.icon className="w-10 h-10 text-green-600" />
            <h3 className="mt-4 text-xl font-semibold">
              {feature.title}
            </h3>
            <p className="mt-2 text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* TEAM */}
      <section className="mt-24">
        <h2 className="text-3xl font-bold text-center mb-12">
          Our Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 text-center shadow-md"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-green-200" />
              <h4 className="mt-4 text-lg font-semibold">
                {member.name}
              </h4>
              <p className="text-sm text-gray-500">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-28 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold"
        >
          Let’s Build Something Great Together
        </motion.h2>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-8 py-3 bg-green-600 text-white rounded-full shadow-lg"
        >
          Get in Touch
        </motion.button>
      </section>
    </div>
  );
}

const features = [
  {
    icon: Rocket,
    title: "Fast Performance",
    desc: "Optimized, blazing-fast websites with modern tech stack.",
  },
  {
    icon: Users,
    title: "User-Centered",
    desc: "Designs focused on real user behavior and engagement.",
  },
  {
    icon: Leaf,
    title: "Clean & Scalable",
    desc: "Maintainable codebases built for long-term growth.",
  },
];

const team = [
  { name: "Aarav", role: "Frontend Engineer" },
  { name: "Isha", role: "UI/UX Designer" },
  { name: "Rohan", role: "Backend Developer" },
];
