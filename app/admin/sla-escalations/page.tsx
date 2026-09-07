'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Building2, 
  Flame, 
  CheckCircle2, 
  ArrowUpRight, 
  Plus, 
  X,
  MessageSquare,
  AlertOctagon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSlaEscalationsPage() {
  const { escalations, addEscalationRemark, escalateItem } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [remarkModalId, setRemarkModalId] = useState<string | null>(null);
  const [remarkText, setRemarkText] = useState<string>('');

  const handleAddRemarkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (remarkModalId && remarkText.trim()) {
      addEscalationRemark(remarkModalId, remarkText.trim());
      setRemarkText('');
      setRemarkModalId(null);
    }
  };

  const filtered = escalations.filter(item => {
    if (filterSeverity === 'all') return true;
    return item.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  const criticalCount = escalations.filter(e => e.severity === 'Critical').length;
  const highCount = escalations.filter(e => e.severity === 'High').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              State Escalation & SLA Enforcement Center
            </h1>
            <span className="bg-red-100 text-red-900 text-xs font-bold px-2.5 py-0.5 rounded border border-red-200">
              SECTION 12 STATUTORY ENFORCEMENT
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Supervisory intervention cell tracking overdue dockets, inter-departmental delays, and Deemed Approval risks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-xs flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4" />
            <span>{criticalCount} Critical Escalations Active</span>
          </span>
        </div>
      </div>

      {/* SLA Statutory Disclaimer */}
      <div className="p-4 bg-slate-900 text-white rounded-lg border border-slate-800 shadow-gov flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-red-600 text-white flex items-center justify-center font-bold shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-amber-400 block">Statutory Deemed Approval Mandate:</strong>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Under Haryana Single Window Act 2016 Section 12, clearances not evaluated within the prescribed SLA automatically transition to &ldquo;Deemed Approval&rdquo; unless statutory deficiency queries are formally logged.
            </p>
          </div>
        </div>
        <div className="shrink-0 font-mono text-slate-400 text-right">
          <span>Automatic Default Window: <strong>72 Hours</strong></span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border-l-4 border-l-red-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Severity</span>
          <p className="text-2xl font-black text-red-600 mt-2">{criticalCount}</p>
          <span className="text-xs text-red-700 mt-1 block">Level 3 Apex Committee Direct</span>
        </div>

        <div className="bg-white border-l-4 border-l-amber-500 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">High Severity</span>
          <p className="text-2xl font-black text-amber-600 mt-2">{highCount}</p>
          <span className="text-xs text-amber-700 mt-1 block">Level 2 Joint Director Review</span>
        </div>

        <div className="bg-white border-l-4 border-l-blue-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active Escalations</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{escalations.length}</p>
          <span className="text-xs text-slate-500 mt-1 block">Cross-department tracking</span>
        </div>

        <div className="bg-white border-l-4 border-l-emerald-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolution Velocity</span>
          <p className="text-2xl font-black text-emerald-700 mt-2">1.4 Days</p>
          <span className="text-xs text-emerald-700 mt-1 block">Avg apex turnaround</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterSeverity('all')}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-bold transition-colors',
            filterSeverity === 'all'
              ? 'bg-purple-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          All Severities ({escalations.length})
        </button>
        <button
          onClick={() => setFilterSeverity('critical')}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-bold transition-colors',
            filterSeverity === 'critical'
              ? 'bg-red-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          Critical Only ({criticalCount})
        </button>
        <button
          onClick={() => setFilterSeverity('high')}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-bold transition-colors',
            filterSeverity === 'high'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          High ({highCount})
        </button>
      </div>

      {/* Escalations Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Active Regulatory Escalations Docket
          </h2>
          <span className="text-xs text-slate-500">
            Automated Audit Log
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Docket ID / Approval</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Current Owner</th>
                <th className="py-3 px-4">Severity Tier</th>
                <th className="py-3 px-4">Escalation Level</th>
                <th className="py-3 px-4">Overdue Period</th>
                <th className="py-3 px-4">Grounds for Escalation</th>
                <th className="py-3 px-4 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((item) => {
                const isCritical = item.severity === 'Critical';

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.applicationName}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{item.applicationId}</span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {item.departmentName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      <div>{item.officerName}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={cn(
                        'px-2 py-0.5 rounded font-bold text-[10px] border',
                        isCritical 
                          ? 'bg-red-100 text-red-800 border-red-300 font-mono' 
                          : 'bg-amber-100 text-amber-800 border-amber-300 font-mono'
                      )}>
                        {item.severity}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.escalationLevel}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                      {item.timeOverdue}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-600 line-clamp-2">{item.reason}</p>
                      {item.remarks.length > 0 && (
                        <span className="text-[10px] text-purple-700 font-semibold block mt-1">
                          Latest remark: {item.remarks[item.remarks.length - 1]}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setRemarkModalId(item.id)}
                        className="px-2.5 py-1 text-xs font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded"
                      >
                        Remark
                      </button>

                      {item.escalationLevel !== 'Level 3: Apex Committee' && (
                        <button
                          onClick={() => escalateItem(item.id)}
                          className="px-2.5 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded shadow-xs"
                        >
                          Escalate L3
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Remark Modal */}
      {remarkModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Executive Escalation Remark</h3>
              <button onClick={() => setRemarkModalId(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRemarkSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Official Directive / Remark
                </label>
                <textarea
                  required
                  rows={3}
                  value={remarkText}
                  onChange={(e) => setRemarkText(e.target.value)}
                  placeholder="e.g. Instructed SPCB Nodal Officer to complete re-inspection within 48 hours..."
                  className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setRemarkModalId(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 rounded shadow-xs"
                >
                  Record Remark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
