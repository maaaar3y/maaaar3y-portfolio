'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { useCountUp } from '@/components/motion/use-count-up';
import { FlaskConical, Globe, Package, Megaphone, Languages, ShoppingBag, Sparkles } from 'lucide-react';

const phases = [
  {
    icon: FlaskConical,
    title: 'Research & Analysis',
    description:
      'Researched and analyzed Egyptian, French, and Gulf perfumery traditions to identify a market gap for a heritage-driven fragrance brand.',
  },
  {
    icon: Sparkles,
    title: 'Product Development',
    description:
      'Designed and developed three original fragrance formulations — Ra‘| Veloura, Ra‘| Nefer, and Ra‘| Rêve — blending Egyptian, French, and Arabian olfactory elements.',
  },
  {
    icon: Globe,
    title: 'Market Validation',
    description:
      'Conducted, analyzed, and interpreted an 87-participant market survey to evaluate consumer preferences and validate demand for the concept.',
  },
  {
    icon: Languages,
    title: 'Translation & Localization',
    description:
      'Applied translation and localization strategies, including CAT tools, to adapt the brand for both regional and international markets.',
  },
  {
    icon: Megaphone,
    title: 'Marketing & Content',
    description:
      'Produced marketing materials, including promotional videos and a branded e-commerce website, to launch and present the final product.',
  },
  {
    icon: Package,
    title: 'Brand & Packaging',
    description:
      'Created a complete brand identity and packaging concept that tells the story of merging cultural aromas into one essence.',
  },
];

export function GraduationProject() {
  const survey = useCountUp(87, 2000);
  const products = useCountUp(3, 1500);
  const cultures = useCountUp(3, 1500);

  return (
    <section id="graduation" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Graduation Project — Case Study"
          title={
            <>
              The Art of Merging: <span className="text-gradient">Cultural Aromas</span> into One Essence
            </>
          }
          description="A heritage-driven fragrance brand born from academic research, cross-cultural analysis, and bilingual localization — supervised by Dr. Rana Ghanem."
        />

        {/* Stats */}
        <Reveal className="mt-14" delay={0.1}>
          <div className="grid grid-cols-3 gap-4 sm:gap-8">
            {[
              { ref: survey.ref, value: Math.round(survey.value), label: 'Survey Participants' },
              { ref: products.ref, value: Math.round(products.value), label: 'Original Fragrances' },
              { ref: cultures.ref, value: Math.round(cultures.value), label: 'Cultural Traditions' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-2xl p-6 text-center"
              >
                <div
                  ref={stat.ref}
                  className="font-serif text-4xl font-bold text-gradient-teal sm:text-5xl"
                >
                  {stat.value}
                </div>
                <div className="mt-2 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Project phases */}
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.08}>
          {phases.map((phase) => (
            <StaggerItem key={phase.title}>
              <div className="card-glow glass group h-full rounded-2xl p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <phase.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold">{phase.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {phase.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Fragrance showcase */}
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
                {[
                  { name: 'Ra‘ | Veloura', culture: 'Egyptian × French', note: 'Soft, velvety, warm' },
                  { name: 'Ra‘ | Nefer', culture: 'Egyptian Heritage', note: 'Beautiful, ancient, pure' },
                  { name: 'Ra‘ | Rêve', culture: 'French × Arabian', note: 'Dreamy, opulent, bold' },
                ].map((frag) => (
                  <div
                    key={frag.name}
                    className="rounded-2xl border border-border/40 bg-card/40 p-5 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/5"
                  >
                    <div className="font-serif text-lg font-semibold">{frag.name}</div>
                    <div className="mt-1 text-xs text-primary">{frag.culture}</div>
                    <div className="mt-3 text-sm text-muted-foreground">{frag.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
