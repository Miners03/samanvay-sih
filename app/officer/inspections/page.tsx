'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { 
  CalendarCheck2, 
  MapPin, 
  Users, 
  Building2, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function InspectionsPage() {
  const { project } = useApp();

  const inspections = [
    {
      id: 'insp-01',
      title: 'Joint Pre-Clearance Site Inspection',
      facility: project.name,
      location: `${project.location.industrialArea}, ${project.location.district}`,
      date: '2026-09-18',
      leadDepartment: 'State Pollution Control Board',
      participatingDepartments: ['State Fire & Emergency Services', 'Town & Country Planning'],
      status: 'Scheduled',
      inspectorLead: 'Er. R. K. Sharma (SPCB)',
    },
    {
      id: 'insp-02',
      title: 'Structural Stability & Fire Sprinkler Verification',
      facility: project.name,
      location: `${project.location.industrialArea}, ${project.location.district}`,
      date: '2026-10-05',
      leadDepartment: 'State Fire & Emergency Services Department',
      participatingDepartments: ['Labour & Safety (DISH)'],
      status: 'Upcoming',
      inspectorLead: 'Divisional Fire Officer M. S. Hooda',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Joint Inter-Departmental Inspections"
        subtitle="Single Window Inspection System: Coordinated joint visits to prevent multiple uncoordinated site disruptions."
        breadcrumbs={[
          { label: 'Government Portal', href: '/officer/queue' },
          { label: 'Joint Inspections', current: true },
        ]}
      />

      <div className="bg-blue-50 border border-gov-blue-border rounded-lg p-4 text-xs text-blue-900 flex items-start gap-3">
        <Users className="w-5 h-5 text-gov-blue-secondary shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-gov-blue-primary">Statutory Joint Inspection Mandate</h4>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Under the Ease of Doing Business reform framework, regulatory authorities (Pollution, Fire, Labour, Boilers) must conduct synchronized physical site audits on the same day.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {inspections.map((insp) => (
          <div
            key={insp.id}
            className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="bg-blue-100 text-gov-blue-secondary text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                {insp.id.toUpperCase()}
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                {insp.status}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900">{insp.title}</h3>

            <p className="text-xs text-slate-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {insp.location}
            </p>

            <div className="bg-slate-50 p-2.5 rounded text-xs text-slate-700 space-y-1 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Scheduled Date:</span>
                <span className="font-bold text-slate-900">{formatDate(insp.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lead Inspector:</span>
                <span className="font-medium text-slate-800">{insp.inspectorLead}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Participating:</span>
                <span className="font-medium text-slate-800">{insp.participatingDepartments.join(', ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
