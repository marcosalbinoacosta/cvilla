import Link from "next/link";
import Image from "next/image";
import { eq, sql as dsql } from "drizzle-orm";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { getCursoConModulos, getCursosResumen } from "@/sanity/queries";
import { getProgreso } from "@/lib/progreso";
import { isAdmin } from "@/lib/admin";
import { contarNoLeidosAdmin, getBandeja } from "@/lib/mensajes";
import ProgressBar from "./_components/ProgressBar";

export const dynamic = "force-dynamic";

type ModuloMin = { _id: string; slug: string };
type CursoConModulos = {
  titulo: string;
  subtitulo?: string;
  modulos?: ModuloMin[];
};
type CursoResumen = {
  _id: string;
  titulo: string;
  slug: string;
  nModulos: number;
  activo?: boolean;
};

export default async function AulaDashboard() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <section>
        <h1 className="font-serif text-3xl text-navy">
          Ingresá para ver el aula
        </h1>
      </section>
    );
  }

  const userId = session.user.id;
  const nombre = session.user.name ?? session.user.email;

  // ── Panel de administración (Catalina) ──────────────────────────────────
  // El admin no compra cursos: gestiona. Le mostramos su propio panel en vez
  // del estado de alumna.
  if (isAdmin(session.user.email)) {
    const [noLeidos, bandeja, cursos, alumnasRows] = await Promise.all([
      contarNoLeidosAdmin(),
      getBandeja(),
      getCursosResumen() as Promise<CursoResumen[]>,
      db
        .select({
          n: dsql<number>`count(distinct ${schema.accesosCurso.userId})`,
        })
        .from(schema.accesosCurso)
        .where(eq(schema.accesosCurso.activo, true)),
    ]);
    const alumnas = Number(alumnasRows[0]?.n ?? 0);

    return (
      <section>
        <p className="text-xs tracking-[0.18em] uppercase text-navy/70 mb-3">
          Panel de administración
        </p>
        <h1 className="font-serif text-3xl md:text-5xl text-navy font-light mb-2">
          Hola, {nombre}
        </h1>
        <p className="text-sm text-text/60 mb-10 max-w-lg">
          Desde acá seguís los comentarios de las alumnas y accedés a los
          cursos.
        </p>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white border border-beige rounded-xl p-5">
            <p className="font-serif text-3xl text-navy">{alumnas}</p>
            <p className="text-xs tracking-wider uppercase text-text/55 mt-1">
              Alumnas con acceso
            </p>
          </div>
          <div className="bg-white border border-beige rounded-xl p-5">
            <p className="font-serif text-3xl text-navy">{bandeja.length}</p>
            <p className="text-xs tracking-wider uppercase text-text/55 mt-1">
              Módulos con comentarios
            </p>
          </div>
          <div className="bg-white border border-beige rounded-xl p-5">
            <p className="font-serif text-3xl text-navy">
              {noLeidos}
              {noLeidos > 0 && <span className="text-accent"> ·</span>}
            </p>
            <p className="text-xs tracking-wider uppercase text-text/55 mt-1">
              Sin ver
            </p>
          </div>
        </div>

        {/* Bandeja de mensajes */}
        <Link
          href="/aula/mensajes"
          className="group flex items-center justify-between gap-4 bg-navy text-white rounded-xl p-6 md:p-7 mb-10 hover:bg-accent transition-colors"
        >
          <div>
            <p className="font-serif text-2xl">Comentarios</p>
            <p className="text-sm text-white/70 mt-1">
              {noLeidos > 0
                ? `${noLeidos} comentario${noLeidos === 1 ? "" : "s"} nuevo${noLeidos === 1 ? "" : "s"} para ver`
                : "No hay comentarios nuevos"}
            </p>
          </div>
          <span className="text-2xl transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>

        {/* Cursos */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl text-navy">Cursos</h2>
          <Link
            href="/studio"
            className="text-xs tracking-widest uppercase text-navy/70 hover:text-accent transition-colors"
          >
            Editar en el Studio →
          </Link>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cursos.map((c) => (
            <li
              key={c._id}
              className="bg-white border border-beige rounded-xl p-6 flex flex-col gap-4"
            >
              <div>
                <h3 className="font-serif text-xl text-navy leading-tight">
                  {c.titulo}
                  {c.activo === false && (
                    <span className="ml-2 text-[11px] tracking-wider uppercase text-text/45">
                      · inactivo
                    </span>
                  )}
                </h3>
                <p className="text-xs tracking-wider uppercase text-text/55 mt-1">
                  {c.nModulos} módulo{c.nModulos === 1 ? "" : "s"}
                </p>
              </div>
              <Link
                href={`/aula/${c.slug}`}
                className="mt-auto self-start text-xs tracking-widest uppercase text-navy/70 hover:text-accent transition-colors"
              >
                Ver en el aula →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const accesos = await db
    .select({ productoId: schema.accesosCurso.productoId })
    .from(schema.accesosCurso)
    .where(eq(schema.accesosCurso.userId, userId));

  if (accesos.length === 0) {
    return (
      <section className="max-w-lg">
        <p className="text-xs tracking-[0.18em] uppercase text-navy/70 mb-3">
          Hola {nombre}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-navy font-light mb-6">
          Todavía no tenés cursos
        </h1>
        <p className="text-sm text-text/75 mb-8">
          Una vez que te inscribas a Emprendé con Confianza, vas a ver acá todos
          los módulos y materiales.
        </p>
        <Link
          href="/programa-virtuosa"
          className="inline-block bg-navy text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-accent transition-colors"
        >
          Ver Emprendé con Confianza
        </Link>
      </section>
    );
  }

  const cursos = await Promise.all(
    accesos.map(async (a) => {
      const data = (await getCursoConModulos(
        a.productoId
      )) as CursoConModulos | null;
      const completados = await getProgreso(userId, a.productoId);
      const modulos = data?.modulos ?? [];
      const hechos = modulos.filter((m) => completados.has(m._id)).length;
      // Primer módulo sin completar → CTA "continuar".
      const siguiente =
        modulos.find((m) => !completados.has(m._id)) ?? modulos[0];
      return {
        slug: a.productoId,
        titulo: data?.titulo ?? a.productoId,
        subtitulo: data?.subtitulo,
        total: modulos.length,
        hechos,
        siguienteSlug: siguiente?.slug,
        empezado: hechos > 0,
      };
    })
  );

  return (
    <section className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:gap-8 lg:items-stretch">
      {/* Columna izquierda: saludo + tarjetas (fondo limpio, sin imagen
          detrás, para que el texto se lea nítido). */}
      <div>
        <p className="text-xs tracking-[0.18em] uppercase text-navy/70 mb-3">
          Aula virtual
        </p>
        <h1 className="font-serif text-3xl md:text-5xl text-navy font-light mb-2">
          Hola, {nombre}
        </h1>
        <p className="text-sm text-text/60 mb-10 max-w-lg">
          Retomá donde lo dejaste. Todo tu recorrido, en un solo lugar.
        </p>

        <ul className="grid grid-cols-1 gap-6">
        {cursos.map((c) => {
          const destino = c.siguienteSlug
            ? `/aula/${c.slug}/${c.siguienteSlug}`
            : `/aula/${c.slug}`;
          const cta = !c.empezado
            ? "Empezar el curso"
            : c.hechos >= c.total && c.total > 0
              ? "Repasar el curso"
              : "Continuar";
          return (
            <li
              key={c.slug}
              className="group relative bg-white border border-beige rounded-xl overflow-hidden hover:shadow-[0_20px_50px_-20px_rgba(27,46,107,0.25)] transition-shadow"
            >
              <div className="h-1.5 w-full bg-gradient-to-r from-navy via-accent to-accent-light" />
              <div className="p-7 md:p-8 flex flex-col gap-6 h-full">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl text-navy leading-tight">
                    {c.titulo}
                  </h2>
                  {c.subtitulo && (
                    <p className="text-sm text-text/70 mt-2">{c.subtitulo}</p>
                  )}
                </div>

                {c.total > 0 && (
                  <ProgressBar hechos={c.hechos} total={c.total} size="sm" />
                )}

                <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                  <Link
                    href={destino}
                    className="bg-navy text-white text-xs uppercase tracking-widest px-6 py-3.5 hover:bg-accent transition-colors"
                  >
                    {cta}
                  </Link>
                  <Link
                    href={`/aula/${c.slug}`}
                    className="text-xs tracking-widest uppercase text-navy/70 hover:text-accent transition-colors"
                  >
                    Ver módulos →
                  </Link>
                </div>
              </div>
            </li>
          );
        })}

        </ul>
      </div>

      {/* Columna derecha: imagen grande, fuera del área de texto para que las
          letras se lean limpias. Ocupa todo el alto de la sección (más grande
          que la tarjeta) y se funde con el fondo por el borde izquierdo. Solo
          en pantallas grandes. */}
      <div
        aria-hidden="true"
        className="hidden lg:block relative rounded-2xl overflow-hidden min-h-[22rem]"
      >
        <Image
          src="/images/charla.jpeg"
          alt=""
          fill
          sizes="(min-width: 1024px) 42vw, 0px"
          quality={75}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-navy/5" />
      </div>
    </section>
  );
}
