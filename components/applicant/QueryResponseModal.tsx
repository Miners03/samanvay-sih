'use client';

import React, { useState } from 'react';
import { ApprovalRoadmapItem, VaultDocument } from '@/lib/types';
import { useApp } from '@/lib/context/AppContext';
import { useApprovalQueries } from '@/hooks/useApprovalQueries';
import { supabase } from '@/lib/supabase';
import { 
  X, 
  AlertTriangle, 
  FileText, 
  Upload, 
  Check, 
  Calendar, 
  ShieldAlert, 
  Building 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface QueryResponseModalProps {
  approval: ApprovalRoadmapItem;
  approvalUuid?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const QueryResponseModal: React.FC<QueryResponseModalProps> = ({
  approval,
  approvalUuid,
  isOpen,
  onClose,
}) => {
  const { vaultDocuments } = useApp();
  const [responseNotes, setResponseNotes] = useState('');
  const [selectedVaultDocs, setSelectedVaultDocs] = useState<string[]>([]);
  const [simulatedUploadName, setSimulatedUploadName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const liveQueries = useApprovalQueries(approvalUuid ?? '');

  if (!isOpen || !approval.query) return null;

  const query = approval.query;

  const toggleDocSelection = (docTitle: string) => {
    if (selectedVaultDocs.includes(docTitle)) {
      setSelectedVaultDocs(selectedVaultDocs.filter(d => d !== docTitle));
    } else {
      setSelectedVaultDocs([...selectedVaultDocs, docTitle]);
    }
  };

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setSimulatedUploadName(fileName);
      setSelectedVaultDocs(prev => [...prev, `${fileName} (Direct Upload)`]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseNotes.trim() && selectedVaultDocs.length === 0) {
      alert('Please provide a clarification explanation or attach requested documents.');
      return;
    }

    const queryId = liveQueries[0]?.id;
    if (!queryId) {
      alert('This query is not available in the live registry yet. Please refresh and try again.');
      return;
    }

    setIsSubmitting(true);
    void (async () => {
      const result = await supabase.rpc('respond_to_query', {
        p_query_id: queryId,
        p_response: responseNotes,
      });

      if (result.error) {
        console.error('Failed to respond to query', result.error);
        alert('The response could not be submitted. Please try again.');
      } else {
        onClose();
      }

      setIsSubmitting(false);
    })();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-amber-50 px-6 py-4 border-b border-amber-200 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-md text-amber-800 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded">
                  Official Scrutiny Query
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {approval.approvalCode}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {approval.approvalName}
              </h3>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                {approval.departmentName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md hover:bg-amber-100/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Query Details Box */}
          <div className="bg-slate-50 rounded-md border border-slate-200 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-200 pb-2">
              <span>Raised by: <strong className="text-slate-800">{query.raisedBy}</strong></span>
              <span className="flex items-center gap-1 text-amber-800 font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                Due Deadline: {formatDate(query.deadlineDate)}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Subject of Query
              </span>
              <p className="font-semibold text-slate-900 text-sm mt-0.5">
                {query.subject}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                Departmental Observations / Requirement
              </span>
              <p className="text-slate-700 mt-1 leading-relaxed bg-white p-3 rounded border border-slate-200 font-sans">
                {query.description}
              </p>
            </div>

            {query.requestedDocuments && query.requestedDocuments.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block mb-1">
                  Required Supporting Documents
                </span>
                <div className="flex flex-wrap gap-2">
                  {query.requestedDocuments.map((doc, idx) => (
                    <span
                      key={idx}
                      className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Response Textarea */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800">
              Your Official Written Clarification / Explanation <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={responseNotes}
              onChange={(e) => setResponseNotes(e.target.value)}
              placeholder="State the technical specifications, compliance methodology or specific clarifications requested by the inspecting officer..."
              className="w-full rounded border border-slate-300 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-gov-blue-secondary focus:ring-1 focus:ring-gov-blue-secondary"
              required
            />
            <p className="text-[11px] text-slate-500">
              Note: Responses are digitally timestamped and appended to the official statutory case dossier.
            </p>
          </div>

          {/* Attach Documents Section */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-800">
              Select Supporting Files from Document Vault
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border border-slate-200 rounded-md bg-slate-50">
              {vaultDocuments.map((vDoc) => {
                const isSelected = selectedVaultDocs.includes(vDoc.title);
                return (
                  <button
                    key={vDoc.id}
                    type="button"
                    onClick={() => toggleDocSelection(vDoc.title)}
                    className={`text-left p-2 rounded border text-xs flex items-center justify-between transition-colors ${isSelected ? 'bg-blue-50 border-gov-blue-secondary text-gov-blue-secondary font-semibold' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{vDoc.title}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-gov-blue-secondary shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Direct File Attachment Option */}
            <div className="pt-2 flex items-center justify-between">
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-gov-blue-secondary hover:text-gov-blue-primary font-medium">
                <Upload className="w-3.5 h-3.5" />
                <span>Or upload new file from computer</span>
                <input
                  type="file"
                  onChange={handleSimulateUpload}
                  className="hidden"
                />
              </label>
              {simulatedUploadName && (
                <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Attached: {simulatedUploadName}
                </span>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold transition-all shadow hover:shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting Clarification...' : 'Submit Clarification to Department'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
