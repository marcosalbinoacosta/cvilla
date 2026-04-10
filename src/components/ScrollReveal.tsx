"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type AnimationType =
  | "fade-up"
  | "slide-left"
  | "slide-right"
  | "scale-in"
  | "blur-in"
  | "clip-up"
  | "rotate-in"
  | "stagger"
  | "mask-reveal";

const hiddenStyles: Record<string, string> = {
  "fade-up": "opacity-0 translate-y-10",
  "slide-left": "opacity-0 translate-x-20",
  "slide-right": "opacity-0 -translate-x-20",
  "scale-in": "opacity-0 scale-[0.85]",
  "blur-in": "opacity-0 blur-sm translate-y-2",
  "clip-up": "opacity-0 translate-y-10",
  "rotate-in": "opacity-0 rotate-[-3deg] translate-y-8",
};

const visibleStyles: Record<string, string> = {
  "fade-up": "opacity-100 translate-y-0",
  "slide-left": "opacity-100 translate-x-0",
  "slide-right": "opacity-100 translate-x-0",
  "scale-in": "opacity-100 scale-100",
  "blur-in": "opacity-100 blur-0 translate-y-0",
  "clip-up": "opacity-100 translate-y-0",
  "rotate-in": "opacity-100 rotate-0 translate-y-0",
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  animation = "fade-up",
  threshold = 0.15,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  animation?: AnimationType;
  threshold?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setVisible(true), delay);
          } else {
            setVisible(true);
          }
          if (once) observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold, once]);

  if (animation === "stagger") {
    return (
      <div ref={ref} className={`stagger-children ${visible ? "revealed" : ""} ${className}`}>
        {children}
      </div>
    );
  }

  if (animation === "mask-reveal") {
    return (
      <div ref={ref} className={`mask-reveal ${visible ? "revealed" : ""} ${className}`}>
        {children}
      </div>
    );
  }

  const hidden = hiddenStyles[animation] || hiddenStyles["fade-up"];
  const shown = visibleStyles[animation] || visibleStyles["fade-up"];

  return (
    <div
      ref={ref}
      className={`transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible ? shown : hidden
      } ${className}`}
    >
      {children}
    </div>
  );
}
