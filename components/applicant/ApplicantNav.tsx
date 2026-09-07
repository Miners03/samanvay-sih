'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FolderKanban, 
  FileCheck2, 
  ShieldCheck, 
  CalendarClock, 
  Award, 
  Bell, 
  User, 
  PlusCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/context/AppContext';

export const ApplicantNav: React.FC = () => {
  const pathname = usePathname();
  const { notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { label: 'Dashboard', href: '/applicant/dashboard', icon: LayoutDashboard },
    { label: 'Projects', href: '/applicant/projects', icon: FolderKanban },
    { label: 'Applications', href: '/applicant/applications', icon: FileCheck2 },
    { label: 'Document Vault', href: '/applicant/vault', icon: ShieldCheck },
    { label: 'Renewals & Compliance', href: '/applicant/renewals', icon: CalendarClock },
    { label: 'Incentives', href: '/applicant/incentives', icon: Award },
    { 
      label: 'Notifications', 
      href: '/applicant/notifications', 
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined 
    },
    { label: 'Profile', href: '/applicant/profile', icon: User },
  ];

  return (
    <nav className="bg-gov-blue-primary text-white shadow-md border-b border-blue-900 sticky top-[53px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Main Navigation Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/applicant/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors relative',
                    isActive
                      ? 'bg-gov-blue-secondary text-white shadow-inner font-semibold border-b-2 border-amber-400'
                      : 'text-slate-200 hover:bg-gov-blue-secondary/60 hover:text-white'
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0 opacity-90" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-1 bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Prominent Primary CTA: + Register New Project */}
          <div className="shrink-0 pl-3">
            <Link
              href="/applicant/register-project"
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all shadow hover:shadow-md border border-amber-400 focus:ring-2 focus:ring-amber-300"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Register New Project</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
