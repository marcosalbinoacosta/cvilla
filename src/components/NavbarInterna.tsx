"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function NavbarInterna() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-sm shadow-navy/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-16 md:h-[68px]">
        <Link
          href="/"
          className="font-serif text-lg md:text-xl font-semibold text-navy tracking-wide"
        >
          Catalina{" "}
          <span className="font-script text-shimmer text-xl md:text-2xl">
            Villafañe
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="hidden md:inline text-xs font-normal text-navy/75 uppercase tracking-widest hover:text-navy transition-colors duration-300"
          >
            &larr; Volver al inicio
          </Link>
          <a
            href="https://wa.me/5491100000000"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-white uppercase tracking-widest bg-navy px-5 py-2.5 hover:bg-navy/90 transition-all duration-300"
          >
            Consultá ahora
          </a>
        </div>
      </div>
    </nav>
  );
}
