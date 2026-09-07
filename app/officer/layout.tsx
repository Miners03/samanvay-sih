'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { useApp } from '@/lib/context/AppContext';
import { DEPARTMENTS } from '@/lib/data/departments';
import { 
  LayoutDashboard,
  Inbox, 
  CalendarCheck2, 
  Clock,
  AlertTriangle,
  BarChart3,
  Bell,
  UserCheck,
  Building2, 
  ShieldAlert, 
  ChevronDown 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, setRole, selectedOfficerDept, setSelectedOfficerDept, escalations } = useApp();
  const pathname = usePathname();

  useEffect(() => {
    if (role !== 'officer') {
      setRole('officer');
    }
  }, [role, setRole]);

  const activeDept = DEPARTMENTS.find(d => d.id === selectedOfficerDept) || DEPARTMENTS[0];

  const activeEscalationsCount = escalations.filter(e => e.status === 'active').length;

  const officerNav = [
    { label: 'Dashboard', href: '/officer/dashboard', icon: LayoutDashboard },
    { label: 'Applications', href: '/officer/queue', icon: Inbox },
    { label: 'Inspections', href: '/officer/inspections', icon: CalendarCheck2 },
    { label: 'SLA Monitor', href: '/officer/sla-monitor', icon: Clock },
    { 
      label: 'Escalations', 
      href: '/officer/escalations', 
      icon: AlertTriangle,
      badge: activeEscalationsCount > 0 ? activeEscalationsCount : undefined 
    },
    { label: 'Risk & Analytics', href: '/officer/analytics', icon: BarChart3 },
    { label: 'Notifications', href: '/officer/notifications', icon: Bell },
    { label: 'Profile', href: '/officer/profile', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />

      {/* Mandatory Statutory Audit Notice & Prominent Department Title */}
      <div className="bg-slate-900 text-white text-xs px-4 sm:px-6 lg:px-8 py-2.5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gov-blue-secondary flex items-center justify-center font-bold text-white shadow-sm shrink-0">
            {activeDept.code.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black tracking-tight text-white">
                {activeDept.name} — Officer Portal
              </h2>
              <span className="bg-blue-600/80 text-blue-100 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-blue-400/30">
                STATE SCRUTINY CELL
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Nodal Officer: <strong>{activeDept.nodalOfficer}</strong> ({activeDept.designation}) • Official ID: GOV-HR-88412
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-bold text-slate-400">Switch Department:</span>
          <select
            value={selectedOfficerDept}
            onChange={(e) => setSelectedOfficerDept(e.target.value)}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-1 px-2.5 rounded border border-slate-700 focus:ring-1 focus:ring-blue-400 cursor-pointer"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.code} — {dept.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Officer Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-[53px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 overflow-x-auto py-1">
            {officerNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/officer/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-colors relative',
                    isActive
                      ? 'bg-gov-blue-primary text-white shadow-xs'
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
