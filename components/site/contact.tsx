'use client';

import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from './language-provider';
import { getIcon } from '@/lib/supabase/icon-map';
import { submitContactMessage } from '@/lib/supabase/data';
import type { ContactInfo, SocialLink } from '@/lib/supabase/types';

interface ContactProps {
  contactInfo: ContactInfo | null;
  socialLinks: SocialLink[];
}

export function Contact({ contactInfo, socialLinks }: ContactProps) {
  const { locale } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const contactItems = contactInfo
    ? [
        { icon: Mail, label: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
        { icon: Phone, label: 'Phone', value: contactInfo.phone, href: `tel:${contactInfo.phone}` },
        { icon: MapPin, label: 'Location', value: locale === 'ar' ? contactInfo.location_ar : contactInfo.location_en, href: null },
        { icon: Linkedin, label: 'LinkedIn', value: contactInfo.linkedin_url?.replace('https://', '').replace('http://', '') || '', href: contactInfo.linkedin_url || null },
      ]
    : [
        { icon: Mail, label: 'Email', value: 'maaaar3y@gmail.com', href: 'mailto:maaaar3y@gmail.com' },
        { icon: Phone, label: 'Phone', value: '+20 100 479 3760', href: 'tel:+201004793760' },
        { icon: MapPin, label: 'Location', value: 'Kafr El-Sheikh, Egypt', href: null },
        { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/maaaar3y', href: 'https://linkedin.com/in/maaaar3y' },
      ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await submitContactMessage({
        name: form.name,
        email: form.email,
        subject: form.subject || 'No subject',
        message: form.message,
      });
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Let&apos;s build something <span className="text-gradient">together</span>
            </>
          }
          description="Open to roles in translation, career development, project coordination, and bilingual communication."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Contact info */}
          <Reveal>
            <div className="flex h-full flex-col gap-4">
              {contactItems.map((info) => {
                const Wrapper = info.href ? 'a' : 'div';
                return (
                  <Wrapper
                    key={info.label}
                    href={info.href ?? undefined}
                    target={info.href?.startsWith('http') ? '_blank' : undefined}
                    rel={info.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`card-glow glass flex items-center gap-4 rounded-2xl p-5 ${
                      info.href ? 'cursor-pointer' : ''
                    }`}
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <info.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">
                        {info.label}
                      </div>
                      <div className="text-sm font-medium text-foreground">{info.value}</div>
                    </div>
                  </Wrapper>
                );
              })}

              {/* Extra social links */}
              {socialLinks.filter((s) => !['linkedin', 'email', 'mail'].includes(s.platform.toLowerCase())).length > 0 && (
                <div className="card-glow glass flex items-center gap-3 rounded-2xl p-5">
                  {socialLinks.map((s) => {
                    const SIcon = getIcon(s.icon_name);
                    return (
                      <a
                        key={s.id}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label_en}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-border/50 bg-card/40 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary hover:-translate-y-0.5"
                      >
                        <SIcon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </Reveal>

          {/* Contact form */}
          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-6 sm:p-8">
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-card/60"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-card/60"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-card/60"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full resize-none rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/50 focus:bg-card/60"
                    placeholder="Tell me about the opportunity or project..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending' || status === 'sent'}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70"
                >
                  {status === 'idle' && (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                  {status === 'sending' && (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  )}
                  {status === 'sent' && (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Message Sent!
                    </>
                  )}
                  {status === 'error' && (
                    <>
                      <AlertCircle className="h-4 w-4" />
                      Failed to send
                    </>
                  )}
                </button>
                <AnimatePresence>
                  {status === 'sent' && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-sm text-success"
                    >
                      Thank you! I&apos;ll get back to you soon.
                    </motion.p>
                  )}
                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-sm text-destructive"
                    >
                      Something went wrong. Please try again or email directly.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
