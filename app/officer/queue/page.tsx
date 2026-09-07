'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { DEPARTMENTS } from '@/lib/data/departments';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SLAAlert } from '@/components/common/SLAAlert';
import { 
  Inbox, 
  Clock, 
  Search, 
  Filter, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  Building2, 
  FileCheck2, 
  CheckCircle2 
} from 'lucide-react';
import { formatDate, formatCurrencyINR } from '@/lib/utils';

export default function OfficerQueuePage() {
  const { project, selectedOfficerDept, officerApprove, officerReject } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'query' | 'approved'>('all');
  const [search, setSearch] = useState('');

  const activeDept = DEPARTMENTS.find(d => d.id === selectedOfficerDept) || DEPARTMENTS[0];

  // Applications relevant to this department (or all if matches)
  const deptApprovals = project.approvals.filter(a => a.departmentId === selectedOfficerDept);

  // If none match currently selected department, fallback to showing all to allow rich testing
  const displayApprovals = deptApprovals.length > 0 
    ? deptApprovals 
    : project.approvals.slice(0, 4);

  const filtered = displayApprovals.filter(a => {
    if (filterType === 'pending' && a.status !== 'in_progress') return false;
    if (filterType === 'query' && a.status !== 'action_required') return false;
    if (filterType === 'approved' && a.status !== 'approved') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.approvalName.toLowerCase().includes(q) ||
        a.approvalCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title={`${activeDept.name} — Scrutiny Desk`}
        subtitle={`Official Scrutiny Queue: Review statutory clearances, verify digital dossier blueprints, raise audit queries, and issue dispatch orders.`}
        breadcrumbs={[
          { label: 'Government Portal', href: '/officer/queue' },
          { label: 'Scrutiny Queue', current: true },
        ]}
        badge={
          <span className="bg-slate-800 text-slate-200 text-xs font-mono font-bold px-2 py-0.5 rounded border border-slate-700">
            {activeDept.code} DESK
          </span>
        }
      />

      {/* Officer Department Statistics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider block">
            Dockets in Department Queue
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{displayApprovals.length}</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">For enterprise facility</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider block">
            Statutory SLA Window
          </span>
          <p className="text-2xl font-black text-gov-blue-secondary mt-1">{activeDept.slaDays} Days</p>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">Avg clearance: {activeDept.avgClearanceDays} days</span>
        </div>
        <div className="bg-white p-4 rounded-lg border-l-4 border-l-amber-500 border border-slate-200 shadow-sm">
          <span className="text-amber-800 text-[11px] font-bold uppercase tracking-wider block">
            Applicant Queries Pending
          </span>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {displayApprovals.filter(a => a.status === 'action_required').length}
          </p>
          <span className="text-[10px] text-amber-800 mt-0.5 block">Awaiting applicant documents</span>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider block">
            Deemed Clearance Threshold
          </span>
          <p className="text-2xl font-black text-purple-700 mt-1">{activeDept.deemedApprovalThresholdDays} Days</p>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Automatic grant upon lapse</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Queue Status:
          </span>
          {[
            { id: 'all', label: 'All Dockets' },
            { id: 'pending', label: 'Under Active Scrutiny' },
            { id: 'query', label: 'Query Dispatched' },
            { id: 'approved', label: 'Clearance Granted' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-3 py-1 rounded font-semibold transition-colors ${filterType === tab.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search docket or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 p-1.5 px-3 rounded border border-slate-300 text-xs w-full sm:w-64 focus:ring-1 focus:ring-gov-blue-secondary"
          />
        </div>
      </div>

      {/* Applications List in Queue */}
      <div className="space-y-4">
        {filtered.map((approval) => {
          const isQuery = approval.status === 'action_required' && approval.query;
          const isPending = approval.status === 'in_progress';
          const isApproved = approval.status === 'approved';

          return (
            <div
              key={approval.id}
              className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-3 border-b border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {approval.approvalCode}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Project: <strong>{project.name}</strong>
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-mono">
                      Ref: {project.referenceNo}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {approval.approvalName}
                  </h3>

                  <p className="text-xs text-slate-600 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Applicant Entity: <strong>{project.companyName}</strong> (PAN: {project.panNumber})
                  </p>
                </div>

                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0">
                  <StatusBadge status={approval.status} size="sm" />
                  <span className="text-xs font-mono text-slate-500">
                    Fee: {formatCurrencyINR(approval.feeAmountINR)}
                  </span>
                </div>
              </div>

              {/* SLA & Query Context */}
              {isPending && (
                <div className="space-y-2">
                  <SLAAlert
                    daysRemaining={approval.slaDaysRemaining ?? 15}
                    slaDays={approval.slaDays}
                    isDeemedApprovalEligible={approval.isDeemedApprovalEligible}
                  />
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                    Application under formal examination. Check attached technical documents and engineering calculations.
                  </p>
                </div>
              )}

              {isQuery && (
                <div className="bg-amber-50 p-3 rounded border border-amber-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-amber-950 font-bold">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                      Active Observation Dispatched to Applicant
                    </span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-amber-200">
                      Applicant Deadline: {formatDate(approval.query?.deadlineDate)}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    &quot;{approval.query?.description}&quot;
                  </p>
                  {approval.query?.status === 'submitted_by_applicant' && (
                    <div className="bg-emerald-100 text-emerald-950 p-2 rounded text-xs font-semibold mt-2">
                      Applicant has submitted a response and attached supplementary documents! Ready for re-scrutiny.
                    </div>
                  )}
                </div>
              )}

              {isApproved && (
                <div className="bg-emerald-50 p-3 rounded border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Clearance Order Dispatched. Certificate No: <strong className="font-mono">{approval.certificateNo}</strong></span>
                  </div>
                  <span className="text-[11px] text-emerald-800">Completed</span>
                </div>
              )}

              {/* Action Bar for Officer */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[11px] text-slate-500">
                  {approval.documentsSubmitted.length} documents lodged in vault
                </span>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/officer/review/${approval.id}`}
                    className="bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold px-3.5 py-1.5 rounded transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>Open Scrutiny Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {!isApproved && (
                    <button
                      onClick={() => officerApprove(approval.id, 'Scrutiny satisfied. Approved per statutory guidelines.')}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded transition-colors"
                    >
                      Grant Clearance
                    </button>
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
