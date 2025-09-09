"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CreditCard, BarChart3 } from 'lucide-react';

const links = [
  { href: '/owner', label: 'Overview', icon: Home },
  { href: '/owner?tab=transactions', label: 'Transactions', icon: CreditCard },
  { href: '/owner?tab=analytics', label: 'Analytics', icon: BarChart3 }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:block w-64 sticky top-14 h-[calc(100vh-3.5rem)] border-r border-white/40 bg-white/50 backdrop-blur-xl">
      <div className="p-4 space-y-1">
        {links.map((l) => {
          const Icon = l.icon;
          const active = pathname === l.href.split('?')[0];
          return (
            <Link key={l.href} href={l.href} className={`flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-white/70 ${active ? 'bg-white/80 text-apple-blue' : ''}`}>
              <Icon className="h-5 w-5" />
              <span>{l.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

