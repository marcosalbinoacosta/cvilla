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
      subtitulo,
      descripcion,
      descripcionLarga,
      "imagenUrl": imagen.asset->url,
      incluye,
      orden
    }`
  );
}

export async function getInfoContacto() {
  return client.fetch(
    `*[_id == "infoContacto"][0] {
      email,
      whatsapp,
      ubicacion,
      instagram,
      linkedin
    }`
  );
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
