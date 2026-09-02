'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { useCountUp } from '@/components/motion/use-count-up';
import { ShoppingBag } from 'lucide-react';
import { useLanguage } from './language-provider';
import { getIcon } from '@/lib/supabase/icon-map';
import type { GraduationProject as GradProject, GradProjectPhase, GradProjectFragrance, GradProjectStat } from '@/lib/supabase/types';

interface GraduationProjectProps {
  content: GradProject | null;
  phases: GradProjectPhase[];
  fragrances: GradProjectFragrance[];
  stats: GradProjectStat[];
}

export function GraduationProject({ content, phases, fragrances, stats }: GraduationProjectProps) {
  const { locale } = useLanguage();

  const eyebrow = content ? (locale === 'ar' ? content.eyebrow_ar : content.eyebrow_en) : 'Graduation Project — Case Study';
  const title = content
    ? (locale === 'ar' ? content.title_ar : content.title_en)
    : 'The Art of Merging: Cultural Aromas into One Essence';
  const description = content
    ? (locale === 'ar' ? content.description_ar : content.description_en)
    : 'A heritage-driven fragrance brand born from academic research, cross-cultural analysis, and bilingual localization — supervised by Dr. Rana Ghanem.';

  const displayStats = stats.length > 0
    ? stats
    : [
        { id: 'fallback-1', value: 87, label_en: 'Survey Participants', label_ar: 'مشاركين في الاستبيان', sort_order: 0, created_at: '' },
        { id: 'fallback-2', value: 3, label_en: 'Original Fragrances', label_ar: 'عطور أصلية', sort_order: 1, created_at: '' },
        { id: 'fallback-3', value: 3, label_en: 'Cultural Traditions', label_ar: 'تقاليد ثقافية', sort_order: 2, created_at: '' },
      ];

  return (
    <section id="graduation" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow={eyebrow}
          title={
            <>
              {title.includes('Cultural Aromas') ? (
                <>
                  {title.split('Cultural Aromas')[0]}<span className="text-gradient">Cultural Aromas</span>{title.split('Cultural Aromas')[1]}
                </>
              ) : (
                <span className="text-gradient">{title}</span>
              )}
            </>
          }
          description={description}
        />

        {/* Stats */}
        <Reveal className="mt-14" delay={0.1}>
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {displayStats.map((stat, i) => (
              <StatCard key={(stat as { id: string }).id ?? i} value={stat.value} label={locale === 'ar' ? stat.label_ar : stat.label_en} />
            ))}
          </div>
        </Reveal>

        {/* Project phases */}
        {phases.length > 0 && (
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.08}>
            {phases.map((phase) => {
              const PIcon = getIcon(phase.icon_name);
              return (
                <StaggerItem key={phase.id}>
                  <div className="card-glow glass group h-full rounded-2xl p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                      <PIcon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-serif text-lg font-semibold">{locale === 'ar' ? phase.title_ar : phase.title_en}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                      {locale === 'ar' ? phase.description_ar : phase.description_en}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}

        {/* Fragrance showcase */}
        {fragrances.length > 0 && (
          <Reveal className="mt-12" delay={0.15}>
            <div className="glass-strong relative overflow-hidden rounded-3xl p-8 sm:p-12">
              <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="uppercase tracking-[0.16em]">The Ra‘ Collection</span>
                </div>
                <h3 className="mt-3 font-serif text-2xl font-bold sm:text-3xl">
                  Three fragrances, three cultures, one essence
                </h3>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {fragrances.map((frag) => (
                    <div
                      key={frag.id}
                      className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div className="font-serif text-lg font-semibold">{locale === 'ar' ? frag.name_ar : frag.name_en}</div>
                      <div className="mt-1 text-xs text-primary">{locale === 'ar' ? frag.culture_ar : frag.culture_en}</div>
                      <div className="mt-3 text-sm text-muted-foreground">{locale === 'ar' ? frag.note_ar : frag.note_en}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  const { value: countValue, ref } = useCountUp(value, 2000);
  return (
    <div className="glass rounded-2xl p-6 text-center">
      <div
        ref={ref}
        className="font-serif text-4xl font-bold text-gradient-teal sm:text-5xl"
      >
        {Math.round(countValue)}
      </div>
      <div className="mt-2 text-xs text-muted-foreground sm:text-sm">
        {label}
      </div>
    </div>
  );
}
