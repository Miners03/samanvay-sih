'use client';

import React from 'react';
import Link from 'next/link';
import { DEPARTMENTS } from '@/lib/data/departments';
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Award,
  ArrowUpRight,
  Layers,
  AlertTriangle
} from 'lucide-react';

export default function AdminDepartmentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              State Department Directory & Velocity Benchmark
            </h1>
            <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded border border-purple-200">
              6 INTEGRATED NODAL AUTHORITIES
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Directory of statutory authorities, gazetted nodal officers, benchmark clearance velocity, and digital integration tiers.
          </p>
        </div>

        <Link
          href="/admin/workload"
          className="inline-flex items-center gap-2 bg-gov-blue-primary hover:bg-gov-blue-secondary text-white text-xs font-bold px-4 py-2 rounded shadow-xs"
        >
          <span>View Officer Desks</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="bg-slate-900 text-white font-mono text-xs font-bold px-2 py-0.5 rounded">
                  {dept.code}
                </span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                  Live API Sync
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {dept.name}
                </h3>
                <span className="text-xs text-slate-500 font-medium">{dept.shortName}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded text-xs text-slate-700 space-y-2 border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Nodal Officer</span>
                  <p className="font-bold text-slate-900">{dept.nodalOfficer}</p>
                  <p className="text-[11px] text-slate-500">{dept.designation}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] space-y-1 text-slate-600">
                  <p className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{dept.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono">{dept.phone}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50/60 p-2.5 rounded border border-blue-100">
                  <span className="text-[10px] text-blue-900 block font-semibold">Statutory SLA</span>
                  <span className="font-bold text-blue-950 text-sm">{dept.slaDays} Days</span>
                </div>
                <div className="bg-emerald-50/60 p-2.5 rounded border border-emerald-100">
                  <span className="text-[10px] text-emerald-900 block font-semibold">Avg Turnaround</span>
                  <span className="font-bold text-emerald-950 text-sm">{dept.avgClearanceDays} Days</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500">Active Pipeline: <strong>{dept.totalActiveApplications} dockets</strong></span>
                <Link
                  href={`/admin/applications?dept=${dept.id}`}
                  className="font-bold text-gov-blue-primary hover:underline flex items-center gap-1"
                >
                  View Dockets <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
