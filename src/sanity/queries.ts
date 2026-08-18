import { client } from "./client";

export async function getTestimonios() {
  return client.fetch(
    `*[_type == "testimonio"] | order(orden asc) {
      _id,
      nombre,
      rol,
      cita,
      "fotoUrl": foto.asset->url,
      orden
    }`
  );
}

export async function getCharlasImages() {
  return client.fetch(
    `*[_type == "charlaImagen"] | order(orden asc) {
      _id,
      titulo,
      "src": imagen.asset->url,
      ancho,
      alto,
      orden
    }`
  );
}

export async function getServicios() {
  return client.fetch(
    `*[_type == "servicio"] | order(orden asc) {
      _id,
      titulo,
      "slug": slug.current,
      etiqueta,
      subtituloIntro,
      subtituloDestacado,
      tagline,
      descripcion,
      descripcionLarga,
      "imagenUrl": imagen.asset->url,
      ctaTexto,
      ctaLink,
      incluye,
      orden
    }`
  );
}

export async function getServicioVirtuosa() {
  return client.fetch(
    `*[_type == "servicio" && slug.current == "virtuosa"][0] {
      titulo,
      etiqueta,
      subtituloIntro,
      subtituloDestacado,
      tagline,
      descripcion,
      descripcionLarga,
      "imagenUrl": imagen.asset->url,
      ctaTexto,
      ctaLink
    }`
  );
}

export async function getInfoContacto() {
  const data = await client.fetch<{
    email?: string;
    whatsapp?: string;
    ubicacion?: string;
    instagram?: string;
    linkedin?: string;
  } | null>(
    `*[_id == "infoContacto"][0] {
      email,
      whatsapp,
      ubicacion,
      instagram,
      linkedin
    }`
  );
  if (!data) return undefined;
  return {
    email: data.email?.trim() || undefined,
    whatsapp: data.whatsapp?.trim() || undefined,
    ubicacion: data.ubicacion?.trim() || undefined,
    instagram: data.instagram?.trim() || undefined,
    linkedin: data.linkedin?.trim() || undefined,
  };
}

export async function getSobreMi() {
  return client.fetch(
    `*[_id == "sobreMi"][0] {
      nombre,
      saludo,
      titulo,
      bio,
      cita,
      "fotoUrl": foto.asset->url,
      expertise,
      anosExperiencia
    }`
  );
}

export async function getFaqs(seccion: "individual" | "grupal" | "general") {
  return client.fetch(
    `*[_type == "faq" && seccion == $seccion] | order(orden asc) {
      _id,
      pregunta,
      respuesta
    }`,
    { seccion }
  );
}

export async function getCursoBySlug(slug: string) {
  return client.fetch(
    `*[_type == "curso" && slug.current == $slug][0] {
      titulo,
      subtitulo,
      descripcion,
      duracionTexto,
      precio,
      currency
    }`,
    { slug }
  );
}

export async function getCursosResumen() {
  return client.fetch(
    `*[_type == "curso"] | order(titulo asc) {
      _id,
      titulo,
      "slug": slug.current,
      "nModulos": count(modulos),
      activo
    }`
  );
}

export async function getCuponByCodigo(codigo: string) {
  // Sin CDN: un cupón desactivado/vencido debe dejar de funcionar al instante.
  return client.withConfig({ useCdn: false }).fetch(
    `*[_type == "cupon" && upper(codigo) == upper($codigo)][0] {
      "codigo": upper(codigo),
      tipo,
      valor,
      activo,
      vencimiento,
      "cursos": cursosAplicables[]->slug.current
    }`,
    { codigo }
  );
}

export async function getCursoConModulos(slug: string) {
  return client.fetch(
    `*[_type == "curso" && slug.current == $slug][0] {
      _id,
      titulo,
      subtitulo,
      "slug": slug.current,
      videoIntroId,
      introTitulo,
      introDescripcion,
      modulos[]-> {
        _id,
        titulo,
        "slug": slug.current,
        orden,
        descripcion,
        videoId,
        duracionMin
      }
    }`,
    { slug }
  );
}

export async function getModuloBySlug(cursoSlug: string, moduloSlug: string) {
  // Se busca el módulo por su slug, restringido a los referenciados por el
  // curso. La forma `curso.modulos[]->[filtro][0]` de GROQ devuelve null por
  // precedencia del `->`, así que se resuelve el módulo directamente.
  return client.fetch(
    `*[
      _type == "modulo" &&
      slug.current == $moduloSlug &&
      _id in *[_type == "curso" && slug.current == $cursoSlug][0].modulos[]._ref
    ][0] {
      _id,
      titulo,
      "slug": slug.current,
      orden,
      descripcion,
      videoId,
      videoUrl,
      duracionMin,
      materiales[] {
        nombre,
        "url": archivo.asset->url
      }
    }`,
    { cursoSlug, moduloSlug }
  );
}
