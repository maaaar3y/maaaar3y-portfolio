'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useRef } from 'react';
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
          eyebrow="Skills"
          title={
            <>
              A toolkit for <span className="text-gradient">data, content, and communication</span>
            </>
          }
          description="Categorized, visualized, and grounded in real-world application across career development and community work."
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const Icon = getIcon(category.icon_name);

  return (
    <div ref={ref} className="card-glow glass h-full rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-serif text-lg font-semibold">{locale === 'ar' ? category.title_ar : category.title_en}</h3>
      </div>

      <div className="mt-6 space-y-5">
        {category.skills.map((skill) => (
          <div key={skill.id}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{locale === 'ar' ? skill.name_ar : skill.name_en}</span>
              <span className="text-xs text-muted-foreground">{skill.level}%</span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{locale === 'ar' ? skill.description_ar : skill.description_en}</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={reduce ? { width: `${skill.level}%` } : { width: 0 }}
                animate={inView || reduce ? { width: `${skill.level}%` } : { width: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
