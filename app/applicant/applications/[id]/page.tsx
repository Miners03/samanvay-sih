'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { RequireProject } from '@/components/applicant/RequireProject';
import { useApp, useProject } from '@/lib/context/AppContext';
import { useApprovalQueries } from '@/hooks/useApprovalQueries';
import { useApprovalIdentities } from '@/hooks/useApprovalIdentities';
import { supabase } from '@/lib/supabase';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SLAAlert } from '@/components/common/SLAAlert';
import { QueryResponseModal } from '@/components/applicant/QueryResponseModal';
import { 
  Building2, 
  MapPin, 
  Clock, 
  FileText, 
  Download, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  CalendarCheck, 
  MessageSquare, 
  Layers, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Info, 
  Send 
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '@/lib/utils';

// 1. Default Export Wrapper (guards against null project)
export default function ApplicationDetailPage() {
  return (
    <RequireProject>
      <ApplicationDetailPageContent />
    </RequireProject>
  );
}

// 2. Main Page Content (runs safely when project exists)
function ApplicationDetailPageContent() {
  const { id } = useParams();
  const project = useProject();
  const { vaultDocuments } = useApp();
  const { getUuid } = useApprovalIdentities();

  const approval = project.approvals.find(a => a.id === id) || project.approvals[0];
  const approvalUuid = getUuid(typeof id === 'string' ? id : '');
  const approvalQueries = useApprovalQueries(approvalUuid ?? '');
  const activeQuery = approvalQueries[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'timeline' | 'queries' | 'inspection' | 'communication' | 'decision'>('overview');
  
  // Queries tab state
  const [showQueryDialog, setShowQueryDialog] = useState(false);
  const [inlineReplyText, setInlineReplyText] = useState('');
  const [selectedDocsForReply, setSelectedDocsForReply] = useState<string[]>([]);
  const [responseSubmittedLocally, setResponseSubmittedLocally] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'documents', label: 'Documents', icon: FileText, count: approval.documentsRequired.length },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { 
      id: 'queries', 
      label: 'Queries & Deficiencies', 
      icon: AlertTriangle,
      badge: approval.status === 'action_required' ? '1 Action' : undefined 
    },
    { id: 'inspection', label: 'Joint Inspection', icon: CalendarCheck },
    { id: 'communication', label: 'Authority Reply Tracker', icon: MessageSquare },
    { id: 'decision', label: 'Official Decision', icon: CheckCircle2 },
  ];

  const handleInlineQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineReplyText) return;

    if (!activeQuery) return;

    const { error } = await supabase.rpc('respond_to_query', {
      p_query_id: activeQuery.id,
      p_response: inlineReplyText,
    });

    if (error) {
      console.error('Failed to respond to query', error);
      alert('The response could not be submitted. Please try again.');
      return;
    }

    setResponseSubmittedLocally(true);
    setInlineReplyText('');
  };

  const getProgressPct = () => {
    switch (approval.status) {
      case 'approved': return 100;
      case 'inspection_scheduled': return 75;
      case 'action_required': return 50;
      case 'in_progress':
      case 'submitted': return 40;
      case 'can_apply_now': return 15;
      default: return 0;
    }
  };

  const progressPct = getProgressPct();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back to Applications */}
      <div>
        <Link
          href="/applicant/applications"
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications Registry</span>
        </Link>
      </div>

      {/* Detail Page Header */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-mono font-bold text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                {approval.approvalCode}
              </span>
              <span className="text-slate-600 flex items-center gap-1 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {approval.departmentName}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-600">
                Project: <strong>{project.name}</strong> ({project.referenceNo})
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {approval.approvalName}
            </h1>

            <p className="text-xs text-slate-500">
              Statutory Application Docket • Enterprise Signatory: {project.contactPerson}
            </p>
          </div>

          <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0">
            <StatusBadge status={approval.status} size="lg" />
            <span className="text-xs text-slate-500 font-mono">
              Fee Paid: <strong>{formatCurrencyINR(approval.feeAmountINR)}</strong>
            </span>
          </div>
        </div>

        {/* Progress Bar & SLA Countdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              Dossier Scrutiny Progress: <strong>{progressPct}%</strong>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Statutory SLA Target: {approval.slaDays} Days
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPct}%` }}
              className={`h-full transition-all duration-500 ${progressPct === 100 ? 'bg-emerald-600' : progressPct >= 50 ? 'bg-amber-500' : 'bg-blue-600'}`}
            />
          </div>
        </div>
      </div>

      {/* SLA Alert */}
      <SLAAlert
        daysRemaining={approval.slaDaysRemaining ?? 12}
        slaDays={approval.slaDays}
        isDeemedApprovalEligible={approval.isDeemedApprovalEligible}
        departmentName={approval.departmentName}
      />

      {/* 7 TABS NAVIGATION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-x-auto">
        <div className="flex items-center space-x-1 p-1 border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-bold whitespace-nowrap transition-colors relative ${isActive ? 'bg-gov-blue-primary text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div className="p-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 text-xs animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-2">
                    Application Docket Details
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Clearance Category</span>
                      <span className="font-bold text-slate-800">{approval.approvalType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Statutory Act</span>
                      <span className="font-bold text-slate-800">State Facilitation Act 2024</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Applied Date</span>
                      <span className="font-bold text-slate-800">{formatDate(approval.appliedDate)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Nodal Department</span>
                      <span className="font-bold text-slate-800">{approval.departmentName}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-2">
                    Enterprise Parameters Linked
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Facility Name</span>
                      <span className="font-bold text-slate-800 truncate block">{project.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Plot Location</span>
                      <span className="font-bold text-slate-800 truncate block">{project.location?.industrialArea}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Proposed Outlay</span>
                      <span className="font-bold text-emerald-800">{formatCurrencyINR((project.estimatedInvestmentCrores ?? 0) * 10000000)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Power / Water Demand</span>
                      <span className="font-bold text-slate-800">{project.operations?.utilities?.powerKVA} kVA / {project.operations?.utilities?.waterKLD} KLD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Downstream Dependencies Impact */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-blue-700" />
                  Downstream Coordination Impact:
                </span>
                <p className="text-[11px] text-slate-600">
                  Completing this clearance unlocks Factory Building Plan approvals and contributes directly to the Single Window Commissioning Sanction.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-6 text-xs animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                    Required Statutory Blueprints &amp; Dossiers
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    All documents are cryptographically verified via your central DigiLocker Document Vault.
                  </p>
                </div>
                <Link
                  href="/applicant/vault"
                  className="bg-gov-blue-secondary text-white px-3 py-1.5 rounded font-bold hover:bg-gov-blue-primary"
                >
                  Open Vault
                </Link>
              </div>

              <div className="space-y-3">
                {approval.documentsRequired.map((reqDoc, idx) => {
                  const isSubmitted = approval.documentsSubmitted.includes(reqDoc);

                  return (
                    <div
                      key={idx}
                      className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded ${isSubmitted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{reqDoc}</p>
                          <span className="text-[10px] text-slate-500">
                            {isSubmitted ? 'Verified and attached from Document Vault' : 'Pending submission or additional clarification'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSubmitted ? (
                          <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            Attached
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px] border border-amber-300">
                            Pending
                          </span>
                        )}
                        <button
                          onClick={() => alert(`Opening preview of ${reqDoc}...`)}
                          className="text-gov-blue-secondary font-bold hover:underline ml-2"
                        >
                          View File
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE (VERTICAL DATED STEPS) */}
          {activeTab === 'timeline' && (
            <div className="space-y-6 text-xs animate-in fade-in duration-150">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                  Statutory Clearance Lifecycle Timeline
                </h3>
                <p className="text-[11px] text-slate-500">
                  Vertical chronological milestone ledger tracked under the Business Facilitation Act.
                </p>
              </div>

              {/* Vertical Timeline */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {(approval.timelineEvents || []).map((evt) => (
                  <div key={evt.id} className="relative group">
                    {/* Timeline Node Dot */}
                    <div
                      className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${evt.isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : evt.isCurrent ? 'bg-amber-500 border-amber-500 text-white ring-4 ring-amber-100' : 'bg-white border-slate-300'}`}
                    >
                      {evt.isCompleted && <Check className="w-2.5 h-2.5" />}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 pb-1">
                        <span className="font-bold text-slate-900">{evt.stageName}</span>
                        <span className="font-mono">{evt.date} {evt.time && `• ${evt.time}`}</span>
                      </div>
                      <p className="text-slate-700 font-medium pt-1">
                        {evt.description}
                      </p>
                      <span className="text-[10px] text-slate-400 block pt-1">
                        Actor: <strong className="text-slate-600">{evt.actor}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUERIES & DEFICIENCIES */}
          {activeTab === 'queries' && (
            <div className="space-y-6 text-xs animate-in fade-in duration-150">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Official Scrutiny Deficiencies &amp; Clarifications
                </h3>
                <p className="text-[11px] text-slate-500">
                  Departmental queries pause the statutory SLA clock until a formal response is recorded.
                </p>
              </div>

              {activeQuery ? (
                <div className="space-y-4">
                  {/* The Query Message Box */}
                  <div className="bg-amber-50 rounded-lg border border-amber-300 p-5 space-y-3">
                    <div className="flex items-center justify-between text-amber-950 font-bold border-b border-amber-200 pb-2">
                      <span>Query Category: &quot;{activeQuery.category}&quot;</span>
                      <span className="bg-white px-2 py-0.5 rounded text-[11px] border border-amber-300">
                        Response Deadline: {formatDate(activeQuery.response_deadline || '')}
                      </span>
                    </div>

                    <div className="text-slate-800 space-y-1 leading-relaxed">
                      <span className="text-[10px] font-bold text-amber-900 uppercase">Officer Remarks:</span>
                      <p className="bg-white p-3 rounded border border-amber-200 font-sans">
                        {activeQuery.message}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-600">
                      <span>Query ID: <strong>{activeQuery.id}</strong></span>
                    </div>
                  </div>

                  {/* Response Submitted State */}
                  {(responseSubmittedLocally || activeQuery.awaiting === 'officer' || activeQuery.resolved) ? (
                    <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-5 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                        <span>Response Submitted Successfully</span>
                      </div>
                      <p className="text-emerald-800 leading-relaxed">
                        Your technical clarification and supplementary documents have been submitted to the scrutiny desk. The reviewing officer can now inspect your response.
                      </p>
                    </div>
                  ) : (
                    /* Inline Query Response Form */
                    <form onSubmit={handleInlineQuerySubmit} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-4">
                      <h4 className="font-bold text-slate-900">Draft Official Response</h4>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">
                          Technical Clarification Text:
                        </label>
                        <textarea
                          rows={4}
                          value={inlineReplyText}
                          onChange={(e) => setInlineReplyText(e.target.value)}
                          placeholder="Provide specific engineering parameters or rule compliance details..."
                          className="w-full p-2.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-gov-blue-secondary"
                          required
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="submit"
                          className="bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold px-5 py-2 rounded text-xs shadow flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Official Response to Department</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-lg text-center text-slate-500 border border-slate-200">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-800">No Deficiencies or Queries Raised</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Your submitted documentation is complete and satisfies departmental pre-screening standards.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: JOINT INSPECTION */}
          {activeTab === 'inspection' && (
            <div className="space-y-6 text-xs animate-in fade-in duration-150">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                  Joint Site Inspection Details
                </h3>
                <p className="text-[11px] text-slate-500">
                  Single-window coordinated physical site audits to prevent multiple disruptions.
                </p>
              </div>

              {approval.inspection ? (
                <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900">
                      Scheduled Date: {formatDate(approval.inspection.scheduledDate)}
                    </span>
                    <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded text-[10px]">
                      Confirmed Schedule
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Lead Officer</span>
                      <span className="font-bold text-slate-800">{approval.inspection.leadOfficer}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Participating Bodies</span>
                      <span className="font-bold text-slate-800">{approval.inspection.departments.join(', ')}</span>
                    </div>
                  </div>

                  {approval.inspection.checklist && (
                    <div className="pt-2 border-t border-slate-200 space-y-1.5">
                      <span className="font-bold text-slate-800 block">Site Inspection Checklist:</span>
                      {approval.inspection.checklist.map((chk, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-slate-700">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${chk.verified ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span>{chk.item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-lg text-center text-slate-500 border border-slate-200">
                  <CalendarCheck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="font-bold text-slate-800">Desk Examination Phase</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Physical site inspection will be synchronized if required following preliminary drawing scrutiny.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: AUTHORITY COMMUNICATION / AUTHORITY REPLY TRACKER */}
          {activeTab === 'communication' && (
            <div className="space-y-6 text-xs animate-in fade-in duration-150">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                  Authority Reply Tracker &amp; Transparency Ledger
                </h3>
                <p className="text-[11px] text-slate-500">
                  Real transparency into departmental handling instead of a bare &quot;Under Review&quot; status.
                </p>
              </div>

              {approval.authorityTracker ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Last Authority Action</span>
                    <p className="font-bold text-slate-900 text-sm">{approval.authorityTracker.lastAuthorityAction}</p>
                    <span className="text-[11px] text-slate-500 block">Date Recorded: {approval.authorityTracker.lastAuthorityActionDate}</span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Applicant Response</span>
                    <p className="font-bold text-slate-900 text-sm">{approval.authorityTracker.applicantResponse}</p>
                    <span className="text-[11px] text-slate-500 block">Status: Active on file</span>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
                    <span className="text-[10px] text-blue-900 font-bold uppercase block">Current Internal State</span>
                    <p className="font-bold text-gov-blue-primary text-sm">{approval.authorityTracker.currentState}</p>
                    <span className="text-[11px] text-slate-600 block">Assigned Officer: {approval.authorityTracker.responsibleOfficer}</span>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 space-y-2">
                    <span className="text-[10px] text-emerald-900 font-bold uppercase block">Expected Next Step &amp; SLA</span>
                    <p className="font-bold text-emerald-950 text-sm">{approval.authorityTracker.expectedNextAction}</p>
                    <span className="text-[11px] text-emerald-800 font-bold block">
                      Remaining SLA Window: {approval.authorityTracker.slaRemainingDays} Days
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-slate-500">Awaiting initial authority dispatch.</div>
              )}
            </div>
          )}

          {/* TAB 7: DECISION */}
          {activeTab === 'decision' && (
            <div className="space-y-6 text-xs animate-in fade-in duration-150">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                  Statutory Clearance Order &amp; Official Seal
                </h3>
                <p className="text-[11px] text-slate-500">
                  Legally binding clearance certificate issued under state single-window provisions.
                </p>
              </div>

              {approval.status === 'approved' ? (
                <div className="bg-white p-6 rounded-lg border-2 border-emerald-500 shadow-md space-y-4 max-w-2xl mx-auto">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-gov-blue-primary text-white flex items-center justify-center font-bold">
                        स
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Certificate of Statutory Clearance</h4>
                        <span className="text-[10px] text-slate-500">{approval.departmentName}</span>
                      </div>
                    </div>
                    <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-300">
                      AUTHENTICATED ORDER
                    </span>
                  </div>

                  <div className="space-y-2 text-slate-700 leading-relaxed text-xs">
                    <p>
                      This is to certify that <strong>{project.companyName}</strong> has satisfied all statutory inspection requirements for <strong>{approval.approvalName}</strong> at Plot 42-44, IMT Manesar, Gurugram.
                    </p>
                    <p className="font-mono font-bold text-slate-900">
                      Certificate Reference: {approval.certificateNo}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Digital Signature Hash: sha256:7e88b901fc4d29a... • Date of Issuance: {formatDate(approval.appliedDate)}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={() => alert(`Downloading signed digital certificate ${approval.certificateNo}...`)}
                      className="bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold px-4 py-2 rounded text-xs flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Stamped Order (PDF)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-6 rounded-lg text-center text-slate-500 border border-slate-200">
                  <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-bold text-slate-800">Clearance Order Not Yet Dispatched</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Final stamped order and official certificate reference will appear here upon completion of scrutiny.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}