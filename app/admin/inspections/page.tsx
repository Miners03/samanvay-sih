'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { 
  CalendarCheck2, 
  TrendingDown, 
  CheckCircle2, 
  Clock, 
  Building2, 
  MapPin, 
  Users, 
  ArrowUpRight, 
  Sparkles,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminInspectionsPage() {
  const { unifiedInspection } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              State Unified Inspection Oversight & Optimization
            </h1>
            <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded border border-purple-200">
              STATE JOINT PROTOCOL
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Coordinated site inspection scheduling, overlap analysis, and regulatory burden reduction tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded border border-emerald-300 flex items-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
            <span>28% Fewer Site Visits Achieved</span>
          </span>
        </div>
      </div>

      {/* Optimization Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border-l-4 border-l-slate-400 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Standalone Requests</span>
          <p className="text-2xl font-black text-slate-700 mt-2">57</p>
          <span className="text-xs text-slate-500 mt-1 block">Uncoordinated single visits</span>
        </div>

        <div className="bg-white border-l-4 border-l-purple-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Potentially Combinable</span>
          <p className="text-2xl font-black text-purple-900 mt-2">41</p>
          <span className="text-xs text-purple-700 mt-1 block">Commonality score &ge; 70%</span>
        </div>

        <div className="bg-white border-l-4 border-l-emerald-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unified Visits Scheduled</span>
          <p className="text-2xl font-black text-emerald-700 mt-2">16</p>
          <span className="text-xs text-emerald-700 mt-1 block">Clustered multi-department</span>
        </div>

        <div className="bg-white border-l-4 border-l-blue-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant Days Saved</span>
          <p className="text-2xl font-black text-blue-700 mt-2">6.2 Days</p>
          <span className="text-xs text-blue-700 mt-1 block">Average downtime saved</span>
        </div>
      </div>

      {/* Simulated Analytics Disclaimer */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-gov-blue-primary shrink-0 mt-0.5" />
        <p className="text-xs text-blue-900 leading-relaxed">
          <strong>Prototype/Simulated Analytics:</strong> Inspection clustering algorithm compares geo-coordinates, construction progress milestones, and statutory inspection mandates across Fire, SPCB, and Labour departments. Officers conduct joint physical visits while maintaining 100% independent checklists and legal findings.
        </p>
      </div>

      {/* Live Active Coordinated Case Spotlight */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-purple-300">
                ACTIVE UNIFIED DOCKET
              </span>
              <h2 className="text-base font-black text-slate-900">
                {unifiedInspection.projectName}
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{unifiedInspection.facilityLocation}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Commonality Match</span>
              <span className="text-lg font-black text-purple-900">{unifiedInspection.commonalityScore}% Overlap</span>
            </div>
            <Link
              href="/officer/inspections"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gov-blue-primary hover:bg-gov-blue-secondary text-white text-xs font-bold rounded shadow-xs"
            >
              Open Unified Inspector <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Participating Departments Bar */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Coordinated Inspecting Wings (3 Individual Visits Unified into 1)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {unifiedInspection.participatingDepartments.map((dept) => (
                <div key={dept.departmentId} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{dept.departmentName}</span>
                    <span className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded',
                      dept.checklistSubmitted 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    )}>
                      {dept.checklistSubmitted ? 'Checklist Completed' : 'Pending Site Visit'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    <div>Nodal Inspector: <strong>{dept.officerName}</strong></div>
                    <div className="font-mono text-[11px] text-slate-400">Approval: {dept.approvalCode}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overlap Matrix */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Cross-Department Requirement Overlap Matrix
            </h3>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 font-bold border-b border-slate-200 text-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Inspection Criterion</th>
                    <th className="py-2.5 px-4 text-center">Fire & Emergency</th>
                    <th className="py-2.5 px-4 text-center">Pollution Control</th>
                    <th className="py-2.5 px-4 text-center">Labour / DISH</th>
                    <th className="py-2.5 px-4 text-right">Coordination Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800">Physical Site & Boundary Verification</td>
                    <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">✓</td>
                    <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">✓</td>
                    <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">✓</td>
                    <td className="py-2.5 px-4 text-right text-emerald-700 font-bold">100% Unified Check</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800">Premises Layout & Structural Corridors</td>
                    <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">✓</td>
                    <td className="py-2.5 px-4 text-center text-slate-400">—</td>
                    <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">✓</td>
                    <td className="py-2.5 px-4 text-right text-emerald-700 font-bold">Joint Inspection</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800">Environmental & Effluent Safeguards</td>
                    <td className="py-2.5 px-4 text-center text-slate-400">—</td>
                    <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">✓</td>
                    <td className="py-2.5 px-4 text-center text-slate-400">—</td>
                    <td className="py-2.5 px-4 text-right text-slate-600">SPCB Specialist Wing</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-bold text-slate-800">Worker Safety, Ventilation & PPE</td>
                    <td className="py-2.5 px-4 text-center text-slate-400">—</td>
                    <td className="py-2.5 px-4 text-center text-slate-400">—</td>
                    <td className="py-2.5 px-4 text-center text-emerald-700 font-bold">✓</td>
                    <td className="py-2.5 px-4 text-right text-slate-600">DISH Specialist Wing</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
