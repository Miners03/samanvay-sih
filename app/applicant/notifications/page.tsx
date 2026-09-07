'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  Sparkles, 
  ArrowRight, 
  Filter, 
  ShieldAlert 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function NotificationsPage() {
  const { notifications, markNotificationAsRead } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (filterType !== 'all' && n.type !== filterType) return false;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_update':
        return <div className="p-2 bg-blue-100 text-blue-800 rounded"><Clock className="w-4 h-4" /></div>;
      case 'query':
        return <div className="p-2 bg-amber-100 text-amber-800 rounded"><AlertTriangle className="w-4 h-4" /></div>;
      case 'approval':
        return <div className="p-2 bg-emerald-100 text-emerald-800 rounded"><CheckCircle2 className="w-4 h-4" /></div>;
      case 'dependency':
        return <div className="p-2 bg-purple-100 text-purple-800 rounded"><Sparkles className="w-4 h-4" /></div>;
      case 'renewal':
        return <div className="p-2 bg-orange-100 text-orange-800 rounded"><RotateCcw className="w-4 h-4" /></div>;
      case 'sla':
        return <div className="p-2 bg-red-100 text-red-800 rounded"><ShieldAlert className="w-4 h-4" /></div>;
      default:
        return <div className="p-2 bg-slate-100 text-slate-700 rounded"><Bell className="w-4 h-4" /></div>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'application_update': return 'Application Update';
      case 'query': return 'Query Raised';
      case 'approval': return 'Approval Issued';
      case 'dependency': return 'Dependency Cleared';
      case 'renewal': return 'Statutory Renewal';
      case 'sla': return 'SLA Alert';
      default: return 'Notification';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Notifications &amp; Statutory Alerts Center"
        subtitle="Chronological feed of clearance status updates, department scrutiny queries, auto-unlocked dependencies, and SLA alerts."
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Notifications', current: true },
        ]}
      />

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          Filter:
        </span>
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'application_update', label: 'Application Updates' },
          { id: 'query', label: 'Queries' },
          { id: 'approval', label: 'Approvals' },
          { id: 'dependency', label: 'Dependencies Unlocked' },
          { id: 'renewal', label: 'Renewals' },
          { id: 'sla', label: 'SLA Alerts' },
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilterType(btn.id)}
            className={`px-3 py-1.5 rounded-md font-semibold whitespace-nowrap transition-colors ${filterType === btn.id ? 'bg-gov-blue-primary text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Notification Cards with Timestamps */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationAsRead(n.id)}
            className={`bg-white rounded-lg border border-slate-200 shadow-gov p-5 flex items-start gap-4 transition-all hover:border-slate-300 cursor-pointer ${!n.read ? 'border-l-4 border-l-gov-blue-primary bg-blue-50/20' : ''}`}
          >
            <div className="shrink-0 mt-0.5">
              {getNotificationIcon(n.type)}
            </div>

            <div className="flex-1 space-y-1 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {getTypeLabel(n.type)}
                  </span>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {n.timeAgo} • {formatDate(n.timestamp)}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug pt-0.5">
                {n.title}
              </h4>

              <p className="text-slate-600 leading-relaxed text-xs">
                {n.description}
              </p>

              <div className="pt-2 flex items-center justify-between">
                {n.department && (
                  <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {n.department}
                  </span>
                )}

                {n.actionLabel && (
                  <Link
                    href={n.actionUrl || '/applicant/dashboard'}
                    className="inline-flex items-center gap-1 text-xs font-bold text-gov-blue-secondary hover:underline"
                  >
                    <span>{n.actionLabel}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
