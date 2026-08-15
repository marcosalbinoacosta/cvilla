import { defineType, defineField } from "sanity";

export default defineType({
  name: "cupon",
  title: "Cupones de descuento",
  type: "document",
  fields: [
    defineField({
      name: "codigo",
      title: "Código",
      description:
        "Lo que escribe la persona al comprar. No distingue mayúsculas/minúsculas. Ej: LANZAMIENTO20.",
      type: "string",
      validation: (rule) => rule.required().min(3).max(40),
    }),
    defineField({
      name: "tipo",
      title: "Tipo de descuento",
      type: "string",
      options: {
        list: [
          { title: "Porcentaje (%)", value: "porcentaje" },
          { title: "Monto fijo ($)", value: "fijo" },
        ],
        layout: "radio",
      },
      initialValue: "porcentaje",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "valor",
      title: "Valor",
      description:
        "Si es porcentaje: número del 1 al 100. Si es monto fijo: pesos a descontar (ej: 8000).",
      type: "number",
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "activo",
      title: "Activo",
      description: "Desactivá el cupón para que deje de funcionar sin borrarlo.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "vencimiento",
      title: "Vence el (opcional)",
      description:
        "Después de esta fecha el cupón deja de funcionar. Vacío = sin vencimiento.",
      type: "date",
      options: { dateFormat: "DD/MM/YYYY" },
    }),
    defineField({
      name: "cursosAplicables",
      title: "Cursos aplicables (opcional)",
      description: "Dejar vacío para que aplique a todos los cursos.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "curso" }] }],
    }),
  ],
  preview: {
    select: {
      title: "codigo",
      tipo: "tipo",
      valor: "valor",
      activo: "activo",
    },
    prepare({ title, tipo, valor, activo }) {
      const desc = tipo === "porcentaje" ? `${valor}% OFF` : `$${valor} OFF`;
      return {
        title: title ?? "(sin código)",
        subtitle: activo === false ? `${desc} · inactivo` : desc,
      };
    },
  },
});
