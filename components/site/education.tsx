'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from './language-provider';
import type { Education } from '@/lib/supabase/types';

interface EducationProps {
  education: Education[];
}

export function Education({ education }: EducationProps) {
  const { locale } = useLanguage();

  return (
    <section id="education" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Education"
          title={
            <>
              Academic <span className="text-gradient">foundation</span>
            </>
          }
          description="Formal education and academic achievements that shaped the journey."
        />

        <Stagger className="mt-16 space-y-6" staggerChildren={0.15}>
          {education.map((edu, i) => (
            <StaggerItem key={edu.id ?? i}>
              <EducationCard edu={edu} locale={locale} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function EducationCard({ edu, locale }: { edu: Education; locale: 'en' | 'ar' }) {
  const degree = locale === 'ar' ? edu.degree_ar : edu.degree_en;
  const institution = locale === 'ar' ? edu.institution_ar : edu.institution_en;
  const period = locale === 'ar' ? edu.period_ar : edu.period_en;
  const description = locale === 'ar' ? edu.description_ar : edu.description_en;

  return (
    <div className="card-glow glass relative overflow-hidden rounded-2xl">
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent via-accent/50 to-transparent" />
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/15 to-primary/10 text-accent">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold sm:text-xl">{degree}</h3>
              <p className="mt-0.5 text-sm text-primary">{institution}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground sm:items-end">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 font-medium text-accent">
              <Calendar className="h-3 w-3" />
              {period}
            </span>
            {edu.gpa && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-card/30 px-2.5 py-1">
                GPA: {edu.gpa}
              </span>
            )}
          </div>
        </div>
        {description && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
