'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import {
  Star,
  MessageSquare,
  Mail,
  TrendingUp,
  FolderGit2,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface OverviewStats {
  pendingTestimonials: number;
  pendingComments: number;
  unreadMessages: number;
  totalProjects: number;
  totalCertificates: number;
  totalTimelineEvents: number;
  totalTestimonials: number;
  totalComments: number;
  totalMessages: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<OverviewStats>({
    pendingTestimonials: 0,
    pendingComments: 0,
    unreadMessages: 0,
    totalProjects: 0,
    totalCertificates: 0,
    totalTimelineEvents: 0,
    totalTestimonials: 0,
    totalComments: 0,
    totalMessages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentNotifs, setRecentNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient();
    (async () => {
      const [
        tAll, tPending,
        cAll, cPending,
        mAll, mUnread,
        projRes, certRes, tlRes,
        notifRes, msgRes,
      ] = await Promise.all([
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('comments').select('*', { count: 'exact', head: true }),
        supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('certificates').select('*', { count: 'exact', head: true }),
        supabase.from('timeline_events').select('*', { count: 'exact', head: true }),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('contact_messages').select('id, name, email, subject, message, is_read, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      setStats({
        pendingTestimonials: tPending.count ?? 0,
        pendingComments: cPending.count ?? 0,
        unreadMessages: mUnread.count ?? 0,
        totalProjects: projRes.count ?? 0,
        totalCertificates: certRes.count ?? 0,
        totalTimelineEvents: tlRes.count ?? 0,
        totalTestimonials: tAll.count ?? 0,
        totalComments: cAll.count ?? 0,
        totalMessages: mAll.count ?? 0,
      });
      setRecentMessages(msgRes.data ?? []);
      setRecentNotifs(notifRes.data ?? []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const cards = [
    { label: 'Pending Testimonials', value: stats.pendingTestimonials, icon: Star, color: 'text-warning' },
    { label: 'Pending Comments', value: stats.pendingComments, icon: MessageSquare, color: 'text-warning' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: Mail, color: 'text-destructive' },
    { label: 'Total Projects', value: stats.totalProjects, icon: FolderGit2, color: 'text-primary' },
    { label: 'Total Certificates', value: stats.totalCertificates, icon: Award, color: 'text-accent' },
    { label: 'Timeline Events', value: stats.totalTimelineEvents, icon: Clock, color: 'text-info' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="glass rounded-2xl border border-border/40 p-6">
        <h2 className="font-serif text-xl font-semibold">Welcome back!</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your portfolio content, review submissions, and keep your site up to date.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass rounded-2xl border border-border/40 p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-muted ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-serif text-2xl font-bold">{card.value}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent notifications */}
        <div className="glass rounded-2xl border border-border/40 p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold">Recent Activity</h3>
          {recentNotifs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentNotifs.map((notif) => (
                <div key={notif.id} className="flex items-start gap-3 rounded-lg border border-border/30 p-3">
                  {!notif.is_read ? (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  ) : (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{notif.title}</div>
                    <div className="text-xs text-muted-foreground">{notif.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent messages */}
        <div className="glass rounded-2xl border border-border/40 p-6">
          <h3 className="mb-4 font-serif text-lg font-semibold">Recent Messages</h3>
          {recentMessages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No messages yet</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 rounded-lg border border-border/30 p-3">
                  <Mail className={`mt-0.5 h-4 w-4 shrink-0 ${msg.is_read ? 'text-muted-foreground' : 'text-primary'}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{msg.name}</span>
                      {!msg.is_read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{msg.subject || 'No subject'}</div>
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-1">{msg.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
