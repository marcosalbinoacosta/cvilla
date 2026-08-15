import { defineType, defineField } from "sanity";

export default defineType({
  name: "modulo",
  title: "Módulos",
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
      options: { source: "titulo", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "orden",
      title: "Orden dentro del curso",
      type: "number",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "descripcion",
      title: "Descripción",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "videoId",
      title: "ID de video (Cloudflare Stream)",
      type: "string",
      description:
        "UID del video en Cloudflare Stream. El player genera una signed URL en runtime.",
    }),
    defineField({
      name: "videoUrl",
      title: "URL de video (fallback / desarrollo)",
      type: "string",
      description:
        "URL directa al video: /videos/modulo.mp4, YouTube, Vimeo, etc. Se usa solo si Cloudflare Stream no está configurado.",
    }),
    defineField({
      name: "duracionMin",
      title: "Duración (minutos)",
      type: "number",
    }),
    defineField({
      name: "materiales",
      title: "Materiales descargables",
      type: "array",
      of: [
        {
          type: "object",
          name: "material",
          fields: [
            defineField({
              name: "nombre",
              title: "Nombre",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "archivo",
              title: "Archivo",
              type: "file",
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
  orderings: [
    { title: "Orden", name: "orden", by: [{ field: "orden", direction: "asc" }] },
  ],
  preview: {
    select: { title: "titulo", subtitle: "orden" },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `Módulo ${subtitle}` : undefined,
      };
    },
  },
});
