'use client';

import { motion, useReducedMotion } from 'framer-motion';

export function AuroraBackground() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

      {/* Aurora blobs */}
      {!reduce && (
        <>
          <motion.div
            className="absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full blur-[120px]"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, 60, -30, 0],
              y: [0, 40, -20, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute top-1/3 -right-40 h-[35rem] w-[35rem] rounded-full blur-[120px]"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--accent) / 0.14) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, -50, 30, 0],
              y: [0, 30, -40, 0],
              scale: [1, 0.9, 1.15, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-0 left-1/4 h-[30rem] w-[30rem] rounded-full blur-[120px]"
            style={{
              background:
                'radial-gradient(circle, hsl(var(--primary-glow) / 0.12) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, 40, -50, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.05, 0.9, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
