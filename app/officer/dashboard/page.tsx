'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { DEPARTMENTS } from '@/lib/data/departments';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SLAAlert } from '@/components/common/SLAAlert';
import { 
  Inbox, 
  Clock, 
  CalendarCheck2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  Layers 
} from 'lucide-react';
import { formatDate, formatCurrencyINR } from '@/lib/utils';
import { useApprovalIdentities } from '@/hooks/useApprovalIdentities';

export default function OfficerDashboardPage() {
  const { project, selectedOfficerDept, escalations, unifiedInspection } = useApp();
  const { getUuid } = useApprovalIdentities();

  const activeDept = DEPARTMENTS.find(d => d.id === selectedOfficerDept) || DEPARTMENTS[0];

  // Applications relevant to this department (or fallback to active items)
  const deptApprovals = project.approvals.filter(a => a.departmentId === selectedOfficerDept);
  const displayApprovals = deptApprovals.length > 0 ? deptApprovals : project.approvals.slice(0, 4);

  // Exact 5 cards requested: New Applications, Under Review, SLA At Risk, Inspections, Escalated
  const newAppsCount = project.approvals.filter(a => a.status === 'can_apply_now').length;
  const underReviewCount = project.approvals.filter(a => a.status === 'in_progress').length;
  const slaAtRiskCount = project.approvals.filter(a => (a.slaDaysRemaining ?? 30) <= 10 && a.status !== 'approved').length;
  const inspectionsCount = project.approvals.filter(a => a.inspectionRequired && a.status !== 'approved').length;
  const escalatedCount = escalations.filter(e => e.status === 'active').length;

  // Surface SLA-at-risk and high risk first
  const prioritizedDockets = [...project.approvals].sort((a, b) => {
    const aRisk = a.status === 'action_required' ? 1 : 0;
    const bRisk = b.status === 'action_required' ? 1 : 0;
    if (bRisk !== aRisk) return bRisk - aRisk;
    return (a.slaDaysRemaining ?? 30) - (b.slaDaysRemaining ?? 30);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title={`${activeDept.shortName} — Officer Operational Dashboard`}
        subtitle="Departmental scrutiny operations: Monitor statutory SLA velocity, review priority dockets, coordinate multi-department joint audits, and manage active queries."
        breadcrumbs={[
          { label: 'Government Portal', href: '/officer/dashboard' },
          { label: 'Dashboard', current: true },
        ]}
        badge={
          <span className="bg-slate-800 text-slate-200 text-xs font-mono font-bold px-2 py-0.5 rounded border border-slate-700">
            OFFICIAL DESK: {activeDept.code}
          </span>
        }
      />

      {/* 5 EXACT REQUESTED STAT CARDS: New Applications, Under Review, SLA At Risk, Inspections, Escalated */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: New Applications */}
        <Link 
          href="/officer/queue"
          className="bg-white p-4 rounded-lg border-l-4 border-l-blue-500 border border-slate-200 shadow-sm hover:border-slate-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">New Filings</span>
            <Inbox className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{newAppsCount}</p>
          <span className="text-[10px] text-blue-600 font-semibold group-hover:underline flex items-center gap-1 mt-0.5">
            <span>View incoming</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </Link>

        {/* Card 2: Under Review */}
        <Link 
          href="/officer/queue"
          className="bg-white p-4 rounded-lg border-l-4 border-l-gov-blue-secondary border border-slate-200 shadow-sm hover:border-slate-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Under Review</span>
            <Clock className="w-4 h-4 text-gov-blue-secondary" />
          </div>
          <p className="text-2xl font-black text-gov-blue-primary mt-1">{underReviewCount}</p>
          <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">Active examination</span>
        </Link>

        {/* Card 3: SLA At Risk */}
        <Link 
          href="/officer/sla-monitor"
          className="bg-white p-4 rounded-lg border-l-4 border-l-amber-500 border border-slate-200 shadow-sm hover:border-slate-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase">SLA At Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-1">{slaAtRiskCount}</p>
          <span className="text-[10px] text-amber-800 font-semibold mt-0.5 block">&lt;10 Days remaining</span>
        </Link>

        {/* Card 4: Inspections */}
        <Link 
          href="/officer/inspections"
          className="bg-white p-4 rounded-lg border-l-4 border-l-purple-500 border border-slate-200 shadow-sm hover:border-slate-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900 uppercase">Inspections</span>
            <CalendarCheck2 className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-900 mt-1">{inspectionsCount}</p>
          <span className="text-[10px] text-purple-700 font-semibold mt-0.5 block">1 Unified Coordinated</span>
        </Link>

        {/* Card 5: Escalated */}
        <Link 
          href="/officer/escalations"
          className="bg-white p-4 rounded-lg border-l-4 border-l-red-500 border border-slate-200 shadow-sm hover:border-slate-300 transition-all group col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-900 uppercase">Escalated</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-black text-red-700 mt-1">{escalatedCount}</p>
          <span className="text-[10px] text-red-700 font-semibold mt-0.5 block">Requires attention</span>
        </Link>
      </div>

      {/* UNIFIED INSPECTION HIGHLIGHT CALLOUT (MAJOR USP) */}
      <div className="bg-gradient-to-r from-blue-900 via-gov-blue-primary to-slate-900 text-white rounded-lg p-5 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
              CORE USP: UNIFIED INSPECTION PLANNING
            </span>
            <span className="text-xs text-blue-200 font-mono">
              Commonality Match: {unifiedInspection.commonalityScore}%
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            3 Individual Department Visits ➔ 1 Coordinated Site Audit
          </h3>
          <p className="text-xs text-slate-200 leading-relaxed">
            Multi-department site inspection requested for <strong>{project.name}</strong> at IMT Manesar. Requirements overlap across Fire Safety, Environmental Containment, and Factory Health.
          </p>
          <p className="text-[11px] text-amber-200/90 italic">
            Statutory Guardrail: Each department keeps its own independent checklist and decision.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="/officer/inspections"
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded shadow text-xs inline-flex items-center gap-2 transition-all"
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>Open Unified Planner</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* PRIORITY ACTION TABLE: Surfaces SLA-At-Risk and High-Risk Dockets First */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Prioritized Statutory Docket Queue (High Risk &amp; SLA-at-Risk First)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live statutory cases ordered by urgency to protect deemed approval timelines.
            </p>
          </div>
          <Link
            href="/officer/queue"
            className="text-xs font-bold text-gov-blue-secondary hover:underline flex items-center gap-1"
          >
            <span>View Full Queue ({project.approvals.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Approval Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Statutory SLA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {prioritizedDockets.slice(0, 5).map((app) => {
                const isUrgent = app.status === 'action_required' || (app.slaDaysRemaining ?? 30) <= 10;

                return (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {app.id}
                      {isUrgent && (
                        <span className="block text-[10px] text-red-600 font-semibold font-sans">
                          Urgent Attention
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <Link href={getUuid(app.id) ? `/officer/review/${getUuid(app.id)}` : '#'} className="hover:text-gov-blue-secondary hover:underline">
                        {app.approvalName}
                      </Link>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        Code: {app.approvalCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {app.departmentName}
                    </td>
                    <td className="py-3 px-4">
                      <SLAAlert
                        daysRemaining={app.slaDaysRemaining ?? 15}
                        slaDays={app.slaDays}
                        isDeemedApprovalEligible={app.isDeemedApprovalEligible}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={getUuid(app.id) ? `/officer/review/${getUuid(app.id)}` : '#'}
                        className="inline-flex items-center gap-1 bg-gov-blue-secondary hover:bg-gov-blue-primary text-white px-3 py-1.5 rounded text-xs font-bold transition-all shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Scrutinize</span>
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
