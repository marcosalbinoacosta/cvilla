import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/admin";
import { userHasAccess } from "@/lib/access";
import { getCursoConModulos, getModuloBySlug } from "@/sanity/queries";
import { getProgreso } from "@/lib/progreso";
import { getThread } from "@/lib/mensajes";
import { streamIframeSrc } from "@/lib/stream";
import Comentarios from "../../_components/Comentarios";
import CompletarModuloBtn from "../../_components/CompletarModuloBtn";
import VideoPlayer from "../../_components/VideoPlayer";
import StreamPlayer from "../../_components/StreamPlayer";

export const dynamic = "force-dynamic";

type Material = { nombre: string; url?: string };
type Modulo = {
  _id: string;
  titulo: string;
  slug: string;
  orden: number;
  descripcion?: string;
  videoId?: string;
  videoUrl?: string;
  duracionMin?: number;
  materiales?: Material[];
};
type ModuloNav = { _id: string; titulo: string; slug: string; orden: number };
type CursoConModulos = { titulo: string; modulos?: ModuloNav[] };

export default async function Page({
  params,
}: {
  params: Promise<{ curso: string; modulo: string }>;
}) {
  const { curso: cursoSlug, modulo: moduloSlug } = await params;
  const session = await auth();
  if (!session?.user?.id)
    redirect(`/ingresar?callbackUrl=/aula/${cursoSlug}/${moduloSlug}`);

  const admin = isAdmin(session.user.email);
  const hasAccess = admin || (await userHasAccess(session.user.id, cursoSlug));
  if (!hasAccess) redirect(`/programa-virtuosa`);

  const [modulo, curso] = await Promise.all([
    getModuloBySlug(cursoSlug, moduloSlug) as Promise<Modulo | null>,
    getCursoConModulos(cursoSlug) as Promise<CursoConModulos | null>,
  ]);
  if (!modulo) notFound();

  const modulos = curso?.modulos ?? [];
  const idx = modulos.findIndex((m) => m.slug === moduloSlug);
  const anterior = idx > 0 ? modulos[idx - 1] : null;
  const siguiente =
    idx >= 0 && idx < modulos.length - 1 ? modulos[idx + 1] : null;

  const completados = admin
    ? new Set<string>()
    : await getProgreso(session.user.id, cursoSlug);
  const completo = completados.has(modulo._id);

  const thread = admin
    ? []
    : await getThread({ alumnoId: session.user.id, moduloId: modulo._id });

  const streamSrc = streamIframeSrc(modulo.videoId);

  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link
          href={`/aula/${cursoSlug}`}
          className="text-xs tracking-widest uppercase text-navy/70 hover:text-accent transition-colors"
        >
          ← Volver al curso
        </Link>
        {modulos.length > 0 && idx >= 0 && (
          <span className="text-[11px] tracking-wider uppercase text-text/45">
            Módulo {idx + 1} de {modulos.length}
          </span>
        )}
      </div>

      <p className="text-xs tracking-[0.18em] uppercase text-navy/60 mb-2">
        Módulo {modulo.orden}
        {completo && <span className="text-accent ml-2">· completado</span>}
      </p>
      <h1 className="font-serif text-3xl md:text-5xl text-navy font-light mb-7">
        {modulo.titulo}
      </h1>

      <div className="mb-8">
        {streamSrc && !admin ? (
          <StreamPlayer
            src={streamSrc}
            cursoId={cursoSlug}
            moduloId={modulo._id}
            moduloSlug={modulo.slug}
            yaCompletado={completo}
          />
        ) : (
          <VideoPlayer videoId={modulo.videoId} fallbackUrl={modulo.videoUrl} />
        )}
      </div>

      {!admin && (
        <div className="mb-10">
          <CompletarModuloBtn
            cursoId={cursoSlug}
            moduloId={modulo._id}
            moduloSlug={modulo.slug}
            completado={completo}
          />
        </div>
      )}

      {modulo.descripcion && (
        <p className="text-base text-text/80 leading-relaxed mb-10 max-w-2xl whitespace-pre-wrap">
          {modulo.descripcion}
        </p>
      )}

      {modulo.materiales && modulo.materiales.length > 0 && (
        <div className="mb-10 max-w-2xl">
          <h2 className="font-serif text-xl text-navy mb-4">Materiales</h2>
          <ul className="divide-y divide-beige border border-beige rounded-lg overflow-hidden bg-white">
            {modulo.materiales.map((m, i) => (
              <li key={i}>
                {m.url ? (
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm text-navy hover:bg-cream transition-colors"
                  >
                    <span>{m.nombre}</span>
                    <span className="text-xs tracking-wider uppercase text-accent">
                      Descargar ↓
                    </span>
                  </a>
                ) : (
                  <span className="block px-5 py-3.5 text-sm text-text/60">
                    {m.nombre}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navegación entre módulos */}
      {(anterior || siguiente) && (
        <nav className="flex items-stretch justify-between gap-4 border-t border-beige pt-6 mb-4">
          {anterior ? (
            <Link
              href={`/aula/${cursoSlug}/${anterior.slug}`}
              className="group flex-1 max-w-[48%] text-left"
            >
              <span className="text-[11px] tracking-widest uppercase text-text/45">
                ← Anterior
              </span>
              <span className="block font-serif text-navy group-hover:text-accent transition-colors truncate">
                {anterior.titulo}
              </span>
            </Link>
          ) : (
            <span className="flex-1 max-w-[48%]" />
          )}
          {siguiente && (
            <Link
              href={`/aula/${cursoSlug}/${siguiente.slug}`}
              className="group flex-1 max-w-[48%] text-right"
            >
              <span className="text-[11px] tracking-widest uppercase text-text/45">
                Siguiente →
              </span>
              <span className="block font-serif text-navy group-hover:text-accent transition-colors truncate">
                {siguiente.titulo}
              </span>
            </Link>
          )}
        </nav>
      )}

      {admin ? (
        <div className="mt-14 border-t border-beige pt-8">
          <p className="text-sm text-text/60">
            Estás viendo este módulo como <strong>administradora</strong>. Los
            comentarios de las alumnas se gestionan desde{" "}
            <Link
              href="/aula/mensajes"
              className="text-accent underline hover:no-underline"
            >
              la bandeja de mensajes
            </Link>
            .
          </p>
        </div>
      ) : (
        <Comentarios
          cursoId={cursoSlug}
          moduloId={modulo._id}
          moduloSlug={modulo.slug}
          moduloTitulo={modulo.titulo}
          mensajes={thread}
          currentUserId={session.user.id}
        />
      )}
    </section>
  );
}
