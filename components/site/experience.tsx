'use client';

import { useState } from 'react';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Calendar, Building2 } from 'lucide-react';
import { useLanguage } from './language-provider';
import { getIcon } from '@/lib/supabase/icon-map';
import type { Experience, ExperienceHighlight } from '@/lib/supabase/types';

interface ExperienceProps {
  experiences: (Experience & { highlights: ExperienceHighlight[] })[];
}

export function Experience({ experiences }: ExperienceProps) {
  const { locale } = useLanguage();

  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Experience"
          title={
            <>
              Where I made <span className="text-gradient">measurable impact</span>
            </>
          }
          description="Volunteer roles that translated academic skills into real-world systems, events, and data-driven outcomes."
        />

        <div className="mt-16 space-y-6">
          <Stagger staggerChildren={0.15}>
            {experiences.map((exp, i) => (
              <StaggerItem key={exp.id ?? i}>
                <ExperienceCard exp={exp} locale={locale} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ exp, locale }: { exp: Experience & { highlights: ExperienceHighlight[] }; locale: 'en' | 'ar' }) {
  const [expanded, setExpanded] = useState(false);

  const role = locale === 'ar' ? exp.role_ar : exp.role_en;
  const org = locale === 'ar' ? exp.org_ar : exp.org_en;
  const collaboration = exp.collaboration_en || exp.collaboration_ar ? (locale === 'ar' ? exp.collaboration_ar : exp.collaboration_en) : null;
  const period = locale === 'ar' ? exp.period_ar : exp.period_en;
  const location = locale === 'ar' ? exp.location_ar : exp.location_en;
  const summary = locale === 'ar' ? exp.summary_ar : exp.summary_en;

  return (
    <div className="card-glow glass relative overflow-hidden rounded-2xl">
      {/* Accent line */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start justify-between gap-4 p-6 text-left sm:p-8"
        aria-expanded={expanded}
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
              <Calendar className="h-3 w-3" />
              {period}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-3 w-3" />
              {location}
            </span>
          </div>
          <h3 className="mt-3 font-serif text-xl font-semibold sm:text-2xl">
            {role}
          </h3>
          <p className="mt-1 text-sm font-medium text-foreground/80">{org}</p>
          {collaboration && (
            <p className="mt-0.5 text-xs text-muted-foreground">{collaboration}</p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
            {summary}
          </p>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50 bg-card/50"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && exp.highlights.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/30 px-6 pb-6 pt-5 sm:px-8">
              <div className="space-y-4">
                {exp.highlights.map((h, i) => {
                  const HIcon = getIcon(h.icon_name);
                  return (
                    <div key={h.id ?? i} className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                        <HIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                        {locale === 'ar' ? h.text_ar : h.text_en}
                      </p>
                    </div>
                  );
                })}
              </div>
              {exp.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/40 bg-card/30 px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
