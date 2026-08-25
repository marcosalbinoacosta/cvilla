import { defineType, defineField } from "sanity";

export default defineType({
  name: "mentoria",
  title: "Mentorías (contenido de página)",
  type: "document",
  fields: [
    defineField({
      name: "seccion",
      title: "Sección",
      type: "string",
      options: {
        list: [
          { title: "Mentoría Individual", value: "individual" },
          { title: "Mentoría Grupal", value: "grupal" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "paraQuienEyebrow",
      title: "\"Es para vos?\" — etiqueta",
      type: "string",
      description: "Ej: '¿Es para vos?'.",
    }),
    defineField({
      name: "paraQuienTitulo",
      title: "\"Es para vos?\" — título",
      type: "string",
      description: "Ej: 'Este espacio es para vos si…'.",
    }),
    defineField({
      name: "paraQuienItems",
      title: "\"Es para vos?\" — lista",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "incluyeEyebrow",
      title: "\"Qué incluye?\" — etiqueta",
      type: "string",
      description: "Ej: '¿Qué incluye?'.",
    }),
    defineField({
      name: "incluyeTituloIntro",
      title: "\"Qué incluye?\" — título (parte normal)",
      type: "string",
      description: "Ej: 'Todo lo que necesitás para'.",
    }),
    defineField({
      name: "incluyeTituloDestacado",
      title: "\"Qué incluye?\" — título (parte destacada)",
      type: "string",
      description: "Ej: 'avanzar' o 'resultados'. Se muestra con tipografía especial.",
    }),
    defineField({
      name: "incluyeTituloSufijo",
      title: "\"Qué incluye?\" — título (texto después de la parte destacada)",
      type: "string",
      description: "Opcional. Ej: 'reales' (para 'Estrategia colectiva, resultados reales'). Dejar vacío si no aplica.",
    }),
    defineField({
      name: "incluyeItems",
      title: "\"Qué incluye?\" — lista",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "incluyeNota",
      title: "\"Qué incluye?\" — nota final",
      type: "string",
      description: "Ej: 'La primera conversación es sin compromiso.'.",
    }),
  ],
  preview: {
    select: { title: "seccion" },
  },
});
