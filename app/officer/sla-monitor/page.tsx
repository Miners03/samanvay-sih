'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { SLAAlert } from '@/components/common/SLAAlert';
import { StatusBadge } from '@/components/common/StatusBadge';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ArrowRight, 
  Eye, 
  Building2, 
  Filter 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useApprovalIdentities } from '@/hooks/useApprovalIdentities';

export default function SlaMonitorPage() {
  const { project } = useApp();
  const { getUuid } = useApprovalIdentities();
  const [activeTab, setActiveTab] = useState<'all' | 'on_track' | 'approaching' | 'breached'>('all');

  // Categorize approvals into On Track, Approaching, Breached
  const approachingList = project.approvals.filter(
    a => (a.slaDaysRemaining ?? 30) <= 10 && (a.slaDaysRemaining ?? 30) > 0 && a.status !== 'approved'
  );

  const breachedList = project.approvals.filter(
    a => (a.slaDaysRemaining ?? 30) <= 0 && a.status !== 'approved' && a.status !== 'waiting'
  );

  const onTrackList = project.approvals.filter(
    a => (a.slaDaysRemaining ?? 30) > 10 || a.status === 'approved'
  );

  const currentDisplayList = activeTab === 'all' ? project.approvals :
    activeTab === 'on_track' ? onTrackList :
    activeTab === 'approaching' ? approachingList : breachedList;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Statutory SLA Monitor & Deemed Clearance Radar"
        subtitle="Track departmental scrutiny clocks, monitor countdown thresholds, and prevent deemed approval lapses under State Business Facilitation Acts."
        breadcrumbs={[
          { label: 'Government Portal', href: '/officer/dashboard' },
          { label: 'SLA Monitor', current: true },
        ]}
        badge={
          <span className="bg-slate-800 text-slate-200 text-xs font-mono font-bold px-2 py-0.5 rounded border border-slate-700">
            STATUTORY SLA ENGINE
          </span>
        }
      />

      {/* 3 Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('on_track')}
          className={`p-4 rounded-lg border text-left transition-all ${
            activeTab === 'on_track' ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">On Track</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700 mt-1">{onTrackList.length} Dockets</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">&gt;10 Days remaining</span>
        </button>

        <button
          onClick={() => setActiveTab('approaching')}
          className={`p-4 rounded-lg border text-left transition-all ${
            activeTab === 'approaching' ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-300' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase">Approaching SLA</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-1">{approachingList.length} Dockets</p>
          <span className="text-[11px] text-amber-800 mt-0.5 block">&le;10 Days to deemed threshold</span>
        </button>

        <button
          onClick={() => setActiveTab('breached')}
          className={`p-4 rounded-lg border text-left transition-all ${
            activeTab === 'breached' ? 'bg-red-50 border-red-500 ring-2 ring-red-300' : 'bg-white border-slate-200 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-900 uppercase">SLA Breached / Overdue</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-black text-slate-800 mt-1">{breachedList.length} Dockets</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Immediate escalation triggered</span>
        </button>
      </div>

      {/* SLA Radar Table: Application, Department, Officer, SLA, Days Remaining, Current Stage */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-800">Filter View:</span>
            {['all', 'on_track', 'approaching', 'breached'].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as any)}
                className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-colors ${
                  activeTab === t ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Showing {currentDisplayList.length} Statutory Clearances
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Application &amp; Code</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th className="py-3 px-4">Statutory SLA</th>
                <th className="py-3 px-4">Remaining / Overdue</th>
                <th className="py-3 px-4">Current Stage</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentDisplayList.map((app) => {
                const daysRem = app.slaDaysRemaining ?? 15;
                const isUrgent = daysRem <= 8 && app.status !== 'approved';

                return (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link href={getUuid(app.id) ? `/officer/review/${getUuid(app.id)}` : '#'} className="font-bold text-slate-900 hover:text-gov-blue-secondary hover:underline block leading-tight">
                        {app.approvalName}
                      </Link>
                      <span className="font-mono text-[10px] text-slate-400 mt-0.5 block">
                        {app.id} • {app.approvalCode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {app.departmentName}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {app.authorityTracker?.responsibleOfficer || 'Nodal Scrutiny Cell'}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {app.slaDays} Statutory Days
                    </td>

                    <td className="py-3.5 px-4">
                      <SLAAlert
                        daysRemaining={daysRem}
                        slaDays={app.slaDays}
                        isDeemedApprovalEligible={app.isDeemedApprovalEligible}
                      />
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={getUuid(app.id) ? `/officer/review/${getUuid(app.id)}` : '#'}
                        className="inline-flex items-center gap-1 bg-gov-blue-secondary hover:bg-gov-blue-primary text-white px-3 py-1.5 rounded text-xs font-bold transition-all shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
