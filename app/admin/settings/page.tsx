'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, Save, Upload } from 'lucide-react';

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<'general' | 'contact' | 'seo' | 'appearance' | 'sections' | 'social'>('general');
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [seo, setSeo] = useState<any>(null);
  const [appearance, setAppearance] = useState<any>(null);
  const [sections, setSections] = useState<any>(null);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [profileImg, setProfileImg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createBrowserClient();

  useEffect(() => {
    (async () => {
      const [s, c, se, ap, sv, sl, pi] = await Promise.all([
        supabase.from('site_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('contact_info').select('*').eq('id', 1).maybeSingle(),
        supabase.from('seo_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('appearance_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('section_visibility').select('*').eq('id', 1).maybeSingle(),
        supabase.from('social_links').select('*').order('sort_order'),
        supabase.from('profile_image').select('*').eq('id', 1).maybeSingle(),
      ]);
      setSiteSettings(s.data); setContactInfo(c.data); setSeo(se.data);
      setAppearance(ap.data); setSections(sv.data); setSocialLinks(sl.data ?? []);
      setProfileImg(pi.data);
      setLoading(false);
    })();
  }, []);

  const saveTable = async (table: string, data: any, id: number = 1) => {
    setSaving(true);
    const { error } = await supabase.from(table).update(data).eq('id', id);
    if (error) toast.error('Failed to save');
    else toast.success('Saved successfully');
    setSaving(false);
  };

  const saveSocialLink = async (link: any) => {
    const { error } = await supabase.from('social_links').update({
      platform: link.platform, icon_name: link.icon_name, url: link.url,
      label_en: link.label_en, label_ar: link.label_ar, published: link.published,
    }).eq('id', link.id);
    if (error) toast.error('Failed'); else toast.success('Saved');
  };

  const addSocialLink = async () => {
    const { data, error } = await supabase.from('social_links').insert({
      platform: 'new', icon_name: 'Link', url: '#', label_en: 'New', label_ar: 'جديد',
      sort_order: socialLinks.length, published: true,
    }).select().single();
    if (!error && data) { setSocialLinks([...socialLinks, data]); toast.success('Added'); }
  };

  const deleteSocialLink = async (id: string) => {
    await supabase.from('social_links').delete().eq('id', id);
    setSocialLinks(socialLinks.filter((l) => l.id !== id));
    toast.success('Deleted');
  };

  const uploadProfile = async (file: File | null) => {
    if (!file) return;
    const filePath = `profile/${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const { error: upErr } = await supabase.storage.from('profile').upload(filePath, file);
    if (upErr) { toast.error('Upload failed'); return; }
    const { data: { publicUrl } } = supabase.storage.from('profile').getPublicUrl(filePath);
    await supabase.from('profile_image').update({ image_url: publicUrl }).eq('id', 1);
    setProfileImg({ ...profileImg, image_url: publicUrl });
    toast.success('Profile image updated');
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  const tabs = ['general', 'contact', 'social', 'seo', 'appearance', 'sections'] as const;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage site settings, SEO, appearance, and more.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}`}>{t}</button>
        ))}
      </div>

      {tab === 'general' && siteSettings && (
        <div className="glass rounded-2xl border border-border/40 p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold">General Settings</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: 'owner_name_en', label: 'Owner Name (EN)' },
              { key: 'owner_name_ar', label: 'Owner Name (AR)' },
              { key: 'site_title_en', label: 'Site Title (EN)', full: true },
              { key: 'site_title_ar', label: 'Site Title (AR)', full: true },
              { key: 'tagline_en', label: 'Tagline (EN)' },
              { key: 'tagline_ar', label: 'Tagline (AR)' },
              { key: 'description_en', label: 'Description (EN)', full: true, area: true },
              { key: 'description_ar', label: 'Description (AR)', full: true, area: true },
              { key: 'location_en', label: 'Location (EN)' },
              { key: 'location_ar', label: 'Location (AR)' },
            ].map((f) => (
              <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
                {f.area ? (
                  <textarea value={siteSettings[f.key] ?? ''} onChange={(e) => setSiteSettings({ ...siteSettings, [f.key]: e.target.value })} rows={3} className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
                ) : (
                  <input type="text" value={siteSettings[f.key] ?? ''} onChange={(e) => setSiteSettings({ ...siteSettings, [f.key]: e.target.value })} className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
                )}
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={siteSettings.available_for_opportunities} onChange={(e) => setSiteSettings({ ...siteSettings, available_for_opportunities: e.target.checked })} />
                Available for opportunities badge
              </label>
            </div>
          </div>

          {/* Profile image */}
          <div className="mt-6 border-t border-border/30 pt-6">
            <h4 className="mb-3 text-sm font-semibold">Profile Image</h4>
            <div className="flex items-center gap-4">
              {profileImg?.image_url ? (
                <img src={profileImg.image_url} alt="Profile" className="h-20 w-20 rounded-full object-cover border-2 border-border" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">Y</div>
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted">
                <Upload className="h-4 w-4" /> Upload New
                <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadProfile(e.target.files?.[0] ?? null)} />
              </label>
            </div>
          </div>

          <button onClick={() => saveTable('site_settings', siteSettings)} disabled={saving} className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-70">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Settings
          </button>
        </div>
      )}

      {tab === 'contact' && contactInfo && (
        <div className="glass rounded-2xl border border-border/40 p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold">Contact Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Phone' },
              { key: 'location_en', label: 'Location (EN)' },
              { key: 'location_ar', label: 'Location (AR)' },
              { key: 'linkedin_url', label: 'LinkedIn URL', full: true },
              { key: 'github_url', label: 'GitHub URL', full: true },
            ].map((f) => (
              <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
                <input type="text" value={contactInfo[f.key] ?? ''} onChange={(e) => setContactInfo({ ...contactInfo, [f.key]: e.target.value })} className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
              </div>
            ))}
          </div>
          <button onClick={() => saveTable('contact_info', contactInfo)} disabled={saving} className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-70">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
          </button>
        </div>
      )}

      {tab === 'social' && (
        <div className="glass rounded-2xl border border-border/40 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif text-lg font-semibold">Social Links</h3>
            <button onClick={addSocialLink} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Add Link</button>
          </div>
          <div className="space-y-3">
            {socialLinks.map((link, i) => (
              <div key={link.id} className="grid grid-cols-2 gap-3 rounded-xl border border-border/30 p-4 sm:grid-cols-5">
                <input type="text" value={link.platform} onChange={(e) => { const n = [...socialLinks]; n[i] = { ...link, platform: e.target.value }; setSocialLinks(n); }} placeholder="Platform" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
                <input type="text" value={link.icon_name} onChange={(e) => { const n = [...socialLinks]; n[i] = { ...link, icon_name: e.target.value }; setSocialLinks(n); }} placeholder="Icon" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
                <input type="text" value={link.url} onChange={(e) => { const n = [...socialLinks]; n[i] = { ...link, url: e.target.value }; setSocialLinks(n); }} placeholder="URL" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
                <input type="text" value={link.label_en} onChange={(e) => { const n = [...socialLinks]; n[i] = { ...link, label_en: e.target.value }; setSocialLinks(n); }} placeholder="Label (EN)" className="rounded-lg border border-border/50 bg-card/40 px-3 py-2 text-xs" />
                <div className="flex items-end gap-2">
                  <button onClick={() => saveSocialLink(link)} className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground">Save</button>
                  <button onClick={() => deleteSocialLink(link.id)} className="rounded-lg p-2 text-destructive hover:bg-destructive/10 text-xs">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'seo' && seo && (
        <div className="glass rounded-2xl border border-border/40 p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold">SEO Settings</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: 'page_title_en', label: 'Page Title (EN)', full: true },
              { key: 'page_title_ar', label: 'Page Title (AR)', full: true },
              { key: 'meta_description_en', label: 'Meta Description (EN)', full: true, area: true },
              { key: 'meta_description_ar', label: 'Meta Description (AR)', full: true, area: true },
              { key: 'keywords', label: 'Keywords (comma-separated)', full: true, array: true },
              { key: 'og_title_en', label: 'OG Title (EN)', full: true },
              { key: 'og_title_ar', label: 'OG Title (AR)', full: true },
              { key: 'og_description_en', label: 'OG Description (EN)', full: true, area: true },
              { key: 'og_description_ar', label: 'OG Description (AR)', full: true, area: true },
              { key: 'og_image_url', label: 'OG Image URL', full: true },
              { key: 'canonical_url', label: 'Canonical URL', full: true },
              { key: 'favicon_url', label: 'Favicon URL', full: true },
            ].map((f) => (
              <div key={f.key} className={f.full ? 'sm:col-span-2' : ''}>
                <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
                {f.area ? (
                  <textarea value={seo[f.key] ?? ''} onChange={(e) => setSeo({ ...seo, [f.key]: e.target.value })} rows={3} className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
                ) : f.array ? (
                  <input type="text" value={Array.isArray(seo[f.key]) ? seo[f.key].join(', ') : ''} onChange={(e) => setSeo({ ...seo, [f.key]: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) })} className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
                ) : (
                  <input type="text" value={seo[f.key] ?? ''} onChange={(e) => setSeo({ ...seo, [f.key]: e.target.value })} className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
                )}
              </div>
            ))}
          </div>
          <button onClick={() => saveTable('seo_settings', seo)} disabled={saving} className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-70">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save SEO
          </button>
        </div>
      )}

      {tab === 'appearance' && appearance && (
        <div className="glass rounded-2xl border border-border/40 p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold">Appearance Settings</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { key: 'primary_color', label: 'Primary Color (HSL)' },
              { key: 'accent_color', label: 'Accent Color (HSL)' },
              { key: 'background_color', label: 'Background Color (HSL)' },
              { key: 'text_color', label: 'Text Color (HSL)' },
              { key: 'font_family', label: 'Font Family' },
              { key: 'border_radius', label: 'Border Radius' },
            ].map((f) => (
              <div key={f.key}>
                <label className="mb-1.5 block text-sm font-medium">{f.label}</label>
                <input type="text" value={appearance[f.key] ?? ''} onChange={(e) => setAppearance({ ...appearance, [f.key]: e.target.value })} className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50" />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">Animation Intensity</label>
              <select value={appearance.animation_intensity} onChange={(e) => setAppearance({ ...appearance, animation_intensity: e.target.value })} className="w-full rounded-xl border border-border/50 bg-card/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50">
                <option value="off">Off</option>
                <option value="subtle">Subtle</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <button onClick={() => saveTable('appearance_settings', appearance)} disabled={saving} className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-70">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Appearance
          </button>
        </div>
      )}

      {tab === 'sections' && sections && (
        <div className="glass rounded-2xl border border-border/40 p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold">Section Visibility</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(sections).filter(([k]) => k.startsWith('show_')).map(([key, val]) => (
              <label key={key} className="flex items-center gap-3 rounded-xl border border-border/30 p-4">
                <input type="checkbox" checked={val as boolean} onChange={(e) => setSections({ ...sections, [key]: e.target.checked })} />
                <span className="text-sm font-medium capitalize">{key.replace('show_', '').replace('_', ' ')}</span>
              </label>
            ))}
          </div>
          <button onClick={() => saveTable('section_visibility', sections)} disabled={saving} className="mt-4 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-70">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Visibility
          </button>
        </div>
      )}
    </div>
  );
}
