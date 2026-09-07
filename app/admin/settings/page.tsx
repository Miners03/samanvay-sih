'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Clock, 
  Database, 
  KeyRound, 
  Save, 
  CheckCircle2,
  Lock,
  Building2,
  Server
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Settings form states
  const [slaCapDays, setSlaCapDays] = useState(15);
  const [deemedApprovalGraceHours, setDeemedApprovalGraceHours] = useState(72);
  const [autoEscalateThresholdPercent, setAutoEscalateThresholdPercent] = useState(85);
  const [jointInspectionThresholdPercent, setJointInspectionThresholdPercent] = useState(70);
  const [enableImmutableAudit, setEnableImmutableAudit] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Single-Window Governance & System Controls
          </h1>
          <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded border border-purple-200">
            APEX CONFIGURATION
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          Statutory SLA parameters, automated Deemed Approval thresholds, and cryptographic audit policies.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>System configuration saved and synced to all departmental scrutiny gateways.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* SLA & Deemed Approval Settings */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <Clock className="w-4 h-4 text-gov-blue-primary" />
            <h2 className="text-sm font-bold text-slate-900">
              Statutory SLA & Deemed Approval Policy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                State Standard SLA Maximum (Days)
              </label>
              <input
                type="number"
                min={5}
                max={60}
                value={slaCapDays}
                onChange={(e) => setSlaCapDays(parseInt(e.target.value) || 15)}
                className="w-full p-2.5 border border-slate-300 rounded bg-white focus:ring-1 focus:ring-purple-500"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Upper limit for Category-Orange & Standard clearances.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Deemed Approval Grace Period (Hours)
              </label>
              <input
                type="number"
                min={24}
                max={168}
                value={deemedApprovalGraceHours}
                onChange={(e) => setDeemedApprovalGraceHours(parseInt(e.target.value) || 72)}
                className="w-full p-2.5 border border-slate-300 rounded bg-white focus:ring-1 focus:ring-purple-500"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Final response window before legal Section 12 certificate auto-issues.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Automatic Escalation Trigger (% of SLA)
              </label>
              <input
                type="number"
                min={50}
                max={95}
                value={autoEscalateThresholdPercent}
                onChange={(e) => setAutoEscalateThresholdPercent(parseInt(e.target.value) || 85)}
                className="w-full p-2.5 border border-slate-300 rounded bg-white focus:ring-1 focus:ring-purple-500"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Fires Level 2 escalation notice to Joint Director.
              </span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Unified Inspection Commonality Threshold (%)
              </label>
              <input
                type="number"
                min={50}
                max={90}
                value={jointInspectionThresholdPercent}
                onChange={(e) => setJointInspectionThresholdPercent(parseInt(e.target.value) || 70)}
                className="w-full p-2.5 border border-slate-300 rounded bg-white focus:ring-1 focus:ring-purple-500"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Score at which multi-department site visits are clustered automatically.
              </span>
            </div>
          </div>
        </div>

        {/* Security & Cryptographic Compliance */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
            <KeyRound className="w-4 h-4 text-gov-blue-primary" />
            <h2 className="text-sm font-bold text-slate-900">
              Cryptographic DSC Signing & Audit Policy
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded">
              <div>
                <span className="font-bold text-slate-900 block">Immutable SHA-256 Event Audit Trail</span>
                <span className="text-slate-500 text-[11px]">Logs all officer scrutiny decisions, query dispatches, and applicant uploads.</span>
              </div>
              <input
                type="checkbox"
                checked={enableImmutableAudit}
                onChange={(e) => setEnableImmutableAudit(e.target.checked)}
                className="rounded text-gov-blue-primary border-slate-300"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">CCA India Class-3 Digital Token Provider</span>
                <span className="text-slate-500 text-[11px]">Hardware cryptographic tokens certified under FIPS 140-2 Level 3.</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Active & Enforced
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-purple-900 hover:bg-purple-800 text-white font-bold px-5 py-2.5 rounded-md shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Governance Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
