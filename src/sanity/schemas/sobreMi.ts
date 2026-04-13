import { defineType, defineField } from "sanity";

export default defineType({
  name: "sobreMi",
  title: "Sobre Mí",
  type: "document",
  fields: [
    defineField({
      name: "nombre",
      title: "Nombre",
      type: "string",
    }),
    defineField({
      name: "saludo",
      title: "Saludo (cursiva)",
      type: "string",
      description: "Ej: 'Hola, soy Cata'",
    }),
    defineField({
      name: "titulo",
      title: "Título / Eslogan",
      type: "string",
      description: "Ej: 'Trazando el camino de tu expansión'",
    }),
    defineField({
      name: "bio",
      title: "Biografía",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "cita",
      title: "Cita destacada",
      type: "string",
    }),
    defineField({
      name: "foto",
      title: "Foto de perfil",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "expertise",
      title: "Áreas de expertise",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "anosExperiencia",
      title: "Años de experiencia",
      type: "number",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Sobre Mí" }),
  },
});
