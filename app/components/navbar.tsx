"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

const NAV_LINKS = [
  { label: "Work", href: "/" },
  { label: "Services", href: "/" },
  { label: "About", href: "/" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const underlineRef = useRef<HTMLSpanElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const ctaGlowTl = useRef<gsap.core.Timeline | null>(null);

  // ─── Navbar Entrance ─────────────────────────────
  useEffect(() => {
    if (!navbarRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(navbarRef.current, { y: -120, opacity: 0 });

      gsap.to(navbarRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "back.out(1.6)",
        delay: 0.2,
      });

      const children = [
        logoRef.current,
        ...(linksRef.current?.children ?? []),
        ctaRef.current,
      ].filter(Boolean);

      gsap.fromTo(
        children,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.07,
          delay: 0.6,
          ease: "power2.out",
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // ─── CTA Glow ─────────────────────────────
  useEffect(() => {
    if (!ctaRef.current) return;

    const tl = gsap.timeline({ paused: true, repeat: -1, yoyo: true });

    tl.to(ctaRef.current, {
      boxShadow: "0 0 25px 5px #FDE04788",
      duration: 0.8,
      ease: "sine.inOut",
    });

    ctaGlowTl.current = tl;

    return () => {
      tl.kill();
    };
  }, []);

  const handleCtaEnter = () => ctaGlowTl.current?.play();

  const router = useRouter();

  const handleCtaLeave = () => {
    ctaGlowTl.current?.pause();
    if (ctaRef.current) {
      gsap.to(ctaRef.current, {
        boxShadow: "0 0 0px transparent",
        duration: 0.3,
      });
    }
  };

  const handleCtaClick = () => router.push("/contact");

  // ─── Hover Underline ─────────────────────────────
  const handleLinkEnter = (i: number) => {
    const el = linkRefs.current[i];
    if (!el || !underlineRef.current || !linksRef.current) return;

    const parent = linksRef.current.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    gsap.to(underlineRef.current, {
      x: rect.left - parent.left,
      width: rect.width,
      opacity: 1,
      duration: 0.3,
      ease: "power3.out",
      font: "extrabold",
    });

    gsap.to(el, {
      y: -3,
      color: "#F472B6",
      duration: 0.2,
    });
  };

  const handleLinkLeave = (i: number) => {
    const el = linkRefs.current[i];
    if (!el) return;

    gsap.to(el, {
      y: 0,
      color: "white",
      duration: 0.25,
    });
  };

  const handleContainerLeave = () => {
    if (!underlineRef.current) return;

    gsap.to(underlineRef.current, {
      opacity: 0,
      duration: 0.2,
    });
  };

  // ─── Mobile Menu ─────────────────────────────
  const toggleMobileMenu = () => {
    if (!mobileMenuRef.current) return;

    if (!mobileOpen) {
      setMobileOpen(true);

      gsap.set(mobileMenuRef.current, { display: "flex" });

      gsap.fromTo(
        mobileMenuRef.current,
        { clipPath: "inset(0 0 100% 0)", opacity: 0 },
        {
          clipPath: "inset(0 0 0% 0)",
          opacity: 1,
          duration: 0.5,
          ease: "power4.out",
        }
      );

      gsap.fromTo(
        ".mobile-link",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          delay: 0.2,
          duration: 0.5,
        }
      );
    } else {
      gsap.to(mobileMenuRef.current, {
        clipPath: "inset(0 0 100% 0)",
        opacity: 0,
        duration: 0.4,
        ease: "power4.in",
        onComplete: () => {
          gsap.set(mobileMenuRef.current, { display: "none" });
          setMobileOpen(false);
        },
      });
    }
  };

  return (
    <>
      {/* NAVBAR */}
      <div
        ref={navbarRef}
        className="fixed top-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2"
      >
        <nav className="flex items-center justify-between px-5 py-3 rounded-2xl border bg-black/60 backdrop-blur-xl border-purple-500/20">

          {/* Logo */}
          <div ref={logoRef} className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              V
            </div>
            <span className="text-white font-bold">ORIVON</span>
          </div>

          {/* Desktop Links */}
          <div
            ref={linksRef}
            onMouseLeave={handleContainerLeave}
            className="hidden md:flex gap-8 relative"
          >
            <span
              ref={underlineRef}
              className="absolute bottom-0 h-0.5  bg-pink-400 opacity-0"
            />

            {NAV_LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                ref={(el) => {
                  linkRefs.current[i] = el;
                }}
                className="text-gray-400 text-sm"
                onMouseEnter={() => handleLinkEnter(i)}
                onMouseLeave={() => handleLinkLeave(i)}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <button
            ref={ctaRef}
            onMouseEnter={handleCtaEnter}
            onMouseLeave={handleCtaLeave}
            onClick={handleCtaClick}
            className="hidden md:block px-5! py-1! bg-[#0F1D14]! text-white rounded-xl"
          >
            Start Project
          </button>

          {/* Hamburger */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden bg-transparent! pr-3! text-white text-xl"
          >
            ☰
          </button>
        </nav>
      </div>

      {/* MOBILE MENU */}
    <div
  ref={mobileMenuRef}
  className="fixed inset-0 z-40  flex-col items-center justify-center gap-6 
             bg-linear-to-br from-[#0f1f14] via-[#132a13] to-black hidden"
>
  {NAV_LINKS.map((link) => (
    <a
      key={link.label}
      href={link.href}
      onClick={(e) => {
        const el = e.currentTarget;

        // click press animation
        gsap.fromTo(
          el,
          { scale: 1 },
          { scale: 0.88, duration: 0.12, yoyo: true, repeat: 1 }
        );

        toggleMobileMenu();
      }}
      onMouseEnter={(e) => {
        gsap.to(e.currentTarget, {
          scale: 1.12,
          color: "#a7c957",
          textShadow: "0 0 10px rgba(167,201,87,0.7)",
          duration: 0.15,
          ease: "power2.out",
        });
      }}
      onMouseLeave={(e) => {
        gsap.to(e.currentTarget, {
          scale: 1.2,
          color: "#ffffff",
          textShadow: "0 0 0px rgba(0,0,0,0)",
          duration: 0.15,
          font: "extrabold",
        });
      }}
      className="mobile-link text-white text-3xl relative transition-all duration-300"
    >
      {link.label}

      {/* matcha underline */}
      <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#a7c957] transition-all duration-300 group-hover:w-full"></span>
    </a>
  ))}
</div>
    </>
  );
}