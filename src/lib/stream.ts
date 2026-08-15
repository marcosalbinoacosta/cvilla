/**
 * Construye la URL del reproductor embebido de Cloudflare Stream.
 * Devuelve null si falta el UID del video o el customer code del servidor.
 */
export function streamIframeSrc(videoId?: string | null): string | null {
  const code = process.env.CLOUDFLARE_STREAM_CUSTOMER_CODE;
  if (!videoId || !code) return null;
  return `https://customer-${code}.cloudflarestream.com/${videoId}/iframe`;
}
