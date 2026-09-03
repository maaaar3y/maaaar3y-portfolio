'use client';

import { Reveal, Stagger, StaggerItem } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import { useLanguage } from './language-provider';
import type { Project, ProjectMedia } from '@/lib/supabase/types';

interface ProjectsProps {
  projects: (Project & { media: ProjectMedia[] })[];
}

export function Projects({ projects }: ProjectsProps) {
  const { locale } = useLanguage();

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Projects"
          title={
            <>
              Things I&apos;ve <span className="text-gradient">built</span>
            </>
          }
          description="Projects that combine translation, data, and community impact."
        />

        <Stagger className="mt-16 grid gap-6 md:grid-cols-2" staggerChildren={0.12}>
          {projects.map((project, i) => (
            <StaggerItem key={project.id ?? i}>
              <ProjectCard project={project} locale={locale} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function ProjectCard({ project, locale }: { project: Project & { media: ProjectMedia[] }; locale: 'en' | 'ar' }) {
  const title = locale === 'ar' ? project.title_ar : project.title_en;
  const description = locale === 'ar' ? project.description_ar : project.description_en;
  const category = locale === 'ar' ? project.category_ar : project.category_en;

  const mainImage = project.main_image_url || project.media.find((m) => m.media_type === 'image')?.url || null;

  return (
    <div className="card-glow glass group relative flex h-full flex-col overflow-hidden rounded-2xl">
      {/* Image */}
      {mainImage && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={mainImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          {project.featured && (
            <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
              Featured
            </span>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {category && (
          <span className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            <Tag className="h-3 w-3" />
            {category}
          </span>
        )}
        <h3 className="font-serif text-lg font-semibold sm:text-xl">{title}</h3>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        )}

        {/* Technologies */}
        {project.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/40 bg-card/30 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Date range */}
        {(project.start_date || project.end_date) && (
          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {project.start_date && new Date(project.start_date).toLocaleDateString()}
            {project.start_date && project.end_date && ' — '}
            {project.end_date && new Date(project.end_date).toLocaleDateString()}
          </div>
        )}

        {/* Links */}
        <div className="mt-auto flex flex-wrap gap-3 pt-4">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" /> Live Demo
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <Github className="h-3 w-3" /> Code
            </a>
          )}
          {project.external_links?.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" /> {link.label}
            </a>
          ))}
        </div>

        {/* Additional media */}
        {project.media.length > 0 && !mainImage && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {project.media.slice(0, 3).map((m) => (
              <div key={m.id} className="aspect-video overflow-hidden rounded-lg">
                {m.media_type === 'image' ? (
                  <img src={m.url} alt={m.caption_en ?? ''} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
