"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const links = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#proposito", label: "Propósito" },
  { href: "/#servicios", label: "Servicios" },
  { href: "/#sobre-mi", label: "Sobre mí" },
];

type NavbarProps = {
  /** Use light text for dark backgrounds (e.g. /programa-virtuosa). */
  dark?: boolean;
};

export default function Navbar({ dark = false }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Color tokens según el tema
  const logoText = dark ? "text-cream" : "text-navy";
  const linkText = dark
    ? "text-cream/80 hover:text-cream"
    : "text-navy/75 hover:text-navy";
  const ctaBtn = dark
    ? "text-navy bg-cream hover:bg-accent-light hover:text-white"
    : "text-white bg-navy hover:bg-accent";
  const burgerColor = dark ? "bg-cream" : "bg-navy";
  const mobileMenuBg = dark
    ? "bg-navy/95 border-t border-cream/10"
    : "bg-cream/95 border-t border-beige";
  const mobileLinkText = dark ? "text-cream/85" : "text-navy/80";
  const scrolledBg = dark ? "glass-dark shadow-sm shadow-black/10" : "glass shadow-sm shadow-navy/5";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? scrolledBg : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-16 md:h-[68px]">
        {/* Logo */}
        <Link
          href="/"
          className={`font-serif text-lg md:text-xl font-semibold ${logoText} tracking-wide`}
        >
          Catalina{" "}
          <span className="font-script text-shimmer text-xl md:text-2xl">
            Villafañe
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative text-xs font-normal ${linkText} uppercase tracking-widest transition-colors duration-300 after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1.5px] after:bg-accent after:transition-all after:duration-300 hover:after:w-full`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/#contacto"
              className={`text-xs font-medium uppercase tracking-widest px-5 py-2.5 transition-all duration-300 ${ctaBtn}`}
            >
              Contacto
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menú"
        >
          <span
            className={`block w-6 h-0.5 ${burgerColor} transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 ${burgerColor} transition-all duration-300 ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 ${burgerColor} transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden ${mobileMenuBg} backdrop-blur-md overflow-hidden transition-all duration-500 ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-4 px-6 pb-6 pt-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className={`text-sm ${mobileLinkText} uppercase tracking-widest`}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/#contacto"
              onClick={() => setOpen(false)}
              className={`inline-block text-sm uppercase tracking-widest px-6 py-3 ${ctaBtn}`}
            >
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
