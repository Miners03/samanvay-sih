'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { ApprovalRoadmapItem, VaultDocument } from '@/lib/types';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Upload, 
  RefreshCw, 
  Building2, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';
import { formatCurrencyINR } from '@/lib/utils';

interface StartApplicationModalProps {
  approval: ApprovalRoadmapItem;
  isOpen: boolean;
  onClose: () => void;
}

export const StartApplicationModal: React.FC<StartApplicationModalProps> = ({
  approval,
  isOpen,
  onClose,
}) => {
  const { project, vaultDocuments, startApplication } = useApp();
  const [docActions, setDocActions] = useState<Record<string, 'reuse' | 'replace' | 'upload'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Find relevant vault documents
  const relevantDocs = vaultDocuments.slice(0, 5);

  const handleActionChange = (docId: string, action: 'reuse' | 'replace' | 'upload') => {
    setDocActions(prev => ({ ...prev, [docId]: action }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const usedTitles = relevantDocs.map(d => d.title);
    setTimeout(() => {
      startApplication(approval.id, usedTitles);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gov-blue-primary text-white px-6 py-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold bg-white/20 px-2 py-0.5 rounded text-white">
                {approval.approvalCode}
              </span>
              <span className="text-xs text-blue-200">
                {approval.departmentName}
              </span>
            </div>
            <h3 className="text-base font-bold mt-1">
              Start Application: {approval.approvalName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
          {/* Section 1: Pre-filled Profile Data with Verified Badges */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-950 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>We found verified information in your profile and document vault.</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              The following fields have been automatically pre-populated from your government-verified business profile:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-white p-2.5 rounded border border-emerald-200/80">
                <span className="text-[10px] text-slate-500 block">Entity Name</span>
                <span className="font-bold text-slate-900 block truncate">{project.companyName}</span>
                <span className="text-[9px] font-bold text-emerald-700 mt-0.5 flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Verified Profile
                </span>
              </div>

              <div className="bg-white p-2.5 rounded border border-emerald-200/80">
                <span className="text-[10px] text-slate-500 block">Corporate CIN</span>
                <span className="font-mono font-bold text-slate-900 block">{project.registrationNumber}</span>
                <span className="text-[9px] font-bold text-emerald-700 mt-0.5 flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> MCA21 Stamped
                </span>
              </div>

              <div className="bg-white p-2.5 rounded border border-emerald-200/80">
                <span className="text-[10px] text-slate-500 block">PAN / GSTIN</span>
                <span className="font-mono font-bold text-slate-900 block">{project.panNumber}</span>
                <span className="text-[9px] font-bold text-emerald-700 mt-0.5 flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Tax Network Verified
                </span>
              </div>

              <div className="bg-white p-2.5 rounded border border-emerald-200/80">
                <span className="text-[10px] text-slate-500 block">Premises Location</span>
                <span className="font-bold text-slate-900 block truncate">{project.location.industrialArea}</span>
                <span className="text-[9px] font-bold text-emerald-700 mt-0.5 flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Cadastral Allotment
                </span>
              </div>

              <div className="bg-white p-2.5 rounded border border-emerald-200/80">
                <span className="text-[10px] text-slate-500 block">Capital Outlay</span>
                <span className="font-bold text-slate-900 block">{formatCurrencyINR(project.estimatedInvestmentCrores * 10000000)}</span>
                <span className="text-[9px] font-bold text-emerald-700 mt-0.5 flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> DPR Authenticated
                </span>
              </div>

              <div className="bg-white p-2.5 rounded border border-emerald-200/80">
                <span className="text-[10px] text-slate-500 block">Connected Power</span>
                <span className="font-bold text-slate-900 block">{project.operations.utilities.powerKVA} kVA HT</span>
                <span className="text-[9px] font-bold text-emerald-700 mt-0.5 flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Load Survey Done
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Suggestions from Document Vault */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-gov-blue-secondary" />
                  We found {relevantDocs.length} relevant documents in your Document Vault
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Choose whether to reuse your pre-verified vault files or upload updated technical drawings.
                </p>
              </div>
              <span className="text-[10px] font-bold bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                Zero Re-Upload Friction
              </span>
            </div>

            <div className="space-y-2.5">
              {relevantDocs.map((doc) => {
                const currentChoice = docActions[doc.id] || 'reuse';

                return (
                  <div
                    key={doc.id}
                    className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="truncate pr-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="font-bold text-slate-900 truncate">{doc.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-3 mt-1">
                        <span className="font-mono">{doc.docNumber}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold">DigiLocker Verified</span>
                        <span>•</span>
                        <span>Valid until: {doc.validUntil}</span>
                      </div>
                    </div>

                    {/* Action Selector: Reuse / Replace / Upload New */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded border border-slate-300 text-[11px] shrink-0">
                      <button
                        type="button"
                        onClick={() => handleActionChange(doc.id, 'reuse')}
                        className={`px-2.5 py-1 rounded font-bold transition-colors ${currentChoice === 'reuse' ? 'bg-gov-blue-secondary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        ✓ Reuse from Vault
                      </button>
                      <button
                        type="button"
                        onClick={() => handleActionChange(doc.id, 'replace')}
                        className={`px-2.5 py-1 rounded font-bold transition-colors ${currentChoice === 'replace' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => handleActionChange(doc.id, 'upload')}
                        className={`px-2.5 py-1 rounded font-bold transition-colors ${currentChoice === 'upload' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                      >
                        Upload New
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statutory Affirmation */}
          <div className="bg-slate-50 p-3 rounded border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">Statutory Self-Declaration:</p>
            <p>
              I hereby affirm under the State Business Facilitation Act that the submitted drawings and attached documents accurately describe the proposed premises, machine ratings, and environmental management plans.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-all shadow hover:shadow-md flex items-center gap-1.5"
            >
              <span>{isSubmitting ? 'Lodging Application...' : 'Confirm & Submit Application'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
