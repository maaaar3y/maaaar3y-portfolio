'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Check, X, Star, Pin, Trash2, Eye, EyeOff } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'hidden'>('all');
  const supabase = createBrowserClient();

  const fetchItems = async () => {
    setLoading(true);
    let q = supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') q = q.eq('status', filter);
    const { data } = await q;
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('testimonials').update({ status }).eq('id', id);
    if (error) toast.error('Failed'); else { toast.success(`Marked as ${status}`); fetchItems(); }
  };

  const toggleFeatured = async (item: any) => {
    await supabase.from('testimonials').update({ featured: !item.featured }).eq('id', item.id);
    fetchItems();
  };

  const togglePinned = async (item: any) => {
    await supabase.from('testimonials').update({ pinned: !item.pinned }).eq('id', item.id);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id);
    toast.success('Deleted'); fetchItems();
  };

  const filters = ['all', 'pending', 'approved', 'rejected', 'hidden'] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Testimonials</h2>
        <p className="mt-1 text-sm text-muted-foreground">Review and moderate visitor testimonials.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="glass rounded-2xl border border-border/40 p-12 text-center"><p className="text-sm text-muted-foreground">No testimonials found.</p></div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="glass rounded-2xl border border-border/40 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-base font-semibold">{item.name}</span>
                    {item.pinned && <Pin className="h-3.5 w-3.5 text-primary" />}
                    {item.featured && <Star className="h-3.5 w-3.5 text-accent" />}
                  </div>
                  {item.role_company && <p className="text-xs text-muted-foreground">{item.role_company}</p>}
                  <div className="mt-1 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < item.rating ? 'text-accent fill-accent' : 'text-muted'}`} />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.comment_en}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  {item.status !== 'approved' && (
                    <button onClick={() => updateStatus(item.id, 'approved')} className="flex items-center gap-1 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-medium text-success hover:bg-success/20"><Check className="h-3.5 w-3.5" /> Approve</button>
                  )}
                  {item.status !== 'rejected' && (
                    <button onClick={() => updateStatus(item.id, 'rejected')} className="flex items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"><X className="h-3.5 w-3.5" /> Reject</button>
                  )}
                  {item.status !== 'hidden' && (
                    <button onClick={() => updateStatus(item.id, 'hidden')} className="flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80"><EyeOff className="h-3.5 w-3.5" /> Hide</button>
                  )}
                  <button onClick={() => toggleFeatured(item)} className="flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80"><Star className="h-3.5 w-3.5" /> {item.featured ? 'Unfeature' : 'Feature'}</button>
                  <button onClick={() => togglePinned(item)} className="flex items-center gap-1 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium hover:bg-muted/80"><Pin className="h-3.5 w-3.5" /> {item.pinned ? 'Unpin' : 'Pin'}</button>
                  <button onClick={() => handleDelete(item.id)} className="flex items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
