"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Code2,
  Layers,
  Zap,
  Globe,
  ArrowRight,
  Star,
  Award,
  TrendingUp,
  Monitor,
  Palette,
  Cpu,
  CheckCircle2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── COLOR TOKENS ────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0b1a10",
  surface: "#122118",
  card: "#182e21",
  border: "#264334",
  matchaDark: "#2d5a3d",
  matcha: "#4a7c59",
  matchaMid: "#6b9e78",
  matchaLight: "#9fc4a8",
  matchaPale: "#c8dfc8",
  foam: "#e8f4e8",
  accent: "#a8d8a8",
  gold: "#c9b96b",
};

// ─── BUBBLE ───────────────────────────────────────────────────────────────────
interface Bubble {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

function BubbleField() {
  const [bubbles] = useState<Bubble[]>(() =>
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 60 + 12,
      delay: Math.random() * 8,
      duration: Math.random() * 12 + 10,
      opacity: Math.random() * 0.15 + 0.04,
    }))
  );

  return (
    <div className="bubble-field" aria-hidden>
      {bubbles.map((b) => (
        <motion.div
          key={b.id}
          className="bubble"
          style={{
            left: `${b.x}%`,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
          }}
          animate={{
            y: [120, -160],
            x: [0, Math.random() * 40 - 20, 0],
            scale: [0.6, 1.1, 0.8],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── SKELETON ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skel skel-icon" />
      <div className="skel skel-title" />
      <div className="skel skel-line" />
      <div className="skel skel-line short" />
    </div>
  );
}

function SkeletonHero() {
  return (
    <div className="skeleton-hero">
      <div className="skel skel-badge" />
      <div className="skel skel-h1" />
      <div className="skel skel-h1 mid" />
      <div className="skel skel-para" />
      <div className="skel skel-para short" />
      <div className="skel skel-btn" />
    </div>
  );
}

// ─── STAT COUNTER ─────────────────────────────────────────────────────────────
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = value / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className="stat-item">
      <span className="stat-number">
        {count}
        <span className="stat-suffix">{suffix}</span>
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

// ─── SERVICE CARD ─────────────────────────────────────────────────────────────
interface Service { icon: React.ElementType; title: string; desc: string; tag: string; }

function ServiceCard({ icon: Icon, title, desc, tag, index }: Service & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="service-card"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, scale: 1.015 }}
    >
      <div className="service-icon-wrap">
        <Icon size={22} strokeWidth={1.8} />
      </div>
      <span className="service-tag">{tag}</span>
      <h3 className="service-title">{title}</h3>
      <p className="service-desc">{desc}</p>
      <div className="service-arrow">
        <ArrowRight size={16} />
      </div>
    </motion.div>
  );
}

// ─── TEAM CARD ────────────────────────────────────────────────────────────────
interface TeamMember { name: string; role: string; initials: string; color: string; }

function TeamCard({ name, role, initials, color, index }: TeamMember & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="team-card"
      initial={{ opacity: 0, scale: 0.88 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
    >
      <div className="team-avatar" style={{ background: color }}>
        <span>{initials}</span>
      </div>
      <div className="team-info">
        <p className="team-name">{name}</p>
        <p className="team-role">{role}</p>
      </div>
      <div className="team-stars">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={12} fill={COLORS.gold} color={COLORS.gold} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── SECTION HEADING ──────────────────────────────────────────────────────────
function SectionHeading({ badge, title, sub }: { badge: string; title: string; sub: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="section-heading"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <span className="badge">{badge}</span>
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: title }} />
      <p className="section-sub">{sub}</p>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function About() {
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Simulate data fetch
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  // GSAP ScrollTrigger: hero parallax
  useEffect(() => {
    if (loading || !heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(".hero-tagline", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Horizontal marquee
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 18,
        repeat: -1,
      });

      // Scroll progress bar
      gsap.to(progressRef.current, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 0,
        },
      });

      // Section reveal lines
      gsap.utils.toArray<HTMLElement>(".reveal-line").forEach((el) => {
        gsap.fromTo(
          el,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });

      // Values list stagger
      gsap.fromTo(
        ".value-item",
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: ".values-list", start: "top 80%", once: true },
        }
      );
    });

    return () => ctx.revert();
  }, [loading]);

  const services: Service[] = [
    { icon: Monitor, title: "Web Development", desc: "Crafting blazing-fast, accessible web apps with Next.js, React, and modern tooling.", tag: "Core" },
    { icon: Palette, title: "UI/UX Design", desc: "Pixel-perfect interfaces that balance beauty with intuitive user experience.", tag: "Creative" },
    { icon: Cpu, title: "AI Integration", desc: "Embedding intelligent features — chatbots, recommendations, automation — into your product.", tag: "Innovation" },
    { icon: Globe, title: "Digital Strategy", desc: "Data-driven roadmaps to grow your brand and out-maneuver competitors.", tag: "Growth" },
    { icon: Zap, title: "Performance Audit", desc: "Lighthouse-perfect scores, sub-second loads, and Core Web Vitals mastery.", tag: "Speed" },
    { icon: Layers, title: "Design Systems", desc: "Scalable component libraries and tokens that ship consistency at every breakpoint.", tag: "Scale" },
  ];

  const team: TeamMember[] = [
    { name: "Aiko Tanaka", role: "Creative Director", initials: "AT", color: "linear-gradient(135deg,#4a7c59,#2d5a3d)" },
    { name: "Romain Lefevre", role: "Lead Engineer", initials: "RL", color: "linear-gradient(135deg,#6b9e78,#4a7c59)" },
    { name: "Sara Okonkwo", role: "UX Architect", initials: "SO", color: "linear-gradient(135deg,#86b090,#6b9e78)" },
    { name: "Dev Malhotra", role: "AI Engineer", initials: "DM", color: "linear-gradient(135deg,#4a7c59,#86b090)" },
  ];

  const values = [
    "Craft over shortcuts",
    "Radical transparency",
    "Ship & iterate fast",
    "Accessibility by default",
    "Client ownership always",
  ];

  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500;600&family=Space+Mono&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: ${COLORS.bg};
          --surface: ${COLORS.surface};
          --card: ${COLORS.card};
          --border: ${COLORS.border};
          --matcha: ${COLORS.matcha};
          --matcha-dark: ${COLORS.matchaDark};
          --matcha-mid: ${COLORS.matchaMid};
          --matcha-light: ${COLORS.matchaLight};
          --matcha-pale: ${COLORS.matchaPale};
          --foam: ${COLORS.foam};
          --accent: ${COLORS.accent};
          --gold: ${COLORS.gold};
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--bg);
          color: var(--foam);
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        /* ── PROGRESS ── */
        .progress-bar {
          position: fixed; top: 0; left: 0; height: 3px; width: 0;
          background: linear-gradient(90deg, var(--matcha-dark), var(--accent), var(--matcha-mid));
          z-index: 9999;
          box-shadow: 0 0 12px var(--matcha-mid);
        }

        /* ── BUBBLES ── */
        .bubble-field {
          position: fixed; inset: 0; pointer-events: none; overflow: hidden; z-index: 0;
        }
        .bubble {
          position: absolute; bottom: -80px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, var(--matcha-mid), var(--matcha-dark));
          border: 1px solid rgba(106,158,120,0.25);
          backdrop-filter: blur(2px);
        }

        /* ── LAYOUT ── */
        .about-page {
          position: relative; z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.25rem;
        }

        /* ── SKELETON ── */
        .skel {
          background: linear-gradient(90deg, var(--card) 25%, var(--border) 50%, var(--card) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .skeleton-hero { padding: 5rem 0 3rem; }
        .skel-badge { width:140px; height:28px; margin-bottom:1.5rem; border-radius:999px; }
        .skel-h1 { width: 70%; height: 56px; margin-bottom:.75rem; }
        .skel-h1.mid { width: 55%; }
        .skel-para { width: 60%; height: 18px; margin-bottom:.5rem; margin-top:.5rem; }
        .skel-para.short { width: 42%; }
        .skel-btn { width: 160px; height: 48px; margin-top: 2rem; border-radius: 999px; }
        .skeleton-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 1.75rem;
        }
        .skel-icon { width: 44px; height: 44px; border-radius: 12px; margin-bottom: 1.2rem; }
        .skel-title { width: 65%; height: 22px; margin-bottom: .75rem; }
        .skel-line { width: 90%; height: 14px; margin-bottom:.4rem; }
        .skel-line.short { width: 70%; }
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
          margin: 3rem 0;
        }

        /* ── HERO ── */
        .hero-section {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 6rem 0 4rem;
          position: relative;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: .5rem;
          border: 1px solid var(--border);
          background: rgba(74,124,89,.1);
          color: var(--accent);
          font-family: 'Space Mono', monospace;
          font-size: .7rem;
          letter-spacing: .12em;
          text-transform: uppercase;
          padding: .4rem 1rem;
          border-radius: 999px;
          margin-bottom: 2rem;
          width: fit-content;
        }
        .hero-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.8rem, 7vw, 6rem);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 1.75rem;
          color: var(--foam);
        }
        .hero-tagline em {
          font-style: italic;
          color: var(--matcha-light);
        }
        .hero-tagline .underline-text {
          position: relative;
          display: inline-block;
        }
        .hero-tagline .underline-text::after {
          content: '';
          position: absolute; bottom: 4px; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--matcha), var(--accent));
          border-radius: 1px;
        }
        .hero-sub {
          font-size: clamp(.95rem, 1.5vw, 1.1rem);
          color: var(--matcha-light);
          max-width: 540px;
          line-height: 1.75;
          margin-bottom: 2.5rem;
          font-weight: 300;
        }
        .hero-cta-row {
          display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: .6rem;
          background: linear-gradient(135deg, var(--matcha-dark), var(--matcha));
          color: var(--foam);
          border: none;
          padding: .85rem 1.75rem;
          border-radius: 999px;
          font-family: 'DM Sans', sans-serif;
          font-size: .9rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: box-shadow .3s, transform .2s;
          box-shadow: 0 4px 20px rgba(74,124,89,.35);
        }
        .btn-primary:hover {
          box-shadow: 0 6px 30px rgba(74,124,89,.55);
          transform: translateY(-2px);
        }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: .5rem;
          border: 1px solid var(--border);
          color: var(--matcha-light);
          background: transparent;
          padding: .85rem 1.5rem;
          border-radius: 999px;
          font-size: .9rem;
          font-weight: 400;
          cursor: pointer;
          text-decoration: none;
          transition: border-color .25s, color .25s;
        }
        .btn-ghost:hover { border-color: var(--matcha); color: var(--foam); }
        .hero-scroll-hint {
          position: absolute; bottom: 2.5rem; left: 0;
          display: flex; align-items: center; gap: .6rem;
          color: var(--matcha-mid);
          font-size: .75rem;
          letter-spacing: .08em;
          font-family: 'Space Mono', monospace;
        }
        .scroll-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--matcha);
          animation: blink 1.4s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }

        /* ── MARQUEE ── */
        .marquee-wrap {
          overflow: hidden;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 1rem 0;
          margin: 2rem 0 5rem;
          background: rgba(18,33,24,.6);
        }
        .marquee-track {
          display: flex; gap: 3rem; white-space: nowrap; width: max-content;
        }
        .marquee-item {
          display: inline-flex; align-items: center; gap: .6rem;
          color: var(--matcha-mid);
          font-family: 'Space Mono', monospace;
          font-size: .78rem;
          letter-spacing: .06em;
          text-transform: uppercase;
        }
        .marquee-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--matcha); }

        /* ── STATS ── */
        .stats-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 18px;
          overflow: hidden;
          margin-bottom: 5rem;
        }
        .stat-item {
          background: var(--card);
          padding: 1.75rem 1.5rem;
          display: flex; flex-direction: column; gap: .4rem;
          transition: background .25s;
        }
        .stat-item:hover { background: rgba(74,124,89,.12); }
        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.8rem;
          font-weight: 600;
          color: var(--foam);
          line-height: 1;
        }
        .stat-suffix { color: var(--matcha-mid); font-size: 1.8rem; }
        .stat-label {
          font-size: .8rem;
          color: var(--matcha-mid);
          font-weight: 400;
          letter-spacing: .04em;
        }

        /* ── SECTION HEADING ── */
        .section-heading { max-width: 640px; margin-bottom: 3rem; }
        .badge {
          display: inline-flex; align-items: center; gap: .4rem;
          background: rgba(74,124,89,.15);
          color: var(--accent);
          border: 1px solid rgba(74,124,89,.3);
          font-size: .72rem;
          font-family: 'Space Mono', monospace;
          letter-spacing: .12em;
          text-transform: uppercase;
          padding: .35rem .9rem;
          border-radius: 999px;
          margin-bottom: 1.1rem;
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 300;
          line-height: 1.15;
          color: var(--foam);
          margin-bottom: .9rem;
        }
        .section-title span { color: var(--matcha-light); font-style: italic; }
        .section-sub {
          font-size: .95rem;
          color: var(--matcha-light);
          line-height: 1.7;
          font-weight: 300;
        }

        /* ── REVEAL LINE ── */
        .reveal-line {
          height: 1px;
          background: linear-gradient(90deg, var(--matcha), transparent);
          margin: 1.5rem 0 3rem;
        }

        /* ── SERVICES GRID ── */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
          margin-bottom: 6rem;
        }
        .service-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 1.75rem;
          cursor: pointer;
          transition: border-color .25s, box-shadow .25s;
          position: relative;
          overflow: hidden;
        }
        .service-card::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle at 0% 0%, rgba(74,124,89,.12), transparent 60%);
          opacity: 0; transition: opacity .3s;
        }
        .service-card:hover { border-color: var(--matcha); box-shadow: 0 8px 32px rgba(74,124,89,.15); }
        .service-card:hover::before { opacity: 1; }
        .service-icon-wrap {
          width: 44px; height: 44px;
          background: rgba(74,124,89,.15);
          border: 1px solid rgba(74,124,89,.3);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          color: var(--accent);
          margin-bottom: 1.1rem;
        }
        .service-tag {
          display: inline-block;
          font-size: .68rem;
          font-family: 'Space Mono', monospace;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: var(--matcha-mid);
          margin-bottom: .55rem;
        }
        .service-title {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--foam);
          margin-bottom: .6rem;
        }
        .service-desc {
          font-size: .875rem;
          color: var(--matcha-light);
          line-height: 1.65;
          font-weight: 300;
        }
        .service-arrow {
          position: absolute; bottom: 1.5rem; right: 1.5rem;
          color: var(--matcha-mid);
          opacity: 0;
          transform: translateX(-6px);
          transition: opacity .25s, transform .25s;
        }
        .service-card:hover .service-arrow { opacity: 1; transform: translateX(0); }

        /* ── ABOUT SPLIT ── */
        .about-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
          margin-bottom: 6rem;
        }
        @media (max-width: 768px) {
          .about-split { grid-template-columns: 1fr; gap: 2.5rem; }
        }
        .about-visual {
          aspect-ratio: 4/5;
          border-radius: 24px;
          background: var(--card);
          border: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .about-visual-inner {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(45,90,61,.8) 0%, rgba(11,26,16,.4) 100%);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: .75rem;
        }
        .visual-icon-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1rem; padding: 2rem;
          width: 100%;
        }
        .v-icon-box {
          aspect-ratio: 1;
          background: rgba(74,124,89,.15);
          border: 1px solid rgba(74,124,89,.25);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          color: var(--matcha-light);
        }
        .about-copy p {
          font-size: .95rem;
          color: var(--matcha-light);
          line-height: 1.8;
          font-weight: 300;
          margin-bottom: 1.2rem;
        }
        .values-list { list-style: none; margin-top: 1.75rem; }
        .value-item {
          display: flex; align-items: center; gap: .75rem;
          padding: .7rem 0;
          border-bottom: 1px solid var(--border);
          font-size: .9rem;
          color: var(--foam);
          font-weight: 400;
        }
        .value-item:last-child { border-bottom: none; }
        .value-check { color: var(--accent); flex-shrink: 0; }

        /* ── TEAM ── */
        .team-section { margin-bottom: 6rem; }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        .team-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex; flex-direction: column; align-items: center;
          gap: 1rem;
          text-align: center;
          cursor: pointer;
          transition: border-color .25s;
        }
        .team-card:hover { border-color: var(--matcha); }
        .team-avatar {
          width: 64px; height: 64px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 600;
          color: var(--foam);
          box-shadow: 0 4px 16px rgba(0,0,0,.3);
        }
        .team-name { font-size: .95rem; font-weight: 500; color: var(--foam); }
        .team-role { font-size: .8rem; color: var(--matcha-mid); margin-top: .2rem; font-family: 'Space Mono', monospace; }
        .team-stars { display: flex; gap: .2rem; margin-top: .25rem; }

        /* ── AWARDS STRIP ── */
        .awards-strip {
          display: flex; flex-wrap: wrap; gap: 1rem;
          margin-bottom: 6rem;
        }
        .award-chip {
          display: inline-flex; align-items: center; gap: .6rem;
          border: 1px solid var(--border);
          background: var(--card);
          color: var(--matcha-light);
          padding: .65rem 1.1rem;
          border-radius: 999px;
          font-size: .82rem;
          transition: border-color .25s;
        }
        .award-chip:hover { border-color: var(--matcha); }
        .award-icon { color: var(--gold); }

        /* ── CTA SECTION ── */
        .cta-section {
          text-align: center;
          padding: 5rem 1rem 6rem;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 28px;
          margin-bottom: 4rem;
          position: relative;
          overflow: hidden;
        }
        .cta-section::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(74,124,89,.18), transparent 65%);
        }
        .cta-glyph {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem,8vw,5.5rem);
          font-weight: 300;
          line-height: 1.1;
          color: var(--foam);
          margin-bottom: 1.25rem;
          position: relative;
        }
        .cta-glyph em { color: var(--matcha-light); font-style: italic; }
        .cta-sub {
          font-size: 1rem;
          color: var(--matcha-light);
          max-width: 440px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
          font-weight: 300;
        }

        /* ── FOOTER ── */
        .about-footer {
          text-align: center;
          padding: 2rem 0 3rem;
          color: var(--matcha-mid);
          font-size: .8rem;
          font-family: 'Space Mono', monospace;
          border-top: 1px solid var(--border);
          letter-spacing: .04em;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 480px) {
          .hero-cta-row { flex-direction: column; align-items: flex-start; }
          .services-grid { grid-template-columns: 1fr; }
          .stats-strip { grid-template-columns: 1fr 1fr; }
          .team-grid { grid-template-columns: 1fr 1fr; }
          .awards-strip { gap: .6rem; }
          .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
        }

        @media (min-width: 1400px) {
          .services-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      {/* Progress bar */}
      <div ref={progressRef} className="progress-bar" />

      {/* Floating bubbles */}
      <BubbleField />

      <div className="about-page">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeleton" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <SkeletonHero />
              <div className="skeleton-grid">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* ── HERO ── */}
              {/* <section ref={heroRef} className="hero-section">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                >
                  <span className="hero-eyebrow">
                    <Sparkles size={12} />
                    Web Agency · Est. 2019
                  </span>
                </motion.div>

                <div className="hero-tagline">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    We craft <em>digital</em>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.32 }}
                  >
                    experiences that{" "}
                    <span className="underline-text">matter.</span>
                  </motion.div>
                </div>

                <motion.p
                  className="hero-sub"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                >
                  A boutique agency obsessed with performance, design, and outcomes. We
                  partner with ambitious brands to build products people love.
                </motion.p>

                <motion.div
                  className="hero-cta-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.65 }}
                >
                  <a href="#services" className="btn-primary">
                    Our Work <ArrowRight size={16} />
                  </a>
                  <a href="#team" className="btn-ghost">
                    <Users size={15} /> Meet the team
                  </a>
                </motion.div>

                <div className="hero-scroll-hint">
                  <div className="scroll-dot" />
                  scroll to explore
                </div>
              </section> */}

              {/* ── MARQUEE ── */}
              {/* <div className="marquee-wrap">
                <div ref={marqueeRef} className="marquee-track">
                  {[...Array(2)].flatMap(() =>
                    ["Next.js", "React", "Figma", "TypeScript", "GSAP", "Three.js", "AI/ML", "Tailwind", "GraphQL", "Framer"].map(
                      (t, i) => (
                        <span key={`${t}-${i}`} className="marquee-item">
                          <span className="marquee-dot" />
                          {t}
                        </span>
                      )
                    )
                  )}
                </div>
              </div> */}

              {/* ── STATS ── */}
              {/* <div className="stats-strip">
                <StatCounter value={120} suffix="+" label="Projects shipped" />
                <StatCounter value={98} suffix="%" label="Client satisfaction" />
                <StatCounter value={6} suffix="yr" label="Industry experience" />
                <StatCounter value={40} suffix="+" label="Brands served" />
              </div> */}

              {/* ── SERVICES ── */}
              <section id="services">
                <SectionHeading
                  badge="What we do"
                  title="Services built for <span>scale</span>"
                  sub="From zero to production — we cover every layer of the digital stack."
                />
                <div className="reveal-line" />
                <div className="services-grid">
                  {services.map((s, i) => <ServiceCard key={s.title} {...s} index={i} />)}
                </div>
              </section>

              {/* ── ABOUT SPLIT ── */}
              <section>
                <SectionHeading
                  badge="About us"
                  title="Built by people who <span>give a damn</span>"
                  sub="We're a small, senior team that believes great craft is the competitive advantage."
                />
                <div className="about-split">
                  <motion.div
                    className="about-visual"
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7 }}
                  >
                    <div className="about-visual-inner">
                      <div className="visual-icon-grid">
                        {[Code2, Palette, Zap, Globe].map((Icon, i) => (
                          <motion.div
                            key={i}
                            className="v-icon-box"
                            initial={{ scale: 0.7, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.45 }}
                          >
                            <Icon size={28} strokeWidth={1.4} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  <div className="about-copy">
                    <p>
                      Founded in 2019, we started as two developers who were tired of
                      agencies shipping mediocre code and calling it enterprise-grade.
                      Today we`re a tight-knit crew of designers, engineers, and strategists.
                    </p>
                    <p>
                      Our process is simple: listen deeply, design boldly, ship fast, and
                      iterate relentlessly. Every project gets our full attention — we cap our
                      client roster so we never spread ourselves thin.
                    </p>
                    <ul className="values-list">
                      {values.map((v) => (
                        <li key={v} className="value-item">
                          <CheckCircle2 size={16} className="value-check" />
                          {v}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* ── TEAM ── */}
              <section id="team" className="team-section">
                <SectionHeading
                  badge="The crew"
                  title="Faces behind the <span>magic</span>"
                  sub="Senior talent only. No juniors learning on your dime."
                />
                <div className="team-grid">
                  {team.map((m, i) => <TeamCard key={m.name} {...m} index={i} />)}
                </div>
              </section>

              {/* ── AWARDS ── */}
              <div className="awards-strip">
                {[
                  "Awwwards — Site of the Day",
                  "CSS Design Awards",
                  "Webby Nominee 2024",
                  "500k+ Users Served",
                  "Google Partner",
                  "Top Agency — Clutch 2024",
                ].map((a) => (
                  <motion.span
                    key={a}
                    className="award-chip"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.04 }}
                  >
                    <Award size={14} className="award-icon" />
                    {a}
                  </motion.span>
                ))}
              </div>

              {/* ── CTA ── */}
              <motion.section
                className="cta-section"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
              >
                <p className="cta-glyph">
                  Ready to build<br />
                  something <em>great?</em>
                </p>
                <p className="cta-sub">
                  We take on 3–4 new projects per quarter. Let`s talk before the spots fill up.
                </p>
                <a href="mailto:hello@agency.com" className="btn-primary" style={{ margin: "0 auto", display: "inline-flex" }}>
                  <TrendingUp size={16} /> Start a project
                </a>
              </motion.section>

              {/* ── FOOTER ── */}
              <footer className="about-footer">
                © 2025 Studio Verde · All rights reserved · Built with intention
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}