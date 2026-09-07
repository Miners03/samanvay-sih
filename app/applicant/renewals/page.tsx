'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { 
  CalendarClock, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '@/lib/utils';

export default function RenewalsPage() {
  const { renewals, showToast } = useApp();

  const handleRenew = (licenceName: string, fee: number) => {
    showToast(
      'Renewal Application Initiated',
      `Renewal docket created for ${licenceName}. Statutory fee of ${formatCurrencyINR(fee)} queued for payment gateway.`,
      'success'
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Statutory Renewals &amp; Compliance Calendar"
        subtitle="Proactive compliance monitoring: Track expiry dates for operational licences, environmental consents, and safety certifications."
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Renewals & Compliance', current: true },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-gov">
          <span className="text-xs font-bold text-slate-500 uppercase">Valid Active Clearances</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">2</p>
          <p className="text-[11px] text-slate-500 mt-1">Compliant with all state statutory norms</p>
        </div>
        <div className="bg-white p-5 rounded-lg border-l-4 border-l-amber-500 border border-slate-200 shadow-gov">
          <span className="text-xs font-bold text-amber-800 uppercase">Due for Renewal (&lt; 60 Days)</span>
          <p className="text-2xl font-black text-amber-700 mt-1">1</p>
          <p className="text-[11px] text-amber-800 mt-1">Action required before expiry</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-gov">
          <span className="text-xs font-bold text-slate-500 uppercase">Auto-Renewal Eligible</span>
          <p className="text-2xl font-black text-blue-700 mt-1">2</p>
          <p className="text-[11px] text-slate-500 mt-1">Self-certification without fresh inspection</p>
        </div>
      </div>

      {/* Renewals Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <CalendarClock className="w-4 h-4 text-gov-blue-secondary" />
            Statutory Licences &amp; Regulatory Validity Ledger
          </h3>
          <span className="text-xs text-slate-500">
            Auto-syncs with State Ease of Doing Business portal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Licence / Consent</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Licence No.</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Days Left</th>
                <th className="py-3 px-4">Renewal Fee</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {renewals.map((item) => {
                const isUrgent = item.daysRemaining <= 45;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{item.licenceName}</div>
                      <span className="text-[11px] font-mono text-slate-500">{item.approvalCode}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {item.department}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {item.licenceNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium">
                      {formatDate(item.expiryDate)}
                    </td>
                    <td className="py-3.5 px-4">
                      {isUrgent ? (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 font-bold text-[11px] flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          {item.daysRemaining} days
                        </span>
                      ) : (
                        <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-medium text-[11px] flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          {item.daysRemaining} days
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold font-mono">
                      {formatCurrencyINR(item.renewalFee)}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.autoRenewalEligible ? (
                        <span className="text-[10px] bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-bold border border-blue-200">
                          Auto-Renewable
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          Standard Review
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleRenew(item.licenceName, item.renewalFee)}
                        className="bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold px-3 py-1.5 rounded text-[11px] transition-colors inline-flex items-center gap-1 shadow-sm"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Renew</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
