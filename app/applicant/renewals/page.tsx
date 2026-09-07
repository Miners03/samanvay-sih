'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { ComplianceRenewal } from '@/lib/types';
import { 
  CalendarClock, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Check, 
  ArrowRight, 
  FileText 
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '@/lib/utils';

export default function RenewalsPage() {
  const { renewals, submitSmartRenewal } = useApp();
  const [smartRenewalTarget, setSmartRenewalTarget] = useState<ComplianceRenewal | null>(null);

  // Form states for new fields
  const [updatedField1, setUpdatedField1] = useState('1.15 GWh (Trial Production)');
  const [updatedField2, setUpdatedField2] = useState('SPCB-LAB-REPORT-AUG26.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validCount = renewals.filter(r => r.status === 'valid').length;
  const expiringCount = renewals.filter(r => r.status === 'expiring_soon').length;
  const expiredCount = renewals.filter(r => r.status === 'expired').length;
  const actionCount = expiringCount + expiredCount;

  const handleSmartRenewalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smartRenewalTarget) return;

    setIsSubmitting(true);
    setTimeout(() => {
      submitSmartRenewal(smartRenewalTarget.id, {
        [smartRenewalTarget.reusedDetails.updatedFieldsRequired[0] || 'Field 1']: updatedField1,
        [smartRenewalTarget.reusedDetails.updatedFieldsRequired[1] || 'Field 2']: updatedField2,
      });
      setIsSubmitting(false);
      setSmartRenewalTarget(null);
    }, 600);
  };

  const getIntelligenceBadge = (days: number, msg: string) => {
    if (days <= 15) {
      return (
        <div className="bg-red-50 text-red-950 p-2.5 rounded border border-red-300 text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
          <span>{msg}</span>
        </div>
      );
    }
    if (days <= 45) {
      return (
        <div className="bg-amber-50 text-amber-950 p-2.5 rounded border border-amber-300 text-xs font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>{msg}</span>
        </div>
      );
    }
    return (
      <div className="bg-emerald-50 text-emerald-950 p-2.5 rounded border border-emerald-300 text-xs font-medium flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>{msg}</span>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Renewals &amp; Statutory Compliance"
        subtitle="Zero-Friction Smart Renewals: Track licence validity, receive expiry intelligence alerts, and renew without retyping existing dossier parameters."
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Renewals & Compliance', current: true },
        ]}
      />

      {/* 4 Dashboard Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-lg border-l-4 border-l-emerald-600 border border-slate-200 shadow-gov">
          <span className="text-xs font-bold text-slate-500 uppercase">Valid Clearances</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{validCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Full statutory compliance</p>
        </div>

        <div className="bg-white p-5 rounded-lg border-l-4 border-l-amber-500 border border-slate-200 shadow-gov">
          <span className="text-xs font-bold text-amber-800 uppercase">Expiring Soon</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{expiringCount}</p>
          <p className="text-[11px] text-amber-800 mt-1">Window open for renewal</p>
        </div>

        <div className="bg-white p-5 rounded-lg border-l-4 border-l-red-500 border border-slate-200 shadow-gov">
          <span className="text-xs font-bold text-slate-500 uppercase">Expired</span>
          <p className="text-2xl font-black text-slate-700 mt-1">{expiredCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">None lapsed</p>
        </div>

        <div className="bg-white p-5 rounded-lg border-l-4 border-l-gov-blue-secondary border border-slate-200 shadow-gov">
          <span className="text-xs font-bold text-gov-blue-secondary uppercase">Renewal Actions</span>
          <p className="text-2xl font-black text-gov-blue-primary mt-1">{actionCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Requires digital sign-off</p>
        </div>
      </div>

      {/* Renewals Ledger */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Statutory Licences &amp; Regulatory Expiry Intelligence Ledger
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {renewals.map((item) => {
            const isUrgent = item.daysRemaining <= 45;

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 space-y-3 hover:border-slate-300 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.approvalCode}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.department}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-1">
                      {item.licenceName}
                    </h4>

                    <p className="text-xs text-slate-600 font-mono">
                      Licence Reference: <strong>{item.licenceNumber}</strong> • Valid until: <strong>{formatDate(item.expiryDate)}</strong>
                    </p>

                    {/* Expiry Intelligence Message */}
                    <div className="pt-2">
                      {getIntelligenceBadge(item.daysRemaining, item.expiryIntelligenceMessage)}
                    </div>
                  </div>

                  {/* Actions & Fee */}
                  <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Renewal Fee</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {formatCurrencyINR(item.renewalFee)}
                      </span>
                    </div>

                    <button
                      onClick={() => setSmartRenewalTarget(item)}
                      className="bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold px-4 py-2 rounded text-xs transition-all shadow flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Smart Renew</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Smart Renewal Modal */}
      {smartRenewalTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-2xl w-full p-6 text-xs space-y-5 animate-in fade-in duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  SMART RENEWAL WORKFLOW
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Renew: {smartRenewalTarget.licenceName}
                </h3>
              </div>
              <button
                onClick={() => setSmartRenewalTarget(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reused Information Notice */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>We&apos;ve reused information from your previous application</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Your company registration, site address, and master blueprints have been pre-populated directly from your previous filing. You only need to provide updated operational reports for the renewal period.
              </p>

              {/* Pre-filled read-only parameters */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-700">
                <div className="bg-white p-2 rounded border border-emerald-200">
                  <span className="text-slate-400 block text-[10px]">Pre-filled Entity:</span>
                  <span className="font-bold">{smartRenewalTarget.reusedDetails.businessName}</span>
                </div>
                <div className="bg-white p-2 rounded border border-emerald-200">
                  <span className="text-slate-400 block text-[10px]">Previous Licence No:</span>
                  <span className="font-mono font-bold">{smartRenewalTarget.reusedDetails.previousConsentNo}</span>
                </div>
                <div className="bg-white p-2 rounded border border-emerald-200 col-span-2">
                  <span className="text-slate-400 block text-[10px]">Reused Vault Documents:</span>
                  <span className="font-medium">{smartRenewalTarget.reusedDetails.vaultDocumentsReused.join(' • ')}</span>
                </div>
              </div>
            </div>

            {/* Highlighted Required New / Updated Fields */}
            <form onSubmit={handleSmartRenewalSubmit} className="space-y-4">
              <div className="border-l-4 border-l-amber-500 bg-amber-50/60 p-4 rounded border border-amber-200 space-y-3">
                <h4 className="font-bold text-amber-950 uppercase tracking-wider text-[11px]">
                  Required New / Updated Information (Only 2 Fields Needed)
                </h4>

                {smartRenewalTarget.reusedDetails.updatedFieldsRequired[0] && (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">
                      {smartRenewalTarget.reusedDetails.updatedFieldsRequired[0]} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={updatedField1}
                      onChange={(e) => setUpdatedField1(e.target.value)}
                      className="w-full p-2.5 rounded border border-slate-300 text-xs bg-white font-medium"
                      required
                    />
                  </div>
                )}

                {smartRenewalTarget.reusedDetails.updatedFieldsRequired[1] && (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-800">
                      {smartRenewalTarget.reusedDetails.updatedFieldsRequired[1]} <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={updatedField2}
                        onChange={(e) => setUpdatedField2(e.target.value)}
                        className="w-full p-2.5 rounded border border-slate-300 text-xs bg-white font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => alert('Simulating file attachment from vault...')}
                        className="bg-slate-200 hover:bg-slate-300 px-3 py-2.5 rounded font-bold shrink-0 text-slate-700"
                      >
                        Browse
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="font-mono font-bold text-slate-900 text-xs">
                  Statutory Renewal Fee: {formatCurrencyINR(smartRenewalTarget.renewalFee)}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSmartRenewalTarget(null)}
                    className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold rounded shadow"
                  >
                    {isSubmitting ? 'Lodging Renewal...' : 'Submit Smart Renewal'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
