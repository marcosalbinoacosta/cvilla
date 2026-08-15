import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { userHasAccess } from "@/lib/access";
import { getCursoConModulos } from "@/sanity/queries";
import { getProgreso } from "@/lib/progreso";
import ProgressBar from "../_components/ProgressBar";
import VideoPlayer from "../_components/VideoPlayer";

export const dynamic = "force-dynamic";

type Modulo = {
  _id: string;
  titulo: string;
  slug: string;
  orden: number;
  descripcion?: string;
  videoId?: string;
  duracionMin?: number;
};
type CursoConModulos = {
  _id: string;
  titulo: string;
  slug: string;
  videoIntroId?: string;
  introTitulo?: string;
  introDescripcion?: string;
  modulos?: Modulo[];
};

export default async function Page({
  params,
}: {
  params: Promise<{ curso: string }>;
}) {
  const { curso: cursoSlug } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/ingresar?callbackUrl=/aula/${cursoSlug}`);

  const hasAccess = await userHasAccess(session.user.id, cursoSlug);
  if (!hasAccess) redirect(`/programa-virtuosa`);

  const curso = (await getCursoConModulos(cursoSlug)) as CursoConModulos | null;
  if (!curso) notFound();

  const completados = await getProgreso(session.user.id, cursoSlug);
  const modulos = curso.modulos ?? [];
  const hechos = modulos.filter((m) => completados.has(m._id)).length;

  return (
    <section>
      <Link
        href="/aula"
        className="text-xs tracking-widest uppercase text-navy/70 hover:text-accent transition-colors"
      >
        ← Mis cursos
      </Link>

      <header className="mt-5 mb-10 pb-8 border-b border-beige">
        <h1 className="font-serif text-3xl md:text-5xl text-navy font-light mb-6">
          {curso.titulo}
        </h1>
        {modulos.length > 0 && (
          <div className="max-w-md">
            <ProgressBar hechos={hechos} total={modulos.length} />
          </div>
        )}
      </header>

      {curso.videoIntroId && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] tracking-[0.2em] uppercase text-accent bg-accent/10 px-2.5 py-1 rounded-full">
              Empezá por acá
            </span>
            <h2 className="font-serif text-2xl text-navy">
              {curso.introTitulo ?? "Bienvenida"}
            </h2>
          </div>
          <VideoPlayer videoId={curso.videoIntroId} />
          {curso.introDescripcion && (
            <p className="text-base text-text/80 leading-relaxed mt-5 max-w-2xl whitespace-pre-wrap">
              {curso.introDescripcion}
            </p>
          )}
        </div>
      )}

      {modulos.length > 0 && (
        <h2 className="font-serif text-2xl text-navy mb-5">Módulos</h2>
      )}

      {modulos.length > 0 ? (
        <ol className="space-y-4">
          {modulos.map((m) => {
            const completo = completados.has(m._id);
            return (
              <li
                key={m._id}
                className="group bg-white border border-beige rounded-xl p-5 md:p-6 hover:border-navy/25 transition-colors"
              >
                <div className="flex items-start gap-4 md:gap-6">
                  <span
                    aria-hidden
                    className={`shrink-0 grid place-items-center w-10 h-10 rounded-full border text-sm font-serif transition-colors ${
                      completo
                        ? "bg-navy text-white border-navy"
                        : "border-beige text-navy/70 group-hover:border-navy/40"
                    }`}
                  >
                    {completo ? (
                      <svg
                        viewBox="0 0 14 14"
                        className="w-4 h-4"
                        fill="none"
                      >
                        <path
                          d="M3 7.4 5.8 10.2 11 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      m.orden
                    )}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] tracking-[0.18em] uppercase text-navy/55 mb-1">
                      Módulo {m.orden}
                      {completo && (
                        <span className="text-accent ml-2">· completado</span>
                      )}
                    </p>
                    <h2 className="font-serif text-lg md:text-xl text-navy">
                      {m.titulo}
                    </h2>
                    {m.descripcion && (
                      <p className="text-sm text-text/70 mt-2 line-clamp-2">
                        {m.descripcion}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    {m.duracionMin && (
                      <span className="text-[11px] tracking-wider uppercase text-text/50">
                        {m.duracionMin} min
                      </span>
                    )}
                    <Link
                      href={`/aula/${curso.slug}/${m.slug}`}
                      className={`text-xs uppercase tracking-widest px-5 py-2.5 transition-colors ${
                        completo
                          ? "border border-navy/25 text-navy hover:border-navy"
                          : "bg-navy text-white hover:bg-accent"
                      }`}
                    >
                      {completo ? "Repasar" : "Ver módulo"}
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="text-sm text-text/70">
          Los módulos se están cargando. Volvé en unos minutos.
        </p>
      )}
    </section>
  );
}
