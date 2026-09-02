'use client';

import { Reveal } from '@/components/motion/reveal';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  align?: 'center' | 'left';
}) {
  return (
    <Reveal
      className={
        align === 'center'
          ? 'mx-auto max-w-2xl text-center'
          : 'max-w-2xl text-left'
      }
    >
      <div
        className={`inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/30 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground ${
          align === 'center' ? '' : ''
        }`}
      >
        <span className="h-1 w-1 rounded-full bg-primary" />
        {eyebrow}
      </div>
      <h2 className="mt-5 font-serif text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-muted-foreground text-pretty sm:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
