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
  Eye, 
  CheckCircle2 
} from 'lucide-react';
import { formatDate, formatCurrencyINR } from '@/lib/utils';

export default function OfficerQueuePage() {
  const { project, selectedOfficerDept } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedSla, setSelectedSla] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [search, setSearch] = useState('');

  const activeDept = DEPARTMENTS.find(d => d.id === selectedOfficerDept) || DEPARTMENTS[0];

  // Derive risk for each approval
  const getRiskLevel = (app: any): 'High' | 'Medium' | 'Low' => {
    if (app.status === 'action_required' || (app.slaDaysRemaining ?? 30) <= 8) return 'High';
    if ((app.slaDaysRemaining ?? 30) <= 15 || app.status === 'inspection_scheduled') return 'Medium';
    return 'Low';
  };

  // Surface SLA-at-risk and High-Risk first
  const sortedApprovals = [...project.approvals].sort((a, b) => {
    const aRiskWeight = getRiskLevel(a) === 'High' ? 3 : getRiskLevel(a) === 'Medium' ? 2 : 1;
    const bRiskWeight = getRiskLevel(b) === 'High' ? 3 : getRiskLevel(b) === 'Medium' ? 2 : 1;
    if (bRiskWeight !== aRiskWeight) return bRiskWeight - aRiskWeight;
    return (a.slaDaysRemaining ?? 30) - (b.slaDaysRemaining ?? 30);
  });

  const filtered = sortedApprovals.filter(a => {
    const risk = getRiskLevel(a);
    if (selectedStatus !== 'all' && a.status !== selectedStatus) return false;
    if (selectedRisk !== 'all' && risk !== selectedRisk) return false;
    if (selectedSla === 'at_risk' && (a.slaDaysRemaining ?? 30) > 10) return false;
    if (selectedSla === 'on_track' && (a.slaDaysRemaining ?? 30) <= 10) return false;
    if (selectedType !== 'all' && a.approvalType && !a.approvalType.toLowerCase().includes(selectedType.toLowerCase())) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.id.toLowerCase().includes(q) ||
        a.approvalName.toLowerCase().includes(q) ||
        a.approvalCode.toLowerCase().includes(q) ||
        a.departmentName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title={`${activeDept.name} — Scrutiny Desk`}
        subtitle="Statutory Applications Scrutiny Queue: Examine official dossiers, verify blueprints, issue queries, schedule joint inspections, and dispatch clearance orders."
        breadcrumbs={[
          { label: 'Government Portal', href: '/officer/dashboard' },
          { label: 'Applications Queue', current: true },
        ]}
        badge={
          <span className="bg-slate-800 text-slate-200 text-xs font-mono font-bold px-2 py-0.5 rounded border border-slate-700">
            {activeDept.code} SCRUTINY DESK
          </span>
        }
      />

      {/* Multi-Criteria Filters Bar (Status, Risk, SLA, Type) */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-3 text-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Filter Queue:
            </span>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1.5 rounded border border-slate-300 bg-white text-xs font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="in_progress">Under Review</option>
              <option value="action_required">Action Required (Query)</option>
              <option value="approved">Approved</option>
              <option value="waiting">Waiting for Prerequisite</option>
            </select>

            {/* Risk Filter */}
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="p-1.5 rounded border border-slate-300 bg-white text-xs font-medium"
            >
              <option value="all">All Risk Tiers</option>
              <option value="High">High Risk (SLA at risk / Query)</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>

            {/* SLA Filter */}
            <select
              value={selectedSla}
              onChange={(e) => setSelectedSla(e.target.value)}
              className="p-1.5 rounded border border-slate-300 bg-white text-xs font-medium"
            >
              <option value="all">All SLA Timers</option>
              <option value="at_risk">SLA At Risk (&le;10 Days)</option>
              <option value="on_track">On Track (&gt;10 Days)</option>
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="p-1.5 rounded border border-slate-300 bg-white text-xs font-medium"
            >
              <option value="all">All Clearance Types</option>
              <option value="Environmental">Environmental Consents</option>
              <option value="Fire">Fire Safety</option>
              <option value="Labour">Labour &amp; Factory Safety</option>
              <option value="Power">Power &amp; Utilities</option>
              <option value="Land">Land Tenure</option>
            </select>
          </div>

          <div className="relative shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search docket ID, approval code, name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 p-1.5 px-3 rounded border border-slate-300 text-xs w-full sm:w-64 focus:ring-1 focus:ring-gov-blue-secondary"
            />
          </div>
        </div>
      </div>

      {/* Applications Queue Table with EXACT REQUESTED COLUMNS: ID, Applicant, Project, Submitted, Risk, SLA, Status, Action */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4">Risk Tier</th>
                <th className="py-3 px-4">Statutory SLA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((app) => {
                const risk = getRiskLevel(app);

                return (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <Link href={`/officer/review/${app.id}`} className="hover:text-gov-blue-secondary hover:underline">
                        {app.id}
                      </Link>
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {app.approvalCode}
                      </span>
                    </td>

                    {/* Applicant */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{project.contactPerson}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{project.companyName}</div>
                    </td>

                    {/* Project */}
                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-[200px] truncate" title={project.name}>
                      {project.name}
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {project.referenceNo}
                      </span>
                    </td>

                    {/* Submitted Date */}
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {app.appliedDate ? formatDate(app.appliedDate) : '2026-08-12'}
                    </td>

                    {/* Risk Tier */}
                    <td className="py-3.5 px-4">
                      {risk === 'High' ? (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-900 text-[10px] font-bold px-2 py-0.5 rounded border border-red-300">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          High Risk
                        </span>
                      ) : risk === 'Medium' ? (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                          Medium Risk
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                          Low Risk
                        </span>
                      )}
                    </td>

                    {/* Statutory SLA */}
                    <td className="py-3.5 px-4">
                      <SLAAlert
                        daysRemaining={app.slaDaysRemaining ?? 15}
                        slaDays={app.slaDays}
                        isDeemedApprovalEligible={app.isDeemedApprovalEligible}
                      />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/officer/review/${app.id}`}
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
