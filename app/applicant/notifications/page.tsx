'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Building2, 
  ArrowRight, 
  Check 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead } = useApp();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Official Notifications &amp; Alerts"
        subtitle="Chronological feed of statutory scrutiny updates, query dispatches, inspection schedules, and order approvals."
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Notifications', current: true },
        ]}
      />

      <div className="bg-white rounded-lg border border-slate-200 shadow-gov divide-y divide-slate-100 overflow-hidden">
        {notifications.map((n) => {
          return (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-5 flex items-start gap-4 transition-colors cursor-pointer hover:bg-slate-50 ${!n.read ? 'bg-blue-50/40' : ''}`}
            >
              <div className="mt-1 shrink-0">
                {n.type === 'action' ? (
                  <div className="p-2 bg-amber-100 rounded text-amber-800">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                ) : n.type === 'success' ? (
                  <div className="p-2 bg-emerald-100 rounded text-emerald-800">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2 bg-blue-100 rounded text-blue-800">
                    <Info className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                    )}
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-medium">
                    {n.timeAgo}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  {n.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  {n.department && (
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {n.department}
                    </span>
                  )}

                  {n.actionLabel && (
                    <Link
                      href={n.actionUrl || '/applicant/dashboard'}
                      className="text-xs font-bold text-gov-blue-secondary hover:underline flex items-center gap-1"
                    >
                      <span>{n.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
