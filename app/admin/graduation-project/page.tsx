'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Save, Plus, Trash2, X } from 'lucide-react';

export default function AdminGraduationProjectPage() {
  const [gp, setGp] = useState<any>(null);
  const [phases, setPhases] = useState<any[]>([]);
  const [fragrances, setFragrances] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createBrowserClient();

  useEffect(() => {
    (async () => {
      const [{ data: g }, { data: p }, { data: f }, { data: s }] = await Promise.all([
        supabase.from('graduation_project').select('*').eq('id', 1).maybeSingle(),
        supabase.from('grad_project_phases').select('*').order('sort_order'),
        supabase.from('grad_project_fragrances').select('*').order('sort_order'),
        supabase.from('grad_project_stats').select('*').order('sort_order'),
      ]);
      setGp(g); setPhases(p ?? []); setFragrances(f ?? []); setStats(s ?? []);
      setLoading(false);
    })();
  }, []);

  const saveGp = async () => {
    setSaving(true);
    const { error } = await supabase.from('graduation_project').update({
      eyebrow_en: gp.eyebrow_en, eyebrow_ar: gp.eyebrow_ar,
      title_en: gp.title_en, title_ar: gp.title_ar,
      description_en: gp.description_en, description_ar: gp.description_ar,
      overview_en: gp.overview_en, overview_ar: gp.overview_ar,
      team_info_en: gp.team_info_en, team_info_ar: gp.team_info_ar,
      technologies: gp.technologies,
      featured: gp.featured, published: gp.published,
    }).eq('id', 1);
    if (error) toast.error('Failed to save');
    else toast.success('Graduation project saved');
    setSaving(false);
  };

  const savePhase = async (phase: any) => {
    const { error } = await supabase.from('grad_project_phases').update({
      icon_name: phase.icon_name, title_en: phase.title_en, title_ar: phase.title_ar,
      description_en: phase.description_en, description_ar: phase.description_ar, published: phase.published,
    }).eq('id', phase.id);
    if (error) toast.error('Failed'); else toast.success('Phase saved');
  };

  const addPhase = async () => {
    const { data, error } = await supabase.from('grad_project_phases').insert({
      icon_name: 'FlaskConical', title_en: 'New Phase', title_ar: 'مرحلة جديدة',
      description_en: 'Description', description_ar: 'وصف', sort_order: phases.length, published: true,
    }).select().single();
    if (!error && data) { setPhases([...phases, data]); toast.success('Phase added'); }
  };

  const deletePhase = async (id: string) => {
    await supabase.from('grad_project_phases').delete().eq('id', id);
    setPhases(phases.filter((p) => p.id !== id)); toast.success('Deleted');
  };

  const saveFragrance = async (f: any) => {
    const { error } = await supabase.from('grad_project_fragrances').update({
      name_en: f.name_en, name_ar: f.name_ar, culture_en: f.culture_en, culture_ar: f.culture_ar,
      note_en: f.note_en, note_ar: f.note_ar,
    }).eq('id', f.id);
    if (error) toast.error('Failed'); else toast.success('Fragrance saved');
  };

  const addFragrance = async () => {
    const { data, error } = await supabase.from('grad_project_fragrances').insert({
      name_en: 'New', name_ar: 'جديد', culture_en: 'Culture', culture_ar: 'ثقافة',
      note_en: 'Note', note_ar: 'ملاحظة', sort_order: fragrances.length,
    }).select().single();
    if (!error && data) { setFragrances([...fragrances, data]); toast.success('Added'); }
  };

  const deleteFragrance = async (id: string) => {
    await supabase.from('grad_project_fragrances').delete().eq('id', id);
    setFragrances(fragrances.filter((f) => f.id !== id)); toast.success('Deleted');
  };

  const saveStat = async (s: any) => {
    const { error } = await supabase.from('grad_project_stats').update({
      value: s.value, label_en: s.label_en, label_ar: s.label_ar,
    }).eq('id', s.id);
    if (error) toast.error('Failed'); else toast.success('Stat saved');
  };

  const addStat = async () => {
    const { data, error } = await supabase.from('grad_project_stats').insert({
      value: 0, label_en: 'New', label_ar: 'جديد', sort_order: stats.length,
    }).select().single();
    if (!error && data) { setStats([...stats, data]); toast.success('Added'); }
  };

  const deleteStat = async (id: string) => {
    await supabase.from('grad_project_stats').delete().eq('id', id);
    setStats(stats.filter((s) => s.id !== id)); toast.success('Deleted');
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const gpFields = [
    { key: 'eyebrow_en', label: 'Eyebrow (EN)' },
    { key: 'eyebrow_ar', label: 'Eyebrow (AR)' },
    { key: 'title_en', label: 'Title (EN)', full: true },
    { key: 'title_ar', label: 'Title (AR)', full: true },
    { key: 'description_en', label: 'Description (EN)', full: true, area: true },
    { key: 'description_ar', label: 'Description (AR)', full: true, area: true },
    { key: 'overview_en', label: 'Overview (EN)', full: true, area: true },
    { key: 'overview_ar', label: 'Overview (AR)', full: true, area: true },
    { key: 'team_info_en', label: 'Team Info (EN)' },
    { key: 'team_info_ar', label: 'Team Info (AR)' },
    { key: 'technologies', label: 'Technologies (comma-separated)', full: true, array: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Graduation Project</h2>
        <p className="mt-1 text-sm text-muted-foreground">Edit the graduation project case study.</p>
      </div>

      <div className="glass rounded-2xl border border-border/40 p-6">
        <h3 className="mb-4 font-serif text-lg font-semibold">Main Content</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {gpFields.map((f) => (
            <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
              <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
              {f.area ? (
                <textarea value={gp?.[f.key] ?? ''} onChange={(e) => setGp({ ...gp, [f.key]: e.target.value })} rows={3}
                  className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
              ) : f.array ? (
                <input type="text" value={Array.isArray(gp?.[f.key]) ? gp[f.key].join(', ') : ''} onChange={(e) => setGp({ ...gp, [f.key]: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                  className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
              ) : (
                <input type="text" value={gp?.[f.key] ?? ''} onChange={(e) => setGp({ ...gp, [f.key]: e.target.value })}
                  className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
              )}
            </div>
          ))}
          <div className="flex items-center gap-4 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={gp?.featured ?? true} onChange={(e) => setGp({ ...gp, featured: e.target.checked })} /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={gp?.published ?? true} onChange={(e) => setGp({ ...gp, published: e.target.checked })} /> Published
            </label>
          </div>
        </div>
        <button onClick={saveGp} disabled={saving} className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-70">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
        </button>
      </div>

      {/* Phases */}
      <div className="glass rounded-2xl border border-border/40 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">Phases</h3>
          <button onClick={addPhase} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4" /> Add Phase</button>
        </div>
        <div className="space-y-3">
          {phases.map((p, i) => (
            <div key={p.id} className="grid grid-cols-2 gap-3 rounded-xl border border-border/30 p-4 sm:grid-cols-5">
              <input type="text" value={p.icon_name} onChange={(e) => { const n = [...phases]; n[i] = { ...p, icon_name: e.target.value }; setPhases(n); }} placeholder="Icon" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
              <input type="text" value={p.title_en} onChange={(e) => { const n = [...phases]; n[i] = { ...p, title_en: e.target.value }; setPhases(n); }} placeholder="Title (EN)" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
              <input type="text" value={p.title_ar} onChange={(e) => { const n = [...phases]; n[i] = { ...p, title_ar: e.target.value }; setPhases(n); }} placeholder="Title (AR)" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
              <input type="text" value={p.description_en} onChange={(e) => { const n = [...phases]; n[i] = { ...p, description_en: e.target.value }; setPhases(n); }} placeholder="Desc (EN)" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
              <div className="flex items-end gap-2">
                <button onClick={() => savePhase(p)} className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Save</button>
                <button onClick={() => deletePhase(p.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fragrances */}
      <div className="glass rounded-2xl border border-border/40 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">Fragrances</h3>
          <button onClick={addFragrance} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4" /> Add Fragrance</button>
        </div>
        <div className="space-y-3">
          {fragrances.map((f, i) => (
            <div key={f.id} className="grid grid-cols-2 gap-3 rounded-xl border border-border/30 p-4 sm:grid-cols-6">
              <input type="text" value={f.name_en} onChange={(e) => { const n = [...fragrances]; n[i] = { ...f, name_en: e.target.value }; setFragrances(n); }} placeholder="Name (EN)" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
              <input type="text" value={f.name_ar} onChange={(e) => { const n = [...fragrances]; n[i] = { ...f, name_ar: e.target.value }; setFragrances(n); }} placeholder="Name (AR)" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
              <input type="text" value={f.culture_en} onChange={(e) => { const n = [...fragrances]; n[i] = { ...f, culture_en: e.target.value }; setFragrances(n); }} placeholder="Culture (EN)" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
              <input type="text" value={f.culture_ar} onChange={(e) => { const n = [...fragrances]; n[i] = { ...f, culture_ar: e.target.value }; setFragrances(n); }} placeholder="Culture (AR)" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
              <input type="text" value={f.note_en} onChange={(e) => { const n = [...fragrances]; n[i] = { ...f, note_en: e.target.value }; setFragrances(n); }} placeholder="Note (EN)" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
              <div className="flex items-end gap-2">
                <button onClick={() => saveFragrance(f)} className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Save</button>
                <button onClick={() => deleteFragrance(f.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="glass rounded-2xl border border-border/40 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-lg font-semibold">Stats</h3>
          <button onClick={addStat} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4" /> Add Stat</button>
        </div>
        <div className="space-y-3">
          {stats.map((s, i) => (
            <div key={s.id} className="grid grid-cols-2 gap-3 rounded-xl border border-border/30 p-4 sm:grid-cols-4">
              <input type="number" value={s.value} onChange={(e) => { const n = [...stats]; n[i] = { ...s, value: Number(e.target.value) }; setStats(n); }} placeholder="Value" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
              <input type="text" value={s.label_en} onChange={(e) => { const n = [...stats]; n[i] = { ...s, label_en: e.target.value }; setStats(n); }} placeholder="Label (EN)" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
              <input type="text" value={s.label_ar} onChange={(e) => { const n = [...stats]; n[i] = { ...s, label_ar: e.target.value }; setStats(n); }} placeholder="Label (AR)" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
              <div className="flex items-end gap-2">
                <button onClick={() => saveStat(s)} className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Save</button>
                <button onClick={() => deleteStat(s.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
