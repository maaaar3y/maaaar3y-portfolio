'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { useCountUp } from '@/components/motion/use-count-up';
import { useLanguage } from './language-provider';
import { getIcon } from '@/lib/supabase/icon-map';
import type { Achievement as AchievementType } from '@/lib/supabase/types';

interface AchievementsProps {
  achievements: AchievementType[];
}

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <section id="achievements" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Achievements"
          title={
            <>
              Numbers that tell a <span className="text-gradient">story of impact</span>
            </>
          }
          description="Every metric below represents real people, programs, and outcomes from volunteer and academic work."
        />

        <Stagger className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3" staggerChildren={0.08}>
          {achievements.map((a) => (
            <StaggerItem key={a.id}>
              <AchievementCard achievement={a} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function AchievementCard({ achievement }: { achievement: AchievementType }) {
  const { locale } = useLanguage();
  const { value, ref } = useCountUp(achievement.value, 2000);
  const Icon = getIcon(achievement.icon_name);
  const display = achievement.value >= 100 ? Math.round(value) : value.toFixed(achievement.suffix.includes('/') ? 2 : 0);

  return (
    <div className="card-glow glass group relative h-full overflow-hidden rounded-2xl p-6 text-center">
      <div className="absolute -top-8 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-primary/8 blur-2xl transition-opacity group-hover:opacity-80" />
      <div className="relative flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
        <div
          ref={ref}
          className="mt-4 font-serif text-3xl font-bold text-gradient-teal sm:text-4xl"
        >
          {display}
          <span className="text-lg text-primary">{achievement.suffix}</span>
        </div>
        <div className="mt-2 text-sm font-medium text-foreground">{locale === 'ar' ? achievement.label_ar : achievement.label_en}</div>
        <div className="mt-1 text-xs text-muted-foreground text-pretty">{locale === 'ar' ? achievement.context_ar : achievement.context_en}</div>
      </div>
    </div>
  );
}
