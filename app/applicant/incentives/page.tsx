'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { IncentiveScheme } from '@/lib/types';
import { 
  Award, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  HelpCircle, 
  FileText, 
  X, 
  ShieldAlert 
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '@/lib/utils';

export default function IncentivesPage() {
  const { incentives, showToast } = useApp();
  const [activeSchemeDrawer, setActiveSchemeDrawer] = useState<IncentiveScheme | null>(null);

  const handleApply = (schemeName: string) => {
    showToast(
      'Incentive Claim Docket Lodged',
      `Potentially eligible claim for ${schemeName} submitted to the Directorate of Industries Single Window Cell.`,
      'success'
    );
    setActiveSchemeDrawer(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Incentives &amp; Financial Support"
        subtitle="Government Capital Subsidies, Duty Waivers &amp; Green Transition Grants matched with your enterprise parameters."
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Incentives & Support', current: true },
        ]}
      />

      {/* Mandatory 'Potentially Eligible' Advisory Banner */}
      <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 text-xs text-amber-950 flex items-start gap-3 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900 block text-xs">
            Notice on Indicative Scheme Matching: Potentially Eligible Subsidies
          </span>
          <p className="text-slate-700 mt-0.5 leading-relaxed text-[11px]">
            The schemes listed below are algorithmic suggestions identified as <strong>Potentially Eligible</strong> based on your capital investment slab, industrial park location, and renewable energy manufacturing sector. <strong>This does not constitute a legal entitlement or official guarantee of grant disbursal.</strong> Final sanction is subject to physical verification of assets by the State Investment Promotion Board (SIPB).
          </p>
        </div>
      </div>

      {/* Schemes List with High Match indicators */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Potentially Eligible Schemes &amp; Incentives ({incentives.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Auto-matched via Business Registration Parameters
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {incentives.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {scheme.code}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {scheme.administeringBody}
                  </span>

                  {/* Eligibility Indicator */}
                  <span className="bg-emerald-100 text-emerald-950 font-bold text-[10px] px-2 py-0.5 rounded border border-emerald-300">
                    {scheme.matchRating} • Potentially Eligible
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {scheme.name}
                </h4>

                {/* Benefits & Eligibility */}
                <div className="bg-slate-50 p-3 rounded-md text-xs text-slate-700 space-y-1 border border-slate-100">
                  <p>
                    <strong className="text-slate-900">Quantum of Benefits:</strong> {scheme.maxBenefit}
                  </p>
                  <p>
                    <strong className="text-slate-900">Eligibility Parameter:</strong> {scheme.eligibilityHighlight}
                  </p>
                </div>

                {/* Required Docs & Deadline */}
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                  <span>
                    Deadline: <strong className="text-slate-800">{formatDate(scheme.applicationDeadline)}</strong>
                  </span>
                  <span>
                    Required Documents: <strong className="text-slate-800">{scheme.requiredDocuments.length} files</strong>
                  </span>
                  {scheme.claimAmountINR && (
                    <span>
                      Potential Benefit: <strong className="text-emerald-800">{formatCurrencyINR(scheme.claimAmountINR)}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button: View Scheme */}
              <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <button
                  onClick={() => setActiveSchemeDrawer(scheme)}
                  className="bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold px-4 py-2 rounded text-xs transition-all shadow hover:shadow-md flex items-center gap-1.5"
                >
                  <span>View Scheme</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scheme Detail Modal / Drawer */}
      {activeSchemeDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-xl w-full p-6 text-xs space-y-4 animate-in fade-in duration-150">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">{activeSchemeDrawer.code}</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{activeSchemeDrawer.name}</h3>
              </div>
              <button
                onClick={() => setActiveSchemeDrawer(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-slate-700">
              <div>
                <span className="font-bold text-slate-900 block">Nodal Administering Body:</span>
                <p>{activeSchemeDrawer.administeringBody}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block">Subsidy Category:</span>
                <p>{activeSchemeDrawer.type}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block">Full Scheme Entitlement:</span>
                <p className="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-800">
                  {activeSchemeDrawer.maxBenefit}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-900 block">Mandatory Required Documents:</span>
                <ul className="list-disc pl-4 mt-1 space-y-0.5 text-[11px]">
                  {activeSchemeDrawer.requiredDocuments.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setActiveSchemeDrawer(null)}
                className="px-4 py-2 rounded border border-slate-300 font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => handleApply(activeSchemeDrawer.name)}
                className="px-5 py-2 bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold rounded shadow"
              >
                File Potentially Eligible Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
