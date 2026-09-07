'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { 
  Award, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  HelpCircle 
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '@/lib/utils';

export default function IncentivesPage() {
  const { incentives, showToast } = useApp();

  const handleApply = (schemeName: string) => {
    showToast(
      'Incentive Claim Lodged',
      `Application for ${schemeName} submitted to Directorate of Industries. Scrutiny committee dossier generated.`,
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Industrial Incentives &amp; Financial Subsidies"
        subtitle="Fiscal support portal: Automated eligibility matching under State Industrial Policies, PLI schemes, and Green Transition Funds."
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Incentives', current: true },
        ]}
      />

      {/* Summary Highlight */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Identified Fiscal Benefit
            </span>
            <p className="text-2xl font-black text-emerald-700 mt-1">₹14.14 Crore</p>
            <p className="text-xs text-slate-600 mt-0.5">
              Across 3 active state &amp; central schemes
            </p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sanctioned / Approved to Date
            </span>
            <p className="text-2xl font-black text-gov-blue-secondary mt-1">₹34.80 Lakh</p>
            <p className="text-xs text-slate-600 mt-0.5">
              Stamp duty reimbursement ready for disbursal
            </p>
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Under Nodal Scrutiny
            </span>
            <p className="text-2xl font-black text-amber-700 mt-1">₹12.00 Crore</p>
            <p className="text-xs text-slate-600 mt-0.5">
              ACC PLI Scheme scrutiny phase
            </p>
          </div>
        </div>
      </div>

      {/* Schemes List */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Available &amp; Claimed Incentive Schemes
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {incentives.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {scheme.code}
                  </span>
                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {scheme.administeringBody}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {scheme.name}
                </h4>

                <div className="bg-slate-50 p-2.5 rounded text-xs text-slate-700 space-y-1 border border-slate-100">
                  <p>
                    <strong className="text-slate-900">Quantum of Benefit:</strong> {scheme.maxBenefit}
                  </p>
                  <p>
                    <strong className="text-slate-900">Eligibility Criterion:</strong> {scheme.eligibilityHighlight}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>Claim Window Closes: <strong className="text-slate-800">{formatDate(scheme.applicationDeadline)}</strong></span>
                  {scheme.claimAmountINR && (
                    <span>Estimated Outlay: <strong className="text-emerald-800">{formatCurrencyINR(scheme.claimAmountINR)}</strong></span>
                  )}
                </div>
              </div>

              <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                {scheme.status === 'sanctioned' && (
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded text-xs border border-emerald-300">
                    Sanctioned
                  </span>
                )}
                {scheme.status === 'under_scrutiny' && (
                  <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded text-xs border border-amber-300">
                    Under Scrutiny
                  </span>
                )}
                {scheme.status === 'applied' && (
                  <span className="bg-blue-100 text-blue-900 font-bold px-3 py-1 rounded text-xs border border-blue-300">
                    Application Lodged
                  </span>
                )}
                {scheme.status === 'eligible' && (
                  <button
                    onClick={() => handleApply(scheme.name)}
                    className="bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold px-4 py-2 rounded text-xs transition-all shadow hover:shadow-md flex items-center gap-1.5"
                  >
                    <span>Apply / File Claim</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
