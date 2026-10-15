"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number; y: number; size: number; vy: number; vx: number;
  rot: number; vr: number; sway: number; phase: number; color: string; flip: number; vflip: number;
}

const COLORS = ["rgba(242,212,206,0.85)", "rgba(250,229,224,0.8)", "rgba(201,139,139,0.65)", "rgba(246,200,196,0.75)"];

/** Lightweight canvas of drifting petals. Pauses off-screen / hidden tab; disabled for reduced motion. */
export function Petals({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, running = false, last = 0;
    const petals: Petal[] = [];
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const spawn = (initial: boolean): Petal => ({
      x: rnd(0, w), y: initial ? rnd(-h * 0.1, h) : rnd(-60, -10),
      size: rnd(9, 20) * (w < 640 ? 0.8 : 1),
      vy: rnd(28, 62), vx: rnd(-8, 14),
      rot: rnd(0, Math.PI * 2), vr: rnd(-0.9, 0.9),
      sway: rnd(14, 38), phase: rnd(0, Math.PI * 2),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      flip: rnd(0, Math.PI * 2), vflip: rnd(0.8, 2.2),
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = w < 640 ? 12 : 24;
      while (petals.length < target) petals.push(spawn(true));
      petals.length = target;
    };

    const draw = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.scale(1, Math.abs(Math.cos(p.flip)) * 0.75 + 0.25);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      const s = p.size;
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.9, -s * 0.6, s * 0.7, s * 0.7, 0, s);
      ctx.bezierCurveTo(-s * 0.7, s * 0.7, -s * 0.9, -s * 0.6, 0, -s);
      ctx.fill();
      ctx.restore();
    };

    const tick = (t: number) => {
      if (!running) return;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.phase += dt * 1.1;
        p.y += p.vy * dt;
        p.x += (p.vx + Math.sin(p.phase) * p.sway) * dt;
        p.rot += p.vr * dt;
        p.flip += p.vflip * dt;
        if (p.y > h + 40 || p.x < -60 || p.x > w + 60) petals[i] = spawn(false);
        else draw(p);
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true; last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    let inView = true;
    const sync = () => (inView && !document.hidden ? start() : stop());

    resize();
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      stop(); io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none h-full w-full ${className}`} />;
}
