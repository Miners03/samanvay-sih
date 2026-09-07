'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Send, 
  UserCheck, 
  MessageSquare, 
  Check, 
  X, 
  ArrowRight, 
  Building2, 
  Clock 
} from 'lucide-react';

export default function EscalationCenterPage() {
  const { escalations, addEscalationRemark, escalateItem, showToast } = useApp();
  const [activeRemarkModal, setActiveRemarkModal] = useState<string | null>(null);
  const [remarkText, setRemarkText] = useState('');

  const handleRemarkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRemarkModal || !remarkText) return;
    addEscalationRemark(activeRemarkModal, remarkText);
    setRemarkText('');
    setActiveRemarkModal(null);
  };

  const handleNotifyDepartment = (deptName: string) => {
    showToast(
      'Statutory Notice Dispatched',
      `Urgent SLA compliance notice dispatched to ${deptName} directorate desk.`,
      'info'
    );
  };

  const handleReassign = (appCode: string) => {
    showToast(
      'Workload Reassignment Requested',
      `Reassignment request lodged for ${appCode} with Department Nodal Head.`,
      'info'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Departmental Escalation Center"
        subtitle="Intervention Desk: Address statutory bottlenecks, dispatch expedited compliance reminders, log executive remarks, and escalate SLA-at-risk dockets."
        breadcrumbs={[
          { label: 'Government Portal', href: '/officer/dashboard' },
          { label: 'Escalations', current: true },
        ]}
        badge={
          <span className="bg-red-100 text-red-900 border border-red-300 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-red-700" />
            {escalations.length} Active Escalations
          </span>
        }
      />

      {/* Escalation Cards Grid */}
      <div className="space-y-4">
        {escalations.map((esc) => {
          const isCritical = esc.severity === 'Critical';
          const isHigh = esc.severity === 'High';

          return (
            <div
              key={esc.id}
              className={`bg-white rounded-lg border-l-4 shadow-gov p-5 space-y-4 transition-all ${
                isCritical ? 'border-l-red-600 border-red-200' :
                isHigh ? 'border-l-amber-500 border-amber-200' :
                'border-l-blue-500 border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className={`font-bold px-2 py-0.5 rounded border uppercase text-[10px] ${
                      isCritical ? 'bg-red-100 text-red-900 border-red-300' :
                      isHigh ? 'bg-amber-100 text-amber-900 border-amber-300' :
                      'bg-blue-100 text-blue-900 border-blue-300'
                    }`}>
                      {esc.severity} Severity
                    </span>
                    <span className="font-mono text-slate-500 font-bold">
                      {esc.approvalCode}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 font-medium">
                      {esc.departmentName}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-gov-blue-primary font-semibold">
                      Owner: {esc.officerName}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {esc.applicationName}
                  </h3>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                    <strong>Reason for Escalation:</strong> {esc.reason}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-red-700 font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      {esc.timeOverdue}
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">
                      Escalation Level: <strong>{esc.escalationLevel}</strong>
                    </span>
                  </div>

                  {/* Remarks History */}
                  {esc.remarks.length > 0 && (
                    <div className="space-y-1 pt-1 text-xs">
                      <span className="font-bold text-slate-700 block text-[11px]">Audit Remarks:</span>
                      {esc.remarks.map((rem, idx) => (
                        <p key={idx} className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                          {rem}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4 Interactive Actions: Notify Department, Escalate, Reassign, Add Remark */}
                <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2 pt-2 lg:pt-0">
                  <button
                    onClick={() => handleNotifyDepartment(esc.departmentName)}
                    className="bg-blue-50 hover:bg-blue-100 text-gov-blue-primary border border-blue-200 font-bold px-3 py-1.5 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Notify Department</span>
                  </button>

                  <button
                    onClick={() => escalateItem(esc.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 font-bold px-3 py-1.5 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                    <span>Escalate Level</span>
                  </button>

                  <button
                    onClick={() => handleReassign(esc.approvalCode)}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold px-3 py-1.5 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reassign Docket</span>
                  </button>

                  <button
                    onClick={() => setActiveRemarkModal(esc.id)}
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold px-3 py-1.5 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>Add Remark</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Remark Modal */}
      {activeRemarkModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-md w-full p-5 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h4 className="font-bold text-slate-900 text-sm">Add Official Scrutiny Remark</h4>
              <button onClick={() => setActiveRemarkModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleRemarkSubmit} className="space-y-3">
              <textarea
                value={remarkText}
                onChange={(e) => setRemarkText(e.target.value)}
                rows={3}
                placeholder="Enter official observation or administrative directive..."
                className="w-full p-2.5 rounded border border-slate-300 text-xs"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveRemarkModal(null)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gov-blue-primary hover:bg-gov-blue-secondary text-white font-bold px-4 py-1.5 rounded text-xs"
                >
                  Save Remark
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
