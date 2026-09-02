'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, Download, Mail, Linkedin, Github, Sparkles } from 'lucide-react';
import { useLanguage } from './language-provider';

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: {
      transition: {
        delayChildren: reduce ? 0 : 0.3,
        staggerChildren: reduce ? 0 : 0.12,
      },
    },
  };

  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20"
    >
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="section-shell relative z-10 flex flex-col items-center text-center"
      >
        {/* Badge */}
        <motion.div variants={item}>
          <div className="glass mb-8 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-muted-foreground">Available for opportunities</span>
          </div>
        </motion.div>

        {/* Name */}
        <motion.h1
          variants={item}
          className="font-serif text-5xl font-bold tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Youssef M.{' '}
          <span className="text-gradient">Marey</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty sm:text-xl"
        >
          {t('hero.tagline')} — career development specialist, bilingual project
          coordinator, and monitoring &amp; evaluation practitioner from Kafr
          El-Sheikh, Egypt.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <button
            onClick={() =>
              document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group relative flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" />
            {t('hero.cta.work')}
          </button>
          <button
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-7 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:-translate-y-0.5"
          >
            <Mail className="h-4 w-4" />
            {t('hero.cta.contact')}
          </button>
        </motion.div>

        {/* Social links */}
        <motion.div variants={item} className="mt-8 flex items-center gap-3">
          {[
            { icon: Linkedin, href: 'https://linkedin.com/in/maaaar3y', label: 'LinkedIn' },
            { icon: Github, href: 'https://github.com/maaaar3y', label: 'GitHub' },
            { icon: Mail, href: 'mailto:maaaar3y@gmail.com', label: 'Email' },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card/40 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary hover:-translate-y-0.5"
            >
              <social.icon className="h-4 w-4" />
            </a>
          ))}
        </motion.div>

        {/* Stats strip */}
        <motion.div
          variants={item}
          className="mt-16 grid w-full max-w-2xl grid-cols-3 gap-4"
        >
          {[
            { value: '3.61', label: 'GPA / 4.00', suffix: '' },
            { value: '70', label: 'Training Programs', suffix: '+' },
            { value: '1000', label: 'Event Participants', suffix: '+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                {stat.value}
                <span className="text-primary">{stat.suffix}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <div className="flex h-9 w-5 justify-center rounded-full border border-border/60 pt-1.5">
            <motion.div
              animate={reduce ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="h-1.5 w-1 rounded-full bg-primary"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
