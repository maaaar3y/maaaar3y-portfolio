'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BarChart3, FileSpreadsheet, Monitor, Languages, Video, Megaphone } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  description: string;
}

interface SkillCategory {
  icon: typeof BarChart3;
  title: string;
  skills: Skill[];
}

const categories: SkillCategory[] = [
  {
    icon: FileSpreadsheet,
    title: 'Office & Data',
    skills: [
      { name: 'Microsoft Excel', level: 88, description: 'Reporting, data tracking, and analysis' },
      { name: 'Microsoft Word', level: 92, description: 'Document creation and formatting' },
      { name: 'Microsoft PowerPoint', level: 90, description: 'Presentation design' },
    ],
  },
  {
    icon: BarChart3,
    title: 'MEL & Web',
    skills: [
      { name: 'Monitoring, Evaluation & Learning', level: 85, description: 'MEL systems and data reporting tools' },
      { name: 'Website Content Management', level: 82, description: 'Content updates and management' },
    ],
  },
  {
    icon: Video,
    title: 'Content & Media',
    skills: [
      { name: 'Social Media Design', level: 80, description: 'Posts, reels, and campaign design' },
      { name: 'Video Editing', level: 78, description: 'Reels and promotional videos' },
    ],
  },
  {
    icon: Languages,
    title: 'Languages',
    skills: [
      { name: 'Arabic', level: 100, description: 'Native proficiency' },
      { name: 'English', level: 85, description: 'Professional working proficiency — translation & interpreting (simultaneous & consecutive)' },
    ],
  },
];

export function Skills() {
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
            <StaggerItem key={cat.title}>
              <SkillCard category={cat} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function SkillCard({ category }: { category: SkillCategory }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const Icon = category.icon;

  return (
    <div ref={ref} className="card-glow glass h-full rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-serif text-lg font-semibold">{category.title}</h3>
      </div>

      <div className="mt-6 space-y-5">
        {category.skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{skill.name}</span>
              <span className="text-xs text-muted-foreground">{skill.level}%</span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{skill.description}</p>
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
