'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Mail, Trash2, Archive, CheckCircle2, ArchiveRestore } from 'lucide-react';

export default function AdminMessagesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [selected, setSelected] = useState<any | null>(null);
  const supabase = createBrowserClient();

  const fetchItems = async () => {
    setLoading(true);
    let q = supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (filter === 'unread') q = q.eq('is_read', false).eq('archived', false);
    else if (filter === 'read') q = q.eq('is_read', true).eq('archived', false);
    else if (filter === 'archived') q = q.eq('archived', true);
    const { data } = await q;
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [filter]);

  const markRead = async (item: any) => {
    if (!item.is_read) {
      await supabase.from('contact_messages').update({ is_read: true }).eq('id', item.id);
      fetchItems();
    }
    setSelected(item);
  };

  const toggleArchive = async (item: any) => {
    await supabase.from('contact_messages').update({ archived: !item.archived }).eq('id', item.id);
    toast.success(item.archived ? 'Unarchived' : 'Archived');
    if (selected?.id === item.id) setSelected(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id);
    toast.success('Deleted');
    if (selected?.id === id) setSelected(null);
    fetchItems();
  };

  const filters = ['all', 'unread', 'read', 'archived'] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Contact Messages</h2>
        <p className="mt-1 text-sm text-muted-foreground">Read and manage messages from the contact form.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}`}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Message list */}
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="glass rounded-2xl border border-border/40 p-12 text-center"><p className="text-sm text-muted-foreground">No messages found.</p></div>
            ) : (
              items.map((item) => (
                <button key={item.id} onClick={() => markRead(item)} className={`w-full rounded-xl border p-4 text-left transition-colors ${selected?.id === item.id ? 'border-primary bg-primary/5' : 'border-border/40 hover:bg-muted/50'}`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${!item.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{item.name}</span>
                    {!item.is_read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{item.subject || 'No subject'}</p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{item.message}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{new Date(item.created_at).toLocaleString()}</p>
                </button>
              ))
            )}
          </div>

          {/* Selected message */}
          {selected && (
            <div className="glass-strong rounded-2xl border border-border/40 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold">{selected.subject || 'No subject'}</h3>
                <div className="flex gap-1">
                  <button onClick={() => toggleArchive(selected)} className="rounded-lg p-2 hover:bg-muted" title={selected.archived ? 'Unarchive' : 'Archive'}>
                    {selected.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                  </button>
                  <button onClick={() => handleDelete(selected.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selected.name}</span>
                  <span className="text-muted-foreground">&lt;{selected.email}&gt;</span>
                </div>
                <div className="rounded-xl border border-border/30 p-4">
                  <p className="text-sm leading-relaxed text-foreground">{selected.message}</p>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(selected.created_at).toLocaleString()}</p>
                {selected.is_read && (
                  <div className="flex items-center gap-1.5 text-xs text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Read</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
