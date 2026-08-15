"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Script from "next/script";
import { marcarModuloCompletadoAuto } from "../actions";

type StreamPlayerApi = {
  addEventListener: (type: string, listener: () => void) => void;
  removeEventListener: (type: string, listener: () => void) => void;
  currentTime: number;
  duration: number;
};

declare global {
  interface Window {
    Stream?: (iframe: HTMLIFrameElement) => StreamPlayerApi;
  }
}

// Se marca completado al llegar a este % de reproducción (o al terminar).
const UMBRAL = 0.95;

export default function StreamPlayer({
  src,
  cursoId,
  moduloId,
  moduloSlug,
  yaCompletado,
}: {
  src: string;
  cursoId: string;
  moduloId: string;
  moduloSlug: string;
  yaCompletado: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const marcadoRef = useRef(yaCompletado);
  const [sdkReady, setSdkReady] = useState(false);
  const [recienMarcado, setRecienMarcado] = useState(false);
  const [, startTransition] = useTransition();

  // `onReady` de next/script dispara también cuando el SDK ya estaba cargado
  // (navegación SPA entre módulos), así que no hace falta chequearlo a mano.
  useEffect(() => {
    if (!sdkReady) return;
    const iframe = iframeRef.current;
    const StreamFn = typeof window !== "undefined" ? window.Stream : undefined;
    if (!iframe || !StreamFn) return;

    const player = StreamFn(iframe);

    const completar = () => {
      if (marcadoRef.current) return;
      marcadoRef.current = true;
      setRecienMarcado(true);
      const fd = new FormData();
      fd.set("cursoId", cursoId);
      fd.set("moduloId", moduloId);
      fd.set("moduloSlug", moduloSlug);
      startTransition(() => {
        void marcarModuloCompletadoAuto(fd);
      });
    };

    const onTime = () => {
      if (marcadoRef.current) return;
      const d = player.duration || 0;
      const t = player.currentTime || 0;
      if (d > 0 && t / d >= UMBRAL) completar();
    };

    player.addEventListener("timeupdate", onTime);
    player.addEventListener("ended", completar);
    return () => {
      try {
        player.removeEventListener("timeupdate", onTime);
        player.removeEventListener("ended", completar);
      } catch {
        /* el iframe pudo desmontarse */
      }
    };
  }, [sdkReady, cursoId, moduloId, moduloSlug, startTransition]);

  return (
    <>
      <Script
        src="https://embed.cloudflarestream.com/embed/sdk.latest.js"
        strategy="afterInteractive"
        onReady={() => setSdkReady(true)}
        onLoad={() => setSdkReady(true)}
      />
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-beige">
        <iframe
          ref={iframeRef}
          src={src}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        />
      </div>
      {recienMarcado && !yaCompletado && (
        <p className="mt-3 inline-flex items-center gap-2 text-xs tracking-wider uppercase text-accent">
          <span aria-hidden>✓</span> Módulo marcado como completado
        </p>
      )}
    </>
  );
}
