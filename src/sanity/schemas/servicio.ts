import { defineType, defineField } from "sanity";

export default defineType({
  name: "servicio",
  title: "Servicios",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titulo" },
    }),
    defineField({
      name: "subtitulo",
      title: "Subtítulo / Frase destacada",
      type: "string",
    }),
    defineField({
      name: "descripcion",
      title: "Descripción corta",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "descripcionLarga",
      title: "Descripción completa",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "imagen",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "etiqueta",
      title: "Etiqueta",
      type: "string",
      description: "Ej: '01 · Programa', '1 a 1', 'Grupal'",
    }),
    defineField({
      name: "incluye",
      title: "Qué incluye",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "orden",
      title: "Orden",
      type: "number",
    }),
  ],
  orderings: [
    { title: "Orden", name: "orden", by: [{ field: "orden", direction: "asc" }] },
  ],
  preview: {
    select: { title: "titulo", subtitle: "etiqueta", media: "imagen" },
  },
});
