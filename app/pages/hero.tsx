"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  MousePointer2,
  Cpu,
} from "lucide-react";

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{
        background:
          "linear-gradient(90deg,#243d21 25%,#3a5535 50%,#243d21 75%)",
        backgroundSize: "200% 100%",
        animation: "skeletonPulse 1.6s ease-in-out infinite",
      }}
    />
  );
}

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl px-6">
      <div className="flex items-center gap-3">
        <div
          className="w-7 h-7 rounded-full border-2"
          style={{
            borderColor: "rgba(110,170,90,0.5)",
            animation: "spinSlow 3s linear infinite",
          }}
        />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="flex flex-col items-center gap-4 w-full">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-14 sm:h-20 w-full max-w-sm" />
        <Skeleton className="h-14 sm:h-20 w-full max-w-xs" />
        <Skeleton className="h-14 sm:h-20 w-full max-w-md" />
        <Skeleton className="h-4 w-72 mt-2" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-12 w-36 rounded-full" />
        <Skeleton className="h-12 w-28 rounded-full" />
      </div>
      <div className="flex flex-col items-center gap-3 mt-2">
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{ background: "var(--m400)" }}
              animate={{ scaleY: [1, 3.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.9, delay: i * 0.13, repeat: Infinity }}
            />
          ))}
        </div>
        <span
          className="font-mono text-xs tracking-widest"
          style={{ color: "var(--m400)" }}
        >
          LOADING EXPERIENCE
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   BUBBLE CANVAS
───────────────────────────────────────── */
function BubbleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const count = window.innerWidth < 768 ? 20 : 44;
    bubblesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight,
      size: Math.random() * 70 + 8,
      speed: Math.random() * 0.7 + 0.18,
      opacity: Math.random() * 0.16 + 0.03,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bubblesRef.current.forEach((b) => {
        b.y -= b.speed;
        b.x += Math.sin(b.y * 0.007) * 0.55;
        if (b.y + b.size < 0) {
          b.y = canvas.height + b.size;
          b.x = Math.random() * canvas.width;
        }
        const grad = ctx.createRadialGradient(
          b.x - b.size * 0.28, b.y - b.size * 0.28, b.size * 0.08,
          b.x, b.y, b.size
        );
        grad.addColorStop(0, `rgba(190,230,160,${b.opacity * 1.5})`);
        grad.addColorStop(0.5, `rgba(100,165,80,${b.opacity})`);
        grad.addColorStop(1, `rgba(50,90,40,${b.opacity * 0.25})`);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = `rgba(210,250,190,${b.opacity * 0.55})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(
          b.x - b.size * 0.32, b.y - b.size * 0.32,
          b.size * 0.18, 0, Math.PI * 2
        );
        ctx.fillStyle = `rgba(255,255,255,${b.opacity * 1.1})`;
        ctx.fill();
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}

/* ─────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────── */
function CustomCursor() {
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);
  const sx = useSpring(cx, { stiffness: 520, damping: 30 });
  const sy = useSpring(cy, { stiffness: 520, damping: 30 });
  const tx = useSpring(cx, { stiffness: 110, damping: 22 });
  const ty = useSpring(cy, { stiffness: 110, damping: 22 });
  const [hot, setHot] = useState(false);

  useEffect(() => {
    const mv = (e: MouseEvent) => { cx.set(e.clientX); cy.set(e.clientY); };
    const mo = (e: MouseEvent) => {
      setHot(!!(e.target as HTMLElement).closest("a,button,[data-hover]"));
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseover", mo);
    return () => {
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseover", mo);
    };
  }, [cx, cy]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hot ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: "var(--m200)" }} />
      </motion.div>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-50"
        style={{ x: tx, y: ty, translateX: "-50%", translateY: "-50%" }}
        animate={{
          scale: hot ? 2.4 : 1,
          borderColor: hot ? "rgba(196,220,140,0.9)" : "rgba(140,190,100,0.45)",
        }}
        transition={{ duration: 0.18 }}
      >
        <div
          className="w-8 h-8 rounded-full border"
          style={{ borderColor: "rgba(140,190,100,0.45)" }}
        />
      </motion.div>
    </>
  );
}

/* ─────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────── */
function MagBtn({
  children,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 380, damping: 22 });
  const sy = useSpring(y, { stiffness: 380, damping: 22 });

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy, ...style }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.38);
        y.set((e.clientY - r.top - r.height / 2) * 0.38);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
      data-hover
    >
      {children}
    </motion.button>
  );
}

/* ─────────────────────────────────────────
   SPLIT-CHAR TEXT
───────────────────────────────────────── */
function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.038,
  started = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  started?: boolean;
}) {
  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
          initial={{ y: "110%", opacity: 0, rotateX: -80 }}
          animate={started ? { y: 0, opacity: 1, rotateX: 0 } : {}}
          transition={{
            duration: 0.7,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────
   NOISE GRAIN
───────────────────────────────────────── */
function Grain() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-10 opacity-[0.032]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "140px",
      }}
    />
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function HeroHeader() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const t1 = setTimeout(() => setLoading(false), 2000);
    const t2 = setTimeout(() => setReady(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const stats = [
    { val: "140+", label: "Projects" },
    { val: "98%",  label: "Retention" },
    { val: "12×",  label: "Avg ROI" },
    { val: "4.9★", label: "Rating" },
  ];

  const techs = ["Next.js", "TypeScript", "Figma", "GSAP", "Framer", "Webflow"];

  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Syne:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          color: var(--m100);
          font-family: 'Syne', system-ui, sans-serif;
          overflow-x: hidden;
          min-height: 100vh;
        }

        :root {
          --bg:   #141d12;
          --m900: #161f14;
          --m800: #1f3019;
          --m700: #2a4022;
          --m600: #36562c;
          --m500: #4a7539;
          --m400: #6a9e57;
          --m300: #91c27a;
          --m200: #bcdda8;
          --m100: #e0f0d4;
          --m50:  #f2faea;
          --gold: #c8a96e;
          --cream: #f4efe4;
        }

        * { cursor: none !important; }
        @media (pointer: coarse) { * { cursor: auto !important; } }

        ::-webkit-scrollbar          { width: 3px; }
        ::-webkit-scrollbar-track    { background: var(--m900); }
        ::-webkit-scrollbar-thumb    { background: var(--m600); border-radius: 99px; }

        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-mono    { font-family: 'JetBrains Mono', monospace; }

        .gradient-text {
          background: linear-gradient(130deg, var(--m200) 0%, var(--m100) 45%, var(--gold) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, var(--m300) 0%, var(--cream) 35%, var(--gold) 55%, var(--m300) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        @keyframes skeletonPulse {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes spinSlow  { to { transform: rotate(360deg); } }
        @keyframes floatY    { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 18px rgba(106,158,87,0.28); }
          50%      { box-shadow: 0 0 52px rgba(106,158,87,0.72), 0 0 90px rgba(106,158,87,0.28); }
        }
        @keyframes badgePing {
          75%, 100% { transform: scale(1.9); opacity: 0; }
        }

        .float      { animation: floatY   5s ease-in-out infinite; }
        .spin       { animation: spinSlow 22s linear infinite; }
        .glow       { animation: glowPulse 3.2s ease-in-out infinite; }
        .badge-ping { animation: badgePing 1.8s cubic-bezier(0,0,0.2,1) infinite; }
      `}</style>

      {/* ── SKELETON ── */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-200 flex items-center justify-center"
            style={{ background: "var(--bg)" }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CURSOR ── */}
      <div className="hidden md:block">
        <CustomCursor />
      </div>

      {/* ── SCROLL PROGRESS BAR ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 z-50 origin-left"
        style={{
          scaleX: scrollYProgress,
          background: "linear-gradient(90deg, var(--m400), var(--gold))",
        }}
      />

      {/* ══════════════════════════════
          HERO HEADER
      ══════════════════════════════ */}
      <header className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center">

        {/* Layered radial bg */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse 130% 70% at 50% -5%,  rgba(74,117,57,0.26) 0%, transparent 55%),
              radial-gradient(ellipse  55% 45% at 92%  85%,  rgba(42,64,34,0.38) 0%, transparent 60%),
              radial-gradient(ellipse  45% 35% at  5%  75%,  rgba(54,86,44,0.22) 0%, transparent 60%),
              var(--bg)
            `,
          }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0 z-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(145,194,122,0.55) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <BubbleCanvas />
        <Grain />

        {/* Decorative SVG ring — top-left */}
        <div
          className="spin absolute top-16 left-8 md:left-20 opacity-[0.12] pointer-events-none hidden sm:block z-10"
          style={{ width: 110, height: 110 }}
        >
          <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="55" cy="55" r="52" stroke="rgba(145,194,122,0.8)" strokeWidth="1" strokeDasharray="6 5" />
            <circle cx="55" cy="55" r="36" stroke="rgba(200,169,110,0.5)" strokeWidth="0.7" />
          </svg>
        </div>

        {/* Decorative SVG ring — bottom-right */}
        <div
          className="absolute bottom-24 right-8 md:right-20 opacity-[0.10] pointer-events-none hidden sm:block z-10"
          style={{ width: 80, height: 80, animation: "spinSlow 30s linear infinite reverse" }}
        >
          <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="37" stroke="rgba(145,194,122,0.7)" strokeWidth="0.8" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Floating decorative icons */}
        <div
          className="float absolute top-1/3 right-8 md:right-24 opacity-[0.18] pointer-events-none hidden md:block z-10"
          style={{ animationDelay: "0.6s" }}
        >
          <Cpu size={52} style={{ color: "var(--m300)" }} />
        </div>
        <div className="float absolute bottom-1/3 left-8 md:left-24 opacity-[0.13] pointer-events-none hidden md:block z-10">
          <MousePointer2 size={38} style={{ color: "var(--gold)" }} />
        </div>

        {/* ── MAIN CONTENT ── */}
        <motion.div
          className="relative z-20 flex flex-col items-center text-center px-5 sm:px-8 max-w-5xl mx-auto w-full"
          style={{ scale: heroScale, opacity: heroOpacity }}
        >

          {/* Badge */}
          <motion.div
            className="relative inline-flex items-center gap-2.5 px-4! py-1! mt-10! rounded-full border"
            style={{
              background: "rgba(36,64,28,0.55)",
              backdropFilter: "blur(14px)",
              borderColor: "rgba(106,158,87,0.3)",
            }}
            initial={{ opacity: 0, y: 16, scale: 0.88 }}
            animate={ready ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className=" badge-ping absolute -inset-0.5 rounded-full border pointer-events-none"
              style={{ borderColor: "rgba(106,158,87,0.4)" }}
            />
            <Sparkles size={16} style={{ color: "var(--gold)" }} />
            <span
              className=" bx-2!  font-mono text-[11px] tracking-[0.22em] uppercase "
              style={{ color: "var(--m300)" }}
            >
              Digital Craft Studio
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full glow"
              style={{ background: "var(--m400)" }}
            />
          </motion.div>

          {/* Headline */}
          <h1
            className="font-display leading-[0.94] mb-7 select-none"
            style={{ fontSize: "clamp(3.2rem, 10.5vw, 8.5rem)", fontWeight: 700 }}
          >
            <span className="block overflow-hidden pb-2">
              <SplitText text="We craft" className="gradient-text" delay={0} stagger={0.042} started={ready} />
            </span>
            <span className="block overflow-hidden pb-2" style={{ fontStyle: "italic" }}>
              <SplitText text="digital" className="text-(--cream)" delay={0.18} stagger={0.042} started={ready} />
            </span>
            <span className="block overflow-hidden pb-2">
              <SplitText text="experiences." className="shimmer-text" delay={0.36} stagger={0.034} started={ready} />
            </span>
          </h1>

          {/* Sub-heading */}
          <motion.p
            className="max-w-lg mt-4! text-base sm:text-lg leading-relaxed mb-10"
            style={{ color: "var(--m300)" }}
            initial={{ opacity: 0, y: 22 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.75, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Transforming bold ideas into stunning websites, memorable brands,
            and scalable digital products —{" "}
            <span style={{ color: "var(--m200)" }}>pixel by pixel.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap items-center justify-center mt-2! mb-4! gap-4"
            initial={{ opacity: 0, y: 22 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <MagBtn
              className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-medium overflow-hidden glow"
              style={{
                background: "linear-gradient(135deg, var(--m500), var(--m600))",
                color: "var(--m50)",
              }}
            >
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{ background: "linear-gradient(135deg, var(--m400), var(--m500))" }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.28 }}
              />
              <span className="relative px-1.5! py-1! z-10 flex items-center gap-2.5">
                Start a Project
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                >
                  <ArrowRight size={15} />
                </motion.span>
              </span>
            </MagBtn>

            <MagBtn
              className="flex items-center gap-2  px-2! py-1.5! rounded-full text-sm font-medium border transition-all duration-300"
              style={{
                borderColor: "rgba(106,158,87,0.35)",
                color: "var(--m200)",
                background: "rgba(36,64,28,0.3)",
                backdropFilter: "blur(12px)",
              }}
            >
              <motion.span whileHover={{ rotate: 45 }} transition={{ duration: 0.25 }}>
                <ArrowUpRight size={15} />
              </motion.span >
              View Work
            </MagBtn>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-14 pt-10 border-t w-full"
            style={{ borderColor: "rgba(106,158,87,0.14)" }}
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                className="flex flex-col items-center gap-1 mt-4!"
                initial={{ opacity: 0, y: 14 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.15 + i * 0.08, duration: 0.5 }}
                whileHover={{ y: -3 }}
                data-hover
              >
                <span className="font-display text-2xl sm:text-3xl font-bold gradient-text">
                  {s.val}
                </span>
                <span
                  className="font-mono text-[10px] tracking-widest uppercase"
                  style={{ color: "var(--m500)" }}
                >
                  {s.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Tech pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-2  mt-2! mb-2!"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 1.35, duration: 0.7 }}
          >
            {techs.map((t, i) => (
              <motion.span
                key={t}
                className=" py-1.5! px-4! rounded-full text-[11px] font-mono border"
                style={{
                  borderColor: "rgba(106,158,87,0.22)",
                  color: "var(--m400)",
                  background: "rgba(36,64,28,0.35)",
                  backdropFilter: "blur(8px)",
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={ready ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1.4 + i * 0.07, duration: 0.4 }}
                whileHover={{
                  scale: 1.08,
                  borderColor: "rgba(145,194,122,0.5)",
                  color: "var(--m200)",
                }}
                data-hover
              >
                {t}
              </motion.span>
            ))}
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="flex flex-col items-center gap-2 "
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 0.5 } : {}}
            transition={{ delay: 1.6, duration: 1 }}
          >
            <span
              className="font-mono  text-[10px] tracking-[0.25em]  uppercase"
              style={{ color: "var(--m400)" }}
            >
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 9, 0] }}
              transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={15} style={{ color: "var(--m400)" }} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-28 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--bg))" }}
        />
      </header>
    </>
  );
}