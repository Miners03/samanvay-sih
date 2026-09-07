'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DEPARTMENTS } from '@/lib/data/departments';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { 
  Building2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  BarChart3, 
  AlertOctagon, 
  Layers 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { project } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Inter-Departmental Coordination Dashboard"
        subtitle="State Single Window Authority: Real-time velocity tracking, inter-departmental bottleneck diagnosis, and statutory SLA compliance."
        breadcrumbs={[
          { label: 'Admin Directorate', href: '/admin/dashboard' },
          { label: 'Coordination Dashboard', current: true },
        ]}
        badge={
          <span className="bg-purple-100 text-purple-900 border border-purple-300 text-xs font-bold px-2 py-0.5 rounded">
            STATE CONSOLIDATED
          </span>
        }
      />

      {/* High-level metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="State-wide Active Enterprises"
          value="184"
          subtitle="New &amp; Expansion Units"
          icon={Building2}
          variant="primary"
          badge={{ text: "+14 this month", type: "positive" }}
        />
        <StatCard
          title="Clearance Velocity"
          value="14.2 Days"
          subtitle="Target SLA: 21 Days"
          icon={Clock}
          variant="success"
          badge={{ text: "6.8d ahead of SLA", type: "positive" }}
        />
        <StatCard
          title="Cross-Dept Bottlenecks"
          value="4"
          subtitle="Clearances held > 15 days"
          icon={AlertTriangle}
          variant="warning"
          badge={{ text: "Escalated", type: "warning" }}
        />
        <StatCard
          title="Deemed Approvals Issued"
          value="12"
          subtitle="Auto-granted on SLA expiry"
          icon={ShieldCheck}
          variant="info"
          badge={{ text: "Section 12 Law", type: "neutral" }}
        />
      </div>

      {/* SLA Breach Heatmap & Bottleneck Analyzer */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-600" />
              Inter-Departmental Bottleneck &amp; Escalation Radar
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies dependencies where downstream approvals are blocked by delays in preceding departments.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
            Updated Hourly
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-red-50/70 border border-red-200 space-y-2">
            <div className="flex items-center justify-between font-bold text-red-950">
              <span>Town &amp; Country Planning (TCPD)</span>
              <span className="bg-red-200 text-red-900 px-1.5 py-0.5 rounded text-[10px]">High Delay Risk</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Average clearance duration currently at 22 days vs statutory 30-day cap. 6 building sanctions approaching deemed clearance deadline.
            </p>
            <div className="pt-2 flex justify-between text-[11px] font-semibold text-red-900 border-t border-red-200">
              <span>Impacted downstream:</span>
              <span>Factory Building Permits</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between font-bold text-amber-950">
              <span>State Pollution Control Board (SPCB)</span>
              <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded text-[10px]">Moderate Query Delay</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              High query generation rate (34% of applications receiving scrutiny objections on ETP drawings). Applicant resolution averaging 8 days.
            </p>
            <div className="pt-2 flex justify-between text-[11px] font-semibold text-amber-900 border-t border-amber-200">
              <span>Impacted downstream:</span>
              <span>Consent to Operate (CTO)</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between font-bold text-emerald-950">
              <span>Fire &amp; Emergency Services (SFES)</span>
              <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded text-[10px]">Optimal Velocity</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Provisional NOC issuance averaging 11 days (4 days ahead of statutory 15-day SLA). Joint inspection sync rate at 94%.
            </p>
            <div className="pt-2 flex justify-between text-[11px] font-semibold text-emerald-900 border-t border-emerald-200">
              <span>Performance status:</span>
              <span>Green Tier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Department-wise SLA Velocity Comparison Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-purple-700" />
            Department Clearances &amp; Statutory SLA Compliance Index
          </h3>
          <span className="text-xs text-slate-500">
            Nodal Agency Ranking
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Nodal Officer</th>
                <th className="py-3 px-4">Active Dockets</th>
                <th className="py-3 px-4">Statutory SLA</th>
                <th className="py-3 px-4">Avg Clearance Time</th>
                <th className="py-3 px-4">Deemed Threshold</th>
                <th className="py-3 px-4">Compliance Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {DEPARTMENTS.map((dept) => {
                const ratio = dept.avgClearanceDays / dept.slaDays;
                const isGreat = ratio <= 0.6;
                const isModerate = ratio > 0.6 && ratio <= 0.85;

                return (
                  <tr key={dept.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{dept.name}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{dept.code}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{dept.nodalOfficer}</div>
                      <span className="text-[10px] text-slate-500">{dept.designation}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {dept.totalActiveApplications}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {dept.slaDays} Days
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {dept.avgClearanceDays} Days
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {dept.deemedApprovalThresholdDays} Days
                    </td>
                    <td className="py-3.5 px-4">
                      {isGreat ? (
                        <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold text-[10px] border border-emerald-300">
                          Tier 1 (Fast-Track)
                        </span>
                      ) : isModerate ? (
                        <span className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-bold text-[10px] border border-blue-300">
                          Tier 2 (Standard)
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold text-[10px] border border-amber-300">
                          Tier 3 (Under Scrutiny)
                        </span>
                      )}
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
