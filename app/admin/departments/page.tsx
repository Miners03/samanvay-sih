'use client';

import React from 'react';
import { DEPARTMENTS } from '@/lib/data/departments';
import { PageHeader } from '@/components/common/PageHeader';
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Award 
} from 'lucide-react';

export default function AdminDepartmentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Participating Regulatory Departments"
        subtitle="Directory of state regulatory bodies integrated into the Samanvay single-window coordination framework."
        breadcrumbs={[
          { label: 'Admin Directorate', href: '/admin/dashboard' },
          { label: 'Department Velocity', current: true },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="bg-slate-900 text-white font-mono text-xs font-bold px-2 py-0.5 rounded">
                  {dept.code}
                </span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                  Integrated API
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {dept.name}
              </h3>

              <div className="bg-slate-50 p-2.5 rounded text-xs text-slate-700 space-y-1.5 border border-slate-100">
                <div>
                  <span className="text-slate-400 text-[10px] block uppercase font-bold">Nodal Officer</span>
                  <p className="font-bold text-slate-900">{dept.nodalOfficer}</p>
                  <p className="text-[11px] text-slate-500">{dept.designation}</p>
                </div>
                <div className="pt-1 border-t border-slate-200/60 text-[11px] space-y-0.5 text-slate-600">
                  <p className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>{dept.email}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{dept.phone}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
              <div className="bg-blue-50/60 p-2 rounded border border-blue-100">
                <span className="text-[10px] text-blue-900 block font-semibold">Statutory SLA</span>
                <span className="font-bold text-blue-950 text-sm">{dept.slaDays} Days</span>
              </div>
              <div className="bg-emerald-50/60 p-2 rounded border border-emerald-100">
                <span className="text-[10px] text-emerald-900 block font-semibold">Avg Clearance</span>
                <span className="font-bold text-emerald-950 text-sm">{dept.avgClearanceDays} Days</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
