/** Barra de progreso presentacional (server-safe). */
export default function ProgressBar({
  hechos,
  total,
  size = "md",
}: {
  hechos: number;
  total: number;
  size?: "sm" | "md";
}) {
  const pct = total > 0 ? Math.round((hechos / total) * 100) : 0;
  const completo = total > 0 && hechos >= total;
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs tracking-[0.16em] uppercase text-navy/60">
          {completo ? "Curso completado" : "Tu progreso"}
        </span>
        <span className="text-xs text-text/60">
          {hechos} de {total} módulos
        </span>
      </div>
      <div
        className={`w-full ${size === "sm" ? "h-1.5" : "h-2"} bg-beige rounded-full overflow-hidden`}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
