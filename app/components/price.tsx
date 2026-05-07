"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Video,
  Phone,
  Briefcase,
  Check,
  Zap,
  Star,
  ArrowRight,
  Sparkles,
  Clock,
  Users,
  Shield,
  ChevronDown,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface Plan {
  id: string;
  name: string;
  badge?: string;
  price: { monthly: number; yearly: number };
  description: string;
  icon: React.ReactNode;
  features: string[];
  cta: string;
  highlight: boolean;
  accentClass: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const plans: Plan[] = [
  {
    id: "starter",
    name: "Work Call",
    price: { monthly: 29, yearly: 23 },
    description: "Perfect for solo freelancers and indie teams.",
    icon: <Phone size={22} />,
    badge: undefined,
    accentClass: "accent-sage",
    highlight: false,
    cta: "Start Free Trial",
    features: [
      "Up to 5 participants",
      "HD audio & screen share",
      "30-min session limit",
      "Basic recording",
      "Chat & reactions",
      "Calendar integration",
    ],
  },
  {
    id: "pro",
    name: "Video Pro",
    price: { monthly: 79, yearly: 63 },
    description: "Built for growing agencies that close deals on camera.",
    icon: <Video size={22} />,
    badge: "Most Popular",
    accentClass: "accent-matcha",
    highlight: true,
    cta: "Get Started",
    features: [
      "Up to 50 participants",
      "4K video + noise cancellation",
      "Unlimited recording & cloud",
      "Custom branded room",
      "AI-generated transcripts",
      "Priority 24/7 support",
      "Analytics dashboard",
      "Whiteboard & annotations",
    ],
  },
  {
    id: "agency",
    name: "Agency Suite",
    price: { monthly: 149, yearly: 119 },
    description: "Enterprise-grade for high-volume client studios.",
    icon: <Briefcase size={22} />,
    badge: undefined,
    accentClass: "accent-forest",
    highlight: false,
    cta: "Talk to Sales",
    features: [
      "Unlimited participants",
      "Multi-room management",
      "White-label experience",
      "SSO + advanced security",
      "Custom integrations",
      "Dedicated account manager",
      "SLA uptime guarantee",
      "API access",
    ],
  },
];

// ─── Bubble ───────────────────────────────────────────────────────────────────
function Bubble({
  size,
  x,
  delay,
  duration,
}: {
  size: number;
  x: number;
  delay: number;
  duration: number;
}) {
  return (
    <motion.div
      className="bubble"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        bottom: "-80px",
      }}
      animate={{
        y: [0, -900],
        x: [0, Math.random() * 60 - 30],
        opacity: [0, 0.55, 0.4, 0],
        scale: [0.6, 1, 0.9],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="sk sk-icon" />
      <div className="sk sk-title" />
      <div className="sk sk-desc" />
      <div className="sk sk-price" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="sk sk-feature" style={{ width: `${70 + i * 4}%` }} />
      ))}
      <div className="sk sk-btn" />
    </div>
  );
}

// ─── FAQ Item ─────────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="faq-item"
      onClick={() => setOpen(!open)}
      whileHover={{ x: 4 }}
    >
      <div className="faq-header">
        <span>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={18} />
        </motion.div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.p
            className="faq-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Pricing() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Simulate loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  // GSAP hero text split
  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-word", {
        y: 80,
        opacity: 0,
        rotateX: -40,
        stagger: 0.09,
        duration: 0.9,
        ease: "back.out(1.4)",
        delay: 0.2,
      });

      gsap.from(".hero-sub", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.9,
        ease: "power3.out",
      });

      gsap.from(".toggle-wrap", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 1.1,
      });

      // Stats counter
      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((el) => {
        const target = parseFloat(el.dataset.target || "0");
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => {
            gsap.fromTo(
              el,
              { innerText: 0 },
              {
                innerText: target,
                duration: 2,
                ease: "power2.out",
                snap: { innerText: target < 10 ? 0.1 : 1 },
              }
            );
          },
        });
      });

      // Card parallax
      gsap.utils.toArray<HTMLElement>(".price-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          y: 60 + i * 20,
          opacity: 0,
          duration: 0.85,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, [loading]);

  // Bubbles config
  const bubbles = Array.from({ length: 18 }, (_, i) => ({
    size: 10 + Math.random() * 50,
    x: Math.random() * 100,
    delay: Math.random() * 12,
    duration: 8 + Math.random() * 14,
  }));

  return (
    <>
      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');


        :root {
          --matcha-50:  #f4f9f0;
          --matcha-100: #e2f0d6;
          --matcha-200: #c5e0ac;
          --matcha-300: #a3cc7e;
          --matcha-400: #7db54e;
          --matcha-500: #5e9932;
          --matcha-600: #4a7c26;
          --matcha-700: #3a611e;
          --matcha-800: #2c4a17;
          --matcha-900:#0D1C12;

          --sage:    #8aab6e;
          --forest:  #2d5a1b;
          --cream:   #f8faf4;
          --text-dark: #1a2410;
          --text-mid:  #3d5228;
          --text-light:#6b8a50;

          --card-bg: var(--matcha-400) ;
          --card-border: rgba(90,140,50,0.18);
          --shadow-card: 0 8px 40px rgba(60,100,30,0.10), 0 2px 8px rgba(60,100,30,0.06);
          --shadow-highlight: 0 20px 60px rgba(60,140,30,0.22), 0 4px 16px rgba(60,140,30,0.14);

          --radius: 24px;
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: var(--font-body);
          background: var(--matcha-900);
          color: var(--text-white);
          overflow-x: hidden;
        }

        /* ── Pricing Page Wrapper ── */
        .pricing-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        /* ── Animated Background ── */
        .bg-mesh {
          position: fixed;
          inset: 0;
          z-index: 0;
          background:
            radial-gradient(ellipse 80% 60% at 20% 10%, rgba(163,204,126,0.22) 0%, transparent 70%),
            radial-gradient(ellipse 60% 50% at 85% 80%, rgba(94,153,50,0.15) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 50% 50%, rgba(232,245,218,0.3) 0%, transparent 70%),
            var(--matcha-900);
          pointer-events: none;
        }

        .bg-grid {
          position: fixed;
          inset: 0;
          z-index: 0;
          background-image:
            linear-gradient(rgba(90,140,50,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(90,140,50,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* ── Bubbles ── */
        .bubble-container {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%,
            rgba(163,204,126,0.55),
            rgba(94,153,50,0.2) 60%,
            transparent);
          border: 1px solid rgba(120,180,70,0.25);
          backdrop-filter: blur(2px);
        }

        /* ── Content ── */
        .content {
          position: relative;
          z-index: 10;
        }

        /* ── Hero ── */
        .hero {
          text-align: center;
          padding: clamp(80px, 12vw, 140px) clamp(20px, 5vw, 60px) clamp(50px, 7vw, 90px);
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(94,153,50,0.1);
          border: 1px solid rgba(94,153,50,0.25);
          border-radius: 100px;
          padding: 6px 18px;
          font-size: 13px;
          font-weight: 500;
          color: var(--matcha-600);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }

        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(38px, 6.5vw, 84px);
          font-weight: 900;
          line-height: 1.08;
          color: var(--text-cream);
          margin-bottom: 22px;
          perspective: 800px;
        }

        .hero-word { display: inline-block; margin: 0 4px; }
        .hero-word.green { color: var(--matcha-500); font-style: italic; }

        .hero-sub {
          font-size: clamp(15px, 2vw, 19px);
          color: var(--text-light);
          max-width: 560px;
          margin: 0 auto 40px;
          line-height: 1.65;
          font-weight: 300;
        }

        /* ── Toggle ── */
        .toggle-wrap {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          background: white;
          border: 1px solid var(--card-border);
          border-radius: 100px;
          padding: 6px 8px;
          backdrop-filter: blur(12px);
        }

        .toggle-label {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-mid);
          padding: 0 8px;
          cursor: pointer;
          transition: color 0.2s;
        }

        .toggle-label.active { color: var(--matcha-900); }

        .toggle-track {
          width: 52px; height: 28px;
          background: var(--matcha-500);
          border-radius: 100px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s;
        }

        .toggle-track.yearly { background: var(--matcha-500); }

        .toggle-thumb {
          position: absolute;
          top: 3px; left: 3px;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }

        .toggle-track.yearly .toggle-thumb { transform: translateX(24px); }

        .save-badge {
          font-size: 11px;
          font-weight: 600;
          color: white;
          background: var(--matcha-500);
          border-radius: 100px;
          padding: 3px 10px;
          margin-left: 4px;
        }

        /* ── Cards Grid ── */
        .cards-section {
          padding: 0 clamp(16px, 4vw, 60px) clamp(60px, 8vw, 100px);
          max-width: 1220px;
          margin: 0 auto;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 960px) {
          .cards-grid { grid-template-columns: 1fr 1fr; }
          .price-card:last-child { grid-column: 1 / -1; max-width: 480px; margin: 0 auto; width: 100%; }
        }

        @media (max-width: 600px) {
          .cards-grid { grid-template-columns: 1fr; }
          .price-card:last-child { grid-column: auto; max-width: 100%; }
        }

        /* ── Price Card ── */
        .price-card {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius);
          padding: clamp(28px, 3.5vw, 44px) clamp(24px, 3vw, 38px);
          backdrop-filter: blur(16px);
          box-shadow: var(--shadow-card);
          position: relative;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s;
        }

        .price-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--matcha-200);
          border-radius: var(--radius) var(--radius) 0 0;
          transition: background 0.3s;
        }

        .price-card.highlight {
          background: linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,250,230,0.9));
          border-color: rgba(94,153,50,0.35);
          box-shadow: var(--shadow-highlight);
          transform: translateY(-8px) scale(1.02);
        }

        .price-card.highlight::before { background: linear-gradient(90deg, var(--matcha-400), var(--matcha-600)); }

        .price-card:hover:not(.highlight) {
          transform: translateY(-4px);
          box-shadow: 0 16px 50px rgba(60,100,30,0.16);
        }

        .price-card.highlight:hover { transform: translateY(-12px) scale(1.02); }

        /* Glow orb inside card */
        .card-orb {
          position: absolute;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(94,153,50,0.12), transparent 70%);
          top: -80px; right: -60px;
          pointer-events: none;
        }

        .card-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--matcha-700);
          background: linear-gradient(135deg, var(--matcha-100), var(--matcha-200));
          border: 1px solid var(--matcha-300);
          border-radius: 100px;
          padding: 4px 12px;
          margin-bottom: 18px;
          letter-spacing: 0.03em;
        }

        .card-icon-wrap {
          width: 48px; height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--matcha-100), var(--matcha-200));
          border: 1px solid var(--matcha-300);
          display: flex; align-items: center; justify-content: center;
          color: var(--matcha-600);
          margin-bottom: 16px;
        }

        .card-name {
          font-family: var(--font-display);
          font-size: clamp(20px, 2.2vw, 26px);
          font-weight: 700;
          color: var(--text-dark);
          margin-bottom: 8px;
        }

        .card-desc {
          font-size: 14px;
          color: var(--text-light);
          line-height: 1.55;
          margin-bottom: 28px;
        }

        .price-row {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          margin-bottom: 28px;
        }

        .price-dollar {
          font-size: 20px;
          font-weight: 600;
          color: var(--matcha-600);
          padding-bottom: 6px;
        }

        .price-amount {
          font-family: var(--font-display);
          font-size: clamp(42px, 5vw, 58px);
          font-weight: 900;
          color: var(--text-dark);
          line-height: 1;
        }

        .price-period {
          font-size: 14px;
          color: var(--text-light);
          padding-bottom: 8px;
          font-weight: 400;
        }

        /* ── Features ── */
        .features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 11px;
          margin-bottom: 32px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          color: var(--text-mid);
          font-weight: 400;
        }

        .feature-check {
          flex-shrink: 0;
          width: 20px; height: 20px;
          border-radius: 6px;
          background: linear-gradient(135deg, var(--matcha-100), var(--matcha-200));
          border: 1px solid var(--matcha-300);
          display: flex; align-items: center; justify-content: center;
          color: var(--matcha-600);
        }

        /* ── CTA Button ── */
        .cta-btn {
          width: 100%;
          padding: 15px 24px;
          border-radius: 14px;
          font-family: var(--font-body);
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          letter-spacing: 0.01em;
        }

        .cta-btn.primary {
          background: linear-gradient(135deg, var(--matcha-500), var(--matcha-600));
          color: white;
          box-shadow: 0 6px 20px rgba(94,153,50,0.35);
        }

        .cta-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(94,153,50,0.45);
          background: linear-gradient(135deg, var(--matcha-400), var(--matcha-500));
        }

        .cta-btn.secondary {
          background: transparent;
          color: var(--matcha-600);
          border: 1.5px solid var(--matcha-300);
        }

        .cta-btn.secondary:hover {
          background: var(--matcha-50);
          border-color: var(--matcha-400);
          transform: translateY(-2px);
        }

        /* ── Stats Bar ── */
        .stats-bar {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: clamp(20px, 4vw, 60px);
          padding: clamp(40px, 6vw, 70px) clamp(20px, 5vw, 60px);
          margin: 0 auto;
          max-width: 900px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number-wrap {
          font-family: var(--font-display);
          font-size: clamp(34px, 4.5vw, 52px);
          font-weight: 900;
          color: var(--matcha-600);
          line-height: 1;
          margin-bottom: 6px;
        }

        .stat-label {
          font-size: 13px;
          color: var(--text-light);
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        .stat-divider {
          width: 1px;
          background: var(--matcha-200);
          align-self: stretch;
          min-height: 50px;
        }

        @media (max-width: 560px) { .stat-divider { display: none; } }

        /* ── Guarantee Strip ── */
        .guarantee-strip {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 60px) clamp(50px, 6vw, 80px);
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }

        .guarantee-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.7);
          border: 1px solid var(--card-border);
          border-radius: 100px;
          padding: 10px 20px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--text-mid);
          backdrop-filter: blur(8px);
        }

        .guarantee-pill svg { color: var(--matcha-500); }

        /* ── FAQ ── */
        .faq-section {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 clamp(20px, 5vw, 60px) clamp(80px, 10vw, 120px);
        }

        .section-label {
          font-family: var(--font-display);
          font-size: clamp(28px, 3.5vw, 42px);
          font-weight: 700;
          color:  var(--matcha-300);
          text-align: center;
          margin-bottom: 40px;
        }

        .faq-item {
          background: rgba(255,255,255,0.7);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 20px 24px;
          margin-bottom: 12px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: border-color 0.2s, background 0.2s;
        }

        .faq-item:hover { border-color: var(--matcha-300); background: rgba(255,255,255,0.88); }

        .faq-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          font-weight: 500;
          color: var(--text-dark);
          gap: 16px;
        }

        .faq-header svg { flex-shrink: 0; color: var(--matcha-500); }

        .faq-body {
          overflow: hidden;
          font-size: 14px;
          color: var(--text-light);
          line-height: 1.65;
          padding-top: 12px;
        }

        /* ── Skeleton ── */
        .skeleton-card {
          background: rgba(255,255,255,0.75);
          border: 1px solid var(--card-border);
          border-radius: var(--radius);
          padding: 38px 32px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .sk {
          border-radius: 8px;
          background: linear-gradient(90deg, var(--matcha-100) 25%, var(--matcha-50) 50%, var(--matcha-100) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite linear;
        }

        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .sk-icon  { width: 48px; height: 48px; border-radius: 14px; }
        .sk-title { width: 55%; height: 22px; }
        .sk-desc  { width: 85%; height: 14px; }
        .sk-price { width: 40%; height: 52px; }
        .sk-feature { height: 14px; }
        .sk-btn   { width: 100%; height: 50px; border-radius: 14px; margin-top: 8px; }
      `}</style>

      {/* ── Background layers ── */}
      <div className="bg-mesh" />
      <div className="bg-grid" />

      {/* ── Bubbles ── */}
      <div className="bubble-container">
        {bubbles.map((b, i) => (
          <Bubble key={i} {...b} />
        ))}
      </div>

      {/* ── Page ── */}
      <div className="pricing-page">
        <div className="content" ref={heroRef}>

          {/* ── Hero ── */}
          <section className="hero">
            <motion.div
              className="hero-eyebrow"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles size={13} />
              Simple, transparent pricing
            </motion.div>

            <h1 className="hero-title">
              {["Plans", "built", "for", "every"].map((w, i) => (
                <span key={i} className="hero-word">{w} </span>
              ))}
              <span className="hero-word green">agency</span>
            </h1>

            <p className="hero-sub">
              Choose the plan that fits how you work — solo calls, team video
              sessions, or a full white-label studio experience.
            </p>

            {/* ── Billing Toggle ── */}
            <div className="toggle-wrap">
              <span
                className={`toggle-label ${billing === "monthly" ? "active" : ""}`}
                onClick={() => setBilling("monthly")}
              >
                Monthly
              </span>

              <div
                className={`toggle-track ${billing === "yearly" ? "yearly" : ""}`}
                onClick={() =>
                  setBilling(billing === "monthly" ? "yearly" : "monthly")
                }
              >
                <div className="toggle-thumb" />
              </div>

              <span
                className={`toggle-label ${billing === "yearly" ? "active" : ""}`}
                onClick={() => setBilling("yearly")}
              >
                Yearly
              </span>
              {billing === "yearly" && (
                <motion.span
                  className="save-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  Save 20%
                </motion.span>
              )}
            </div>
          </section>

          {/* ── Cards ── */}
          <section className="cards-section" ref={cardsRef}>
            <div className="cards-grid">
              <AnimatePresence mode="wait">
                {loading ? (
                  <>
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={`sk-${i}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <SkeletonCard />
                      </motion.div>
                    ))}
                  </>
                ) : (
                  plans.map((plan) => (
                    <motion.div
                      key={plan.id}
                      className={`price-card ${plan.highlight ? "highlight" : ""}`}
                      layout
                      whileHover={{ scale: plan.highlight ? 1.025 : 1.015 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="card-orb" />

                      {plan.badge && (
                        <div className="card-badge">
                          <Star size={11} />
                          {plan.badge}
                        </div>
                      )}

                      <div className="card-icon-wrap">{plan.icon}</div>

                      <div className="card-name">{plan.name}</div>
                      <div className="card-desc">{plan.description}</div>

                      <div className="price-row">
                        <span className="price-dollar">$</span>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`${plan.id}-${billing}`}
                            className="price-amount"
                            initial={{ y: -18, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 18, opacity: 0 }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                          >
                            {plan.price[billing]}
                          </motion.span>
                        </AnimatePresence>
                        <span className="price-period">
                          /{billing === "monthly" ? "mo" : "mo billed annually"}
                        </span>
                      </div>

                      <ul className="features-list">
                        {plan.features.map((f, i) => (
                          <motion.li
                            key={f}
                            className="feature-item"
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * i + 0.3 }}
                          >
                            <span className="feature-check">
                              <Check size={11} strokeWidth={3} />
                            </span>
                            {f}
                          </motion.li>
                        ))}
                      </ul>

                      <motion.button
                        className={`cta-btn ${plan.highlight ? "primary" : "secondary"}`}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ gap: "12px" }}
                      >
                        {plan.cta}
                        <ArrowRight size={16} />
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* ── Guarantee Pills ── */}
          <div className="guarantee-strip">
            {[
              { icon: <Shield size={15} />, text: "30-day money-back guarantee" },
              { icon: <Clock size={15} />, text: "Cancel anytime, no lock-in" },
              { icon: <Zap size={15} />, text: "Instant setup, no credit card" },
              { icon: <Users size={15} />, text: "Free migration support" },
            ].map((g, i) => (
              <motion.div
                key={i}
                className="guarantee-pill"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                {g.icon}
                {g.text}
              </motion.div>
            ))}
          </div>

          {/* ── FAQ ── */}
          <section className="faq-section">
            <motion.h2
              className="section-label"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Common questions
            </motion.h2>

            {[
              {
                q: "Can I switch plans later?",
                a: "Absolutely. You can upgrade or downgrade at any time from your dashboard. Billing is prorated automatically so you only pay for what you use.",
              },
              {
                q: "What happens after the trial ends?",
                a: "Your 14-day trial is full-featured and no credit card is required to start. When it ends you'll be prompted to choose a plan — your data stays safe.",
              },
              {
                q: "Do you offer discounts for non-profits or students?",
                a: "Yes! Reach out to our support team with verification and we'll apply a 40% discount to any plan.",
              },
              {
                q: "Is my video data secure and private?",
                a: "All sessions are end-to-end encrypted using AES-256. We are SOC 2 Type II certified and fully GDPR compliant.",
              },
              {
                q: "Can I record calls and where are they stored?",
                a: "Recordings are available on Pro and Agency plans, stored in our encrypted cloud or exported to your preferred storage (S3, Dropbox, Drive).",
              },
            ].map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </section>

        </div>
      </div>
    </>
  );
}