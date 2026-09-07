'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DEPARTMENTS } from '@/lib/data/departments';
import { 
  Building2, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  ArrowRight, 
  Clock, 
  AlertTriangle, 
  ChevronRight, 
  CalendarCheck 
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '@/lib/utils';

export default function ApplicationsPage() {
  const { project } = useApp();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');

  const filtered = project.approvals.filter((app) => {
    if (selectedDept !== 'all' && app.departmentId !== selectedDept) return false;
    if (selectedPriority !== 'all' && app.priority !== selectedPriority) return false;

    if (selectedStatus !== 'all') {
      const s = selectedStatus.toLowerCase();
      if (s === 'under review' && app.status !== 'in_progress' && app.status !== 'submitted') return false;
      if (s === 'approved' && app.status !== 'approved') return false;
      if (s === 'action required' && app.status !== 'action_required') return false;
      if (s === 'waiting' && app.status !== 'waiting') return false;
      if (s === 'can apply now' && app.status !== 'can_apply_now') return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        app.approvalName.toLowerCase().includes(q) ||
        app.departmentName.toLowerCase().includes(q) ||
        app.approvalCode.toLowerCase().includes(q) ||
        (app.approvalType ? app.approvalType.toLowerCase().includes(q) : false)
      );
    }
    return true;
  });

  const getProgressPercentage = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 100;
      case 'awaiting_decision': return 85;
      case 'inspection_scheduled': return 70;
      case 'action_required': return 50;
      case 'in_progress':
      case 'submitted': return 40;
      case 'can_apply_now': return 15;
      case 'waiting':
      default: return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Statutory Applications Registry"
        subtitle="Track every departmental clearance, examine authority communications, review inspection logs, and download official orders."
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Applications', current: true },
        ]}
      />

      {/* Multi-Criteria Filters Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-3 text-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Filter By:
            </span>

            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="p-1.5 rounded border border-slate-300 bg-white text-xs font-medium"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.code} - {dept.shortName}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1.5 rounded border border-slate-300 bg-white text-xs font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Under Review">Under Review</option>
              <option value="Action Required">Action Required</option>
              <option value="Can Apply Now">Can Apply Now</option>
              <option value="Waiting">Waiting for Prerequisite</option>
            </select>

            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="p-1.5 rounded border border-slate-300 bg-white text-xs font-medium"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Standard">Standard Priority</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search application, code, department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 p-1.5 px-3 rounded border border-slate-300 text-xs w-full sm:w-64 focus:ring-1 focus:ring-gov-blue-secondary"
            />
          </div>
        </div>
      </div>

      {/* Applications Master Table with all required columns */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Application</th>
                <th className="py-3 px-4">Approval Code</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Statutory SLA</th>
                <th className="py-3 px-4 text-right">Next Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((app) => {
                const pct = getProgressPercentage(app.status);

                return (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                    {/* Application Name & Type */}
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <Link
                        href={`/applicant/applications/${app.id}`}
                        className="hover:text-gov-blue-secondary transition-colors block leading-tight"
                      >
                        {app.approvalName}
                      </Link>
                      <span className="text-[10px] text-slate-500 font-normal mt-0.5 block">
                        Type: {app.approvalType} • Priority: <strong>{app.priority}</strong>
                      </span>
                    </td>

                    {/* Approval Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                      {app.approvalCode}
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {app.departmentName}
                    </td>

                    {/* Project */}
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[140px]">
                      {project.name}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={app.status} size="sm" />
                    </td>

                    {/* Progress Indicator */}
                    <td className="py-3.5 px-4">
                      <div className="w-24">
                        <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-0.5">
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className={`h-full ${pct === 100 ? 'bg-emerald-600' : pct >= 50 ? 'bg-amber-500' : 'bg-blue-600'}`}
                          />
                        </div>
                      </div>
                    </td>

                    {/* SLA Countdown */}
                    <td className="py-3.5 px-4">
                      {app.status === 'approved' ? (
                        <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Cleared
                        </span>
                      ) : app.status === 'action_required' ? (
                        <span className="text-[10px] text-red-700 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {app.slaDaysRemaining}d (Clock Paused)
                        </span>
                      ) : app.status === 'waiting' ? (
                        <span className="text-[11px] text-slate-400">Locked</span>
                      ) : (
                        <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" />
                          {app.slaDaysRemaining}d remaining
                        </span>
                      )}
                    </td>

                    {/* Next Action */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/applicant/applications/${app.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-gov-blue-secondary group-hover:text-gov-blue-primary group-hover:underline"
                      >
                        <span>Open Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
