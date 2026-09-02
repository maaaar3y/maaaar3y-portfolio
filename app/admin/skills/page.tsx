'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, X, GripVertical, Eye, EyeOff } from 'lucide-react';

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [creatingCat, setCreatingCat] = useState(false);
  const [catForm, setCatForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [skillForm, setSkillForm] = useState<any>({});
  const [addingSkillTo, setAddingSkillTo] = useState<string | null>(null);
  const supabase = createBrowserClient();

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from('skill_categories').select('*, skills(*)').order('sort_order');
    setCategories(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchCategories(); }, []);

  const startCreateCat = () => { setCatForm({ icon_name: 'BarChart3', sort_order: categories.length, published: true }); setCreatingCat(true); setEditingCat(null); };
  const startEditCat = (cat: any) => { const { skills: _s, ...rest } = cat; setCatForm(rest); setEditingCat(cat); setCreatingCat(false); };
  const cancelCat = () => { setEditingCat(null); setCreatingCat(false); setCatForm({}); };

  const saveCat = async () => {
    setSaving(true);
    try {
      if (editingCat) {
        const { error } = await supabase.from('skill_categories').update(catForm).eq('id', editingCat.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('skill_categories').insert(catForm);
        if (error) throw error;
      }
      toast.success('Saved');
      cancelCat();
      fetchCategories();
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  const deleteCat = async () => {
    if (!deleteTarget) return;
    await supabase.from('skill_categories').delete().eq('id', deleteTarget.id);
    setDeleteTarget(null);
    toast.success('Deleted');
    fetchCategories();
  };

  const addSkill = async (catId: string) => {
    if (!skillForm.name_en) return;
    const { error } = await supabase.from('skills').insert({
      category_id: catId,
      name_en: skillForm.name_en,
      name_ar: skillForm.name_ar || skillForm.name_en,
      level: skillForm.level || 80,
      description_en: skillForm.description_en || '',
      description_ar: skillForm.description_ar || '',
      sort_order: categories.find((c) => c.id === catId)?.skills?.length ?? 0,
    });
    if (error) toast.error('Failed to add skill');
    else { toast.success('Skill added'); setSkillForm({}); setAddingSkillTo(null); fetchCategories(); }
  };

  const deleteSkill = async (skillId: string) => {
    await supabase.from('skills').delete().eq('id', skillId);
    toast.success('Skill deleted');
    fetchCategories();
  };

  const moveCat = async (cat: any, dir: 'up' | 'down') => {
    const idx = categories.findIndex((c) => c.id === cat.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= categories.length) return;
    const swap = categories[swapIdx];
    await Promise.all([
      supabase.from('skill_categories').update({ sort_order: cat.sort_order }).eq('id', swap.id),
      supabase.from('skill_categories').update({ sort_order: swap.sort_order }).eq('id', cat.id),
    ]);
    fetchCategories();
  };

  const toggleCatPublished = async (cat: any) => {
    await supabase.from('skill_categories').update({ published: !cat.published }).eq('id', cat.id);
    fetchCategories();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold">Skills</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage skill categories and individual skills.</p>
        </div>
        {!creatingCat && !editingCat && (
          <button onClick={startCreateCat} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Plus className="h-4 w-4" /> Add Category
          </button>
        )}
      </div>

      {(creatingCat || editingCat) && (
        <div className="glass-strong rounded-2xl border border-primary/30 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">{editingCat ? 'Edit Category' : 'Create Category'}</h3>
            <button onClick={cancelCat} className="rounded-lg p-1.5 hover:bg-muted"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Icon (Lucide)</label>
              <input type="text" value={catForm.icon_name ?? ''} onChange={(e) => setCatForm({ ...catForm, icon_name: e.target.value })}
                className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Sort Order</label>
              <input type="number" value={catForm.sort_order ?? 0} onChange={(e) => setCatForm({ ...catForm, sort_order: Number(e.target.value) })}
                className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Title (EN)</label>
              <input type="text" value={catForm.title_en ?? ''} onChange={(e) => setCatForm({ ...catForm, title_en: e.target.value })}
                className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Title (AR)</label>
              <input type="text" value={catForm.title_ar ?? ''} onChange={(e) => setCatForm({ ...catForm, title_ar: e.target.value })}
                className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={saveCat} disabled={saving} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-70">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save
            </button>
            <button onClick={cancelCat} className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="glass-strong rounded-2xl border border-destructive/30 p-6 shadow-2xl">
            <h3 className="mb-2 font-serif text-lg font-semibold">Delete Category?</h3>
            <p className="mb-4 text-sm text-muted-foreground">All skills in this category will also be deleted.</p>
            <div className="flex gap-3">
              <button onClick={deleteCat} className="rounded-xl bg-destructive px-6 py-2.5 text-sm font-medium text-destructive-foreground">Delete</button>
              <button onClick={() => setDeleteTarget(null)} className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {categories.map((cat, i) => (
          <div key={cat.id} className="glass rounded-2xl border border-border/40 p-5">
            <div className="flex items-center justify-between pr-32">
              <div>
                <h3 className="font-serif text-lg font-semibold">{cat.title_en}</h3>
                <p className="text-xs text-muted-foreground">{cat.title_ar}</p>
              </div>
            </div>
            <div className="absolute right-3 top-3 flex items-center gap-1">
              <button onClick={() => moveCat(cat, 'up')} disabled={i === 0} className="rounded-lg p-1.5 hover:bg-muted disabled:opacity-30"><GripVertical className="h-4 w-4 rotate-180" /></button>
              <button onClick={() => moveCat(cat, 'down')} disabled={i === categories.length - 1} className="rounded-lg p-1.5 hover:bg-muted disabled:opacity-30"><GripVertical className="h-4 w-4" /></button>
              <button onClick={() => toggleCatPublished(cat)} className="rounded-lg p-1.5 hover:bg-muted">{cat.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}</button>
              <button onClick={() => startEditCat(cat)} className="rounded-lg p-1.5 hover:bg-muted hover:text-primary"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => setDeleteTarget(cat)} className="rounded-lg p-1.5 hover:bg-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="mt-4 space-y-2">
              {cat.skills?.map((skill: any) => (
                <div key={skill.id} className="flex items-center gap-3 rounded-lg border border-border/30 p-3">
                  <div className="flex-1">
                    <span className="text-sm font-medium">{skill.name_en}</span>
                    <span className="ml-2 text-xs text-muted-foreground">{skill.level}%</span>
                  </div>
                  <button onClick={() => deleteSkill(skill.id)} className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              ))}
              {addingSkillTo === cat.id ? (
                <div className="flex items-center gap-2 rounded-lg border border-primary/30 p-3">
                  <input type="text" placeholder="Skill name (EN)" value={skillForm.name_en ?? ''} onChange={(e) => setSkillForm({ ...skillForm, name_en: e.target.value })} className="flex-1 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
                  <input type="text" placeholder="AR" value={skillForm.name_ar ?? ''} onChange={(e) => setSkillForm({ ...skillForm, name_ar: e.target.value })} className="w-24 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
                  <input type="number" placeholder="%" value={skillForm.level ?? 80} onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })} className="w-16 rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
                  <button onClick={() => addSkill(cat.id)} className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Add</button>
                  <button onClick={() => setAddingSkillTo(null)} className="rounded-lg p-2 hover:bg-muted"><X className="h-3.5 w-3.5" /></button>
                </div>
              ) : (
                <button onClick={() => { setAddingSkillTo(cat.id); setSkillForm({}); }} className="flex items-center gap-1 text-xs text-primary hover:underline">
                  <Plus className="h-3 w-3" /> Add Skill
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
