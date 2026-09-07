'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { useApp } from '@/lib/context/AppContext';
import { 
  LayoutDashboard,
  Building2,
  Layers,
  Users,
  CalendarCheck2,
  Clock,
  BarChart3,
  BookOpen,
  Bell,
  Settings,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, setRole, escalations } = useApp();
  const pathname = usePathname();

  useEffect(() => {
    if (role !== 'admin') {
      setRole('admin');
    }
  }, [role, setRole]);

  const activeEscalationsCount = escalations.filter(e => e.status === 'active').length;

  const adminNav = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Departments', href: '/admin/departments', icon: Building2 },
    { label: 'Applications', href: '/admin/applications', icon: Layers },
    { label: 'Workload', href: '/admin/workload', icon: Users },
    { label: 'Inspections', href: '/admin/inspections', icon: CalendarCheck2 },
    { 
      label: 'SLA & Escalations', 
      href: '/admin/sla-escalations', 
      icon: Clock,
      badge: activeEscalationsCount > 0 ? activeEscalationsCount : undefined
    },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Regulatory Rules', href: '/admin/regulatory-rules', icon: BookOpen },
    { label: 'Notifications', href: '/admin/notifications', icon: Bell },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />

      {/* Admin Apex Strategic Banner */}
      <div className="bg-slate-950 text-white px-4 sm:px-6 lg:px-8 py-2.5 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
            <div>
              <span className="text-xs font-black tracking-wider uppercase text-purple-200">
                Apex Administrative Directorate • State Single Window Authority
              </span>
              <p className="text-[11px] text-slate-400">
                Inter-departmental governance, statutory velocity oversight & regulatory engine controls
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link 
              href="/admin/audit-logs" 
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono transition-colors",
                pathname === '/admin/audit-logs'
                  ? "bg-purple-900 text-purple-200 border border-purple-400"
                  : "bg-slate-900 text-slate-300 hover:text-white border border-slate-700"
              )}
            >
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>Immutable Audit Trail</span>
            </Link>
            <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
              SYS-VER 2.4.8-SEC
            </span>
          </div>
        </div>
      </div>

      {/* Admin 10-Item Sticky Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[53px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 overflow-x-auto py-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-colors relative',
                    isActive
                      ? 'bg-purple-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ml-1">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 pb-16">
        {children}
      </main>
    </div>
  );
}
