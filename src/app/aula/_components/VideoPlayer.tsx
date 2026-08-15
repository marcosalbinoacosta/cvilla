import { streamIframeSrc } from "@/lib/stream";

/**
 * Reproductor de video del aula. Prioriza Cloudflare Stream (iframe embebido);
 * cae a una URL directa (`videoUrl`) si no hay Stream configurado; y muestra un
 * placeholder si no hay nada.
 */
export default function VideoPlayer({
  videoId,
  fallbackUrl,
}: {
  videoId?: string | null;
  fallbackUrl?: string | null;
}) {
  const iframeSrc = streamIframeSrc(videoId);
  const directUrl = !iframeSrc ? (fallbackUrl ?? null) : null;

  if (iframeSrc) {
    return (
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-beige">
        <iframe
          src={iframeSrc}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
        />
      </div>
    );
  }

  if (directUrl) {
    return (
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-beige">
        <video
          src={directUrl}
          controls
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video bg-navy/5 border border-beige rounded-xl grid place-items-center text-center px-6">
      <div>
        <p className="text-xs tracking-[0.18em] uppercase text-navy/70 mb-2">
          Video no disponible
        </p>
        <p className="text-sm text-text/70 max-w-md">
          {videoId
            ? "Falta configurar CLOUDFLARE_STREAM_CUSTOMER_CODE en el servidor."
            : "Este video todavía no tiene un ID de Cloudflare Stream asignado."}
        </p>
      </div>
    </div>
  );
}
