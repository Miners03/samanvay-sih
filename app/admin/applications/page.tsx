'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { DEPARTMENTS } from '@/lib/data/departments';
import { 
  Layers, 
  Search, 
  Filter, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Building2, 
  ArrowUpRight, 
  AlertOctagon,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApprovalIdentities } from '@/hooks/useApprovalIdentities';

export default function AdminApplicationsPage() {
  const { project, projectApprovals, escalations, escalateItem } = useApp();
  const { getUuid } = useApprovalIdentities();
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const approvals = project.approvals || [];

  const filtered = approvals.filter(item => {
    const matchesDept = filterDept === 'all' || item.departmentId === filterDept || item.departmentName.toLowerCase().includes(filterDept.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
      item.status.toLowerCase() === filterStatus.toLowerCase() ||
      item.statusLabel.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = !searchQuery || 
      item.approvalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDept && matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Master Cross-Department Application Registry
            </h1>
            <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded border border-purple-200">
              STATEWIDE AUDIT CELL
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Consolidated scrutiny tracker across SPCB, Fire Services, Labour DISH, DISCOM, and Land Authorities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded border border-slate-200">
            Active Project: {project.name}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by filing ID, approval name, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs w-full focus:outline-none text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="text-xs font-semibold p-2 border border-slate-200 rounded bg-white text-slate-700"
          >
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(d => (
              <option key={d.id} value={d.id}>{d.shortName}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-semibold p-2 border border-slate-200 rounded bg-white text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="in_progress">Under Review</option>
            <option value="action_required">Action Required (Query)</option>
            <option value="waiting">Waiting / Locked</option>
            <option value="can_apply_now">Can Apply Now</option>
          </select>
        </div>
      </div>

      {/* Master Registry Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-gov-blue-primary" />
            Clearance Filings Directory ({filtered.length} Records)
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Ref: {project.referenceNo}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Filing Ref ID</th>
                <th className="py-3 px-4">Approval Name</th>
                <th className="py-3 px-4">Nodal Department</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Statutory SLA</th>
                <th className="py-3 px-4">Current Bottleneck / Notes</th>
                <th className="py-3 px-4 text-right">Scrutiny Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((item) => {
                const isBottleneck = item.status === 'action_required';
                const isWaiting = item.status === 'waiting';

                return (
                  <tr 
                    key={item.id} 
                    className={cn(
                      'hover:bg-slate-50 transition-colors',
                      isBottleneck && 'bg-red-50/50'
                    )}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {item.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.approvalName}</div>
                      <span className="text-[10px] text-slate-500">{item.approvalType || 'Statutory Clearance'}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">{item.departmentName}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      {item.stageLabel}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={cn(
                        'px-2 py-0.5 rounded font-bold text-[10px] border',
                        item.status === 'approved' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        item.status === 'in_progress' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                        item.status === 'action_required' ? 'bg-red-100 text-red-800 border-red-300 animate-pulse' :
                        item.status === 'can_apply_now' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        'bg-slate-100 text-slate-600 border-slate-300'
                      )}>
                        {item.statusLabel}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-slate-900">{item.slaDays} Days Cap</span>
                      {item.slaDaysRemaining !== undefined && (
                        <span className="text-[10px] text-slate-500 block">
                          {item.slaDaysRemaining}d remaining
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {isBottleneck ? (
                        <span className="text-red-700 font-bold text-[11px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-600 shrink-0" />
                          Query Raised: {item.query?.subject || 'Deficiency clarification requested'}
                        </span>
                      ) : isWaiting ? (
                        <span className="text-slate-400 text-[11px] italic">
                          Blocked on prerequisite approval
                        </span>
                      ) : (
                        <span className="text-slate-600 text-[11px]">
                          {item.authorityTracker?.currentState || 'Normal statutory velocity'}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={getUuid(item.id) ? `/officer/review/${getUuid(item.id)}` : '#'}
                        className="inline-flex items-center gap-1 text-xs font-bold text-gov-blue-primary hover:underline"
                      >
                        Inspect Dossier <ArrowUpRight className="w-3.5 h-3.5" />
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
