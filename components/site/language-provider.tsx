'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'en' | 'ar';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const translations: Record<Locale, Record<string, string>> = {
  en: {
    'nav.about': 'About',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.graduation': 'Graduation',
    'nav.skills': 'Skills',
    'nav.certifications': 'Certifications',
    'nav.achievements': 'Achievements',
    'nav.timeline': 'Timeline',
    'nav.contact': 'Contact',
    'hero.tagline': 'English Language & Translation Graduate',
    'hero.cta.work': 'View My Work',
    'hero.cta.contact': 'Get In Touch',
    'hero.download': 'Download Resume',
  },
  ar: {
    'nav.about': 'نبذة',
    'nav.experience': 'الخبرة',
    'nav.projects': 'المشاريع',
    'nav.graduation': 'مشروع التخرج',
    'nav.skills': 'المهارات',
    'nav.certifications': 'الشهادات',
    'nav.achievements': 'الإنجازات',
    'nav.timeline': 'المسار الزمني',
    'nav.contact': 'تواصل',
    'hero.tagline': 'خريج اللغة الإنجليزية والترجمة',
    'hero.cta.work': 'شاهد أعمالي',
    'hero.cta.contact': 'تواصل معي',
    'hero.download': 'تحميل السيرة الذاتية',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null;
    if (stored) setLocaleState(stored);
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('locale', l);
  };

  useEffect(() => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  const t = (key: string) => translations[locale][key] ?? key;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
