import { defineType, defineField } from "sanity";

export default defineType({
  name: "infoContacto",
  title: "Info de Contacto",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "whatsapp",
      title: "Número de WhatsApp",
      type: "string",
      description: "Formato internacional, ej: 5493511234567",
    }),
    defineField({
      name: "ubicacion",
      title: "Ubicación",
      type: "string",
    }),
    defineField({
      name: "instagram",
      title: "URL de Instagram",
      type: "url",
    }),
    defineField({
      name: "linkedin",
      title: "URL de LinkedIn",
      type: "url",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Info de Contacto" }),
  },
});
