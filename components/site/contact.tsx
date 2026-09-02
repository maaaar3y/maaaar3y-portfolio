'use client';

import { Reveal } from '@/components/motion/reveal';
import { SectionHeading } from './section-heading';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Send, CheckCircle2, Loader2 } from 'lucide-react';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'maaaar3y@gmail.com', href: 'mailto:maaaar3y@gmail.com' },
  { icon: Phone, label: 'Phone', value: '+20 100 479 3760', href: 'tel:+201004793760' },
  { icon: MapPin, label: 'Location', value: 'Kafr El-Sheikh, Egypt', href: null },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/maaaar3y', href: 'https://linkedin.com/in/maaaar3y' },
];

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Phase 2: wire to Supabase contact_messages table
    await new Promise((r) => setTimeout(r, 1200));
    setStatus('sent');
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setStatus('idle'), 4000);
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
              {contactInfo.map((info) => {
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
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
