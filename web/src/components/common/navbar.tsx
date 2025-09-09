"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/providers/auth-provider';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/40 bg-white/50">
      <div className="container-responsive h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Adithi</Link>
        <nav className="flex items-center gap-3">
          <Link href="/owner" className={pathname.includes('/owner') ? 'text-apple-blue' : ''}>Owner</Link>
          <Link href="/retailer" className={pathname.includes('/retailer') ? 'text-apple-blue' : ''}>Retailer</Link>
          {user ? (
            <Button variant="ghost" onClick={logout}>Logout</Button>
          ) : (
            <Link href="/login"><Button>Login</Button></Link>
          )}
        </nav>
      </div>
    </header>
  );
}

