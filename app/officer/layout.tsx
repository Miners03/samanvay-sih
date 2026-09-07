'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { useApp } from '@/lib/context/AppContext';
import { DEPARTMENTS } from '@/lib/data/departments';
import { 
  Inbox, 
  CalendarCheck2, 
  History, 
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
  const { role, setRole, selectedOfficerDept, setSelectedOfficerDept } = useApp();
  const pathname = usePathname();

  useEffect(() => {
    if (role !== 'officer') {
      setRole('officer');
    }
  }, [role, setRole]);

  const activeDept = DEPARTMENTS.find(d => d.id === selectedOfficerDept) || DEPARTMENTS[0];

  const officerNav = [
    { label: 'Scrutiny Queue', href: '/officer/queue', icon: Inbox },
    { label: 'Joint Inspections', href: '/officer/inspections', icon: CalendarCheck2 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />

      {/* Mandatory Statutory Audit Notice Banner */}
      <div className="bg-amber-100/90 text-amber-950 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-amber-300 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-800 shrink-0" />
          <span>
            <strong>Official Notice:</strong> Authorised access only. All departmental scrutiny activities, decisions and audit timestamps are cryptographically recorded for statutory accountability.
          </span>
        </div>
        <span className="hidden sm:inline font-mono text-[11px] text-amber-900">
          OFFICER ID: GOV-HR-88412
        </span>
      </div>

      {/* Officer Department Control Bar */}
      <div className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-[53px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 sm:py-0 sm:h-14 gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Departmental Desk:
              </span>
              <div className="relative">
                <select
                  value={selectedOfficerDept}
                  onChange={(e) => setSelectedOfficerDept(e.target.value)}
                  className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-1.5 px-3 pr-8 rounded border border-slate-700 focus:ring-1 focus:ring-blue-400 cursor-pointer"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.code} — {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Officer Navigation Links */}
            <div className="flex items-center space-x-1">
              {officerNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors',
                      isActive
                        ? 'bg-gov-blue-secondary text-white border-b-2 border-amber-400'
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
