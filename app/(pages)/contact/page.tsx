"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Globe,
  MessageSquare,
  Sparkles,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
}

interface Bubble {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  xOffset: number;
}

// ─── Skeleton Component ───────────────────────────────────────────────────────
const SkeletonPulse = ({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) => (
  <div
    className={`skeleton-pulse rounded-lg ${className}`}
    style={{
      background:
        "linear-gradient(90deg, #2a3d2a 25%, #3a5c3a 50%, #2a3d2a 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.8s infinite",
      ...style,
    }}
  />
);

const ContactSkeleton = () => (
  <div className="contact-skeleton">
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <SkeletonPulse className="h-8 w-48" style={{ height: 32, width: 192 }} />
      <SkeletonPulse className="h-4 w-64" style={{ height: 16, width: 256 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <SkeletonPulse
            key={i}
            style={{ height: i === 5 ? 96 : 48, width: "100%", borderRadius: 8 }}
          />
        ))}
      </div>
      <SkeletonPulse style={{ height: 52, width: "100%", borderRadius: 26 }} />
    </div>
  </div>
);

// ─── Bubble Component ─────────────────────────────────────────────────────────
const BubbleField = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const count = window.innerWidth < 768 ? 20 : 44;
      const generated: Bubble[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 60 + 20,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * 8,
        opacity: Math.random() * 0.25 + 0.05,
        xOffset: (Math.random() - 0.5) * 80,
      }));
      setBubbles(generated);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="bubble-field" aria-hidden="true">
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
            y: [0, -window.innerHeight - 100],
            x: [0, b.xOffset],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// ─── Info Card ────────────────────────────────────────────────────────────────
const InfoCard = ({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delay: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="info-card"
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: 6, transition: { duration: 0.2 } }}
    >
      <div className="info-icon-wrap">
        <Icon size={18} />
      </div>
      <div>
        <p className="info-label">{label}</p>
        <p className="info-value">{value}</p>
      </div>
    </motion.div>
  );
};

// ─── Main Contact Component ───────────────────────────────────────────────────
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    service: "",
    budget: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  // Simulate initial skeleton loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (isLoading) return;
    const ctx = gsap.context(() => {
      // Heading word-by-word reveal
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll(".word");
        gsap.fromTo(
          words,
          { y: 80, opacity: 0, rotateX: -45 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "expo.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Left column slide in
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current,
          { x: -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: leftColRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Form fields stagger
      if (formRef.current) {
        const fields = formRef.current.querySelectorAll(".form-field");
        gsap.fromTo(
          fields,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: formRef.current,
              start: "top 75%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSending(false);
    setSubmitted(true);
  };

  const services = [
    "Brand Identity",
    "Web Design & Development",
    "UI/UX Design",
    "Motion & Animation",
    "Digital Strategy",
    "SEO & Performance",
  ];

  const budgets = [
    "< $5,000",
    "$5,000 – $15,000",
    "$15,000 – $50,000",
    "$50,000+",
  ];

  return (
    <>
      {/* ── Global Styles ─────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --matcha-900: #0f1f0f;
          --matcha-800: #1a2f1a;
          --matcha-700: #243824;
          --matcha-600: #2e4a2e;
          --matcha-500: #4a7c59;
          --matcha-400: #6bab7a;
          --matcha-300: #8ecb9a;
          --matcha-200: #b8e4c0;
          --matcha-100: #e0f4e4;
          --matcha-50:  #f2faf4;
          --cream:      #faf8f0;
          --gold:       #c8a96e;
          --radius-sm:  8px;
          --radius-md:  16px;
          --radius-lg:  24px;
          --radius-xl:  40px;
          --shadow-soft: 0 8px 40px rgba(15, 31, 15, 0.18);
          --shadow-glow: 0 0 40px rgba(74, 124, 89, 0.25);
        }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }

        @keyframes float-up {
          0%   { transform: translateY(100vh) scale(0.8); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-120px) scale(1.1); opacity: 0; }
        }

        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }

        .contact-section {
          position: relative;
          min-height: 100vh;
          background: var(--matcha-900);
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          padding: clamp(4rem, 8vw, 8rem) clamp(1.25rem, 5vw, 4rem);
        }

        /* Noise texture overlay */
        .contact-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        /* Radial glow */
        .contact-section::after {
          content: '';
          position: absolute;
          top: -20%;
          right: -10%;
          width: 70vw;
          height: 70vw;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(74,124,89,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* ── Bubbles ─────────────────────────────────────────────────────────── */
        .bubble-field {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 1;
        }

        .bubble {
          position: absolute;
          bottom: -80px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%,
            rgba(142, 203, 154, 0.6),
            rgba(74, 124, 89, 0.3) 50%,
            transparent 70%);
          border: 1px solid rgba(142, 203, 154, 0.2);
          backdrop-filter: blur(2px);
        }

        /* ── Layout ──────────────────────────────────────────────────────────── */
        .contact-inner {
          position: relative;
          z-index: 2;
          max-width: 1280px;
          margin: 0 auto;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--matcha-300);
          margin-bottom: 1.5rem;
        }

        .eyebrow-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--matcha-400);
          position: relative;
        }

        .eyebrow-dot::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1px solid var(--matcha-400);
          animation: pulse-ring 2s ease-out infinite;
        }

        .contact-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 6vw, 5.5rem);
          line-height: 1.05;
          color: var(--cream);
          margin-bottom: 2.5rem;
          perspective: 800px;
          overflow: hidden;
        }

        .heading-line {
          display: block;
          overflow: hidden;
        }

        .word {
          display: inline-block;
          margin-right: 0.25em;
        }

        .word-accent {
          color: var(--matcha-300);
          font-style: italic;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: clamp(2rem, 5vw, 5rem);
          align-items: start;
          margin-top: 3rem;
        }

        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; gap: 3rem; }
          .contact-heading { font-size: clamp(2.2rem, 8vw, 3.5rem); }
        }

        /* ── Left Column ─────────────────────────────────────────────────────── */
        .left-col { display: flex; flex-direction: column; gap: 1.5rem; }

        .tagline {
          font-size: clamp(0.9rem, 1.5vw, 1.05rem);
          color: rgba(224, 244, 228, 0.65);
          line-height: 1.75;
          max-width: 38ch;
        }

        .info-cards { display: flex; flex-direction: column; gap: 0.875rem; margin-top: 1rem; }

        .info-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background: rgba(42, 74, 42, 0.25);
          border: 1px solid rgba(74, 124, 89, 0.2);
          border-radius: var(--radius-md);
          cursor: default;
          transition: border-color 0.3s, background 0.3s;
        }

        .info-card:hover {
          border-color: rgba(142, 203, 154, 0.4);
          background: rgba(42, 74, 42, 0.4);
        }

        .info-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(74, 124, 89, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--matcha-300);
          flex-shrink: 0;
        }

        .info-label {
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--matcha-400);
          margin-bottom: 0.2rem;
        }

        .info-value {
          font-size: 0.9rem;
          color: var(--cream);
          font-weight: 500;
        }

        .availability-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(74, 124, 89, 0.15);
          border: 1px solid rgba(74, 124, 89, 0.3);
          border-radius: 100px;
          font-size: 0.8rem;
          color: var(--matcha-300);
          margin-top: 0.5rem;
          width: fit-content;
        }

        .avail-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
          animation: pulse-ring 2s ease infinite;
        }

        /* ── Form Panel ──────────────────────────────────────────────────────── */
        .form-panel {
          background: rgba(26, 47, 26, 0.5);
          border: 1px solid rgba(74, 124, 89, 0.25);
          border-radius: var(--radius-xl);
          padding: clamp(1.75rem, 4vw, 3rem);
          backdrop-filter: blur(12px);
          box-shadow: var(--shadow-soft), inset 0 1px 0 rgba(142, 203, 154, 0.08);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr; }
          .form-panel { border-radius: var(--radius-lg); }
        }

        .form-field { display: flex; flex-direction: column; gap: 0.4rem; }

        .form-field.full { grid-column: 1 / -1; }

        .field-label {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--matcha-400);
          padding-left: 0.25rem;
        }

        .field-input,
        .field-select,
        .field-textarea {
          width: 100%;
          background: rgba(15, 31, 15, 0.6);
          border: 1.5px solid rgba(74, 124, 89, 0.2);
          border-radius: var(--radius-sm);
          padding: 0.85rem 1rem;
          color: var(--cream);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
          -webkit-appearance: none;
        }

        .field-input::placeholder,
        .field-textarea::placeholder {
          color: rgba(224, 244, 228, 0.25);
        }

        .field-input:focus,
        .field-select:focus,
        .field-textarea:focus {
          border-color: var(--matcha-400);
          box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.18), var(--shadow-glow);
          background: rgba(15, 31, 15, 0.85);
        }

        .field-select option {
          background: var(--matcha-800);
          color: var(--cream);
        }

        .field-textarea { resize: vertical; min-height: 110px; line-height: 1.6; }

        /* ── Submit Button ────────────────────────────────────────────────────── */
        .submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, var(--matcha-500) 0%, var(--matcha-400) 100%);
          border: none;
          border-radius: 100px;
          color: var(--matcha-900);
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
          box-shadow: 0 4px 24px rgba(74, 124, 89, 0.4);
          margin-top: 0.5rem;
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          border-radius: inherit;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(74, 124, 89, 0.55);
        }

        .submit-btn:active:not(:disabled) { transform: translateY(0); }

        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* ── Success State ────────────────────────────────────────────────────── */
        .success-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 1.25rem;
          padding: 3rem 2rem;
          min-height: 320px;
        }

        .success-icon-wrap {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: rgba(74, 124, 89, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--matcha-300);
        }

        .success-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          color: var(--cream);
        }

        .success-sub {
          font-size: 0.95rem;
          color: rgba(224, 244, 228, 0.6);
          max-width: 30ch;
          line-height: 1.7;
        }

        /* ── Decorative orbit ─────────────────────────────────────────────────── */
        .orbit-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(74, 124, 89, 0.1);
          pointer-events: none;
        }

        .orbit-1 {
          width: 400px;
          height: 400px;
          bottom: -100px;
          left: -120px;
          animation: spin-slow 30s linear infinite;
        }

        .orbit-2 {
          width: 600px;
          height: 600px;
          bottom: -200px;
          left: -220px;
          animation: spin-slow 50s linear infinite reverse;
        }

        /* ── Character counter ───────────────────────────────────────────────── */
        .char-count {
          font-size: 0.7rem;
          color: rgba(224, 244, 228, 0.3);
          text-align: right;
          margin-top: -0.2rem;
        }

        /* ── Scrollbar ───────────────────────────────────────────────────────── */
        .field-textarea::-webkit-scrollbar { width: 4px; }
        .field-textarea::-webkit-scrollbar-track { background: transparent; }
        .field-textarea::-webkit-scrollbar-thumb { background: var(--matcha-600); border-radius: 4px; }
      `}</style>

      <section className="contact-section" ref={sectionRef} id="contact">
        {/* Bubbles */}
        <BubbleField />

        {/* Orbit rings */}
        <div className="orbit-ring orbit-1" />
        <div className="orbit-ring orbit-2" />

        <div className="contact-inner">
          {/* Eyebrow */}
          <motion.div
            className="eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Globe size={13} />
            <span className="eyebrow-dot" />
            Get in touch
          </motion.div>

          {/* Heading */}
          <h2 className="contact-heading" ref={headingRef}>
            <span className="heading-line">
              <span className="word">Let`s</span>
              <span className="word word-accent">craft</span>
            </span>
            <span className="heading-line">
              <span className="word">something</span>
            </span>
            <span className="heading-line">
              <span className="word">remarkable</span>
            </span>
          </h2>

          {/* Grid */}
          <div className="contact-grid">
            {/* ── Left Column ─────────────────────────────────────────────────── */}
            <div className="left-col" ref={leftColRef}>
              <p className="tagline">
                We partner with ambitious brands to build digital experiences
                that are as strategic as they are beautiful. Tell us about your
                vision.
              </p>

              <div className="info-cards">
                <InfoCard
                  icon={Mail}
                  label="Email"
                  value="hello@agency.studio"
                  delay={0.1}
                />
                <InfoCard
                  icon={Phone}
                  label="Phone"
                  value="+1 (415) 820 – 0042"
                  delay={0.2}
                />
                <InfoCard
                  icon={MapPin}
                  label="Studio"
                  value="San Francisco, CA 94107"
                  delay={0.3}
                />
                <InfoCard
                  icon={MessageSquare}
                  label="Response"
                  value="Within 24 hours"
                  delay={0.4}
                />
              </div>

              <motion.div
                className="availability-badge"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <span className="avail-dot" />
                Available for projects in Q3 2025
              </motion.div>
            </div>

            {/* ── Right Column ─────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="skeleton"
                  className="form-panel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4 }}
                >
                  <ContactSkeleton />
                </motion.div>
              ) : submitted ? (
                <motion.div
                  key="success"
                  className="form-panel"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="success-panel">
                    <motion.div
                      className="success-icon-wrap"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <CheckCircle2 size={36} />
                    </motion.div>
                    <motion.h3
                      className="success-title"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Message Sent!
                    </motion.h3>
                    <motion.p
                      className="success-sub"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      Thank you for reaching out. Our team will be in touch
                      within 24 hours.
                    </motion.p>
                    <motion.button
                      className="submit-btn"
                      style={{ marginTop: "0.5rem", width: "auto", padding: "0.75rem 2rem" }}
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", service: "", budget: "", message: "" });
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Sparkles size={16} />
                      Send another
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  className="form-panel"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <form ref={formRef} onSubmit={handleSubmit}>
                    <div className="form-grid">
                      {/* Name */}
                      <div className="form-field">
                        <label className="field-label" htmlFor="name">Name</label>
                        <motion.input
                          id="name"
                          name="name"
                          className="field-input"
                          placeholder="Alex Rivera"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused(null)}
                          required
                          animate={{
                            scale: focused === "name" ? 1.01 : 1,
                          }}
                          transition={{ duration: 0.15 }}
                        />
                      </div>

                      {/* Email */}
                      <div className="form-field">
                        <label className="field-label" htmlFor="email">Email</label>
                        <motion.input
                          id="email"
                          name="email"
                          type="email"
                          className="field-input"
                          placeholder="alex@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocused("email")}
                          onBlur={() => setFocused(null)}
                          required
                          animate={{ scale: focused === "email" ? 1.01 : 1 }}
                          transition={{ duration: 0.15 }}
                        />
                      </div>

                      {/* Service */}
                      <div className="form-field">
                        <label className="field-label" htmlFor="service">Service</label>
                        <motion.select
                          id="service"
                          name="service"
                          className="field-select"
                          value={formData.service}
                          onChange={handleChange}
                          onFocus={() => setFocused("service")}
                          onBlur={() => setFocused(null)}
                          animate={{ scale: focused === "service" ? 1.01 : 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <option value="">Select service…</option>
                          {services.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </motion.select>
                      </div>

                      {/* Budget */}
                      <div className="form-field">
                        <label className="field-label" htmlFor="budget">Budget</label>
                        <motion.select
                          id="budget"
                          name="budget"
                          className="field-select"
                          value={formData.budget}
                          onChange={handleChange}
                          onFocus={() => setFocused("budget")}
                          onBlur={() => setFocused(null)}
                          animate={{ scale: focused === "budget" ? 1.01 : 1 }}
                          transition={{ duration: 0.15 }}
                        >
                          <option value="">Select budget…</option>
                          {budgets.map((b) => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </motion.select>
                      </div>

                      {/* Message */}
                      <div className="form-field full">
                        <label className="field-label" htmlFor="message">Message</label>
                        <motion.textarea
                          id="message"
                          name="message"
                          className="field-textarea"
                          placeholder="Tell us about your project, goals, and timeline…"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocused("message")}
                          onBlur={() => setFocused(null)}
                          maxLength={600}
                          animate={{ scale: focused === "message" ? 1.005 : 1 }}
                          transition={{ duration: 0.15 }}
                        />
                        <span className="char-count">
                          {formData.message.length}/600
                        </span>
                      </div>

                      {/* Submit */}
                      <div className="form-field full">
                        <motion.button
                          type="submit"
                          className="submit-btn"
                          disabled={sending}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {sending ? (
                            <>
                              <Loader2 size={18} className="spin" style={{ animation: "spin-slow 1s linear infinite" }} />
                              Sending…
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              Send message
                              <ArrowRight size={16} />
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}