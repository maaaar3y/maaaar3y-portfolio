'use client';

import { Languages } from 'lucide-react';
import { useLanguage } from './language-provider';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-border/60 bg-card/50 px-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
        aria-label="Change language"
      >
        <Languages className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="glass-strong absolute right-0 mt-2 w-32 overflow-hidden rounded-xl border border-border/40 shadow-xl"
          >
            <button
              onClick={() => {
                setLocale('en');
                setOpen(false);
              }}
              className={`flex w-full items-center px-3 py-2 text-sm transition-colors hover:bg-primary/5 ${
                locale === 'en' ? 'text-primary font-medium' : 'text-foreground'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                setLocale('ar');
                setOpen(false);
              }}
              className={`flex w-full items-center px-3 py-2 text-sm transition-colors hover:bg-primary/5 ${
                locale === 'ar' ? 'text-primary font-medium' : 'text-foreground'
              }`}
            >
              العربية
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
