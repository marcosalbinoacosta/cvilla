import { defineType, defineField } from "sanity";

export default defineType({
  name: "charlaImagen",
  title: "Fotos de Charlas",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Título / Descripción",
      type: "string",
      description: "Referencia interna, ej: 'Charla en Córdoba 2025'",
    }),
    defineField({
      name: "imagen",
      title: "Imagen",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ancho",
      title: "Ancho original (px)",
      type: "number",
      description: "Para calcular aspect ratio en el carrusel",
    }),
    defineField({
      name: "alto",
      title: "Alto original (px)",
      type: "number",
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
    select: { title: "titulo", media: "imagen" },
  },
});
