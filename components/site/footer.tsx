'use client';

import { ArrowUp, Linkedin, Mail, Phone } from 'lucide-react';
import { useLanguage } from './language-provider';
import { ThemeToggle } from './theme-toggle';

const navLinks = [
  { id: 'about', key: 'nav.about' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'graduation', key: 'nav.graduation' },
  { id: 'skills', key: 'nav.skills' },
  { id: 'certifications', key: 'nav.certifications' },
  { id: 'achievements', key: 'nav.achievements' },
  { id: 'timeline', key: 'nav.timeline' },
  { id: 'contact', key: 'nav.contact' },
];

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-border/30 py-12">
      <div className="section-shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <span className="font-serif text-lg font-bold">Y</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-sm font-semibold tracking-tight">
                  Youssef M. Marey
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Personal Brand
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              English Language &amp; Translation graduate, career development
              specialist, and bilingual project coordinator.
            </p>
          </div>

          {/* Quick nav */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Navigation
            </h4>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() =>
                    document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="link-underline text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t(link.key)}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Connect
            </h4>
            <div className="mt-4 flex flex-col gap-2.5">
              <a
                href="https://linkedin.com/in/maaaar3y"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a
                href="mailto:maaaar3y@gmail.com"
                className="link-underline inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" /> maaaar3y@gmail.com
              </a>
              <a
                href="tel:+201004793760"
                className="link-underline inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Phone className="h-4 w-4" /> +20 100 479 3760
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Youssef M. Marey. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/50 bg-card/40 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
