'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { QueryResponseModal } from '@/components/applicant/QueryResponseModal';
import { ApprovalRoadmapItem } from '@/lib/types';
import { 
  Building2, 
  Search, 
  Filter, 
  FileText, 
  ArrowUpDown, 
  Download, 
  ArrowRight, 
  Clock 
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '@/lib/utils';

export default function ApplicationsPage() {
  const { project } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApprovalForQuery, setSelectedApprovalForQuery] = useState<ApprovalRoadmapItem | null>(null);

  const filtered = project.approvals.filter((app) => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        app.approvalName.toLowerCase().includes(q) ||
        app.departmentName.toLowerCase().includes(q) ||
        app.approvalCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Departmental Clearances &amp; Applications"
        subtitle="Consolidated registry of all statutory applications lodged across State &amp; Central regulatory authorities."
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Applications', current: true },
        ]}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Status:
          </span>
          {['all', 'approved', 'action_required', 'in_progress', 'waiting'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded font-semibold capitalize transition-colors ${statusFilter === st ? 'bg-gov-blue-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {st === 'all' ? 'All Applications' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search code, name, department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 p-1.5 px-3 rounded border border-slate-300 text-xs w-full sm:w-64 focus:ring-1 focus:ring-gov-blue-secondary"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Clearance Name &amp; Code</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Fee Paid</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">SLA / Ref</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{app.approvalName}</div>
                    <span className="text-[11px] font-mono text-slate-500">{app.approvalCode}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">
                    {app.departmentName}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                      {app.stageLabel.replace('Stage ', 'S')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium">
                    {formatCurrencyINR(app.feeAmountINR)}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={app.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    {app.status === 'approved' && app.certificateNo ? (
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 block truncate max-w-[140px]">
                        {app.certificateNo}
                      </span>
                    ) : app.status === 'in_progress' ? (
                      <span className="text-[11px] text-blue-800 font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-600" />
                        {app.slaDaysRemaining}d remaining
                      </span>
                    ) : app.status === 'action_required' ? (
                      <span className="text-[11px] text-amber-800 font-bold">
                        Query Pending
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Prerequisite</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {app.status === 'action_required' && app.query ? (
                      <button
                        onClick={() => setSelectedApprovalForQuery(app)}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1 rounded text-[11px] transition-colors"
                      >
                        Respond
                      </button>
                    ) : app.status === 'approved' ? (
                      <button
                        onClick={() => alert(`Downloading clearance certificate for ${app.approvalName}`)}
                        className="text-gov-blue-secondary hover:underline font-bold text-[11px] inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Order</span>
                      </button>
                    ) : (
                      <Link
                        href={`/applicant/roadmap/${project.id}`}
                        className="text-slate-500 hover:text-gov-blue-primary font-medium text-[11px] inline-flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApprovalForQuery && (
        <QueryResponseModal
          approval={selectedApprovalForQuery}
          isOpen={Boolean(selectedApprovalForQuery)}
          onClose={() => setSelectedApprovalForQuery(null)}
        />
      )}
    </div>
  );
}
