'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DEPARTMENTS } from '@/lib/data/departments';
import { 
  UserCheck, 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  MapPin, 
  Mail, 
  Phone, 
  FileCheck2, 
  CheckCircle2, 
  Award,
  Lock
} from 'lucide-react';

export default function OfficerProfilePage() {
  const { selectedOfficerDept } = useApp();
  const activeDept = DEPARTMENTS.find(d => d.id === selectedOfficerDept) || DEPARTMENTS[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Competent Scrutiny Officer Profile
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Statutory delegations, cryptographic digital signing credentials, and territorial jurisdiction.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="bg-slate-900 px-6 py-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gov-blue-secondary text-white font-black text-xl flex items-center justify-center border-2 border-blue-400">
              {activeDept.nodalOfficer.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{activeDept.nodalOfficer}</h2>
              <p className="text-xs text-slate-300">{activeDept.designation}</p>
              <p className="text-[11px] font-mono text-blue-300 mt-0.5">Official ID: GOV-HR-88412 • Class-1 Gazetted</p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 text-right">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Statutory Powers Active
            </span>
            <span className="text-[11px] text-slate-400">Valid: Haryana Cadre (2024–2029)</span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Department & Territorial Desk
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-700">
                <Building2 className="w-4 h-4 text-gov-blue-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-900">{activeDept.name}</span>
                  <span className="text-slate-500">Sub-Divisional Industrial Clearance Board</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-gov-blue-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-slate-900">Gurugram Industrial Hub</span>
                  <span className="text-slate-500">IMT Manesar Phase I-IV, Udyog Vihar, Sohna Industrial Corridor</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-gov-blue-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-slate-900">{activeDept.email}</span>
                  <span className="text-slate-500 block">Official NIC Gov Gateway</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-gov-blue-primary shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono text-slate-900">+91 (0124) 283-9100 / Ext 402</span>
                  <span className="text-slate-500 block">Direct Scrutiny Cell Landline</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Digital Signature & Cryptographic Keys
            </h3>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-gov-blue-primary" />
                  Class-3 DSC Hardware Token
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Connected & Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                e-Mudhra / CCA India Registered Certificate. Serial Number: <code className="text-slate-800 font-mono">0x7F82...4C91</code>
              </p>
              <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200 flex justify-between">
                <span>Valid Until: <strong>14-Oct-2027</strong></span>
                <span>FIPS 140-2 Level 3</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-700 shrink-0" />
              <span>Orders signed with this key carry legal presumption under IT Act Section 4.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Delegations Matrix */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-gov-blue-primary" />
          Statutory Authority Delegations
        </h2>
        <p className="text-xs text-slate-500">
          Statutory acts, rules, and government notifications empowering this scrutiny desk:
        </p>

        <div className="space-y-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Water (Prevention & Control of Pollution) Act, 1974</span>
              <span className="text-slate-500">Section 25/26 — Grant or Refusal of Consent to Establish (CTE) & Operate (CTO)</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Delegated</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Air (Prevention & Control of Pollution) Act, 1981</span>
              <span className="text-slate-500">Section 21 — Control of industrial emission stacks & abatement systems</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Delegated</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-start justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Haryana Single Window Act, 2016</span>
              <span className="text-slate-500">Section 8 — Coordinated inspection protocol & statutory deemed approval provisions</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Delegated</span>
          </div>
        </div>
      </div>
    </div>
  );
}
