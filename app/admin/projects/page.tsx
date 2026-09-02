'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, X, GripVertical, Eye, EyeOff, Star } from 'lucide-react';

export default function AdminProjectsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const supabase = createBrowserClient();

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('projects').select('*, media:project_media(*)').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const startCreate = () => {
    setFormData({ technologies: [], external_links: [], featured: false, published: true, sort_order: items.length });
    setCreating(true); setEditing(null);
  };

  const startEdit = (item: any) => {
    const { media: _m, created_at: _c, updated_at: _u, ...rest } = item;
    setFormData(rest); setEditing(item); setCreating(false);
  };

  const cancel = () => { setEditing(null); setCreating(false); setFormData({}); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        const { id, ...updates } = formData;
        const { error } = await supabase.from('projects').update(updates).eq('id', editing.id);
        if (error) throw error;
        toast.success('Updated');
      } else {
        const { error } = await supabase.from('projects').insert(formData);
        if (error) throw error;
        toast.success('Created');
      }
      cancel(); fetchItems();
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await supabase.from('projects').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null); toast.success('Deleted'); fetchItems();
  };

  const togglePublished = async (item: any) => {
    await supabase.from('projects').update({ published: !item.published }).eq('id', item.id);
    fetchItems();
  };

  const toggleFeatured = async (item: any) => {
    await supabase.from('projects').update({ featured: !item.featured }).eq('id', item.id);
    fetchItems();
  };

  const moveItem = async (item: any, dir: 'up' | 'down') => {
    const idx = items.findIndex((i) => i.id === item.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;
    const swap = items[swapIdx];
    await Promise.all([
      supabase.from('projects').update({ sort_order: item.sort_order }).eq('id', swap.id),
      supabase.from('projects').update({ sort_order: swap.sort_order }).eq('id', item.id),
    ]);
    fetchItems();
  };

  const fields = [
    { key: 'title_en', label: 'Title (EN)', required: true },
    { key: 'title_ar', label: 'Title (AR)', required: true },
    { key: 'category_en', label: 'Category (EN)' },
    { key: 'category_ar', label: 'Category (AR)' },
    { key: 'description_en', label: 'Description (EN)', full: true, area: true },
    { key: 'description_ar', label: 'Description (AR)', full: true, area: true },
    { key: 'technologies', label: 'Technologies (comma-separated)', full: true, array: true },
    { key: 'main_image_url', label: 'Main Image URL', full: true },
    { key: 'video_url', label: 'Video URL' },
    { key: 'live_url', label: 'Live URL' },
    { key: 'github_url', label: 'GitHub URL' },
    { key: 'start_date', label: 'Start Date' },
    { key: 'end_date', label: 'End Date' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold">Projects</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage portfolio projects.</p>
        </div>
        {!creating && !editing && (
          <button onClick={startCreate} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Plus className="h-4 w-4" /> Add New
          </button>
        )}
      </div>

      {(creating || editing) && (
        <div className="glass-strong rounded-2xl border border-primary/30 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">{editing ? 'Edit Project' : 'Create Project'}</h3>
            <button onClick={cancel} className="rounded-lg p-1.5 hover:bg-muted"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
                {f.area ? (
                  <textarea value={formData[f.key] ?? ''} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} rows={3}
                    className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
                ) : f.array ? (
                  <input type="text" value={Array.isArray(formData[f.key]) ? formData[f.key].join(', ') : ''} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })}
                    className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
                ) : (
                  <input type={f.key.includes('date') ? 'date' : 'text'} value={formData[f.key] ?? ''} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                    className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
                )}
              </div>
            ))}
            <div className="flex items-center gap-4 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={formData.featured ?? false} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={formData.published ?? true} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} />
                Published
              </label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-70">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} {editing ? 'Save Changes' : 'Create'}
            </button>
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
      ) : items.length === 0 ? (
        <div className="glass rounded-2xl border border-border/40 p-12 text-center">
          <p className="text-sm text-muted-foreground">No projects yet. Click "Add New" to create one.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.id} className="glass rounded-2xl border border-border/40 p-5">
              {item.main_image_url && (
                <img src={item.main_image_url} alt={item.title_en} className="mb-3 h-32 w-full rounded-lg object-cover" />
              )}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-serif text-base font-semibold">{item.title_en}</h3>
                  <p className="text-xs text-muted-foreground">{item.category_en}</p>
                </div>
                {item.featured && <Star className="h-4 w-4 text-accent" />}
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{item.description_en}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {item.technologies?.slice(0, 3).map((t: string) => (
                  <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px]">{t}</span>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-1 border-t border-border/30 pt-3">
                <button onClick={() => moveItem(item, 'up')} disabled={i === 0} className="rounded-lg p-1.5 hover:bg-muted disabled:opacity-30"><GripVertical className="h-3.5 w-3.5 rotate-180" /></button>
                <button onClick={() => moveItem(item, 'down')} disabled={i === items.length - 1} className="rounded-lg p-1.5 hover:bg-muted disabled:opacity-30"><GripVertical className="h-3.5 w-3.5" /></button>
                <button onClick={() => togglePublished(item)} className="rounded-lg p-1.5 hover:bg-muted">{item.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}</button>
                <button onClick={() => toggleFeatured(item)} className="rounded-lg p-1.5 hover:bg-muted">{item.featured ? <Star className="h-3.5 w-3.5 text-accent" /> : <Star className="h-3.5 w-3.5" />}</button>
                <button onClick={() => startEdit(item)} className="rounded-lg p-1.5 hover:bg-muted hover:text-primary"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => setDeleteTarget(item)} className="rounded-lg p-1.5 hover:bg-muted hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
