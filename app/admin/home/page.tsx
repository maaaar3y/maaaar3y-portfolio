'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export default function AdminHomePagePage() {
  const [hero, setHero] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [navItems, setNavItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient();
    (async () => {
      const [{ data: h }, { data: s }, { data: n }] = await Promise.all([
        supabase.from('hero_content').select('*').eq('id', 1).maybeSingle(),
        supabase.from('hero_stats').select('*').order('sort_order'),
        supabase.from('navigation_items').select('*').order('sort_order'),
      ]);
      setHero(h);
      setStats(s ?? []);
      setNavItems(n ?? []);
      setLoading(false);
    })();
  }, []);

  const saveHero = async () => {
    setSaving(true);
    const supabase = createBrowserClient();
    const { error } = await supabase.from('hero_content').update({
      badge_text_en: hero.badge_text_en,
      badge_text_ar: hero.badge_text_ar,
      title_en: hero.title_en,
      title_ar: hero.title_ar,
      subtitle_en: hero.subtitle_en,
      subtitle_ar: hero.subtitle_ar,
      description_en: hero.description_en,
      description_ar: hero.description_ar,
      cta_work_en: hero.cta_work_en,
      cta_work_ar: hero.cta_work_ar,
      cta_contact_en: hero.cta_contact_en,
      cta_contact_ar: hero.cta_contact_ar,
    }).eq('id', 1);
    if (error) toast.error('Failed to save');
    else toast.success('Hero content saved');
    setSaving(false);
  };

  const saveStat = async (stat: any) => {
    const supabase = createBrowserClient();
    const { error } = await supabase.from('hero_stats').update({
      value: stat.value,
      suffix: stat.suffix,
      label_en: stat.label_en,
      label_ar: stat.label_ar,
      published: stat.published,
    }).eq('id', stat.id);
    if (error) toast.error('Failed to save stat');
    else toast.success('Stat saved');
  };

  const saveNavItem = async (item: any) => {
    const supabase = createBrowserClient();
    const { error } = await supabase.from('navigation_items').update({
      label_en: item.label_en,
      label_ar: item.label_ar,
      section_id: item.section_id,
      published: item.published,
    }).eq('id', item.id);
    if (error) toast.error('Failed to save');
    else toast.success('Navigation item saved');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Homepage Content</h2>
        <p className="mt-1 text-sm text-muted-foreground">Edit the hero section, stats, and navigation.</p>
      </div>

      {/* Hero content */}
      <div className="glass rounded-2xl border border-border/40 p-6">
        <h3 className="mb-4 font-serif text-lg font-semibold">Hero Section</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { key: 'badge_text_en', label: 'Badge Text (EN)' },
            { key: 'badge_text_ar', label: 'Badge Text (AR)' },
            { key: 'title_en', label: 'Title (EN)' },
            { key: 'title_ar', label: 'Title (AR)' },
            { key: 'subtitle_en', label: 'Subtitle (EN)' },
            { key: 'subtitle_ar', label: 'Subtitle (AR)' },
            { key: 'description_en', label: 'Description (EN)', full: true },
            { key: 'description_ar', label: 'Description (AR)', full: true },
            { key: 'cta_work_en', label: 'CTA Work Button (EN)' },
            { key: 'cta_work_ar', label: 'CTA Work Button (AR)' },
            { key: 'cta_contact_en', label: 'CTA Contact Button (EN)' },
            { key: 'cta_contact_ar', label: 'CTA Contact Button (AR)' },
          ].map((f) => (
            <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
              <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
              <input
                type="text"
                value={hero?.[f.key] ?? ''}
                onChange={(e) => setHero({ ...hero, [f.key]: e.target.value })}
                className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
              />
            </div>
          ))}
        </div>
        <button
          onClick={saveHero}
          disabled={saving}
          className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-70"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Hero
        </button>
      </div>

      {/* Hero stats */}
      <div className="glass rounded-2xl border border-border/40 p-6">
        <h3 className="mb-4 font-serif text-lg font-semibold">Hero Stats</h3>
        <div className="space-y-3">
          {stats.map((stat, i) => (
            <div key={stat.id} className="grid grid-cols-2 gap-3 rounded-xl border border-border/30 p-4 sm:grid-cols-5">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Value</label>
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => { const n = [...stats]; n[i] = { ...stat, value: e.target.value }; setStats(n); }}
                  className="w-full rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Suffix</label>
                <input
                  type="text"
                  value={stat.suffix}
                  onChange={(e) => { const n = [...stats]; n[i] = { ...stat, suffix: e.target.value }; setStats(n); }}
                  className="w-full rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Label (EN)</label>
                <input
                  type="text"
                  value={stat.label_en}
                  onChange={(e) => { const n = [...stats]; n[i] = { ...stat, label_en: e.target.value }; setStats(n); }}
                  className="w-full rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Label (AR)</label>
                <input
                  type="text"
                  value={stat.label_ar}
                  onChange={(e) => { const n = [...stats]; n[i] = { ...stat, label_ar: e.target.value }; setStats(n); }}
                  className="w-full rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <button
                onClick={() => saveStat(stat)}
                className="self-end rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="glass rounded-2xl border border-border/40 p-6">
        <h3 className="mb-4 font-serif text-lg font-semibold">Navigation Items</h3>
        <div className="space-y-3">
          {navItems.map((item, i) => (
            <div key={item.id} className="grid grid-cols-2 gap-3 rounded-xl border border-border/30 p-4 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Label (EN)</label>
                <input
                  type="text"
                  value={item.label_en}
                  onChange={(e) => { const n = [...navItems]; n[i] = { ...item, label_en: e.target.value }; setNavItems(n); }}
                  className="w-full rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Label (AR)</label>
                <input
                  type="text"
                  value={item.label_ar}
                  onChange={(e) => { const n = [...navItems]; n[i] = { ...item, label_ar: e.target.value }; setNavItems(n); }}
                  className="w-full rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Section ID</label>
                <input
                  type="text"
                  value={item.section_id}
                  onChange={(e) => { const n = [...navItems]; n[i] = { ...item, section_id: e.target.value }; setNavItems(n); }}
                  className="w-full rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <button
                onClick={() => saveNavItem(item)}
                className="self-end rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"
              >
                Save
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
