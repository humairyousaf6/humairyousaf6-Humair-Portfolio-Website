import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  depth: number;
  phase: number;
  speed: number;
  alpha: number;
  colorIndex: number;
};

const particleColors = [
  [55, 50, 45],
  [255, 181, 48],
  [234, 112, 42],
  [24, 151, 140],
  [55, 126, 184],
  [132, 94, 194],
  [211, 82, 112],
] as const;

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function InteractiveParticleField({
  compact = false,
  className = "pointer-events-none absolute inset-y-0 left-[9%] h-full w-[82%] sm:left-[11%] sm:w-[78%]",
}: {
  compact?: boolean;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const context: CanvasRenderingContext2D = ctx;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frame = 0;
    let targetMouseX = -10_000;
    let targetMouseY = -10_000;
    let mouseX = targetMouseX;
    let mouseY = targetMouseY;
    let mouseActive = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function rebuildParticles() {
      const area = width * height;
      const scale = compact ? 0.82 : 1;
      const count = Math.max(
        compact ? 100 : 170,
        Math.min(compact ? 190 : 350, Math.round((area / 4_800) * scale)),
      );
      particles = Array.from({ length: count }, (_, index) => ({
        x: seeded(index, 1) * width,
        y: seeded(index, 2) * height,
        size: 1.8 + seeded(index, 3) * 3.8,
        depth: 0.35 + seeded(index, 4) * 0.9,
        phase: seeded(index, 5) * Math.PI * 2,
        speed: 0.35 + seeded(index, 6) * 0.8,
        alpha: 0.34 + seeded(index, 7) * 0.5,
        colorIndex: Math.floor(seeded(index, 8) * particleColors.length),
      }));
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      rebuildParticles();
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      mouseActive =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (mouseActive) {
        targetMouseX = event.clientX - rect.left;
        targetMouseY = event.clientY - rect.top;
      }
    }

    function draw(time = 0) {
      context.clearRect(0, 0, width, height);
      mouseX += (targetMouseX - mouseX) * 0.16;
      mouseY += (targetMouseY - mouseY) * 0.16;
      const seconds = time / 1000;

      for (const particle of particles) {
        const driftX = Math.sin(seconds * particle.speed + particle.phase) * 12 * particle.depth;
        const driftY =
          Math.cos(seconds * particle.speed * 0.72 + particle.phase) * 15 * particle.depth;
        let x = particle.x + driftX;
        let y = particle.y + driftY;

        if (mouseActive) {
          const parallaxX = (mouseX / width - 0.5) * 18 * particle.depth;
          const parallaxY = (mouseY / height - 0.5) * 14 * particle.depth;
          x += parallaxX;
          y += parallaxY;

          const dx = x - mouseX;
          const dy = y - mouseY;
          const distance = Math.hypot(dx, dy);
          const radius = 175;
          if (distance > 0 && distance < radius) {
            const force = Math.pow(1 - distance / radius, 2) * 74;
            x += (dx / distance) * force;
            y += (dy / distance) * force;
          }
        }

        const pulse = 0.72 + Math.sin(seconds * 1.3 + particle.phase) * 0.28;
        const alpha = particle.alpha * pulse;
        const [red, green, blue] = particleColors[particle.colorIndex];
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        context.fillRect(x, y, particle.size, particle.size);
      }

      if (!reduceMotion) frame = requestAnimationFrame(draw);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    resize();
    draw();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [compact]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  );
}
