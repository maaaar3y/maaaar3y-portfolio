'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2, X, GripVertical, Eye, EyeOff } from 'lucide-react';

export interface AdminTableProps<T extends Record<string, any>> {
  table: string;
  columns: { key: string; label: string; render?: (item: T) => React.ReactNode }[];
  formFields: FormField[];
  orderBy?: string;
  defaultValues?: Partial<T>;
  renderItem?: (item: T, onEdit: (item: T) => void, onDelete: (item: T) => void) => React.ReactNode;
  title: string;
  description?: string;
}

export interface FormField {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'boolean' | 'array' | 'select' | 'image';
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  full?: boolean;
}

export function AdminCrud<T extends Record<string, any>>({
  table,
  columns,
  formFields,
  orderBy = 'sort_order',
  defaultValues = {},
  renderItem,
  title,
  description,
}: AdminTableProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  const supabase = createBrowserClient();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select('*').order(orderBy);
    if (error) {
      toast.error('Failed to load data');
    } else {
      setItems((data ?? []) as T[]);
    }
    setLoading(false);
  }, [table, orderBy, supabase]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const startCreate = () => {
    setFormData({ ...defaultValues, sort_order: items.length });
    setCreating(true);
    setEditing(null);
  };

  const startEdit = (item: T) => {
    setFormData({ ...item });
    setEditing(item);
    setCreating(false);
  };

  const cancelEdit = () => {
    setEditing(null);
    setCreating(false);
    setFormData({});
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        const { id, ...updates } = formData;
        const { error } = await supabase.from(table).update(updates).eq('id', editing.id);
        if (error) throw error;
        toast.success('Updated successfully');
      } else {
        const { error } = await supabase.from(table).insert(formData);
        if (error) throw error;
        toast.success('Created successfully');
      }
      cancelEdit();
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      const { error } = await supabase.from(table).delete().eq('id', deleteTarget.id);
      if (error) throw error;
      toast.success('Deleted successfully');
      setDeleteTarget(null);
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
    setSaving(false);
  };

  const togglePublished = async (item: T) => {
    const newPublished = !(item as any).published;
    const { error } = await supabase
      .from(table)
      .update({ published: newPublished })
      .eq('id', item.id);
    if (error) {
      toast.error('Failed to update');
    } else {
      toast.success(newPublished ? 'Published' : 'Hidden');
      fetchItems();
    }
  };

  const moveItem = async (item: T, direction: 'up' | 'down') => {
    const index = items.findIndex((i) => i.id === item.id);
    if (index < 0) return;
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= items.length) return;
    const swapItem = items[swapIndex];
    await Promise.all([
      supabase.from(table).update({ sort_order: (item as any).sort_order }).eq('id', swapItem.id),
      supabase.from(table).update({ sort_order: (swapItem as any).sort_order }).eq('id', item.id),
    ]);
    fetchItems();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl font-semibold">{title}</h2>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {!creating && !editing && (
          <button
            onClick={startCreate}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add New
          </button>
        )}
      </div>

      {/* Form */}
      {(creating || editing) && (
        <div className="glass-strong rounded-2xl border border-primary/30 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">
              {editing ? 'Edit Item' : 'Create New Item'}
            </h3>
            <button onClick={cancelEdit} className="rounded-lg p-1.5 hover:bg-muted">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {formFields.map((field) => (
              <div key={field.key} className={field.full ? 'sm:col-span-2' : ''}>
                <label className="mb-1.5 block text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-destructive"> *</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.key] ?? ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    rows={3}
                    className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary/50"
                  />
                ) : field.type === 'boolean' ? (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, [field.key]: !formData[field.key] })}
                    className={`flex h-10 w-20 items-center rounded-full px-1 transition-colors ${
                      formData[field.key] ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full bg-card shadow transition-transform ${
                        formData[field.key] ? 'translate-x-10' : 'translate-x-0'
                      }`}
                    />
                  </button>
                ) : field.type === 'select' ? (
                  <select
                    value={formData[field.key] ?? ''}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'array' ? (
                  <input
                    type="text"
                    value={Array.isArray(formData[field.key]) ? formData[field.key].join(', ') : formData[field.key] ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.key]: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Comma-separated values"
                    className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                  />
                ) : (
                  <input
                    type={field.type === 'number' ? 'number' : 'text'}
                    value={formData[field.key] ?? ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                      })
                    }
                    placeholder={field.placeholder}
                    required={field.required}
                    className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm disabled:opacity-70"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editing ? 'Save Changes' : 'Create Item'}
            </button>
            <button
              onClick={cancelEdit}
              className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="glass-strong rounded-2xl border border-destructive/30 p-6 shadow-2xl">
            <h3 className="mb-2 font-serif text-lg font-semibold">Confirm Delete</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={saving}
                className="rounded-xl bg-destructive px-6 py-2.5 text-sm font-medium text-destructive-foreground disabled:opacity-70"
              >
                {saving ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="glass rounded-2xl border border-border/40 p-12 text-center">
          <p className="text-sm text-muted-foreground">No items yet. Click "Add New" to create one.</p>
        </div>
      ) : renderItem ? (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={item.id} className="relative">
              {renderItem(item, startEdit, setDeleteTarget)}
              <div className="absolute right-3 top-3 flex items-center gap-1">
                <button
                  onClick={() => moveItem(item, 'up')}
                  disabled={i === 0}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
                >
                  <GripVertical className="h-4 w-4 rotate-180" />
                </button>
                <button
                  onClick={() => moveItem(item, 'down')}
                  disabled={i === items.length - 1}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
                >
                  <GripVertical className="h-4 w-4" />
                </button>
                {(item as any).published !== undefined && (
                  <button
                    onClick={() => togglePublished(item)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
                  >
                    {(item as any).published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                )}
                <button
                  onClick={() => startEdit(item)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/40">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((col) => (
                  <th key={String(col.key)} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {items.map((item, i) => (
                <tr key={item.id} className="hover:bg-muted/30">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-sm">
                      {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => moveItem(item, 'up')}
                        disabled={i === 0}
                        className="rounded-lg p-1.5 hover:bg-muted disabled:opacity-30"
                      >
                        <GripVertical className="h-4 w-4 rotate-180" />
                      </button>
                      <button
                        onClick={() => moveItem(item, 'down')}
                        disabled={i === items.length - 1}
                        className="rounded-lg p-1.5 hover:bg-muted disabled:opacity-30"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                      {(item as any).published !== undefined && (
                        <button
                          onClick={() => togglePublished(item)}
                          className="rounded-lg p-1.5 hover:bg-muted"
                        >
                          {(item as any).published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      )}
                      <button
                        onClick={() => startEdit(item)}
                        className="rounded-lg p-1.5 hover:bg-muted hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="rounded-lg p-1.5 hover:bg-muted hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
