'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  FileCheck, 
  UserCheck 
} from 'lucide-react';

export default function ProfilePage() {
  const { project } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Verified Business Profile"
        subtitle="Single National Enterprise Identity: Synchronized with MCA21, CBDT, GSTN, and Udyam databases."
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Profile', current: true },
        ]}
      />

      {/* Verification Status Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-gov-blue-primary text-white flex items-center justify-center font-bold text-2xl font-serif">
              GT
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{project.companyName}</h2>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  VERIFIED ENTITY
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Constitutional Form: {project.businessType} Company
              </p>
            </div>
          </div>
        </div>

        {/* Identifiers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 text-xs">
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Corporate CIN (MCA21)
            </span>
            <span className="text-sm font-bold font-mono text-slate-900 mt-1 block">
              {project.registrationNumber}
            </span>
            <span className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Active &amp; Good Standing
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Income Tax PAN
            </span>
            <span className="text-sm font-bold font-mono text-slate-900 mt-1 block">
              {project.panNumber}
            </span>
            <span className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> NSDL Verified
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Goods &amp; Services Tax (GSTIN)
            </span>
            <span className="text-sm font-bold font-mono text-slate-900 mt-1 block truncate">
              {project.gstin}
            </span>
            <span className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Regular Taxpayer
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              MSME Udyam Number
            </span>
            <span className="text-sm font-bold font-mono text-slate-900 mt-1 block truncate">
              {project.udyamNumber}
            </span>
            <span className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Medium Enterprise
            </span>
          </div>
        </div>
      </div>

      {/* Contact and Registered Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-4 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-gov-blue-secondary" />
            Registered Corporate Office
          </h3>
          <p className="text-slate-700 text-sm leading-relaxed">
            Plot No. 42-44, Sector 8, IMT Manesar, Gurugram, Haryana - 122050
          </p>
          <div className="pt-2 text-slate-500 text-[11px] space-y-1">
            <p>Jurisdiction: Registrar of Companies (RoC Delhi &amp; Haryana)</p>
            <p>Industrial Estate: Haryana State Industrial &amp; Infrastructure Dev Corp (HSIIDC)</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-4 text-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <UserCheck className="w-4 h-4 text-gov-blue-secondary" />
            Designated Authorised Signatory
          </h3>
          <div className="space-y-2">
            <div>
              <span className="text-slate-500 text-[11px] block">Managing Director / Signatory</span>
              <span className="text-sm font-bold text-slate-900">{project.contactPerson}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{project.contactEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{project.contactPhone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
