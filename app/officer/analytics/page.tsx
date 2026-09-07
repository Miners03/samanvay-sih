'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { DEPARTMENTS } from '@/lib/data/departments';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  CalendarCheck2, 
  FileCheck2,
  ArrowUpRight,
  Info
} from 'lucide-react';

export default function OfficerAnalyticsPage() {
  const { selectedOfficerDept, projectApprovals, escalations } = useApp();
  const activeDept = DEPARTMENTS.find(d => d.id === selectedOfficerDept) || DEPARTMENTS[0];

  const deptApprovals = (projectApprovals || []).filter(a => a.departmentId === selectedOfficerDept || selectedOfficerDept === 'all');
  const totalCount = deptApprovals.length;
  const approvedCount = deptApprovals.filter(a => a.status === 'approved' || a.statusLabel === 'Approved').length;
  const reviewCount = deptApprovals.filter(a => a.status === 'in_progress' || a.statusLabel === 'Under Review').length;
  const queryCount = deptApprovals.filter(a => a.status === 'action_required' || a.statusLabel === 'Action Required').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Risk & SLA Performance Analytics
            </h1>
            <span className="bg-blue-100 text-gov-blue-primary text-xs font-bold px-2.5 py-0.5 rounded border border-blue-200">
              {activeDept.shortName} Scrutiny Cell
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Statutory turnaround velocity, risk-tier distribution, and scrutiny performance benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Reporting Window:</span>
          <span className="bg-white border border-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded shadow-xs">
            FY 2025–26 (Q4 Live)
          </span>
        </div>
      </div>

      {/* Statutory Guardrail Disclaimer */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          <strong>Decision-Support Notice:</strong> Performance indicators, risk scoring, and bottleneck estimates are generated strictly for operational workload balance and supervisory visibility. Statutory discretion and evaluation authority reside exclusively with the designated departmental scrutiny officer.
        </p>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-l-4 border-l-blue-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Clearance Time</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">11.4 Days</p>
          <div className="flex items-center gap-1.5 mt-2 text-emerald-700 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>2.8 days faster than statutory benchmark (15d)</span>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-emerald-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">SLA Compliance Rate</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">94.2%</p>
          <p className="text-xs text-slate-500 mt-2">0 Deemed Approval defaults in last 90 days</p>
        </div>

        <div className="bg-white border-l-4 border-l-amber-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deficiency / Query Rate</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">18.6%</p>
          <p className="text-xs text-slate-500 mt-2">Avg applicant response turnaround: 4.2 days</p>
        </div>

        <div className="bg-white border-l-4 border-l-purple-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Joint Inspection Ratio</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">68.0%</p>
          <p className="text-xs text-slate-500 mt-2">Unified with Fire & Factory DISH units</p>
        </div>
      </div>

      {/* Two-Column Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk-Tier Breakdown */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-gov-blue-primary" />
            Application Scrutiny Risk Distribution
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Proactive stratification based on hazardous materials, investment threshold, and site layout parameters.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  Low Risk (Standard Green/Orange Category)
                </span>
                <span className="text-slate-900">58% (64 applications)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '58%' }}></div>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Eligible for fast-track 7-day desk clearance</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-amber-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  Medium Risk (Special Manufacturing & Scale)
                </span>
                <span className="text-slate-900">28% (31 applications)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '28%' }}></div>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Requires technical wing endorsement</span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-red-700 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                  High Risk (Red Category / Heavy Hazardous Chemistry)
                </span>
                <span className="text-slate-900">14% (15 applications)</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: '14%' }}></div>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">Mandatory on-site inspection before Consent Order</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Active High-Risk Case: <strong>GreenTech Battery Plant (SMV/2026/HR/GGM/APP-00106)</strong></span>
            <Link 
              href="/officer/review/SMV-2026-HR-GGM-APP-00106"
              className="font-bold text-gov-blue-primary hover:underline flex items-center gap-1"
            >
              Open Dossier <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* SLA Aging Velocity */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gov-blue-primary" />
            SLA Turnaround Velocity by Processing Stage
          </h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Average days spent in each departmental scrutiny bucket compared to statutory maximums.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2.5">
              <div>
                <span className="font-bold text-slate-900 block">1. Initial Document Adequacy Check</span>
                <span className="text-slate-400 text-[11px]">Statutory allowance: 3 Days</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-700">1.8 Days avg</span>
                <span className="text-[11px] text-slate-400 block">40% under SLA</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2.5">
              <div>
                <span className="font-bold text-slate-900 block">2. Engineering & Technical Scrutiny</span>
                <span className="text-slate-400 text-[11px]">Statutory allowance: 7 Days</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-700">4.9 Days avg</span>
                <span className="text-[11px] text-slate-400 block">30% under SLA</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2.5">
              <div>
                <span className="font-bold text-slate-900 block">3. Joint Physical Site Inspection</span>
                <span className="text-slate-400 text-[11px]">Statutory allowance: 5 Days</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-amber-700">4.1 Days avg</span>
                <span className="text-[11px] text-slate-400 block">Coordinated via Unified Scheduler</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pb-1">
              <div>
                <span className="font-bold text-slate-900 block">4. Final Competent Authority Endorsement</span>
                <span className="text-slate-400 text-[11px]">Statutory allowance: 2 Days</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-700">0.9 Days avg</span>
                <span className="text-[11px] text-slate-400 block">Digital DSC Signing</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Live SLA Monitor: 1 docket approaching SLA threshold (&le;10 days)</span>
            <Link 
              href="/officer/sla-monitor"
              className="font-bold text-amber-700 hover:underline flex items-center gap-1"
            >
              Inspect SLA Monitor <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
