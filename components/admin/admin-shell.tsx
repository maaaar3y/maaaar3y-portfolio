'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { createBrowserClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Home,
  User,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  FlaskConical,
  Award,
  Trophy,
  Clock,
  Image,
  Star,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ExternalLink,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface NavSection {
  label: string;
  items: { label: string; href: string; icon: typeof Home }[];
}

const navSections: NavSection[] = [
  {
    label: 'Dashboard',
    items: [{ label: 'Overview', href: '/admin', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { label: 'Homepage', href: '/admin/home', icon: Home },
      { label: 'About', href: '/admin/about', icon: User },
      { label: 'Experience', href: '/admin/experience', icon: Briefcase },
      { label: 'Education', href: '/admin/education', icon: GraduationCap },
      { label: 'Skills', href: '/admin/skills', icon: Code2 },
      { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
      { label: 'Graduation Project', href: '/admin/graduation-project', icon: FlaskConical },
      { label: 'Certificates', href: '/admin/certificates', icon: Award },
      { label: 'Achievements', href: '/admin/achievements', icon: Trophy },
      { label: 'Timeline', href: '/admin/timeline', icon: Clock },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
      { label: 'Comments', href: '/admin/comments', icon: MessageSquare },
      { label: 'Messages', href: '/admin/messages', icon: Mail },
    ],
  },
  {
    label: 'Media & Settings',
    items: [
      { label: 'Media Library', href: '/admin/media', icon: Image },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const supabase = createBrowserClient();
    const fetchUnread = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      setUnreadCount(count ?? 0);
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/admin/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:hidden">
        <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 hover:bg-muted">
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-serif text-sm font-semibold">Admin Dashboard</span>
        <a href="/" target="_blank" className="rounded-lg p-2 hover:bg-muted">
          <ExternalLink className="h-5 w-5" />
        </a>
      </div>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-card transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / brand */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <span className="font-serif text-xl font-bold">Y</span>
            </div>
            <div>
              <div className="font-serif text-sm font-semibold">Youssef M. Marey</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                CMS Dashboard
              </div>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 hover:bg-muted lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navSections.map((section) => (
            <div key={section.label} className="mb-6">
              <h3 className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {section.label}
              </h3>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        router.push(item.href);
                        setSidebarOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                        active
                          ? 'bg-primary text-primary-foreground font-medium shadow-sm'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.href === '/admin' && unreadCount > 0 && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-3">
          <a
            href="/"
            target="_blank"
            className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            View Website
          </a>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Desktop top bar */}
        <header className="sticky top-0 z-30 hidden items-center justify-between border-b border-border bg-card/80 px-8 py-4 backdrop-blur lg:flex">
          <div>
            <h1 className="font-serif text-lg font-semibold">
              {navSections
                .flatMap((s) => s.items)
                .find((i) => isActive(i.href))?.label ?? 'Dashboard'}
            </h1>
            <p className="text-xs text-muted-foreground">
              Signed in as {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/admin')}
              className="relative rounded-lg border border-border p-2 transition-colors hover:bg-muted"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
