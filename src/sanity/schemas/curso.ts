import { defineType, defineField } from "sanity";

export default defineType({
  name: "curso",
  title: "Cursos",
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
      description: "Identificador URL y clave de acceso en la DB (ej: 'virtuosa').",
      type: "slug",
      options: { source: "titulo", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "etiqueta",
      title: "Etiqueta",
      type: "string",
      description: "Ej: 'Programa', 'Curso online'.",
    }),
    defineField({
      name: "subtitulo",
      title: "Subtítulo",
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
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "imagenPortada",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "precio",
      title: "Precio (en pesos, sin centavos)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "precioOriginal",
      title: "Precio original (opcional, tachado)",
      type: "number",
    }),
    defineField({
      name: "currency",
      title: "Moneda",
      type: "string",
      initialValue: "ARS",
      options: { list: ["ARS", "USD"] },
    }),
    defineField({
      name: "duracionTexto",
      title: "Duración (texto libre)",
      type: "string",
      description: "Ej: '4 módulos · 6 horas'.",
    }),
    defineField({
      name: "beneficios",
      title: "Qué incluye",
      description: "Lista con ícono que se muestra en la página del curso. Ej: 🤝 / 'Acceso a la Comunidad de Emprendedoras'.",
      type: "array",
      of: [
        {
          type: "object",
          name: "beneficio",
          fields: [
            defineField({ name: "emoji", title: "Emoji", type: "string" }),
            defineField({ name: "texto", title: "Texto", type: "string" }),
          ],
          preview: {
            select: { title: "texto", subtitle: "emoji" },
          },
        },
      ],
    }),
    defineField({
      name: "videoIntroId",
      title: "Video de bienvenida — ID de Cloudflare Stream",
      type: "string",
      description:
        "UID del video de introducción. Se muestra arriba de todo en el aula, antes de los módulos. Dejar vacío si no hay intro.",
    }),
    defineField({
      name: "introTitulo",
      title: "Video de bienvenida — título",
      type: "string",
      description: "Ej: 'Bienvenida' o 'Empezá por acá'. Opcional.",
    }),
    defineField({
      name: "introDescripcion",
      title: "Video de bienvenida — descripción",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "modulos",
      title: "Módulos",
      type: "array",
      of: [{ type: "reference", to: [{ type: "modulo" }] }],
    }),
    defineField({
      name: "activo",
      title: "Activo (visible y comprable)",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "titulo", subtitle: "subtitulo", media: "imagenPortada" },
  },
});
