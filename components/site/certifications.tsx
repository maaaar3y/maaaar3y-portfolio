'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { Award, Clock, Hash, GraduationCap, ExternalLink } from 'lucide-react';
import { useLanguage } from './language-provider';
import type { Certificate, CertificateHighlight } from '@/lib/supabase/types';

interface CertificationsProps {
  certificates: (Certificate & { highlights: CertificateHighlight[] })[];
}

export function Certifications({ certificates }: CertificationsProps) {
  const { locale } = useLanguage();

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
          {certificates.map((cert) => (
            <StaggerItem key={cert.id}>
              <CertCard cert={cert} locale={locale} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function CertCard({ cert, locale }: { cert: Certificate & { highlights: CertificateHighlight[] }; locale: 'en' | 'ar' }) {
  const title = locale === 'ar' ? cert.title_ar : cert.title_en;
  const issuer = locale === 'ar' ? cert.issuer_ar : cert.issuer_en;
  const date = locale === 'ar' ? cert.date_ar : cert.date_en;
  const hours = cert.hours_en ? (locale === 'ar' ? cert.hours_ar : cert.hours_en) : null;
  const description = locale === 'ar' ? cert.description_ar : cert.description_en;

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
              <h3 className="font-serif text-lg font-semibold sm:text-xl">{title}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{issuer}</p>
            </div>
          </div>

          {description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">{description}</p>
          )}

          {cert.highlights.length > 0 && (
            <div className="mt-5 space-y-2.5">
              {cert.highlights.map((h, i) => (
                <div key={h.id ?? i} className="flex gap-2.5">
                  <div className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{locale === 'ar' ? h.text_ar : h.text_en}</p>
                </div>
              ))}
            </div>
          )}

          {cert.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {cert.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border/40 bg-card/30 px-3 py-1 text-xs font-medium text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {(cert.image_url || cert.pdf_url || cert.verification_url) && (
            <div className="mt-5 flex flex-wrap gap-3">
              {cert.image_url && (
                <a href={cert.image_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                  <ExternalLink className="h-3 w-3" /> View Certificate
                </a>
              )}
              {cert.pdf_url && (
                <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                  <ExternalLink className="h-3 w-3" /> View PDF
                </a>
              )}
              {cert.verification_url && (
                <a href={cert.verification_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                  <ExternalLink className="h-3 w-3" /> Verify
                </a>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
          {hours && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Clock className="h-3 w-3" />
              {hours}
            </span>
          )}
          <span className="text-xs text-muted-foreground">{date}</span>
          {cert.serial_no && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-card/30 px-2.5 py-0.5 text-[10px] text-muted-foreground">
              <Hash className="h-2.5 w-2.5" />
              {cert.serial_no}
            </span>
          )}
          {cert.credential_id && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-card/30 px-2.5 py-0.5 text-[10px] text-muted-foreground">
              <GraduationCap className="h-2.5 w-2.5" />
              {cert.credential_id}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
