/**
 * vortex.js — motor de partículas para todas las secciones.
 * Cada <canvas class="vortex"> se configura con data-variant y data-palette:
 *   spiral   → remolino orbital (hero, cobalto + electrico)
 *   streams  → dos contracorrientes de hilos (proyectos, indigo + azul suave)
 *   burst    → hilos radiales que emanan del centro (ataque, plata + perla)
 *   flow     → campo de flujo horizontal lento (quien soy, violeta-azul)
 *   converge → remolino denso que traga hacia el centro (contacto, plata + electrico)
 * Todas las secciones reaccionan al mouse: las partículas cercanas quedan
 * arrastradas detrás del cursor. Pausa fuera de vista + reduced-motion.
 */
const canvases = [...document.querySelectorAll('canvas.vortex')];
if (canvases.length) boot();

function boot() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };

  const scenes = canvases
    .map((canvas) => {
      const section = canvas.closest('section');
      if (!section) return null;
      const palette =
        (canvas.dataset.palette || '')
          .split('|')
          .filter(Boolean)
          .map((list) => list.split(',').map(Number));
      return {
        canvas,
        section,
        ctx: canvas.getContext('2d'),
        variant: canvas.dataset.variant || 'spiral',
        colors: palette.length ? palette : [[43, 43, 224], [67, 67, 255]],
        w: 0,
        h: 0,
        dpr: 1,
        seed: [],
        raf: 0,
        visible: false,
      };
    })
    .filter(Boolean);

  function colorOf(scene, hue, pearl, alpha) {
    const c = pearl ? [238, 240, 248] : scene.colors[Math.floor(hue * scene.colors.length)] ?? scene.colors[0];
    return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
  }

  function make(scene, i, total) {
    const t = i / total;
    const rand = Math.random();
    const particle = {
      hue: rand,
      pearl: rand < 0.07,
      size: rand < 0.12 ? 2.4 + Math.random() * 1.8 : 0.7 + Math.random() * 1.2,
      glow: 0,
      x: 0,
      y: 0,
      a: t * Math.PI * 2,
      r: 30 + Math.pow(Math.random(), 0.65) * 360,
      sp: 0.0003 + Math.random() * 0.0011,
      phase: Math.random() * Math.PI * 2,
    };
    if (scene.variant === 'flow') particle.r = 40 + Math.random() * 260;
    return particle;
  }

  function reseed(scene) {
    const count = Math.min(150, Math.max(60, Math.floor((scene.w * scene.h) / 9500)));
    scene.seed = Array.from({ length: count }, (_, i) => make(scene, i, count));
  }

  function size(scene) {
    scene.dpr = Math.min(window.devicePixelRatio || 1, 2);
    scene.w = scene.section.clientWidth;
    scene.h = scene.section.clientHeight;
    scene.canvas.width = scene.w * scene.dpr;
    scene.canvas.height = scene.h * scene.dpr;
    scene.canvas.style.width = `${scene.w}px`;
    scene.canvas.style.height = `${scene.h}px`;
    scene.ctx.setTransform(scene.dpr, 0, 0, scene.dpr, 0, 0);
    reseed(scene);
  }

  function place(scene, p, now) {
    const cx = scene.w * 0.7;
    const cy = scene.h * 0.46;
    let x = 0;
    let y = 0;
    if (scene.variant === 'spiral') {
      p.a += p.sp * 16;
      p.r += Math.sin(now * 0.00035 + p.a * 2) * 0.12;
      x = cx + Math.cos(p.a) * p.r;
      y = cy + Math.sin(p.a) * p.r * 0.72;
    } else if (scene.variant === 'streams') {
      const lane = p.hue < 0.5 ? -1 : 1;
      p.a += p.sp * 16 * lane;
      p.r += Math.sin(now * 0.0005 + p.phase) * 0.2;
      x = cx + Math.cos(p.a) * p.r * (lane + 1.4);
      y = cy + Math.sin(p.a * 0.8) * p.r * 0.5 + lane * scene.h * 0.06;
    } else if (scene.variant === 'burst') {
      p.r += 0.35 + Math.sin(p.phase + now * 0.0004) * 0.25;
      if (p.r > Math.max(scene.w, scene.h) * 0.75) p.r = 20 + Math.random() * 40;
      const spread = p.a + Math.sin(now * 0.0002 + p.phase) * 0.05;
      x = cx + Math.cos(spread) * p.r;
      y = cy + Math.sin(spread) * p.r * 0.8;
    } else if (scene.variant === 'flow') {
      p.r += 0.5;
      if (p.r > scene.w + 60) p.r = -40 + Math.random() * 30;
      x = (scene.w + p.r) % (scene.w + 120) - 60;
      y = cy + Math.sin(p.r * 0.01 + p.phase) * scene.h * 0.34;
      p.a += p.sp * 4;
    } else {
      p.r *= 0.997;
      if (p.r < 24) p.r = 320 + Math.random() * 120;
      p.a -= p.sp * 30;
      x = cx + Math.cos(p.a) * p.r;
      y = cy + Math.sin(p.a) * p.r * 0.6;
    }
    return [x, y];
  }

  function draw(scene, now) {
    if (!scene.visible || document.hidden) {
      scene.raf = 0;
      return;
    }
    const ctx = scene.ctx;
    ctx.clearRect(0, 0, scene.w, scene.h);
    const rect = scene.section.getBoundingClientRect();
    const mx = mouse.x - rect.left;
    const my = mouse.y - rect.top;
    for (const p of scene.seed) {
      let [x, y] = place(scene, p, now);
      const dx = x - mx;
      const dy = y - my;
      const d = Math.hypot(dx, dy);
      let near = 0;
      if (mx > -40 && mx < rect.width + 40 && d < 240) {
        near = Math.exp(-(d * d) / (2 * 110 * 110));
        x += (mouse.vx * 13 - dx * 0.42) * near;
        y += (mouse.vy * 13 - dy * 0.42) * near;
      }
      ctx.beginPath();
      ctx.fillStyle = colorOf(scene, p.hue, p.pearl, 0.32 + Math.min(0.6, near) + (p.pearl ? 0.28 : 0));
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
      if (p.pearl || near > 0.28) {
        ctx.beginPath();
        ctx.fillStyle = colorOf(scene, p.hue, p.pearl, 0.08);
        ctx.arc(x, y, p.size * 3.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    scene.raf = requestAnimationFrame((t) => draw(scene, t));
  }

  function wake(scene) {
    if (!scene.raf && scene.visible && !reduced) {
      scene.raf = requestAnimationFrame((t) => draw(scene, t));
    }
  }

  window.addEventListener('mousemove', (e) => {
    const step = Math.hypot(e.clientX - mouse.x, e.clientY - mouse.y) < 400;
    mouse.vx = step ? e.clientX - mouse.x : 0;
    mouse.vy = step ? e.clientY - mouse.y : 0;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    for (const scene of scenes) wake(scene);
  });

  let resizeId = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeId);
    resizeId = requestAnimationFrame(() => {
      for (const scene of scenes) {
        size(scene);
        if (reduced) paintStatic(scene);
        else wake(scene);
      }
    });
  });

  function paintStatic(scene) {
    scene.ctx.clearRect(0, 0, scene.w, scene.h);
    for (const p of scene.seed) {
      const [x, y] = place(scene, p, 0);
      scene.ctx.beginPath();
      scene.ctx.fillStyle = colorOf(scene, p.hue, p.pearl, 0.5);
      scene.ctx.arc(x, y, p.size, 0, Math.PI * 2);
      scene.ctx.fill();
    }
  }

  for (const scene of scenes) {
    size(scene);
    if (reduced) {
      scene.visible = true;
      paintStatic(scene);
    } else {
      new IntersectionObserver(([entry]) => {
        scene.visible = entry.isIntersecting;
        if (scene.visible) wake(scene);
        else {
          cancelAnimationFrame(scene.raf);
          scene.raf = 0;
        }
      }).observe(scene.section);
    }
  }
}
