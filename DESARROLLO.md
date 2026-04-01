# DESARROLLO WEB — Catalina Villafañe
## Consultora & Mentora de Negocios

---

**Fecha de inicio:** 30 de Marzo, 2026
**Última actualización:** 31 de Marzo, 2026
**Stack:** Next.js 16.2.1 + React 19 + Tailwind CSS v4 + TypeScript
**Referencia visual:** [naylanorryh.com](https://www.naylanorryh.com/)

---

## ESTADO ACTUAL — Fase 1: Web Institucional

### Completado

#### Estructura y configuración
- [x] Proyecto Next.js 16 con App Router configurado
- [x] Tailwind CSS v4 con tema personalizado (colores, tipografías)
- [x] TypeScript habilitado con paths alias (`@/*`)
- [x] Optimización de imágenes (conversión a WebP con sharp-cli)
- [x] ESLint configurado (Next.js core-web-vitals + TypeScript)

#### Identidad visual
- [x] Paleta de colores definida:
  - Navy: `#1B2E6B` (primario)
  - Cream: `#F7F2EC` (fondo claro)
  - Beige: `#EDE4D8` (neutro secundario)
  - Gold: `#B89A72` (acento)
  - Text: `#2C2C2C` (texto base)
- [x] Sistema tipográfico:
  - **Cormorant Garamond** (serif) — titulares
  - **Inter** (sans-serif) — cuerpo de texto
  - **Dancing Script** (script) — palabras de acento en gold
- [x] Consistencia tipográfica: todas las palabras de acento usan `font-script text-gold`

#### Componentes desarrollados (8 secciones + 2 utilidades)

| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| **Navbar** | `src/components/Navbar.tsx` | Navegación transparente sobre el hero, menú hamburguesa en mobile |
| **Hero** | `src/components/Hero.tsx` | Imagen izquierda + titular serif itálico + bullet points con estrellitas + CTAs |
| **Propósito** | `src/components/Proposito.tsx` | Manifiesto animado: texto izq + foto de Cata (fondo oscuro, fade natural) a la derecha |
| **Servicios** | `src/components/Servicios.tsx` | Layout jerárquico: Virtuosa (full-width con imagen de fondo) + Mentoría/Charlas (2 cards) |
| **Testimonios** | `src/components/Testimonios.tsx` | 3 cards translúcidas sobre imagen de fondo (foto grupal) con overlay navy |
| **Sobre Mí** | `src/components/SobreMi.tsx` | Retrato profesional + bio + lista de valores con hover |
| **CTA Banner** | `src/components/CtaBanner.tsx` | Banda de llamada a la acción con foto de escenario como fondo |
| **Contacto** | `src/components/Contacto.tsx` | Layout 2 columnas: info de contacto + formulario |
| **Footer** | `src/components/Footer.tsx` | 3 columnas: marca, navegación, redes sociales |
| **WhatsApp** | `src/components/WhatsAppButton.tsx` | Botón flotante fijo (bottom-right) |

**Utilidades:**
| Componente | Archivo | Descripción |
|-----------|---------|-------------|
| **ScrollReveal** | `src/components/ScrollReveal.tsx` | Wrapper de animación fade-up al scroll (IntersectionObserver) |

#### Imágenes optimizadas

| Archivo | Tamaño | Uso |
|---------|--------|-----|
| `hero.webp` | 64 KB | Hero — imagen principal |
| `cata-proposito.webp` | 71 KB | Propósito — Cata en silla de director (fondo oscuro) |
| `charla.webp` | ~150 KB | Servicios — fondo de Virtuosa (1920px) |
| `charla-grupo.webp` | 342 KB | Testimonios — fondo (foto grupal) |
| `sobre-mi-new.webp` | 57 KB | Sobre Mí — retrato con blazer azul |
| `speaker-stage.webp` | 127 KB | CTA Banner — fondo (Cata en escenario) |
| `mentoria.webp` | 59 KB | Disponible (Cata en escritorio) |
| `cata-speaker.webp` | 71 KB | Disponible (silla director con mic) |
| `biblia.webp` | 34 KB | Disponible (detalle manos + libro) |
| `proposito.webp` | — | Disponible (retrato silla director, ángulo alternativo) |

#### Diseño y UX
- [x] Diseño inspirado en naylanorryh.com
- [x] Hero: imagen a la izquierda, titular serif itálico a la derecha, bullet points con íconos
- [x] Navbar transparente integrado en el hero (no fixed, no sigue al scroll)
- [x] Animaciones al scroll (fade-up, líneas gold que se dibujan, texto escalonado)
- [x] Hover effects en cards, valores, botones (shadow, translate, color transitions)
- [x] Imágenes de fondo full-bleed con overlay en Testimonios, CTA Banner y Virtuosa
- [x] Responsive design (mobile-first, breakpoints: sm, md, lg)
- [x] Ritmo visual alternado: blanco → navy → cream → navy (imagen) → blanco → navy (imagen) → cream → navy

#### Flujo de secciones
```
Hero (blanco, imagen + texto)
  ↓
Propósito (navy, manifiesto animado + foto lateral)
  ↓
Servicios (cream, Virtuosa destacado + 2 cards)
  ↓
Testimonios (imagen fondo + overlay navy, cards translúcidas)
  ↓
Sobre Mí (blanco, retrato + bio + valores)
  ↓
CTA Banner (imagen fondo + overlay navy, llamada a la acción)
  ↓
Contacto (cream, info + formulario)
  ↓
Footer (navy, 3 columnas)
```

---

## PRÓXIMOS PASOS — Fase 1

### Semana 1 restante (01 Abr – 03 Abr)
- [ ] Reunión de aprobación del diseño con Catalina
- [ ] Ajustes de diseño post-feedback del cliente
- [ ] Recibir contenido definitivo del cliente (bio, descripciones, testimonios reales, WhatsApp Business)

### Semana 2 (07 Abr – 11 Abr)
- [ ] Integrar textos definitivos del cliente en todas las secciones
- [ ] Reemplazar testimonios placeholder con testimonios reales
- [ ] Configurar número real de WhatsApp Business
- [ ] Configurar links reales de Instagram y LinkedIn
- [ ] Integrar Sanity CMS para gestión de contenido
- [ ] Implementar formulario de contacto funcional (envío de email)
- [ ] SEO: meta titles, descriptions, Open Graph por sección
- [ ] Registrar y configurar dominio

### Semana 3 (14 Abr – 17 Abr)
- [ ] Testing en dispositivos reales (iPhone, Android, tablet, desktop)
- [ ] Revisión de performance (Lighthouse, Core Web Vitals)
- [ ] Google Analytics 4 + Search Console
- [ ] SSL + deploy a producción en Vercel
- [ ] Demo completa para Catalina
- [ ] Ronda de ajustes (máx. 2 rondas)
- [ ] Capacitación Sanity CMS (30 min)
- [ ] **LANZAMIENTO: Jueves 17 de Abril, 2026**

---

## PENDIENTES DEL CLIENTE — Fase 1

> Fecha límite: **antes del 7 de Abril, 2026**

- [ ] Bio completa (quién es, historia, formación, experiencia)
- [ ] Descripción detallada de cada servicio (Virtuosa, Mentoría, Charlas)
- [ ] Precio del Programa Virtuosa
- [ ] Número de WhatsApp Business
- [ ] Testimonios reales (mínimo 3, con nombre y rol)
- [ ] Links a redes sociales (Instagram, LinkedIn)
- [ ] Logo definitivo (si existe)
- [ ] Dominio elegido (.com / .com.ar)

---

## FASE 2 — Plataforma de Cursos (22 Abr – 8 May)

### Semana 1 (22–25 Abr): Aula Virtual
- [ ] Sistema de usuarios (registro, login, recupero de contraseña) con NextAuth.js
- [ ] Panel del alumno (mis cursos, progreso)
- [ ] Carga de módulos del Programa Virtuosa en Sanity
- [ ] Integración Cloudflare Stream (signed URLs para videos)
- [ ] Control de acceso (solo usuarios con compra aprobada)

### Semana 2 (28 Abr – 02 May): Pagos y Ventas
- [ ] Checkout con Mercado Pago (Checkout Pro)
- [ ] Webhook: activación automática de acceso post-pago
- [ ] Email transaccional (bienvenida + credenciales) con Resend o Brevo
- [ ] Landing page de ventas del Programa Virtuosa
- [ ] Sistema de reserva + cobro para Mentoría

### Semana 3 (05–08 May): Testing y Lanzamiento
- [ ] Testing flujo completo: Compra → Email → Acceso → Video
- [ ] Pruebas sandbox Mercado Pago
- [ ] Demo del flujo de compra para Catalina
- [ ] Ajustes finales + activación pagos reales
- [ ] Capacitación: ver ventas y cargar nuevos cursos
- [ ] **LANZAMIENTO FASE 2: Jueves 8 de Mayo, 2026**

### Pendientes del cliente — Fase 2
> Fecha límite: **antes del 22 de Abril, 2026**

- [ ] Videos del Programa Virtuosa (4 módulos, MP4, mínimo 1080p)
- [ ] Descripción de cada módulo (título + descripción corta)
- [ ] Precio definitivo del programa
- [ ] Materiales descargables (PDFs, plantillas, si los hay)
- [ ] Cuenta Mercado Pago Business verificada
- [ ] Disponibilidad horaria para mentorías
- [ ] Precio(s) de mentoría

---

## ARQUITECTURA DE ARCHIVOS

```
cvillafane-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout (fonts, metadata)
│   │   ├── page.tsx            # Homepage (orquesta componentes)
│   │   ├── globals.css         # Tema Tailwind + animaciones
│   │   └── favicon.ico
│   └── components/
│       ├── Navbar.tsx          # Navegación (absolute, transparente)
│       ├── Hero.tsx            # Hero (imagen izq + texto der)
│       ├── Proposito.tsx       # Manifiesto animado + foto lateral
│       ├── Servicios.tsx       # Virtuosa destacado + 2 cards
│       ├── Testimonios.tsx     # Cards sobre imagen de fondo
│       ├── SobreMi.tsx         # Retrato + bio + valores
│       ├── CtaBanner.tsx       # CTA con imagen de fondo
│       ├── Contacto.tsx        # Info + formulario
│       ├── Footer.tsx          # 3 columnas
│       ├── WhatsAppButton.tsx  # FAB flotante
│       └── ScrollReveal.tsx    # Utilidad de animación al scroll
├── public/images/              # Imágenes optimizadas WebP
├── package.json
├── tsconfig.json
├── next.config.ts
└── postcss.config.mjs
```

---

*Documento generado: 31 de Marzo, 2026*
*Desarrollador: Marcos Albino Acosta*
