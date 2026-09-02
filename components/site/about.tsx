'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { Target, Eye, Heart, BookOpen, Globe2, Users } from 'lucide-react';

const values = [
  {
    icon: BookOpen,
    title: 'Lifelong Learning',
    description:
      'Continuously building expertise through accredited training and real-world application.',
  },
  {
    icon: Globe2,
    title: 'Bilingual Bridge',
    description:
      'Connecting Arabic and English-speaking communities through translation and localization.',
  },
  {
    icon: Users,
    title: 'Community Impact',
    description:
      'Driving measurable results in career development and national initiatives across Egypt.',
  },
];

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow="About Me"
          title={
            <>
              Bridging language, data, and <span className="text-gradient">community impact</span>
            </>
          }
          description="A bilingual professional turning academic excellence in translation into hands-on career development, monitoring & evaluation, and project coordination."
        />

        {/* Professional summary */}
        <Reveal className="mt-16" delay={0.1}>
          <div className="glass card-glow relative overflow-hidden rounded-2xl p-8 sm:p-12">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative">
              <p className="font-serif text-xl leading-relaxed text-foreground text-pretty sm:text-2xl">
                English Language and Translation graduate with a{' '}
                <span className="text-gradient-teal font-semibold">
                  GPA of 3.61 / 4.00
                </span>{' '}
                and hands-on experience in career development services, IT support,
                and monitoring &amp; evaluation — gained through sustained volunteer
                work at Kafrelsheikh University&apos;s Career Development Center (UCCD).
              </p>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground text-pretty">
                Accredited training in project management, entrepreneurship, and
                workplace readiness. Bilingual in Arabic and English, with a track
                record of coordinating data, content, and cross-functional projects
                in service-oriented environments. Passionate about building systems
                that help people grow — whether through training programs, career
                services, or community outreach.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Mission / Vision / Values */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Stagger staggerChildren={0.1}>
            <StaggerItem>
              <ValueCard
                icon={Target}
                title="Mission"
                description="To apply translation, data, and project management skills in roles that create real opportunities for people and communities."
              />
            </StaggerItem>
            <StaggerItem>
              <ValueCard
                icon={Eye}
                title="Vision"
                description="To become a trusted bilingual professional bridging cultures, organizations, and data-driven decision-making across the Arab region."
              />
            </StaggerItem>
            <StaggerItem>
              <ValueCard
                icon={Heart}
                title="Philosophy"
                description="Quality work creates trust. Trust creates opportunity. Every detail — from a survey report to a social media reel — matters."
              />
            </StaggerItem>
          </Stagger>
        </div>

        {/* Core values */}
        <Stagger className="mt-12" staggerChildren={0.08}>
          {values.map((v) => (
            <StaggerItem key={v.title}>
              <div className="card-glow flex h-full flex-col gap-3 rounded-2xl border border-border/40 bg-card/30 p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-semibold">{v.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {v.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function ValueCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Target;
  title: string;
  description: string;
}) {
  return (
    <div className="card-glow glass relative h-full overflow-hidden rounded-2xl p-6">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/8 blur-2xl" />
      <div className="relative flex flex-col gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-serif text-xl font-semibold">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
