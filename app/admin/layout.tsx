'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { useApp } from '@/lib/context/AppContext';
import { 
  BarChart3, 
  Building, 
  ShieldCheck, 
  FileText, 
  Activity 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, setRole } = useApp();
  const pathname = usePathname();

  useEffect(() => {
    if (role !== 'admin') {
      setRole('admin');
    }
  }, [role, setRole]);

  const adminNav = [
    { label: 'Coordination Dashboard', href: '/admin/dashboard', icon: BarChart3 },
    { label: 'Department Velocity', href: '/admin/departments', icon: Building },
    { label: 'Statutory Audit Trail', href: '/admin/audit-logs', icon: Activity },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />

      {/* Admin Apex Navigation Bar */}
      <div className="bg-slate-950 text-white shadow-md border-b border-slate-800 sticky top-[53px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-0 sm:h-14 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                Apex Administrative Cell • Chief Secretary Single Window Directorate
              </span>
            </div>

            <div className="flex items-center space-x-1">
              {adminNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors',
                      isActive
                        ? 'bg-purple-900/60 text-white border-b-2 border-purple-400'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 pb-16">
        {children}
      </main>
    </div>
  );
}
