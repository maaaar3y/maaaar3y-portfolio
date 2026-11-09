'use client';

import { Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { Check } from 'lucide-react';
import { useLanguage } from './language-provider';
import { getIcon } from '@/lib/supabase/icon-map';
import type { SkillCategory, Skill } from '@/lib/supabase/types';

interface SkillsProps {
  categories: (SkillCategory & { skills: Skill[] })[];
}

export function Skills({ categories }: SkillsProps) {
  const { locale } = useLanguage();

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Areas of Expertise"
          title={
            <>
              Four connected <span className="text-gradient">areas of expertise</span>
            </>
          }
          description="Bridging strategy, execution, data, and communication to deliver meaningful results across project coordination, monitoring & evaluation, business & marketing, and bilingual translation."
        />

        <Stagger className="mt-16 grid gap-6 md:grid-cols-2" staggerChildren={0.12}>
          {categories.map((cat) => (
            <StaggerItem key={cat.id}>
              <SkillCard category={cat} locale={locale} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function SkillCard({ category, locale }: { category: SkillCategory & { skills: Skill[] }; locale: 'en' | 'ar' }) {
  const Icon = getIcon(category.icon_name);

  return (
    <div className="card-glow glass h-full rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-serif text-lg font-semibold">{locale === 'ar' ? category.title_ar : category.title_en}</h3>
      </div>

      <ul className="mt-6 space-y-3">
        {category.skills.map((skill) => (
          <li key={skill.id} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <span className="text-sm font-medium text-foreground">{locale === 'ar' ? skill.name_ar : skill.name_en}</span>
              <p className="text-xs text-muted-foreground">{locale === 'ar' ? skill.description_ar : skill.description_en}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
