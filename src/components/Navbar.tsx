"use client";

import { useState } from "react";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#proposito", label: "Propósito" },
  { href: "#servicios", label: "Servicios" },
  { href: "#sobre-mi", label: "Sobre mí" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-16 md:h-[68px]">
        {/* Logo */}
        <a href="#inicio" className="font-serif text-lg md:text-xl font-semibold text-navy tracking-wide">
          Catalina{" "}
          <span className="font-script text-gold text-xl md:text-2xl">
            Villafañe
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-xs font-normal text-navy/75 uppercase tracking-widest hover:text-navy transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contacto"
              className="bg-navy text-white text-xs font-medium uppercase tracking-widest px-5 py-2.5 hover:bg-navy/90 transition-colors"
            >
              Hablemos
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menú"
        >
          <span
            className={`block w-6 h-0.5 bg-navy transition-transform ${open ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-navy transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-6 h-0.5 bg-navy transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-beige px-6 pb-6 pt-4">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-navy/80 uppercase tracking-widest"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="inline-block bg-navy text-white text-sm font-medium uppercase tracking-widest px-6 py-3 mt-2"
              >
                Hablemos
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
