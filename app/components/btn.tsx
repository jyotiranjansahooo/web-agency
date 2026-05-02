"use client";

import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href?: string;
  children?: ReactNode;
  className?: string;
};

export default function AnimatedBackButton({
  href = "/",
  children = "Go Back",
  className = "",
}: Props) {
  return (
    <Link
      href={href}
      className={`
        relative inline-flex items-center justify-center
        w-40 sm:w-48 h-12 sm:h-14
        bg-white text-black
        rounded-2xl
        font-semibold text-sm sm:text-base
        overflow-hidden
        group
        ${className}
      `}
    >
      {/* Sliding green box */}
      <span
        className="
          absolute left-1 top-1
          h-10 sm:h-12
          w-1/4
          
          bg-green-400
          rounded-xl
          flex items-center justify-center
          z-10
          transition-all duration-500
          group-hover:w-[calc(100%-8px)]
        "
      >
        {/* Arrow Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1024 1024"
          className="w-5 h-5 "
        >
          <path
            d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
            fill="#000"
          />
          <path
            d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
            fill="#000"
          />
        </svg>
      </span>

      <span className="translate-x-2 relative z-0">
        {children}
      </span>
    </Link>
  );
}