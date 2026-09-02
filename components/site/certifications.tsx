'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { Award, Clock, Hash, GraduationCap } from 'lucide-react';

interface Certification {
  title: string;
  issuer: string;
  date: string;
  hours?: string;
  credentialId?: string;
  serialNo?: string;
  highlights: string[];
}

const certifications: Certification[] = [
  {
    title: 'Project Management Training',
    issuer: 'American Chamber of Commerce (AmCham)',
    date: 'Oct 2024',
    hours: '35 hours',
    serialNo: '0011524',
    highlights: [
      'Applied Agile and Waterfall methodologies to plan, execute, monitor, and close projects using industry-standard tools.',
      'Practiced risk management, stakeholder engagement, and communication strategies for cross-functional project delivery.',
    ],
  },
  {
    title: 'Soft Skills & Employability Skills Training',
    issuer: 'Aspire Consulting International',
    date: 'Nov 2024',
    hours: '35 hours',
    highlights: [
      'Strengthened communication, teamwork, and leadership competencies through practical workplace-readiness exercises.',
      'Practiced problem-solving and critical-thinking techniques to resolve simulated workplace scenarios.',
      'Managed time and prioritized tasks effectively while adapting to changing team requirements.',
    ],
  },
  {
    title: 'Value Training',
    issuer: 'National Training Academy (NTA) × Haya Karima Foundation',
    date: 'Nov 2024',
    hours: '5-day intensive program',
    credentialId: 'UYTP11-124-033662',
    highlights: [
      'Developed entrepreneurial and innovative solutions aligned with Egypt’s Vision 2030 national development goals.',
      'Built labor-market readiness through hands-on sessions covering leadership, communication, and national project awareness.',
      'Collaborated with peers to design venture concepts addressing real community needs, presenting outcomes to program facilitators.',
    ],
  },
];

export function Certifications() {
  return (
    <section id="certifications" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Certifications & Training"
          title={
            <>
              Accredited <span className="text-gradient">professional development</span>
            </>
          }
          description="Training in project management, employability, and entrepreneurship — backed by credentials and practical application."
        />

        <Stagger className="mt-16 grid gap-6" staggerChildren={0.12}>
          {certifications.map((cert) => (
            <StaggerItem key={cert.title}>
              <CertCard cert={cert} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function CertCard({ cert }: { cert: Certification }) {
  return (
    <div className="card-glow glass relative overflow-hidden rounded-2xl p-6 sm:p-8">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/8 blur-3xl" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 text-primary">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold sm:text-xl">{cert.title}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{cert.issuer}</p>
            </div>
          </div>

          <div className="mt-5 space-y-2.5">
            {cert.highlights.map((h, i) => (
              <div key={i} className="flex gap-2.5">
                <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{h}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Clock className="h-3 w-3" />
            {cert.hours}
          </span>
          <span className="text-xs text-muted-foreground">{cert.date}</span>
          {cert.serialNo && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-card/30 px-2.5 py-0.5 text-[10px] text-muted-foreground">
              <Hash className="h-2.5 w-2.5" />
              {cert.serialNo}
            </span>
          )}
          {cert.credentialId && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-card/30 px-2.5 py-0.5 text-[10px] text-muted-foreground">
              <GraduationCap className="h-2.5 w-2.5" />
              {cert.credentialId}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
