'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { LanguageSwitcher } from './language-switcher';
import { useLanguage } from './language-provider';
import type { NavigationItem, SiteSettings } from '@/lib/supabase/types';

interface NavbarProps {
  navItems: NavigationItem[];
  siteSettings: SiteSettings | null;
}

export function Navbar({ navItems, siteSettings }: NavbarProps) {
  const { t, locale } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24);
  });

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

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

  const ownerName = siteSettings ? (locale === 'ar' ? siteSettings.owner_name_ar : siteSettings.owner_name_en) : 'Youssef M. Marey';

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled ? 'py-2' : 'py-4'
        }`}
      >
        <div className="section-shell">
          <div
            className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 ${
              scrolled
                ? 'glass-strong shadow-lg shadow-black/[0.03]'
                : 'bg-transparent'
            }`}
          >
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2.5"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
                <span className="font-serif text-lg font-bold">Y</span>
                <div className="absolute inset-0 rounded-xl bg-primary/30 blur-md" />
              </div>
              <div className="hidden flex-col leading-none sm:flex">
                <span className="font-serif text-sm font-semibold tracking-tight">
                  {ownerName}
                </span>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Personal Brand
                </span>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card/50 lg:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="glass-strong absolute left-4 right-4 top-20 rounded-2xl border border-border/40 p-4 shadow-2xl"
            >
              <div className="flex flex-col gap-1">
                {items.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => scrollTo(item.id)}
                    className="rounded-lg px-4 py-2.5 text-left text-base font-medium text-foreground transition-colors hover:bg-primary/5"
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
