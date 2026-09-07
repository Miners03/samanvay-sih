'use client';

import React from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Activity, ShieldCheck, Clock, Download } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const auditLogs = [
    {
      id: 'AUD-88219',
      timestamp: '2026-09-07 16:45:12 IST',
      action: 'Clarification Submitted by Enterprise',
      actor: 'Applicant (Vikramaditya Singhania)',
      entity: 'GreenTech Manufacturing Unit (SMV/2026/HR/GGM/00482)',
      department: 'State Pollution Control Board',
      hash: 'sha256:8f4c2e91a0...',
    },
    {
      id: 'AUD-88218',
      timestamp: '2026-09-07 14:30:00 IST',
      action: 'Official Technical Query Dispatched',
      actor: 'Er. R. K. Sharma (SPCB Reviewer)',
      entity: 'GreenTech Manufacturing Unit',
      department: 'State Pollution Control Board',
      hash: 'sha256:7b1e4288c9...',
    },
    {
      id: 'AUD-88217',
      timestamp: '2026-09-04 09:00:22 IST',
      action: 'Statutory Clearance Order Issued',
      actor: 'Ar. Devender Singh (District Town Planner)',
      entity: 'Sanction of Architectural Drawings (TCPD/IND/2026/0441)',
      department: 'Town & Country Planning',
      hash: 'sha256:4a9910d65e...',
    },
    {
      id: 'AUD-88216',
      timestamp: '2026-09-02 16:00:00 IST',
      action: 'Joint Inspection Synchronized',
      actor: 'Inter-Departmental Single Window System',
      entity: 'Joint Site Visit Scheduled for 18th Sept 2026',
      department: 'SPCB & Fire Services',
      hash: 'sha256:32cba911f4...',
    },
    {
      id: 'AUD-88215',
      timestamp: '2026-08-23 11:15:40 IST',
      action: 'Provisional Fire Safety NOC Issued',
      actor: 'Chief Fire Officer M. S. Hooda',
      entity: 'SFES-NOC-PROV (Certificate: SFES/GGM/NOC/2026/092)',
      department: 'State Fire & Emergency Services',
      hash: 'sha256:109e4a3b8c...',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Statutory Digital Audit Trail"
        subtitle="Immutable ledger of all administrative decisions, query issuances, document submissions and dispatch orders."
        breadcrumbs={[
          { label: 'Admin Directorate', href: '/admin/dashboard' },
          { label: 'Audit Trail', current: true },
        ]}
        action={
          <button
            onClick={() => alert('Exporting signed audit ledger in CSV/PDF format...')}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded shadow transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Verified Ledger</span>
          </button>
        }
      />

      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Activity className="w-4 h-4 text-purple-700" />
            <span>Cryptographic Activity Ledger</span>
          </div>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Tamper-Proof Timestamps Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Authorized Actor</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Integrity Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{log.id}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-600">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-900">{log.action}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-800">{log.actor}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-700 truncate max-w-xs">{log.entity}</td>
                  <td className="py-3.5 px-4 font-sans font-medium text-slate-800">{log.department}</td>
                  <td className="py-3.5 px-4 text-slate-400">{log.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
