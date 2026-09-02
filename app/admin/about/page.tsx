'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';

export default function AdminAboutPage() {
  const [about, setAbout] = useState<any>(null);
  const [values, setValues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient();
    (async () => {
      const [{ data: a }, { data: v }] = await Promise.all([
        supabase.from('about_content').select('*').eq('id', 1).maybeSingle(),
        supabase.from('about_values').select('*').order('sort_order'),
      ]);
      setAbout(a);
      setValues(v ?? []);
      setLoading(false);
    })();
  }, []);

  const saveAbout = async () => {
    setSaving(true);
    const supabase = createBrowserClient();
    const { error } = await supabase.from('about_content').update({
      eyebrow_en: about.eyebrow_en,
      eyebrow_ar: about.eyebrow_ar,
      title_en: about.title_en,
      title_ar: about.title_ar,
      description_en: about.description_en,
      description_ar: about.description_ar,
      summary_en: about.summary_en,
      summary_ar: about.summary_ar,
      summary_detail_en: about.summary_detail_en,
      summary_detail_ar: about.summary_detail_ar,
      mission_en: about.mission_en,
      mission_ar: about.mission_ar,
      vision_en: about.vision_en,
      vision_ar: about.vision_ar,
      philosophy_en: about.philosophy_en,
      philosophy_ar: about.philosophy_ar,
      image_url: about.image_url,
    }).eq('id', 1);
    if (error) toast.error('Failed to save');
    else toast.success('About content saved');
    setSaving(false);
  };

  const saveValue = async (val: any) => {
    const supabase = createBrowserClient();
    const { error } = await supabase.from('about_values').update({
      icon_name: val.icon_name,
      title_en: val.title_en,
      title_ar: val.title_ar,
      description_en: val.description_en,
      description_ar: val.description_ar,
      published: val.published,
    }).eq('id', val.id);
    if (error) toast.error('Failed to save');
    else toast.success('Value saved');
  };

  const addValue = async () => {
    const supabase = createBrowserClient();
    const { data, error } = await supabase.from('about_values').insert({
      icon_name: 'BookOpen',
      title_en: 'New Value',
      title_ar: 'قيمة جديدة',
      description_en: 'Description',
      description_ar: 'وصف',
      sort_order: values.length,
      published: true,
    }).select().single();
    if (!error && data) {
      setValues([...values, data]);
      toast.success('Value added');
    }
  };

  const deleteValue = async (id: string) => {
    const supabase = createBrowserClient();
    await supabase.from('about_values').delete().eq('id', id);
    setValues(values.filter((v) => v.id !== id));
    toast.success('Value deleted');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const fields = [
    { key: 'eyebrow_en', label: 'Eyebrow (EN)' },
    { key: 'eyebrow_ar', label: 'Eyebrow (AR)' },
    { key: 'title_en', label: 'Title (EN)', full: true },
    { key: 'title_ar', label: 'Title (AR)', full: true },
    { key: 'description_en', label: 'Description (EN)', full: true },
    { key: 'description_ar', label: 'Description (AR)', full: true },
    { key: 'summary_en', label: 'Summary (EN)', full: true, area: true },
    { key: 'summary_ar', label: 'Summary (AR)', full: true, area: true },
    { key: 'summary_detail_en', label: 'Summary Detail (EN)', full: true, area: true },
    { key: 'summary_detail_ar', label: 'Summary Detail (AR)', full: true, area: true },
    { key: 'mission_en', label: 'Mission (EN)', full: true, area: true },
    { key: 'mission_ar', label: 'Mission (AR)', full: true, area: true },
    { key: 'vision_en', label: 'Vision (EN)', full: true, area: true },
    { key: 'vision_ar', label: 'Vision (AR)', full: true, area: true },
    { key: 'philosophy_en', label: 'Philosophy (EN)', full: true, area: true },
    { key: 'philosophy_ar', label: 'Philosophy (AR)', full: true, area: true },
    { key: 'image_url', label: 'Image URL', full: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">About Section</h2>
        <p className="mt-1 text-sm text-muted-foreground">Edit the about section content and core values.</p>
      </div>

      <div className="glass rounded-2xl border border-border/40 p-6">
        <h3 className="mb-4 font-serif text-lg font-semibold">About Content</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
              <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
              {f.area ? (
                <textarea
                  value={about?.[f.key] ?? ''}
                  onChange={(e) => setAbout({ ...about, [f.key]: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                />
              ) : (
                <input
                  type="text"
                  value={about?.[f.key] ?? ''}
                  onChange={(e) => setAbout({ ...about, [f.key]: e.target.value })}
                  className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                />
              )}
            </div>
          ))}
        </div>
        <button
          onClick={saveAbout}
          disabled={saving}
          className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-70"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save About
        </button>
      </div>

      <div className="glass rounded-2xl border border-border/40 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">Core Values</h3>
          <button
            onClick={addValue}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <Plus className="h-4 w-4" /> Add Value
          </button>
        </div>
        <div className="space-y-3">
          {values.map((val, i) => (
            <div key={val.id} className="grid grid-cols-2 gap-3 rounded-xl border border-border/30 p-4 sm:grid-cols-5">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Icon (Lucide)</label>
                <input
                  type="text"
                  value={val.icon_name}
                  onChange={(e) => { const n = [...values]; n[i] = { ...val, icon_name: e.target.value }; setValues(n); }}
                  className="w-full rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Title (EN)</label>
                <input
                  type="text"
                  value={val.title_en}
                  onChange={(e) => { const n = [...values]; n[i] = { ...val, title_en: e.target.value }; setValues(n); }}
                  className="w-full rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Title (AR)</label>
                <input
                  type="text"
                  value={val.title_ar}
                  onChange={(e) => { const n = [...values]; n[i] = { ...val, title_ar: e.target.value }; setValues(n); }}
                  className="w-full rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Description (EN)</label>
                <input
                  type="text"
                  value={val.description_en}
                  onChange={(e) => { const n = [...values]; n[i] = { ...val, description_en: e.target.value }; setValues(n); }}
                  className="w-full rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div className="flex items-end gap-2">
                <button onClick={() => saveValue(val)} className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">Save</button>
                <button onClick={() => deleteValue(val.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
