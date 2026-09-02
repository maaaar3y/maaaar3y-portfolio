'use client';

import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { motion, useScroll, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { useLanguage } from './language-provider';
import { getIcon } from '@/lib/supabase/icon-map';
import type { TimelineEvent } from '@/lib/supabase/types';

interface TimelineProps {
  events: TimelineEvent[];
}

const typeColors: Record<TimelineEvent['type'], string> = {
  education: 'text-info',
  experience: 'text-primary',
  certification: 'text-accent',
  project: 'text-success',
  volunteer: 'text-destructive',
};

export function Timeline({ events }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 80%', 'end 20%'],
  });

  return (
    <section id="timeline" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Timeline"
          title={
            <>
              The journey, <span className="text-gradient">year by year</span>
            </>
          }
          description="Education, experience, certifications, and volunteer work — all connected."
        />

        <div ref={containerRef} className="relative mt-16">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2">
            <motion.div
              style={{ scaleY: reduce ? 1 : scrollYProgress }}
              className="h-full w-full origin-top bg-gradient-to-b from-primary via-primary/60 to-primary/20"
            />
          </div>

          <div className="space-y-8">
            {events.map((entry, i) => (
              <TimelineRow key={entry.id ?? i} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineRow({ entry, index }: { entry: TimelineEvent; index: number }) {
  const { locale } = useLanguage();
  const isLeft = index % 2 === 0;
  const Icon = getIcon(entry.icon_name);

  const date = locale === 'ar' ? entry.date_ar : entry.date_en;
  const title = locale === 'ar' ? entry.title_ar : entry.title_en;
  const org = locale === 'ar' ? entry.org_ar : entry.org_en;
  const description = locale === 'ar' ? entry.description_ar : entry.description_en;

  return (
    <div
      className={`relative flex gap-6 md:gap-0 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      }`}
    >
      {/* Dot */}
      <div className="absolute left-4 z-10 -translate-x-1/2 md:left-1/2">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-card shadow-md ${typeColors[entry.type]}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </motion.div>
      </div>

      {/* Card */}
      <Reveal
        delay={0.1}
        className={`ml-12 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}
      >
        <div className="card-glow glass rounded-2xl p-5">
          <div className={`text-xs font-medium uppercase tracking-wide text-muted-foreground ${isLeft ? 'md:text-right' : ''}`}>
            {date}
          </div>
          <h3 className="mt-1.5 font-serif text-base font-semibold">{title}</h3>
          <p className="mt-0.5 text-sm text-primary">{org}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        </div>
      </Reveal>

      {/* Spacer for desktop */}
      <div className="hidden md:block md:w-1/2" />
    </div>
  );
}
