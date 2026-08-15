import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin";
import {
  getBandeja,
  getHilosAlumno,
  getThread,
  marcarHiloLeido,
} from "@/lib/mensajes";
import { tiempoRelativo } from "@/lib/fecha";
import ResponderForm from "../_components/ResponderForm";

export const dynamic = "force-dynamic";

export const metadata = { title: "Mensajes" };

export default async function BandejaPage({
  searchParams,
}: {
  searchParams: Promise<{ alumno?: string; modulo?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email)
    redirect("/ingresar?callbackUrl=/aula/mensajes");

  // Vista del alumno: sus propias conversaciones con Catalina.
  if (!isAdmin(session.user.email)) {
    return <BandejaAlumno alumnoId={session.user.id} />;
  }

  const { alumno, modulo } = await searchParams;

  // Al abrir un hilo, marcarlo como leído antes de calcular la bandeja.
  if (alumno && modulo) {
    await marcarHiloLeido({ alumnoId: alumno, moduloId: modulo, porAdmin: true });
  }

  const bandeja = await getBandeja();
  const seleccion =
    alumno && modulo
      ? bandeja.find((h) => h.alumnoId === alumno && h.moduloId === modulo)
      : undefined;
  const thread = seleccion
    ? await getThread({ alumnoId: seleccion.alumnoId, moduloId: seleccion.moduloId })
    : [];

  const nombreDe = (h: (typeof bandeja)[number]) =>
    h.alumnoNombre?.trim() || h.alumnoEmail;

  return (
    <section>
      <p className="text-xs tracking-[0.18em] uppercase text-navy/70 mb-3">
        Comentarios
      </p>
      <h1 className="font-serif text-3xl md:text-4xl text-navy font-light mb-8">
        Comentarios de tus alumnas
      </h1>

      {bandeja.length === 0 ? (
        <p className="text-sm text-text/60 border border-dashed border-beige rounded-lg px-6 py-10 text-center">
          Todavía no hay mensajes. Cuando una alumna comente en un módulo, la vas
          a ver acá.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_1fr] gap-6 items-start">
          {/* Lista de hilos */}
          <ul className="space-y-2 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-1">
            {bandeja.map((h) => {
              const activo =
                h.alumnoId === alumno && h.moduloId === modulo;
              return (
                <li key={`${h.alumnoId}-${h.moduloId}`}>
                  <Link
                    href={`/aula/mensajes?alumno=${encodeURIComponent(h.alumnoId)}&modulo=${encodeURIComponent(h.moduloId)}`}
                    className={`block rounded-lg border px-4 py-3.5 transition-colors ${
                      activo
                        ? "border-navy bg-white"
                        : "border-beige bg-white/60 hover:border-navy/30"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <span className="font-medium text-sm text-navy truncate">
                        {nombreDe(h)}
                      </span>
                      <span className="flex items-center gap-2 shrink-0">
                        {h.noLeidos > 0 && (
                          <span className="grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-medium">
                            {h.noLeidos}
                          </span>
                        )}
                        <span className="text-[11px] text-text/45">
                          {tiempoRelativo(h.ultimoAt)}
                        </span>
                      </span>
                    </div>
                    <p className="text-[11px] tracking-wider uppercase text-accent/80 truncate mb-1">
                      {h.moduloTitulo ?? "Módulo"}
                    </p>
                    <p className="text-xs text-text/60 truncate">
                      {h.ultimoDeAdmin && (
                        <span className="text-text/40">Vos: </span>
                      )}
                      {h.ultimoCuerpo}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Detalle del hilo */}
          <div className="bg-white border border-beige rounded-xl p-6 md:p-8 min-h-[50vh]">
            {!seleccion ? (
              <div className="h-full grid place-items-center text-center">
                <p className="text-sm text-text/50">
                  Elegí un módulo de la izquierda para leer los comentarios. Si
                  querés, podés responder.
                </p>
              </div>
            ) : (
              <>
                <div className="pb-5 mb-5 border-b border-beige">
                  <h2 className="font-serif text-2xl text-navy">
                    {nombreDe(seleccion)}
                  </h2>
                  <p className="text-xs tracking-wider uppercase text-accent/80 mt-1">
                    {seleccion.moduloTitulo ?? "Módulo"} ·{" "}
                    {seleccion.alumnoEmail}
                  </p>
                </div>

                <ul className="space-y-3 mb-2">
                  {thread.map((m) => {
                    const propio = m.deAdmin; // Catalina
                    return (
                      <li
                        key={m.id}
                        className={`rounded-lg px-4 py-3.5 border ${
                          propio
                            ? "border-accent/30 bg-accent/[0.04]"
                            : "border-beige bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            aria-hidden
                            className={`shrink-0 grid place-items-center w-7 h-7 rounded-full text-[11px] font-medium ${
                              propio
                                ? "bg-navy text-white"
                                : "bg-accent/15 text-accent"
                            }`}
                          >
                            {propio ? "C" : "A"}
                          </span>
                          <span className="text-xs font-medium text-navy">
                            {propio ? "Vos" : nombreDe(seleccion)}
                          </span>
                          {propio && (
                            <span className="text-[10px] tracking-[0.12em] uppercase text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                              Respuesta
                            </span>
                          )}
                          <span className="text-[11px] text-text/45 ml-auto">
                            {tiempoRelativo(m.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-text/85 leading-relaxed whitespace-pre-wrap break-words">
                          {m.cuerpo}
                        </p>
                      </li>
                    );
                  })}
                </ul>

                <ResponderForm
                  alumnoId={seleccion.alumnoId}
                  cursoId={seleccion.cursoId}
                  moduloId={seleccion.moduloId}
                  moduloSlug={seleccion.moduloSlug}
                  moduloTitulo={seleccion.moduloTitulo}
                  nombreAlumno={nombreDe(seleccion)}
                />
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/** Vista del alumno: lista de sus conversaciones con Catalina, por módulo. */
async function BandejaAlumno({ alumnoId }: { alumnoId: string }) {
  const hilos = await getHilosAlumno(alumnoId);

  return (
    <section>
      <p className="text-xs tracking-[0.18em] uppercase text-navy/70 mb-3">
        Mis mensajes
      </p>
      <h1 className="font-serif text-3xl md:text-4xl text-navy font-light mb-8">
        Tus conversaciones con Catalina
      </h1>

      {hilos.length === 0 ? (
        <p className="text-sm text-text/60 border border-dashed border-beige rounded-lg px-6 py-10 text-center max-w-xl">
          Todavía no escribiste ningún comentario. Entrá a un módulo y dejale tu
          consulta a Catalina en la sección de comentarios.
        </p>
      ) : (
        <ul className="space-y-3 max-w-2xl">
          {hilos.map((h) => {
            const destino = h.moduloSlug
              ? `/aula/${h.cursoId}/${h.moduloSlug}`
              : `/aula/${h.cursoId}`;
            return (
              <li key={h.moduloId}>
                <Link
                  href={destino}
                  className="block rounded-xl border border-beige bg-white px-5 py-4 hover:border-navy/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-[11px] tracking-wider uppercase text-accent/80 truncate">
                      {h.moduloTitulo ?? "Módulo"}
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      {h.noLeidos > 0 && (
                        <span className="grid place-items-center min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-white text-[10px] font-medium">
                          {h.noLeidos}
                        </span>
                      )}
                      <span className="text-[11px] text-text/45">
                        {tiempoRelativo(h.ultimoAt)}
                      </span>
                    </span>
                  </div>
                  <p className="text-sm text-text/70 truncate">
                    {h.ultimoDeAdmin ? (
                      <span className="text-accent font-medium">
                        Catalina:{" "}
                      </span>
                    ) : (
                      <span className="text-text/40">Vos: </span>
                    )}
                    {h.ultimoCuerpo}
                  </p>
                  {h.noLeidos > 0 && (
                    <p className="mt-2 text-[11px] tracking-wider uppercase text-accent">
                      {h.noLeidos === 1
                        ? "1 respuesta nueva"
                        : `${h.noLeidos} respuestas nuevas`}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
