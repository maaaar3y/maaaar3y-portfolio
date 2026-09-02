'use client';

import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { motion, useScroll, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { GraduationCap, Award, Users, FlaskConical, Heart, Briefcase } from 'lucide-react';

interface TimelineEntry {
  date: string;
  title: string;
  org: string;
  description: string;
  icon: typeof GraduationCap;
  type: 'education' | 'experience' | 'certification' | 'project' | 'volunteer';
}

const timeline: TimelineEntry[] = [
  {
    date: 'Sep 2021 — Jun 2026',
    title: 'B.A. in English Language & Translation',
    org: 'Kafrelsheikh University',
    description: 'GPA 3.61/4.00 (Excellent) — Simultaneous Interpreting, Consecutive Translating, Literary & Media Translation, Advanced Linguistics.',
    icon: GraduationCap,
    type: 'education',
  },
  {
    date: '2024 — 2026',
    title: 'Graduation Project: The Art of Merging',
    org: 'Supervised by Dr. Rana Ghanem',
    description: 'Heritage-driven fragrance brand — research, 87-participant survey, 3 original fragrances, bilingual localization, e-commerce website.',
    icon: FlaskConical,
    type: 'project',
  },
  {
    date: 'Jan 2024 — 2026',
    title: 'Volunteer — UCCD',
    org: 'Kafrelsheikh University × AUC',
    description: 'Built MEL system for 60–70+ training programs, trained 30+ volunteers, coordinated events for 700–1,000 participants.',
    icon: Briefcase,
    type: 'experience',
  },
  {
    date: 'Oct 2024',
    title: 'Project Management Training',
    org: 'AmCham — 35 hours',
    description: 'Agile & Waterfall methodologies, risk management, stakeholder engagement. Serial No. 0011524.',
    icon: Award,
    type: 'certification',
  },
  {
    date: 'Nov 2024',
    title: 'Soft Skills & Employability Training',
    org: 'Aspire Consulting International — 35 hours',
    description: 'Communication, teamwork, leadership, problem-solving, and time management for workplace readiness.',
    icon: Award,
    type: 'certification',
  },
  {
    date: 'Nov 2024',
    title: 'Value Training',
    org: 'NTA × Haya Karima — 5-day intensive',
    description: 'Entrepreneurship and innovation aligned with Egypt Vision 2030. Credential ID: UYTP11-124-033662.',
    icon: Award,
    type: 'certification',
  },
  {
    date: '2024 — Present',
    title: 'Volunteer — Haya Karima Foundation',
    org: '“Decent Life” National Initiative',
    description: 'Community outreach, event logistics, and training documentation aligned with Egypt’s Vision 2030.',
    icon: Heart,
    type: 'volunteer',
  },
];

const typeColors: Record<TimelineEntry['type'], string> = {
  education: 'text-info',
  experience: 'text-primary',
  certification: 'text-accent',
  project: 'text-success',
  volunteer: 'text-destructive',
};

export function Timeline() {
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
            {timeline.map((entry, i) => (
              <TimelineRow key={i} entry={entry} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineRow({ entry, index }: { entry: TimelineEntry; index: number }) {
  const isLeft = index % 2 === 0;
  const Icon = entry.icon;

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
            {entry.date}
          </div>
          <h3 className="mt-1.5 font-serif text-base font-semibold">{entry.title}</h3>
          <p className="mt-0.5 text-sm text-primary">{entry.org}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            {entry.description}
          </p>
        </div>
      </Reveal>

      {/* Spacer for desktop */}
      <div className="hidden md:block md:w-1/2" />
    </div>
  );
}
