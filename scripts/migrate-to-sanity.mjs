import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

const client = createClient({
  projectId: "wgx202d1",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_TOKEN,
  useCdn: false,
});

// Helper to upload an image file
async function uploadImage(filePath) {
  try {
    const fullPath = resolve("public", filePath.replace(/^\//, ""));
    const buffer = readFileSync(fullPath);
    const ext = filePath.split(".").pop();
    const contentType =
      ext === "webp"
        ? "image/webp"
        : ext === "jpeg" || ext === "jpg"
          ? "image/jpeg"
          : "image/png";
    const asset = await client.assets.upload("image", buffer, {
      filename: filePath.split("/").pop(),
      contentType,
    });
    console.log(`  ✓ Uploaded ${filePath}`);
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (e) {
    console.log(`  ✗ Failed to upload ${filePath}: ${e.message}`);
    return undefined;
  }
}

// ============ TESTIMONIOS ============
const testimonios = [
  {
    nombre: "Lic. Sabrina Peña",
    rol: "Asesora en capacitación",
    cita: "Fue un proceso de transformación para mi negocio. En cada encuentro pude conocer nuevas herramientas, diseñar mis objetivos y me regalaste una mirada nueva sobre mi negocio.",
    fotoPath: "images/testimonio-1.webp",
    orden: 1,
  },
  {
    nombre: "Brenda Ayen",
    rol: "Carlos Ayen Joyas",
    cita: "Nos ayudó a ordenar nuestro negocio y darnos cuenta de todo lo que no sabíamos. Es una persona muy clara, firme y siempre enfocada hacia adelante.",
    fotoPath: "images/testimonio-2.webp",
    orden: 2,
  },
  {
    nombre: "Florencia",
    rol: "Diseño de moda",
    cita: "Me ayudó a entender la importancia del valor de mi producto. Hoy tengo una mirada completamente distinta de mi negocio. Se los recomiendo porque realmente vale la pena.",
    fotoPath: "images/testimonio-3.webp",
    orden: 3,
  },
  {
    nombre: "Gina Bazan",
    rol: "Emprendedora gastronómica",
    cita: "Es súper atenta, me escuchó y me dio herramientas para ordenar mi negocio. Ahora trabajo más enfocada y mis ideas se van convirtiendo en resultados.",
    fotoPath: "images/testimonio-4.webp",
    orden: 4,
  },
  {
    nombre: "Gisela Caffaro",
    rol: "Consultora en CX",
    cita: "Me ayudó a darle forma a mi negocio y a trabajar de manera estratégica. Es una persona comprometida, clara y con una energía que te impulsa a avanzar.",
    fotoPath: "images/testimonio-5.webp",
    orden: 5,
  },
  {
    nombre: "Alejandra Sil",
    rol: "Psicóloga",
    cita: "Transformó mi manera de ver y llevar adelante mi negocio. Me dio herramientas concretas para planificar y organizarme. Un proceso de transformación que recomiendo muchísimo.",
    fotoPath: "images/testimonio-6.webp",
    orden: 6,
  },
];

// ============ CHARLA IMAGES ============
const charlasImages = [
  { titulo: "Charla 2", path: "images/charla2.webp", w: 800, h: 533, orden: 1 },
  { titulo: "Charla 3", path: "images/charla3.webp", w: 800, h: 532, orden: 2 },
  { titulo: "Charla 4", path: "images/charla4.webp", w: 800, h: 1199, orden: 3 },
  { titulo: "Charla 5", path: "images/charla5.webp", w: 800, h: 1422, orden: 4 },
  { titulo: "Charla 6", path: "images/charla6.webp", w: 800, h: 532, orden: 5 },
  { titulo: "Charla 7", path: "images/charla7.jpeg", w: 1280, h: 720, orden: 6 },
  { titulo: "Charla 8", path: "images/charla8.webp", w: 800, h: 1200, orden: 7 },
  { titulo: "Charla 9", path: "images/charla9.webp", w: 800, h: 1422, orden: 8 },
  { titulo: "Charla 10", path: "images/charla10.jpeg", w: 720, h: 1280, orden: 9 },
];

// ============ SERVICIOS ============
const servicios = [
  {
    titulo: "Virtuosa",
    etiqueta: "01 · Programa",
    subtitulo: "Es hora de dar el próximo paso.",
    descripcion:
      "Si ya empezaste pero tu negocio está estancado o desordenado, este programa te ayuda a recuperar claridad y definir estrategia para crear con base sólida.",
    descripcionLarga:
      "Vas a definir y avanzar con lo que tenés que hacer y dejar de hacer para dar el próximo paso y vender.",
    imagenPath: "images/charla.jpeg",
    orden: 1,
  },
  {
    titulo: "Mentoría Individual",
    etiqueta: "1 a 1",
    subtitulo: "Tu negocio merece atención personalizada.",
    descripcion:
      "Espacio privado para emprendedoras que quieran mirar su negocio, hacer preguntas, pensar estrategias y trabajar en lo que realmente necesitan para ordenar y escalar su negocio.",
    descripcionLarga:
      "Las mentorías NO son un acompañamiento genérico, es un proceso de transformación donde pongo mi experiencia, conocimiento y mirada crítica al servicio de tu negocio.",
    incluye: [
      "Sesiones privadas 1 a 1 por videollamada",
      "Plan de acción personalizado para tu negocio",
      "Análisis de tu modelo de negocio actual",
      "Estrategia de ventas y posicionamiento",
      "Acompañamiento entre sesiones vía mensajes",
      "Material de apoyo y ejercicios prácticos",
    ],
    orden: 2,
  },
  {
    titulo: "Mentoría Grupal",
    etiqueta: "Grupal",
    subtitulo: "Crecer juntas.",
    descripcion:
      "Un espacio de crecimiento compartido donde emprendedoras se encuentran para aprender, desafiarse y avanzar juntas. Estrategia colectiva con la guía y el acompañamiento personalizado de Cata.",
    descripcionLarga: "Grupos reducidos para garantizar atención y resultados reales.",
    incluye: [
      "Encuentros grupales en vivo por videollamada",
      "Grupos reducidos (máximo 8 emprendedoras)",
      "Material de trabajo y ejercicios prácticos",
      "Feedback personalizado dentro del grupo",
      "Comunidad privada entre participantes",
      "Acceso a grabaciones de las sesiones",
    ],
    orden: 3,
  },
  {
    titulo: "Charlas y Talleres",
    etiqueta: "04 · Eventos",
    subtitulo: "Temáticas adaptables a tu equipo o evento.",
    descripcion: "Consultoría corporativa disponible.",
    orden: 4,
  },
];

// ============ INFO CONTACTO ============
const infoContacto = {
  _id: "infoContacto",
  _type: "infoContacto",
  email: "hola@catalinavillafane.com",
  whatsapp: "5491100000000",
  ubicacion: "Córdoba, Argentina",
  instagram: "https://instagram.com",
  linkedin: "https://linkedin.com",
};

// ============ SOBRE MI ============
const sobreMi = {
  _id: "sobreMi",
  _type: "sobreMi",
  nombre: "Catalina Villafañe",
  saludo: "Hola, soy Cata",
  titulo: "Trazando el camino de tu expansión",
  cita: "Un negocio ordenado multiplica su impacto y le devuelve tiempo y paz a su líder.",
  expertise: [
    "Estrategia Empresarial",
    "Diseño de Procesos",
    "Liderazgo Consciente",
    "Gestión del Tiempo",
    "Transformación Digital",
  ],
  anosExperiencia: 10,
};

// ============ FAQS ============
const faqs = [
  // Individual
  { pregunta: "¿Cuánto dura el proceso de mentoría?", respuesta: "Depende de tus objetivos. Podemos trabajar desde sesiones puntuales hasta un acompañamiento de varios meses. Lo definimos juntas en la primera conversación.", seccion: "individual", orden: 1 },
  { pregunta: "¿Es solo para emprendedoras?", respuesta: "Trabajo principalmente con emprendedoras y dueñas de pymes, pero si tenés un proyecto o negocio que querés hacer crecer, podemos conversar.", seccion: "individual", orden: 2 },
  { pregunta: "¿Qué pasa si no sé bien qué necesito?", respuesta: "Justamente para eso es la primera sesión de diagnóstico. Muchas llegan sin claridad y eso es completamente normal. Mi trabajo es ayudarte a encontrarla.", seccion: "individual", orden: 3 },
  { pregunta: "¿Las sesiones son presenciales o virtuales?", respuesta: "Las sesiones son por videollamada, lo que te permite participar desde cualquier lugar. También hay opción presencial en Córdoba.", seccion: "individual", orden: 4 },
  { pregunta: "¿Cómo sé si la mentoría es para mí?", respuesta: "Si sentís que tu negocio necesita orden, dirección o un impulso estratégico, y estás dispuesta a comprometerte con el proceso, es para vos.", seccion: "individual", orden: 5 },
  // Grupal
  { pregunta: "¿Cuántas personas participan en cada grupo?", respuesta: "Los grupos son reducidos, de máximo 8 emprendedoras. Esto garantiza que cada una reciba atención y feedback personalizado dentro del espacio grupal.", seccion: "grupal", orden: 1 },
  { pregunta: "¿Cuánto dura la mentoría grupal?", respuesta: "Cada ciclo tiene una duración definida que se comunica al abrir inscripciones. Generalmente son entre 4 y 8 semanas con encuentros semanales.", seccion: "grupal", orden: 2 },
  { pregunta: "¿Puedo participar si recién estoy empezando?", respuesta: "Sí, siempre que tengas una idea de negocio en marcha o un emprendimiento que querés hacer crecer. El grupo es un espacio para todas las etapas.", seccion: "grupal", orden: 3 },
  { pregunta: "¿Qué pasa si no puedo asistir a una sesión?", respuesta: "Todas las sesiones se graban y quedan disponibles para que puedas verlas cuando quieras. Además, tenés acceso a la comunidad privada para no perder el hilo.", seccion: "grupal", orden: 4 },
  { pregunta: "¿Cuándo abre el próximo grupo?", respuesta: "Las inscripciones se abren periódicamente. Escribime para sumarte a la lista de espera y ser la primera en enterarte cuando se abra un nuevo grupo.", seccion: "grupal", orden: 5 },
];

// ============ MIGRATION ============
async function migrate() {
  console.log("🚀 Iniciando migración a Sanity...\n");

  // Testimonios
  console.log("📝 Testimonios:");
  for (const t of testimonios) {
    const foto = await uploadImage(t.fotoPath);
    await client.create({
      _type: "testimonio",
      nombre: t.nombre,
      rol: t.rol,
      cita: t.cita,
      foto,
      orden: t.orden,
    });
    console.log(`  ✓ ${t.nombre}`);
  }

  // Charlas
  console.log("\n📸 Fotos de charlas:");
  for (const c of charlasImages) {
    const imagen = await uploadImage(c.path);
    await client.create({
      _type: "charlaImagen",
      titulo: c.titulo,
      imagen,
      ancho: c.w,
      alto: c.h,
      orden: c.orden,
    });
    console.log(`  ✓ ${c.titulo}`);
  }

  // Servicios
  console.log("\n💼 Servicios:");
  for (const s of servicios) {
    const doc = {
      _type: "servicio",
      titulo: s.titulo,
      slug: { _type: "slug", current: s.titulo.toLowerCase().replace(/\s+/g, "-") },
      etiqueta: s.etiqueta,
      subtitulo: s.subtitulo,
      descripcion: s.descripcion,
      descripcionLarga: s.descripcionLarga,
      incluye: s.incluye,
      orden: s.orden,
    };
    if (s.imagenPath) {
      doc.imagen = await uploadImage(s.imagenPath);
    }
    await client.create(doc);
    console.log(`  ✓ ${s.titulo}`);
  }

  // Info Contacto (singleton)
  console.log("\n📞 Info de Contacto:");
  await client.createOrReplace(infoContacto);
  console.log("  ✓ Info de contacto");

  // Sobre Mi (singleton)
  console.log("\n👤 Sobre Mí:");
  const sobreMiFoto = await uploadImage("images/sobre-mi-new.webp");
  await client.createOrReplace({ ...sobreMi, foto: sobreMiFoto });
  console.log("  ✓ Sobre Mí");

  // FAQs
  console.log("\n❓ FAQs:");
  for (const f of faqs) {
    await client.create({
      _type: "faq",
      pregunta: f.pregunta,
      respuesta: f.respuesta,
      seccion: f.seccion,
      orden: f.orden,
    });
    console.log(`  ✓ ${f.pregunta.substring(0, 40)}...`);
  }

  console.log("\n✅ Migración completa!");
}

migrate().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
