'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { Target, Eye, Heart } from 'lucide-react';
import { useLanguage } from './language-provider';
import { getIcon } from '@/lib/supabase/icon-map';
import type { AboutContent, AboutValue } from '@/lib/supabase/types';

interface AboutProps {
  content: AboutContent | null;
  values: AboutValue[];
}

export function About({ content, values }: AboutProps) {
  const { locale } = useLanguage();

  const eyebrow = content ? (locale === 'ar' ? content.eyebrow_ar : content.eyebrow_en) : 'About Me';
  const title = content
    ? (locale === 'ar' ? content.title_ar : content.title_en)
    : 'Bridging language, data, and community impact';
  const description = content
    ? (locale === 'ar' ? content.description_ar : content.description_en)
    : 'A bilingual professional turning academic excellence in translation into hands-on career development, monitoring & evaluation, and project coordination.';
  const summary = content
    ? (locale === 'ar' ? content.summary_ar : content.summary_en)
    : 'English Language and Translation graduate with a GPA of 3.61 / 4.00 and hands-on experience in career development services, IT support, and monitoring & evaluation — gained through sustained volunteer work at Kafrelsheikh University\'s Career Development Center (UCCD).';
  const summaryDetail = content
    ? (locale === 'ar' ? content.summary_detail_ar : content.summary_detail_en)
    : 'Accredited training in project management, entrepreneurship, and workplace readiness. Bilingual in Arabic and English, with a track record of coordinating data, content, and cross-functional projects in service-oriented environments. Passionate about building systems that help people grow — whether through training programs, career services, or community outreach.';
  const mission = content
    ? (locale === 'ar' ? content.mission_ar : content.mission_en)
    : 'To apply translation, data, and project management skills in roles that create real opportunities for people and communities.';
  const vision = content
    ? (locale === 'ar' ? content.vision_ar : content.vision_en)
    : 'To become a trusted bilingual professional bridging cultures, organizations, and data-driven decision-making across the Arab region.';
  const philosophy = content
    ? (locale === 'ar' ? content.philosophy_ar : content.philosophy_en)
    : 'Quality work creates trust. Trust creates opportunity. Every detail — from a survey report to a social media reel — matters.';

  const fallbackValues = [
    { icon_name: 'BookOpen', title_en: 'Lifelong Learning', title_ar: 'التعلم المستمر', description_en: 'Continuously building expertise through accredited training and real-world application.', description_ar: 'بناء الخبرة باستمرار من خلال التدريب المعتمد والتطبيق العملي.' },
    { icon_name: 'Globe2', title_en: 'Bilingual Bridge', title_ar: 'جسر ثنائي اللغة', description_en: 'Connecting Arabic and English-speaking communities through translation and localization.', description_ar: 'ربط المجتمعات الناطقة بالعربية والإنجليزية من خلال الترجمة والتوطين.' },
    { icon_name: 'Users', title_en: 'Community Impact', title_ar: 'التأثير المجتمعي', description_en: 'Driving measurable results in career development and national initiatives across Egypt.', description_ar: 'تحقيق نتائج قابلة للقياس في التطوير المهني والمبادرات الوطنية في مصر.' },
  ];

  const displayValues = values.length > 0 ? values : fallbackValues;

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow={eyebrow}
          title={
            <>
              {title.split('community impact')[0]}
              {title.includes('community impact') && <span className="text-gradient">community impact</span>}
              {title.split('community impact')[1]}
            </>
          }
          description={description}
        />

        {/* Professional summary */}
        <Reveal className="mt-16" delay={0.1}>
          <div className="glass card-glow relative overflow-hidden rounded-2xl p-8 sm:p-12">
            <div className="absolute right-0 top-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-primary/5 blur-3xl" />
            <div className="relative">
              <p className="font-serif text-xl leading-relaxed text-foreground text-pretty sm:text-2xl">
                {summary.includes('3.61') ? (
                  <>
                    {summary.split('GPA of 3.61 / 4.00')[0]}
                    <span className="text-gradient-teal font-semibold">GPA of 3.61 / 4.00</span>
                    {summary.split('GPA of 3.61 / 4.00')[1]}
                  </>
                ) : (
                  summary
                )}
              </p>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground text-pretty">
                {summaryDetail}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Mission / Vision / Values */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Stagger staggerChildren={0.1}>
            <StaggerItem>
              <ValueCard icon={Target} title="Mission" description={mission} />
            </StaggerItem>
            <StaggerItem>
              <ValueCard icon={Eye} title="Vision" description={vision} />
            </StaggerItem>
            <StaggerItem>
              <ValueCard icon={Heart} title="Philosophy" description={philosophy} />
            </StaggerItem>
          </Stagger>
        </div>

        {/* Core values */}
        <Stagger className="mt-12" staggerChildren={0.08}>
          {displayValues.map((v) => {
            const Icon = getIcon(v.icon_name);
            return (
              <StaggerItem key={v.id ?? v.title_en}>
                <div className="card-glow flex h-full flex-col gap-3 rounded-2xl border border-border/40 bg-card/30 p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold">{locale === 'ar' ? v.title_ar : v.title_en}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {locale === 'ar' ? v.description_ar : v.description_en}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
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
