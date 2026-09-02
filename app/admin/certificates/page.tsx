'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, X, GripVertical, Eye, EyeOff, Star } from 'lucide-react';

export default function AdminCertificatesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [highlights, setHighlights] = useState<any[]>([]);
  const [highlightText, setHighlightText] = useState({ en: '', ar: '' });
  const supabase = createBrowserClient();

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('certificates').select('*, highlights:certificate_highlights(*)').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const startCreate = () => {
    setFormData({ tags: [], featured: false, published: true, sort_order: items.length });
    setCreating(true); setEditing(null); setHighlights([]);
  };

  const startEdit = (item: any) => {
    const { highlights: _h, created_at: _c, updated_at: _u, ...rest } = item;
    setFormData(rest); setEditing(item); setCreating(false); setHighlights(item.highlights ?? []);
  };

  const cancel = () => { setEditing(null); setCreating(false); setFormData({}); setHighlights([]); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        const { id, highlights: _h, created_at: _c, updated_at: _u, ...updates } = formData;
        const { error } = await supabase.from('certificates').update(updates).eq('id', editing.id);
        if (error) throw error;
        await saveHighlights(editing.id);
        toast.success('Updated');
      } else {
        const { data, error } = await supabase.from('certificates').insert(formData).select('id').single();
        if (error) throw error;
        await saveHighlights(data.id);
        toast.success('Created');
      }
      cancel(); fetchItems();
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  const saveHighlights = async (certId: string) => {
    await supabase.from('certificate_highlights').delete().eq('certificate_id', certId);
    if (highlights.length > 0) {
      await supabase.from('certificate_highlights').insert(
        highlights.map((h, i) => ({
          certificate_id: certId,
          text_en: h.text_en,
          text_ar: h.text_ar || h.text_en,
          sort_order: i,
        }))
      );
    }
  };

  const addHighlight = () => {
    if (!highlightText.en) return;
    setHighlights([...highlights, { text_en: highlightText.en, text_ar: highlightText.ar || highlightText.en }]);
    setHighlightText({ en: '', ar: '' });
  };

  const removeHighlight = (i: number) => setHighlights(highlights.filter((_, idx) => idx !== i));

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('certificates').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null); toast.success('Deleted'); fetchItems();
  };

  const togglePublished = async (item: any) => {
    await supabase.from('certificates').update({ published: !item.published }).eq('id', item.id); fetchItems();
  };

  const toggleFeatured = async (item: any) => {
    await supabase.from('certificates').update({ featured: !item.featured }).eq('id', item.id); fetchItems();
  };

  const moveItem = async (item: any, dir: 'up' | 'down') => {
    const idx = items.findIndex((i) => i.id === item.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const swap = items[swapIdx];
    await Promise.all([
      supabase.from('certificates').update({ sort_order: item.sort_order }).eq('id', swap.id),
      supabase.from('certificates').update({ sort_order: swap.sort_order }).eq('id', item.id),
    ]);
    fetchItems();
  };

  const fields = [
    { key: 'title_en', label: 'Title (EN)', required: true },
    { key: 'title_ar', label: 'Title (AR)', required: true },
    { key: 'issuer_en', label: 'Issuer (EN)', required: true },
    { key: 'issuer_ar', label: 'Issuer (AR)', required: true },
    { key: 'date_en', label: 'Date (EN)' },
    { key: 'date_ar', label: 'Date (AR)' },
    { key: 'hours_en', label: 'Hours (EN)' },
    { key: 'hours_ar', label: 'Hours (AR)' },
    { key: 'credential_id', label: 'Credential ID' },
    { key: 'serial_no', label: 'Serial No.' },
    { key: 'description_en', label: 'Description (EN)', full: true, area: true },
    { key: 'description_ar', label: 'Description (AR)', full: true, area: true },
    { key: 'image_url', label: 'Image URL', full: true },
    { key: 'pdf_url', label: 'PDF URL', full: true },
    { key: 'verification_url', label: 'Verification URL', full: true },
    { key: 'tags', label: 'Tags (comma-separated)', full: true, array: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold">Certificates</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage certificates and training.</p>
        </div>
        {!creating && !editing && (
          <button onClick={startCreate} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"><Plus className="h-4 w-4" /> Add New</button>
        )}
      </div>

      {(creating || editing) && (
        <div className="glass-strong rounded-2xl border border-primary/30 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">{editing ? 'Edit Certificate' : 'Create Certificate'}</h3>
            <button onClick={cancel} className="rounded-lg p-1.5 hover:bg-muted"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
                {f.area ? (
                  <textarea value={formData[f.key] ?? ''} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} rows={3} className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
                ) : f.array ? (
                  <input type="text" value={Array.isArray(formData[f.key]) ? formData[f.key].join(', ') : ''} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
                ) : (
                  <input type="text" value={formData[f.key] ?? ''} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
                )}
              </div>
            ))}
            <div className="flex items-center gap-4 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.featured ?? false} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} /> Featured</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.published ?? true} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} /> Published</label>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="mb-2 text-sm font-semibold">Highlights</h4>
            <div className="space-y-2">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg border border-border/30 p-3">
                  <input type="text" value={h.text_en} onChange={(e) => { const n = [...highlights]; n[i] = { ...h, text_en: e.target.value }; setHighlights(n); }} placeholder="Highlight (EN)" className="flex-1 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
                  <input type="text" value={h.text_ar} onChange={(e) => { const n = [...highlights]; n[i] = { ...h, text_ar: e.target.value }; setHighlights(n); }} placeholder="Highlight (AR)" className="flex-1 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
                  <button onClick={() => removeHighlight(i)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><X className="h-4 w-4" /></button>
                </div>
              ))}
              <div className="flex items-start gap-2">
                <input type="text" value={highlightText.en} onChange={(e) => setHighlightText({ ...highlightText, en: e.target.value })} placeholder="New highlight (EN)" className="flex-1 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
                <input type="text" value={highlightText.ar} onChange={(e) => setHighlightText({ ...highlightText, ar: e.target.value })} placeholder="New highlight (AR)" className="flex-1 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
                <button onClick={addHighlight} className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground"><Plus className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-70">{saving && <Loader2 className="h-4 w-4 animate-spin" />} {editing ? 'Save Changes' : 'Create'}</button>
            <button onClick={cancel} className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="glass-strong rounded-2xl border border-destructive/30 p-6 shadow-2xl">
            <h3 className="mb-2 font-serif text-lg font-semibold">Confirm Delete</h3>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="rounded-xl bg-destructive px-6 py-2.5 text-sm font-medium text-destructive-foreground">Delete</button>
              <button onClick={() => setDeleteTarget(null)} className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="glass rounded-2xl border border-border/40 p-5">
              <div className="flex items-start justify-between pr-32">
                <div>
                  <h3 className="font-serif text-lg font-semibold">{item.title_en}</h3>
                  <p className="text-sm text-muted-foreground">{item.issuer_en}</p>
                  <p className="text-xs text-muted-foreground">{item.date_en} {item.hours_en ? `· ${item.hours_en}` : ''}</p>
                </div>
              </div>
              <div className="absolute right-3 top-3 flex items-center gap-1">
                <button onClick={() => moveItem(item, 'up')} disabled={i === 0} className="rounded-lg p-1.5 hover:bg-muted disabled:opacity-30"><GripVertical className="h-4 w-4 rotate-180" /></button>
                <button onClick={() => moveItem(item, 'down')} disabled={i === items.length - 1} className="rounded-lg p-1.5 hover:bg-muted disabled:opacity-30"><GripVertical className="h-4 w-4" /></button>
                <button onClick={() => togglePublished(item)} className="rounded-lg p-1.5 hover:bg-muted">{item.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
                <button onClick={() => toggleFeatured(item)} className="rounded-lg p-1.5 hover:bg-muted">{item.featured ? <Star className="h-4 w-4 text-accent" /> : <Star className="h-4 w-4" />}</button>
                <button onClick={() => startEdit(item)} className="rounded-lg p-1.5 hover:bg-muted hover:text-primary"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteTarget(item)} className="rounded-lg p-1.5 hover:bg-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
