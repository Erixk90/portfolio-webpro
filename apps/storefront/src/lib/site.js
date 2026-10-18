/**
 * site.js — ÚNICO archivo que necesitás editar para personalizar el sitio.
 */
export const site = {
  cmsUrl: '',

  brand: {
    name: 'WebPro',
    tagline:
      'Diseño de páginas web, portafolios y bots de WhatsApp en Barranquilla. Sitios rápidos, hechos a mano y medidos contra el reloj.',
  },

  nav: [
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Lo que ataco', href: '#atacar' },
    { label: 'Quién soy', href: '#quien-soy' },
    { label: 'Contacto', href: '#contacto' },
  ],

  hero: {
    kicker: 'Diseño web en Barranquilla, Colombia — disponible en octubre',
    title: 'Tu competencia tiene su web. <em>Tú tenés algo mejor que una plantilla.</em>',
    subtitle:
      'Diseño y desarrollo páginas web rápidas en Barranquilla y toda Colombia: portafolios, landings y catálogos con dirección de arte propia, CSS vanilla y presupuesto de performance medido. Criterio primero, tecnología después.',
    actions: [
      { label: 'Charlar por WhatsApp', href: 'https://wa.me/573053906784', variant: 'primary' },
      { label: 'Ver proyectos', href: '#proyectos', variant: 'ghost' },
    ],
  },

  projects: {
    eyebrow: 'Proyectos',
    title: 'Páginas web reales, en producción',
    items: [
      {
        sector: 'Fitness — Barranquilla',
        title: 'FitPro · Entrenador personal',
        description:
          'Web de captación de clientes para entrenador personal en Barranquilla: bloques por servicio,CTAs de WhatsApp y SEO local apuntando a búsquedas de "entrenador personal Barranquilla".',
        tags: ['CSS vanilla', 'Vercel', 'SEO local'],
        metric: 'Vercel',
        metricLabel: 'deploy continuo por commit',
        href: 'https://fitpro-sable.vercel.app',
        linkLabel: 'Ver FitPro online',
      },
      {
        sector: 'Gaming — Catálogo de venta',
        title: 'Catálogo Webpro-Games',
        description:
          'Catálogo de precios de videojuegos: navegación por categorías, fichas de producto y carrito por WhatsApp. HTML puro para indexar rápido en Google.',
        tags: ['HTML', 'GitHub Pages', 'Catálogo WhatsApp'],
        metric: '0',
        metricLabel: 'frameworks: HTML + CSS puro', 
        href: 'https://erixk90.github.io/webprogames/',
        linkLabel: 'Ver catálogo online',
      },
      {
        sector: 'Legal — Barranquilla',
        title: 'Estudio Jurídico Abogados BQ',
        description:
          'Web de un bufete de abogados en Barranquilla y la Costa Caribe: React + CMS headless propio (API Node y SQLite) para noticias y servicios, SEO técnico con JSON-LD LegalService, sitemap y metatags dinámicos por ruta.',
        tags: ['React', 'CMS headless', 'cPanel'],
        metric: 'DNS',
        metricLabel: 'en producción en abogadosbq.com',
        href: 'https://www.abogadosbq.com',
        linkLabel: 'Ver estudio online',
      },
      {
        sector: 'Servicios — Web & Bots',
        title: 'Páginas Web & Bots para tu Negocio',
        description:
          'Landing de la versión anterior de WebPro: paquetes de páginas web y bots para negocios en Barranquilla, con un canal de conversión único por WhatsApp.',
        tags: ['React', 'SPA', 'Bots de WhatsApp'],
        metric: '1 canal',
        metricLabel: 'WhatsApp como único canal de venta',
        href: 'https://erixk90.github.io/spa-react-26/',
        linkLabel: 'Ver landing online',
      },
    ],
  },

  attack: {
    eyebrow: 'Lo que vamos a atacar',
    title: 'Cuatro problemas, cuatro decisiones',
    intro:
      'Casi todo sitio "de AI" falla por lo mismo. Este es el plan de trabajo cuando trabajamos juntos:',
    items: [
      {
        problem: 'Tu web se ve como plantilla',
        solution:
          '<strong>Dirección de arte.</strong> Referencias reales, un solo acento, tipografía con criterio. Nada de gradiente azul-violeta.',
      },
      {
        problem: 'Carga lenta y LCP alto',
        solution:
          '<strong>Presupuesto de performance.</strong> Se pesa el build en cada cambio: sin librerías que no usás, sin fuentes fuente a fuente.',
      },
      {
        problem: 'El contenido queda desactualizado',
        solution:
          '<strong>CMS headless propio.</strong> Editás textos, proyectos y precios desde el admin sin tocar una línea de código.',
      },
      {
        problem: 'Visitas que nunca escriben',
        solution:
          '<strong>Un solo canal de conversión.</strong> CTAs de WhatsApp prellenados por sección, medidos. El resto, silencio.',
      },
    ],
  },

  about: {
    eyebrow: 'Quién soy',
    lede:
      'No soy una agencia ni una IA con plantilla: soy <em>una persona</em> que diseña, escribe el CSS a mano y te responde directo.',
    text: 'Trabajo desde Barranquilla para negocios de toda Colombia con un framework propio (WebProCode): dirección de arte, componentes BEM vanilla y un CMS headless del que tu sitio puede vivir solo. Menos capas, más criterio.',
    stats: [
      { value: '12+', label: 'Proyectos lanzados' },
      { value: '<1.2s', label: 'LCP medio en móvil' },
      { value: '24h', label: 'Tiempo de respuesta' },
    ],
  },

  contact: {
    eyebrow: 'Contacto',
    title: '¿Charlamos de <em>tu proyecto?</em>',
    text: 'Escríbeme por WhatsApp con la idea que tienes en la cabeza. Una llamada corta y salimos construyendo.',
    whatsappLabel: 'WhatsApp',
    whatsappNumber: '573053906784',
    whatsappMessage: 'Hola WebPro, quiero una página web para mi negocio.',
    email: 'director@webpro.cat',
    note: 'Respondo en menos de 24 horas.',
  },

  footer: {
    note: 'Hecho a mano con WebProCode — sin plantillas.',
    links: [
      { label: 'Proyectos', href: '#proyectos' },
      { label: 'Quién soy', href: '#quien-soy' },
      { label: 'Términos', href: '/terminos' },
      { label: 'Privacidad', href: '/privacidad' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
};

export default site;
