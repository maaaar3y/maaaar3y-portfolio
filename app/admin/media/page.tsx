'use client';

import { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2, Copy, Image as ImageIcon, FileText, Film } from 'lucide-react';

export default function AdminMediaPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('general');
  const fileRef = useRef<HTMLInputElement>(null);
  const supabase = createBrowserClient();

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from('media').select('*').order('created_at', { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        let mediaType = 'other';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) mediaType = 'image';
        else if (ext === 'pdf') mediaType = 'pdf';
        else if (['doc', 'docx', 'txt'].includes(ext)) mediaType = 'document';
        else if (['mp4', 'webm', 'mov'].includes(ext)) mediaType = 'video';

        const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
        const filePath = `${category}/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath);

        const { error: dbError } = await supabase.from('media').insert({
          name: file.name,
          file_path: filePath,
          public_url: publicUrl,
          media_type: mediaType,
          category,
          size_bytes: file.size,
        });
        if (dbError) throw dbError;
      }
      toast.success('Upload complete');
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = async (item: any) => {
    await supabase.storage.from('media').remove([item.file_path]);
    await supabase.from('media').delete().eq('id', item.id);
    toast.success('Deleted');
    fetchItems();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const getIcon = (type: string) => {
    if (type === 'image') return ImageIcon;
    if (type === 'pdf' || type === 'document') return FileText;
    if (type === 'video') return Film;
    return FileText;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Media Library</h2>
        <p className="mt-1 text-sm text-muted-foreground">Upload and manage images, documents, and videos.</p>
      </div>

      {/* Upload area */}
      <div className="glass rounded-2xl border border-border/40 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" placeholder="general" />
          </div>
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium">Upload Files</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border/50 px-6 py-8 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
              <span>{uploading ? 'Uploading...' : 'Click to select files or drag here'}</span>
            </div>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
          </div>
        </div>
      </div>

      {/* Media grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : items.length === 0 ? (
        <div className="glass rounded-2xl border border-border/40 p-12 text-center"><p className="text-sm text-muted-foreground">No media files yet. Upload some files above.</p></div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = getIcon(item.media_type);
            return (
              <div key={item.id} className="glass rounded-2xl border border-border/40 p-4">
                {item.media_type === 'image' ? (
                  <img src={item.public_url} alt={item.name} className="mb-3 h-32 w-full rounded-lg object-cover" />
                ) : (
                  <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <p className="truncate text-xs font-medium">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">{item.media_type} · {item.category}</p>
                <div className="mt-2 flex items-center gap-1">
                  <button onClick={() => copyUrl(item.public_url)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-primary" title="Copy URL">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive" title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
