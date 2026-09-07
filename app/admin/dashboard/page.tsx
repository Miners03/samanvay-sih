'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { DEPARTMENTS } from '@/lib/data/departments';
import { 
  Building2, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  AlertTriangle, 
  CalendarCheck2, 
  Flame, 
  BarChart3, 
  ArrowUpRight, 
  ShieldAlert, 
  Zap, 
  Info,
  TrendingDown,
  Sparkles,
  Search,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { project, projectApprovals, escalations, escalateItem } = useApp();
  const [escalateSuccess, setEscalateSuccess] = useState<string | null>(null);

  const handleEscalateAlert = (deptCode: string, reason: string) => {
    escalateItem({
      applicationId: 'SMV/2026/HR/GGM/APP-00106',
      applicationName: `${deptCode} Regulatory Pipeline Clearance`,
      approvalCode: deptCode === 'HSPCB' ? 'HSPCB-CTE' : 'DISH-FACT-REG',
      departmentName: deptCode === 'HSPCB' ? 'State Pollution Control Board' : 'Labour Dept / DISH',
      officerName: 'Directorate Technical Scrutiny Cell',
      severity: 'Critical',
      reason: reason,
      timeOverdue: '48 Hours beyond standard threshold',
      escalationLevel: 'Level 3: Apex Committee',
    });
    setEscalateSuccess(`Statutory SLA Escalation issued for ${deptCode}. Apex alert dispatched to Directorate.`);
    setTimeout(() => setEscalateSuccess(null), 5000);
  };

  // Department comparison data with comprehensive fields
  const departmentPerformance = [
    {
      name: 'State Pollution Control Board',
      code: 'HSPCB',
      pending: 47,
      slaAtRisk: 18,
      slaBreached: 5,
      avgProcessing: '19.2 Days',
      benchmark: '12 Days',
      inspectionBacklog: 14,
      queryBacklog: 21,
      status: 'critical'
    },
    {
      name: 'Labour Dept / Factory Safety (DISH)',
      code: 'DISH-HR',
      pending: 34,
      slaAtRisk: 11,
      slaBreached: 3,
      avgProcessing: '16.8 Days',
      benchmark: '14 Days',
      inspectionBacklog: 9,
      queryBacklog: 15,
      status: 'warning'
    },
    {
      name: 'Fire & Emergency Services',
      code: 'SFES-HR',
      pending: 22,
      slaAtRisk: 4,
      slaBreached: 0,
      avgProcessing: '9.4 Days',
      benchmark: '15 Days',
      inspectionBacklog: 5,
      queryBacklog: 4,
      status: 'optimal'
    },
    {
      name: 'Town & Country Planning (Building)',
      code: 'DTCP',
      pending: 29,
      slaAtRisk: 8,
      slaBreached: 2,
      avgProcessing: '21.5 Days',
      benchmark: '20 Days',
      inspectionBacklog: 11,
      queryBacklog: 12,
      status: 'warning'
    },
    {
      name: 'Electricity Distribution (DISCOM / DHBVN)',
      code: 'DHBVN',
      pending: 19,
      slaAtRisk: 3,
      slaBreached: 0,
      avgProcessing: '10.1 Days',
      benchmark: '15 Days',
      inspectionBacklog: 3,
      queryBacklog: 2,
      status: 'optimal'
    },
    {
      name: 'HSVP / HSIIDC Land & Estate',
      code: 'HSIIDC',
      pending: 12,
      slaAtRisk: 1,
      slaBreached: 0,
      avgProcessing: '6.5 Days',
      benchmark: '10 Days',
      inspectionBacklog: 1,
      queryBacklog: 1,
      status: 'optimal'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              State Inter-Departmental Coordination Dashboard
            </h1>
            <span className="bg-purple-100 text-purple-900 text-xs font-black px-2.5 py-0.5 rounded border border-purple-200">
              CHIEF SECRETARY APEX CELL
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Real-time cross-departmental clearance velocity, bottleneck diagnosis, and unified inspection governance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-900 text-xs font-mono font-bold px-2.5 py-1 rounded border border-amber-300">
            Data Source: Live Single-Window State Hub
          </span>
        </div>
      </div>

      {escalateSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs">
          <span>{escalateSuccess}</span>
          <button onClick={() => setEscalateSuccess(null)} className="text-emerald-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* 1. SYSTEM-WIDE STAT CARDS (7 required, labeled "Demo Data") */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              System-Wide Pipeline Indicators
            </h2>
            <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
              Demo Data
            </span>
          </div>
          <span className="text-xs text-slate-400">State consolidated across 6 departments</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {/* Card 1: Total Applications */}
          <div className="bg-white border-l-4 border-l-blue-600 rounded-lg p-4 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Total Dockets</span>
              <Layers className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">163</p>
            <span className="text-[10px] text-slate-500 block mt-1">FY 2025–26 Pipeline</span>
          </div>

          {/* Card 2: Active */}
          <div className="bg-white border-l-4 border-l-indigo-600 rounded-lg p-4 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Active</span>
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">48</p>
            <span className="text-[10px] text-indigo-700 font-medium block mt-1">Under Scrutiny</span>
          </div>

          {/* Card 3: Approved */}
          <div className="bg-white border-l-4 border-l-emerald-600 rounded-lg p-4 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Approved</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">105</p>
            <span className="text-[10px] text-emerald-700 font-medium block mt-1">Cleared / Stamped</span>
          </div>

          {/* Card 4: SLA At Risk */}
          <div className="bg-white border-l-4 border-l-amber-500 rounded-lg p-4 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>SLA At Risk</span>
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-amber-600 mt-2">23</p>
            <span className="text-[10px] text-amber-700 font-bold block mt-1">&le;3 Days to Deemed</span>
          </div>

          {/* Card 5: SLA Breached */}
          <div className="bg-white border-l-4 border-l-red-600 rounded-lg p-4 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>SLA Breached</span>
              <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
            </div>
            <p className="text-2xl font-black text-red-600 mt-2">10</p>
            <span className="text-[10px] text-red-700 font-bold block mt-1">Statutory Overdue</span>
          </div>

          {/* Card 6: Active Inspections */}
          <div className="bg-white border-l-4 border-l-purple-600 rounded-lg p-4 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Inspections</span>
              <CalendarCheck2 className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-purple-700 mt-2">32</p>
            <span className="text-[10px] text-purple-700 font-medium block mt-1">16 Unified Visits</span>
          </div>

          {/* Card 7: Escalations */}
          <div className="bg-white border-l-4 border-l-rose-600 rounded-lg p-4 shadow-xs border border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
              <span>Escalations</span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <p className="text-2xl font-black text-rose-600 mt-2">{escalations.length}</p>
            <span className="text-[10px] text-rose-700 font-bold block mt-1">Level 2 & 3 Active</span>
          </div>
        </div>
      </div>

      {/* 2. AUTOMATIC SLA ALERTS PANEL */}
      <div className="bg-gradient-to-r from-red-50 via-amber-50 to-white rounded-lg border border-red-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-red-600 text-white flex items-center justify-center font-bold">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-red-950 uppercase tracking-tight">
                Automatic SLA Threat Alerts — Immediate Intervention Recommended
              </h2>
              <p className="text-xs text-red-800">
                Automated detection based on statutory countdown thresholds under Haryana Single Window Act 2016.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-red-700 bg-red-100 px-2.5 py-1 rounded border border-red-300">
            2 CRITICAL TRIGGERS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Alert 1 */}
          <div className="bg-white p-4 rounded-md border border-red-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                  CRITICAL VELOCITY BREACH
                </span>
                <h3 className="text-xs font-bold text-slate-900 mt-1.5">
                  State Pollution Control Board (HSPCB)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-red-600">Avg 19.2d vs 12d cap</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>23 applications approaching/exceeding SLA</strong>. Total department backlog is <strong>47</strong> filings. Average processing takes 19.2 days against the statutory benchmark of 12 days.
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <Link 
                href="/admin/departments" 
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
              >
                View Department
              </Link>
              <Link 
                href="/admin/applications?dept=SPCB" 
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
              >
                View Applications
              </Link>
              <button 
                onClick={() => handleEscalateAlert('HSPCB', '23 applications approaching/exceeding SLA, backlog 47')}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded ml-auto flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" />
                Escalate
              </button>
            </div>
          </div>

          {/* Alert 2 */}
          <div className="bg-white p-4 rounded-md border border-amber-200 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                  QUERY LOOP RETENTION
                </span>
                <h3 className="text-xs font-bold text-slate-900 mt-1.5">
                  Labour Dept / Factory Safety (DISH)
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-600">11 Dockets in Limbo</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>11 applications held in extended technical queries</strong> on emergency layout corridors. Cumulative delay holding up Stage 3 operational clearances across Gurugram industrial dockets.
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <Link 
                href="/admin/departments" 
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
              >
                View Department
              </Link>
              <Link 
                href="/admin/applications?dept=LABOUR" 
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded"
              >
                View Applications
              </Link>
              <button 
                onClick={() => handleEscalateAlert('DISH-HR', 'Corridor query loop holding up factory certifications')}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded ml-auto flex items-center gap-1"
              >
                <AlertTriangle className="w-3 h-3" />
                Escalate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTLENECK DETECTION & INSPECTION OPTIMISATION (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bottleneck Detection Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-700" />
                Systemic Clearance Bottleneck Detection
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Where filings spend statutory time across all departments (Live analysis).
              </p>
            </div>
            <span className="bg-purple-50 text-purple-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-purple-200">
              DECISION SUPPORT
            </span>
          </div>

          <div className="space-y-3.5">
            {/* 1. Document Verification 31% */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  Document Verification & Deficiency Queries
                </span>
                <span className="font-mono text-red-600 font-black">31% (Largest Delay Factor)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-red-600 h-full rounded-full" style={{ width: '31%' }}></div>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Repeated queries on structural drawings and ZLD effluent plans</span>
            </div>

            {/* 2. Inspection Scheduling 24% */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Inspection Scheduling & Site Availability
                </span>
                <span className="font-mono text-amber-600 font-black">24%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '24%' }}></div>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Individual department visits creating scheduling friction</span>
            </div>

            {/* 3. Officer Technical Review 19% */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  Officer Desk Technical Scrutiny
                </span>
                <span className="font-mono text-blue-600 font-black">19%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '19%' }}></div>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Desk backlog at HSPCB and DISH scrutiny cells</span>
            </div>

            {/* 4. Applicant Response Time 15% */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
                  Applicant Clarification Response Time
                </span>
                <span className="font-mono text-slate-700 font-black">15%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-slate-500 h-full rounded-full" style={{ width: '15%' }}></div>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Time taken by businesses to re-upload revised engineering files</span>
            </div>

            {/* 5. Final Decision & DSC Signing 11% */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-800 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  Final Competent Authority Order & DSC Signing
                </span>
                <span className="font-mono text-emerald-600 font-black">11%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '11%' }}></div>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Competent authority digital signature and certificate issuance</span>
            </div>
          </div>
        </div>

        {/* Inspection Optimisation Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck2 className="w-4 h-4 text-purple-700" />
                Inspection Optimisation Panel
              </h2>
              <span className="bg-blue-50 text-blue-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-blue-200">
                Prototype/Simulated Analytics
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cross-departmental site visit clustering algorithm results for Haryana State.
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Standalone</span>
                <span className="text-xl font-black text-slate-700 mt-1 block">57</span>
                <span className="text-[10px] text-slate-500">Uncoordinated</span>
              </div>

              <div className="p-3 bg-purple-50 rounded border border-purple-200">
                <span className="text-purple-700 text-[10px] uppercase font-bold block">Combinable</span>
                <span className="text-xl font-black text-purple-900 mt-1 block">41</span>
                <span className="text-[10px] text-purple-700">Common &ge;70%</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                <span className="text-emerald-700 text-[10px] uppercase font-bold block">Unified</span>
                <span className="text-xl font-black text-emerald-800 mt-1 block">16</span>
                <span className="text-[10px] text-emerald-700">Visits Scheduled</span>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-md">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <TrendingDown className="w-4 h-4 text-emerald-700" />
                <span>28% Fewer Duplicate Site Visits</span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                By clustering Fire Services, Pollution Control, and Factory Safety inspections onto shared calendars, applicant disruption is cut by 6.2 days on average.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Active Joint Inspection: <strong>GreenTech IMT Manesar</strong></span>
            <Link 
              href="/admin/inspections" 
              className="text-gov-blue-primary font-bold hover:underline flex items-center gap-1"
            >
              Inspect Matrix <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. CROSS-DEPARTMENT PROJECT VIEW (MAJOR USP: Visibility no single department has alone) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-700" />
                Cross-Department Master Project Audit: GreenTech Battery Facility
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
                LIVE CANONICAL CASE
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Ref: <code className="font-mono font-bold text-gov-blue-primary">SMV/2026/HR/GGM/00482</code> • GreenTech CleanEnergy Pvt. Ltd. • IMT Manesar Phase-II • Investment: ₹48.50 Cr
            </p>
          </div>

          <div className="p-2 bg-purple-100 text-purple-900 rounded text-[11px] font-bold flex items-center gap-1.5 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            <span>Apex Cross-Department Dependency Radar</span>
          </div>
        </div>

        {/* Crucial Insight Banner */}
        <div className="px-5 py-3 bg-blue-50 border-b border-blue-200 flex items-start gap-2.5 text-xs text-blue-900">
          <Info className="w-4 h-4 text-gov-blue-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Unique Administrative Advantage:</strong> Individual departments only see their own siloed filings. The Apex Coordination View maps the complete cross-department chain, immediately highlighting that the <strong>SPCB CTE query</strong> is the single critical bottleneck locking downstream Stage 3 & 4 clearances.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Stage / Approval</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Filing ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Statutory SLA</th>
                <th className="py-3 px-4">Downstream Dependency Impact</th>
                <th className="py-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Row 1: Land (Approved) */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  Land Allotment & Possession
                </td>
                <td className="py-3.5 px-4 text-slate-600">HSIIDC Estate Office</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">SMV/2026/HR/GGM/APP-00101</td>
                <td className="py-3.5 px-4">
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px] border border-emerald-200">
                    Approved
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500">Cleared in 6d (SLA: 15d)</td>
                <td className="py-3.5 px-4 text-slate-500">Prerequisite for site plan cleared</td>
                <td className="py-3.5 px-4 text-right">
                  <Link href="/officer/review/SMV-2026-HR-GGM-APP-00101" className="text-gov-blue-primary font-bold hover:underline">
                    View
                  </Link>
                </td>
              </tr>

              {/* Row 2: SPCB CTE (HIGHLIGHTED CURRENT BOTTLENECK ROW) */}
              <tr className="bg-red-50/80 border-y-2 border-red-400 hover:bg-red-50 transition-colors">
                <td className="py-3.5 px-4 font-black text-red-950">
                  <div className="flex items-center gap-2">
                    <span>Consent to Establish (CTE)</span>
                    <span className="bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded animate-pulse">
                      CURRENT BOTTLENECK
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-bold text-red-900">State Pollution Control Board</td>
                <td className="py-3.5 px-4 font-mono font-bold text-red-900">SMV/2026/HR/GGM/APP-00106</td>
                <td className="py-3.5 px-4">
                  <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded font-bold text-[10px] border border-red-300">
                    Action Required (Query Active)
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-red-700">
                  Day 12 of 15 (3 Days left)
                </td>
                <td className="py-3.5 px-4 text-red-900 font-medium">
                  <strong>Blocks Fire NOC & Factory CTO</strong>. Applicant submitted response 14m ago.
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link 
                    href="/officer/review/SMV-2026-HR-GGM-APP-00106" 
                    className="inline-flex items-center gap-1 bg-red-600 text-white px-2.5 py-1 rounded text-xs font-bold hover:bg-red-700 shadow-xs"
                  >
                    Intervene <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>

              {/* Row 3: Factory DISH (Also Action Required / Query) */}
              <tr className="bg-amber-50/50 hover:bg-amber-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-amber-950">
                  <div className="flex items-center gap-2">
                    <span>Factory Registration & Safety Approval</span>
                    <span className="bg-amber-600 text-white text-[9px] font-bold uppercase px-1.5 py-0.2 rounded">
                      SECONDARY QUERY
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-amber-900">Labour Dept / DISH</td>
                <td className="py-3.5 px-4 font-mono text-amber-800">SMV/2026/HR/GGM/APP-00107</td>
                <td className="py-3.5 px-4">
                  <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded font-bold text-[10px] border border-amber-300">
                    Action Required (Corridor Query)
                  </span>
                </td>
                <td className="py-3.5 px-4 text-amber-800">Day 11 of 21 (10 Days left)</td>
                <td className="py-3.5 px-4 text-amber-900">Blocks Final Factory Licence</td>
                <td className="py-3.5 px-4 text-right">
                  <Link href="/officer/review/SMV-2026-HR-GGM-APP-00107" className="text-gov-blue-primary font-bold hover:underline">
                    View
                  </Link>
                </td>
              </tr>

              {/* Row 4: DISCOM HT Feasibility (Under Review) */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  11kV HT Power Feasibility
                </td>
                <td className="py-3.5 px-4 text-slate-600">DISCOM (DHBVN)</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">SMV/2026/HR/GGM/APP-00105</td>
                <td className="py-3.5 px-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold text-[10px] border border-blue-200">
                    Under Review
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-500">Day 7 of 15 (8 Days left)</td>
                <td className="py-3.5 px-4 text-slate-500">Transformer installation pending clearance</td>
                <td className="py-3.5 px-4 text-right">
                  <Link href="/officer/review/SMV-2026-HR-GGM-APP-00105" className="text-gov-blue-primary font-bold hover:underline">
                    View
                  </Link>
                </td>
              </tr>

              {/* Row 5: Fire Provisional NOC (Waiting / Locked) */}
              <tr className="hover:bg-slate-50 transition-colors opacity-80">
                <td className="py-3.5 px-4 font-bold text-slate-500 flex items-center gap-1.5">
                  <span>Fire Provisional NOC</span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 rounded font-mono">Sequential</span>
                </td>
                <td className="py-3.5 px-4 text-slate-500">Fire & Emergency Services</td>
                <td className="py-3.5 px-4 font-mono text-slate-400">SMV/2026/HR/GGM/APP-00108</td>
                <td className="py-3.5 px-4">
                  <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold text-[10px]">
                    Waiting / Locked
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-400">SLA paused until unlocked</td>
                <td className="py-3.5 px-4 text-slate-500 italic">
                  Unlocks immediately once SPCB CTE is cleared
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="text-slate-400 text-xs">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. DEPARTMENT PERFORMANCE COMPARISON TABLE */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-700" />
              State Department Velocity & Backlog Benchmark Table
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative turnaround velocity across all 6 nodal clearance authorities.
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Nodal Benchmark Standard: 15 Days
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Pending Dockets</th>
                <th className="py-3 px-4">SLA At Risk</th>
                <th className="py-3 px-4">SLA Breached</th>
                <th className="py-3 px-4">Avg Processing Time</th>
                <th className="py-3 px-4">Inspection Backlog</th>
                <th className="py-3 px-4">Query Backlog</th>
                <th className="py-3 px-4 text-right">Status Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {departmentPerformance.map((dept) => (
                <tr key={dept.code} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{dept.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{dept.code}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold font-mono text-slate-800">{dept.pending}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-600">
                    {dept.slaAtRisk > 0 ? dept.slaAtRisk : '—'}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-red-600">
                    {dept.slaBreached > 0 ? dept.slaBreached : '0'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{dept.avgProcessing}</div>
                    <span className="text-[10px] text-slate-400">Benchmark: {dept.benchmark}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{dept.inspectionBacklog} visits</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{dept.queryBacklog} queries</td>
                  <td className="py-3.5 px-4 text-right">
                    {dept.status === 'optimal' ? (
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold text-[10px] border border-emerald-200">
                        Fast-Track (Green)
                      </span>
                    ) : dept.status === 'warning' ? (
                      <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold text-[10px] border border-amber-200">
                        Under Watch (Amber)
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold text-[10px] border border-red-200">
                        Critical SLA Risk
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
