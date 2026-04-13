import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonio",
  title: "Testimonios",
  type: "document",
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rol",
      title: "Rol / Empresa",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "cita",
      title: "Testimonio",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "foto",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "orden",
      title: "Orden",
      type: "number",
      description: "Menor número aparece primero",
    }),
  ],
  orderings: [
    { title: "Orden", name: "orden", by: [{ field: "orden", direction: "asc" }] },
  ],
  preview: {
    select: { title: "nombre", subtitle: "rol", media: "foto" },
  },
});
