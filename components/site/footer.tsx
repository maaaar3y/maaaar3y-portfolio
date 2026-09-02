'use client';

import { ArrowUp, Mail, Phone, type LucideIcon } from 'lucide-react';
import { useLanguage } from './language-provider';
import { ThemeToggle } from './theme-toggle';
import { getIcon } from '@/lib/supabase/icon-map';
import type { NavigationItem, SiteSettings, SocialLink, ContactInfo } from '@/lib/supabase/types';

interface FooterProps {
  siteSettings: SiteSettings | null;
  navItems: NavigationItem[];
  socialLinks: SocialLink[];
  contactInfo: ContactInfo | null;
}

export function Footer({ siteSettings, navItems, socialLinks, contactInfo }: FooterProps) {
  const { t, locale } = useLanguage();

  const ownerName = siteSettings ? (locale === 'ar' ? siteSettings.owner_name_ar : siteSettings.owner_name_en) : 'Youssef M. Marey';
  const description = siteSettings ? (locale === 'ar' ? siteSettings.description_ar : siteSettings.description_en) : 'English Language & Translation graduate, career development specialist, and bilingual project coordinator.';

  const items = navItems.length > 0
    ? navItems.map((item) => ({ id: item.section_id, label: locale === 'ar' ? item.label_ar : item.label_en }))
    : [
        { id: 'about', label: t('nav.about') },
        { id: 'experience', label: t('nav.experience') },
        { id: 'graduation', label: t('nav.graduation') },
        { id: 'skills', label: t('nav.skills') },
        { id: 'certifications', label: t('nav.certifications') },
        { id: 'achievements', label: t('nav.achievements') },
        { id: 'timeline', label: t('nav.timeline') },
        { id: 'contact', label: t('nav.contact') },
      ];

  const email = contactInfo?.email ?? 'maaaar3y@gmail.com';
  const phone = contactInfo?.phone ?? '+20 100 479 3760';

  const socials = socialLinks.length > 0
    ? socialLinks
    : [];

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
                  {ownerName}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Personal Brand
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Quick nav */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Navigation
            </h4>
            <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
              {items.map((link) => (
                <button
                  key={link.id}
                  onClick={() =>
                    document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="link-underline text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
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
              {socials.map((s) => {
                const SIcon = getIcon(s.icon_name) as LucideIcon;
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <SIcon className="h-4 w-4" /> {s.label_en}
                  </a>
                );
              })}
              <a
                href={`mailto:${email}`}
                className="link-underline inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-4 w-4" /> {email}
              </a>
              <a
                href={`tel:${phone}`}
                className="link-underline inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Phone className="h-4 w-4" /> {phone}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/30 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {ownerName}. All rights reserved.
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
