import { defineType, defineField } from "sanity";

export default defineType({
  name: "faq",
  title: "Preguntas Frecuentes",
  type: "document",
  fields: [
    defineField({
      name: "pregunta",
      title: "Pregunta",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "respuesta",
      title: "Respuesta",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seccion",
      title: "Sección",
      type: "string",
      options: {
        list: [
          { title: "Mentoría Individual", value: "individual" },
          { title: "Mentoría Grupal", value: "grupal" },
          { title: "General", value: "general" },
        ],
      },
      validation: (rule) => rule.required(),
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
    select: { title: "pregunta", subtitle: "seccion" },
  },
});
