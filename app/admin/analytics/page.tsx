'use client';

import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Building2, 
  CalendarCheck2, 
  Layers, 
  PieChart, 
  ArrowUpRight,
  Info,
  CheckCircle2
} from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              State Strategic Single-Window Analytics
            </h1>
            <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded border border-purple-200">
              MACRO PERFORMANCE
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Ease of Doing Business (EoDB) clearance turnaround velocity, capital investment enablement, and deemed approval audits.
          </p>
        </div>

        <span className="bg-white border border-slate-300 text-slate-700 text-xs font-bold px-3 py-1.5 rounded shadow-xs">
          State Consolidated Hub: FY 2025–26
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border-l-4 border-l-purple-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Industrial Capital Unlocked</span>
          <p className="text-2xl font-black text-slate-900 mt-2">₹4,820.5 Cr</p>
          <div className="flex items-center gap-1.5 mt-2 text-emerald-700 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% YoY capital pipeline</span>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-blue-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Clearance Turnaround</span>
          <p className="text-2xl font-black text-slate-900 mt-2">13.8 Days</p>
          <div className="flex items-center gap-1.5 mt-2 text-emerald-700 text-xs font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>34% reduction vs 2023 baseline</span>
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-emerald-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deemed Clearances Issued</span>
          <p className="text-2xl font-black text-emerald-700 mt-2">12 Dockets</p>
          <p className="text-xs text-slate-500 mt-2">Section 12 automatic grants without default</p>
        </div>

        <div className="bg-white border-l-4 border-l-amber-500 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coordinated Site Visits</span>
          <p className="text-2xl font-black text-slate-900 mt-2">16 Multi-Dept</p>
          <p className="text-xs text-slate-500 mt-2">28% duplicate visit reduction index</p>
        </div>
      </div>

      {/* Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-700" />
            Sector-Wise Capital Allocation
          </h2>
          <p className="text-xs text-slate-500">
            Investment projects undergoing coordinated clearance dockets in Haryana Industrial Zones.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Renewable Energy & Battery Storage</span>
                <span>44% (₹2,120 Cr)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gov-blue-primary h-full rounded-full" style={{ width: '44%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Electric Vehicle Component Manufacturing</span>
                <span>26% (₹1,250 Cr)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: '26%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Precision Engineering & Aerospace Parts</span>
                <span>18% (₹870 Cr)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Pharmaceuticals & Formulation Units</span>
                <span>12% (₹580 Cr)</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '12%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-700" />
            Statutory SLA Compliance Distribution
          </h2>
          <p className="text-xs text-slate-500">
            Clearance velocity stratified across statutory SLA performance tiers.
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-emerald-950 block">Fast-Track Clearance (&lt;50% of SLA time)</span>
                <span className="text-emerald-800 text-[11px]">88 Applications processed ahead of schedule</span>
              </div>
              <span className="font-bold text-emerald-700 text-sm">54%</span>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-blue-950 block">Standard Clearance (50%–90% of SLA time)</span>
                <span className="text-blue-800 text-[11px]">52 Applications within statutory allowance</span>
              </div>
              <span className="font-bold text-blue-700 text-sm">32%</span>
            </div>

            <div className="p-3 bg-red-50 border border-red-200 rounded flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-red-950 block">At-Risk or Breached (&gt;90% of SLA time)</span>
                <span className="text-red-800 text-[11px]">23 Applications subject to executive escalation</span>
              </div>
              <span className="font-bold text-red-700 text-sm">14%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
