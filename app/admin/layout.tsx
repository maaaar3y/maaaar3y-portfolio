'use client';

import { AuthProvider, useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import AdminShell from '@/components/admin/admin-shell';
import { createBrowserClient } from '@/lib/supabase/client';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { session, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !session && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [session, loading, router, pathname, mounted]);

  useEffect(() => {
    if (session && pathname !== '/admin/login') {
      const checkAdmin = async () => {
        const supabase = createBrowserClient();
        const { data } = await supabase
          .from('site_settings')
          .select('admin_email')
          .eq('id', 1)
          .maybeSingle();
        const adminEmail = data?.admin_email;
        const userEmail = session.user?.email;
        if (!adminEmail || !userEmail || userEmail !== adminEmail) {
          await signOut();
          router.replace('/admin/login');
        } else {
          setAdminChecked(true);
        }
      };
      checkAdmin();
    } else if (!session) {
      setAdminChecked(false);
    }
  }, [session, pathname, router, signOut]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!mounted || loading || (session && !adminChecked)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
