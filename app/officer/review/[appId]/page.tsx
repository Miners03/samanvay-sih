'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SLAAlert } from '@/components/common/SLAAlert';
import { 
  Building2, 
  MapPin, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  CalendarCheck, 
  Clock, 
  Download, 
  ArrowLeft, 
  Send 
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '@/lib/utils';

export default function ScrutinyDossierPage() {
  const { appId } = useParams();
  const router = useRouter();
  const { 
    project, 
    vaultDocuments, 
    officerApprove, 
    officerReject, 
    officerRaiseQuery, 
    officerScheduleInspection 
  } = useApp();

  const approval = project.approvals.find(a => a.id === appId) || project.approvals[0];

  // Action states
  const [activeActionTab, setActiveActionTab] = useState<'none' | 'approve' | 'query' | 'inspection' | 'reject'>('none');
  const [approveRemarks, setApproveRemarks] = useState('All statutory norms, setback parameters and environmental safeguards verified. Approved under official seal.');
  const [customCertNo, setCustomCertNo] = useState(`GOV/${approval.approvalCode}/2026/${Math.floor(1000 + Math.random() * 9000)}`);
  
  const [querySubject, setQuerySubject] = useState('');
  const [queryDescription, setQueryDescription] = useState('');
  const [requestedDocs, setRequestedDocs] = useState<string[]>([]);
  
  const [inspectionDate, setInspectionDate] = useState('2026-09-22');
  const [rejectReason, setRejectReason] = useState('');

  const handleApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    officerApprove(approval.id, approveRemarks, customCertNo);
    router.push('/officer/queue');
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!querySubject || !queryDescription) {
      alert('Please state the subject and specific clarification required.');
      return;
    }
    officerRaiseQuery(approval.id, querySubject, queryDescription, requestedDocs);
    router.push('/officer/queue');
  };

  const handleInspectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    officerScheduleInspection(approval.id, inspectionDate, 'joint_site_visit');
    setActiveActionTab('none');
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason) {
      alert('Please specify the legal/statutory grounds for rejection.');
      return;
    }
    officerReject(approval.id, rejectReason);
    router.push('/officer/queue');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/officer/queue"
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scrutiny Queue</span>
        </Link>
      </div>

      <PageHeader
        title={`Scrutiny Dossier: ${approval.approvalName}`}
        subtitle={`Official examination of statutory submission for ${project.name} (${project.referenceNo}).`}
        breadcrumbs={[
          { label: 'Government Portal', href: '/officer/queue' },
          { label: 'Scrutiny Queue', href: '/officer/queue' },
          { label: approval.approvalCode, current: true },
        ]}
        badge={<StatusBadge status={approval.status} size="md" />}
      />

      {/* SLA Alert banner */}
      <SLAAlert
        daysRemaining={approval.slaDaysRemaining ?? 12}
        slaDays={approval.slaDays}
        isDeemedApprovalEligible={approval.isDeemedApprovalEligible}
        departmentName={approval.departmentName}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Applicant Data & Verified Vault Files */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Details Dossier */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Building2 className="w-4 h-4 text-gov-blue-secondary" />
              Enterprise &amp; Facility Profile
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Company Name</span>
                <span className="font-bold text-slate-900">{project.companyName}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Corporate CIN</span>
                <span className="font-mono text-slate-900">{project.registrationNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">PAN / GSTIN</span>
                <span className="font-mono text-slate-900">{project.panNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Proposed Outlay</span>
                <span className="font-bold text-emerald-800">{formatCurrencyINR(project.estimatedInvestmentCrores * 10000000)}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Facility Site</span>
                <span className="text-slate-900">{project.location.industrialArea}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Workforce Deployment</span>
                <span className="text-slate-900">{project.operations.labour.totalWorkers} Workers ({project.operations.labour.contractWorkers} Contract)</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800">Operational Specifics Submitted:</span>
              <p className="text-slate-700">
                Pollution Class: <strong>{project.operations.environmental.category} Category</strong> • Power Demand: <strong>{project.operations.utilities.powerKVA} kVA</strong> • Water: <strong>{project.operations.utilities.waterKLD} KLD</strong> • Boiler: <strong>{project.operations.infrastructure.hasBoiler ? `${project.operations.infrastructure.boilerPressurePSI} PSI` : 'None'}</strong>
              </p>
            </div>
          </div>

          {/* Attached Documents Verified by DigiLocker */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gov-blue-secondary" />
                Attached Certified Blueprints &amp; Dossiers
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                DigiLocker Cryptographic Stamp Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {vaultDocuments.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-50 p-3 rounded-md border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <p className="font-bold text-slate-900 truncate">{doc.title}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{doc.docNumber}</span>
                  </div>
                  <button
                    onClick={() => alert(`Opening official digital viewer for ${doc.title}...`)}
                    className="p-1.5 text-gov-blue-secondary hover:bg-blue-100 rounded shrink-0"
                    title="View Document"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log / Scrutiny History */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-gov-blue-secondary" />
              Statutory Audit Trail
            </h3>

            <div className="space-y-2 text-xs">
              {approval.activityLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-3 bg-slate-50 p-2.5 rounded border border-slate-100">
                  <span className="font-mono text-[10px] text-slate-400 shrink-0 mt-0.5">{log.date}</span>
                  <div>
                    <span className="font-bold text-slate-800">{log.actor}: </span>
                    <span className="text-slate-700">{log.action}</span>
                    {log.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-0.5 bg-white p-1.5 rounded border border-slate-100">
                        &quot;{log.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Official Action Console */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldAlert className="w-4 h-4 text-gov-blue-secondary" />
              Officer Action Desk
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setActiveActionTab('approve')}
                className={`w-full text-left p-3 rounded-md border text-xs font-bold transition-all flex items-center justify-between ${activeActionTab === 'approve' ? 'bg-emerald-50 border-emerald-600 text-emerald-950' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'}`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Grant Clearance &amp; Issue Order</span>
                </div>
              </button>

              <button
                onClick={() => setActiveActionTab('query')}
                className={`w-full text-left p-3 rounded-md border text-xs font-bold transition-all flex items-center justify-between ${activeActionTab === 'query' ? 'bg-amber-50 border-amber-600 text-amber-950' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'}`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Raise Official Scrutiny Query</span>
                </div>
              </button>

              <button
                onClick={() => setActiveActionTab('inspection')}
                className={`w-full text-left p-3 rounded-md border text-xs font-bold transition-all flex items-center justify-between ${activeActionTab === 'inspection' ? 'bg-blue-50 border-blue-600 text-blue-950' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'}`}
              >
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-blue-600" />
                  <span>Schedule Joint Physical Site Inspection</span>
                </div>
              </button>

              <button
                onClick={() => setActiveActionTab('reject')}
                className={`w-full text-left p-3 rounded-md border text-xs font-bold transition-all flex items-center justify-between ${activeActionTab === 'reject' ? 'bg-red-50 border-red-600 text-red-950' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'}`}
              >
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>Return / Reject Application</span>
                </div>
              </button>
            </div>

            {/* Action Dynamic Forms */}
            {activeActionTab === 'approve' && (
              <form onSubmit={handleApproveSubmit} className="pt-3 border-t border-slate-200 space-y-3 text-xs">
                <span className="font-bold text-emerald-900 block">Dispatch Clearance Order</span>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Generated Certificate Reference:</label>
                  <input
                    type="text"
                    value={customCertNo}
                    onChange={(e) => setCustomCertNo(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Official Endorsement Remarks:</label>
                  <textarea
                    rows={3}
                    value={approveRemarks}
                    onChange={(e) => setApproveRemarks(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-xs"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded shadow transition-all"
                >
                  Sign &amp; Issue Statutory Certificate
                </button>
              </form>
            )}

            {activeActionTab === 'query' && (
              <form onSubmit={handleQuerySubmit} className="pt-3 border-t border-slate-200 space-y-3 text-xs">
                <span className="font-bold text-amber-900 block">Formulate Official Observation</span>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Query Subject:</label>
                  <input
                    type="text"
                    value={querySubject}
                    onChange={(e) => setQuerySubject(e.target.value)}
                    placeholder="e.g. Incomplete setback calculations on west boundary"
                    className="w-full p-2 rounded border border-slate-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Detailed Technical Ground:</label>
                  <textarea
                    rows={3}
                    value={queryDescription}
                    onChange={(e) => setQueryDescription(e.target.value)}
                    placeholder="Cite relevant rule and specify exactly what revision is requested..."
                    className="w-full p-2 rounded border border-slate-300 text-xs"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded shadow transition-all"
                >
                  Dispatch Query with 14-Day Deadline
                </button>
              </form>
            )}

            {activeActionTab === 'inspection' && (
              <form onSubmit={handleInspectionSubmit} className="pt-3 border-t border-slate-200 space-y-3 text-xs">
                <span className="font-bold text-blue-900 block">Schedule Joint Department Inspection</span>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Proposed Inspection Date:</label>
                  <input
                    type="date"
                    value={inspectionDate}
                    onChange={(e) => setInspectionDate(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-xs"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  Joint inspection invite will automatically sync with State Fire Services and Labour Department inspectors.
                </p>
                <button
                  type="submit"
                  className="w-full py-2 bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold rounded shadow transition-all"
                >
                  Confirm Joint Site Visit
                </button>
              </form>
            )}

            {activeActionTab === 'reject' && (
              <form onSubmit={handleRejectSubmit} className="pt-3 border-t border-slate-200 space-y-3 text-xs">
                <span className="font-bold text-red-900 block">Return / Rejection Order</span>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">Statutory Grounds of Non-Compliance:</label>
                  <textarea
                    rows={3}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Specify non-conformance with master plan or safety rules..."
                    className="w-full p-2 rounded border border-slate-300 text-xs"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded shadow transition-all"
                >
                  Issue Formal Rejection Order
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
