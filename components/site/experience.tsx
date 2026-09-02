'use client';

import { useState } from 'react';
import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Calendar,
  Building2,
  Users,
  BarChart3,
  Megaphone,
  Video,
  CalendarCheck,
} from 'lucide-react';

interface ExperienceItem {
  role: string;
  org: string;
  collaboration?: string;
  period: string;
  location: string;
  summary: string;
  highlights: { icon: typeof Users; text: string }[];
  tags: string[];
}

const experiences: ExperienceItem[] = [
  {
    role: 'Volunteer — Career Development & MEL',
    org: 'University Center for Career Development (UCCD)',
    collaboration: 'Kafrelsheikh University (KFS) × American University in Cairo (AUC)',
    period: 'Jan 2024 — 2026',
    location: 'Kafr El-Sheikh, Egypt',
    summary:
      'Built and operated the monitoring, evaluation, and learning system for 60–70+ training programs while coordinating events, content, and data for 90+ weekly trainees.',
    highlights: [
      {
        icon: Users,
        text: 'Trained and supported 30+ UCCD volunteers across multiple onboarding cycles on educational and administrative information systems, improving day-to-day operational efficiency.',
      },
      {
        icon: Megaphone,
        text: 'Designed, launched, and maintained recruitment and career-program campaigns across print and social media channels, while managing and updating the UCCD website.',
      },
      {
        icon: BarChart3,
        text: 'Built and implemented a Monitoring, Evaluation, and Learning (MEL) system to track and report program data, establishing priorities, policies, and procedures for data collection and management — supporting delivery of 60–70+ training programs.',
      },
      {
        icon: CalendarCheck,
        text: 'Coordinated the annual graduate follow-up survey end-to-end: collecting data, supervising data entry, generating results, and editing the final survey report.',
      },
      {
        icon: Video,
        text: 'Created, produced, and edited social media content, videos, and reels to promote center services, workshops, and training programs.',
      },
      {
        icon: Calendar,
        text: 'Coordinated logistics and operational support for 10–15 major career events, workshops, roundtables, and career fairs serving 700–1,000 participants.',
      },
    ],
    tags: ['MEL Systems', 'Data Coordination', 'Content Creation', 'Event Management', 'Volunteer Training'],
  },
  {
    role: 'Volunteer — Community Outreach',
    org: 'Haya Karima Foundation',
    collaboration: '“Decent Life” National Initiative, Egypt',
    period: '2024 — Present',
    location: 'Egypt',
    summary:
      'Supporting national development initiatives aligned with Egypt’s Vision 2030 through community outreach, event logistics, and training documentation.',
    highlights: [
      {
        icon: Megaphone,
        text: 'Organized and delivered community outreach and awareness campaigns promoting national development initiatives aligned with Egypt’s Vision 2030.',
      },
      {
        icon: Calendar,
        text: 'Coordinated logistics and administrative support for foundation events, workshops, and programs.',
      },
      {
        icon: Users,
        text: 'Communicated program information to community members, encouraging engagement and participation in initiatives.',
      },
      {
        icon: CalendarCheck,
        text: 'Prepared and organized materials and documentation to support training sessions and public events.',
      },
    ],
    tags: ['Community Outreach', 'Event Logistics', 'Vision 2030', 'Documentation'],
  },
];

export function Experience() {
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
              <StaggerItem key={i}>
                <ExperienceCard exp={exp} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ exp }: { exp: ExperienceItem }) {
  const [expanded, setExpanded] = useState(false);

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
              {exp.period}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-3 w-3" />
              {exp.location}
            </span>
          </div>
          <h3 className="mt-3 font-serif text-xl font-semibold sm:text-2xl">
            {exp.role}
          </h3>
          <p className="mt-1 text-sm font-medium text-foreground/80">{exp.org}</p>
          {exp.collaboration && (
            <p className="mt-0.5 text-xs text-muted-foreground">{exp.collaboration}</p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
            {exp.summary}
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
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/30 px-6 pb-6 pt-5 sm:px-8">
              <div className="space-y-4">
                {exp.highlights.map((h, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                      <h.icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
                      {h.text}
                    </p>
                  </div>
                ))}
              </div>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
