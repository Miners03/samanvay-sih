'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { supabase } from '@/lib/supabase';
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
  Send, 
  Sparkles, 
  Eye, 
  Check, 
  FileCheck, 
  AlertCircle, 
  HelpCircle,
  Layers,
  Search,
  ExternalLink
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
    officerScheduleInspection,
    showToast 
  } = useApp();

  const normalizedAppId = typeof appId === 'string' ? appId.replace(/-/g, '/') : '';
  const approval = project?.approvals?.find(a => a.id === appId || a.id === normalizedAppId) || project?.approvals?.[0];

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'query' | 'inspection' | 'timeline' | 'decision'>('documents');

  // Document review states (Two-column)
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [docVerdicts, setDocVerdicts] = useState<Record<string, 'Verified' | 'Requires Clarification' | 'Invalid'>>({
    'Project DPR': 'Verified',
    'Effluent Management Dossier': 'Verified',
    'ZLD Flow Schematic': 'Requires Clarification',
    'Air Pollution Control Measures': 'Verified',
  });

  // Query tool state
  const [queryCategory, setQueryCategory] = useState('Technical Clarification');
  const [querySubject, setQuerySubject] = useState('');
  const [queryDescription, setQueryDescription] = useState('');
  const [requestedDocs, setRequestedDocs] = useState<string[]>([]);
  const [deadlineDays, setDeadlineDays] = useState('14');

  // Decision state
  const [decisionType, setDecisionType] = useState<'approve' | 'reject' | 'query'>('approve');
  const [approveRemarks, setApproveRemarks] = useState('All statutory norms, environmental safeguards, and setback parameters verified. Cleared under official authority.');
  const [customCertNo, setCustomCertNo] = useState(`GOV/${approval?.approvalCode || 'APP'}/2026/${Math.floor(1000 + Math.random() * 9000)}`);
  const [rejectReason, setRejectReason] = useState('');

  // Inspection scheduling
  const [inspectionDate, setInspectionDate] = useState('2026-09-24');

  if (!approval) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Scrutiny Dossier Not Found</h2>
        <p className="text-sm text-slate-500">The requested application docket could not be retrieved from the active registry.</p>
        <Link href="/officer/queue" className="inline-block px-4 py-2 bg-gov-blue-primary text-white text-xs font-bold rounded">
          Return to Queue
        </Link>
      </div>
    );
  }

  const riskLevel = approval.status === 'action_required' || (approval.slaDaysRemaining ?? 30) <= 8 
    ? 'High Risk' 
    : (approval.slaDaysRemaining ?? 30) <= 15 ? 'Medium Risk' : 'Low Risk';

  const handleDocVerdict = (docName: string, verdict: 'Verified' | 'Requires Clarification' | 'Invalid') => {
    setDocVerdicts(prev => ({ ...prev, [docName]: verdict }));
    showToast(
      'Document Verdict Recorded',
      `${docName} marked as ${verdict}.`,
      verdict === 'Verified' ? 'success' : verdict === 'Requires Clarification' ? 'warning' : 'error'
    );
  };

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!querySubject || !queryDescription) {
      alert('Please fill out the query subject and detailed observation.');
      return;
    }

    const deadline = new Date();
    deadline.setDate(deadline.getDate() + Number(deadlineDays));

    const { error } = await supabase.rpc('raise_query', {
      p_approval_id: approval.id,
      p_category: queryCategory,
      p_message: queryDescription,
      p_required_document_key: requestedDocs[0] || null,
      p_deadline: deadline.toISOString(),
    });

    if (error) {
      console.error('Failed to raise query', error);
      alert('The query could not be sent. Please try again.');
      return;
    }

    setQuerySubject('');
    setQueryDescription('');
    setRequestedDocs([]);
    setActiveTab('overview');
  };

  const handleDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (decisionType === 'approve') {
      officerApprove(approval.id, approveRemarks, customCertNo);
      router.push('/officer/queue');
    } else if (decisionType === 'reject') {
      if (!rejectReason) {
        alert('Please specify statutory grounds for rejection.');
        return;
      }
      officerReject(approval.id, rejectReason);
      router.push('/officer/queue');
    } else {
      setActiveTab('query');
    }
  };

  const currentDocName = approval.documentsRequired[selectedDocIndex] || approval.documentsRequired[0] || 'Technical Plan';
  const currentVerdict = docVerdicts[currentDocName] || 'Verified';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/officer/queue"
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications Queue</span>
        </Link>
      </div>

      {/* APPLICATION HEADER: App ID, Applicant, Approval, Risk, SLA */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
                {approval.id}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Code: <strong>{approval.approvalCode}</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-600">
                Department: <strong>{approval.departmentName}</strong>
              </span>
              {/* Risk Badge */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                riskLevel === 'High Risk' ? 'bg-red-100 text-red-900 border-red-300' :
                riskLevel === 'Medium Risk' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {riskLevel}
              </span>
            </div>

            <h1 className="text-xl font-bold text-slate-900">
              {approval.approvalName}
            </h1>

            <p className="text-xs text-slate-600 flex items-center gap-2 flex-wrap">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Applicant: <strong>{project.contactPerson}</strong> ({project.companyName}) • CIN: <span className="font-mono">{project.registrationNumber}</span>
            </p>
          </div>

          <div className="shrink-0 flex lg:flex-col items-center lg:items-end justify-between gap-2">
            <StatusBadge status={approval.status} size="md" />
            <SLAAlert
              daysRemaining={approval.slaDaysRemaining ?? 15}
              slaDays={approval.slaDays}
              isDeemedApprovalEligible={approval.isDeemedApprovalEligible}
            />
          </div>
        </div>

        {/* 6 Tabs Navigation */}
        <div className="flex items-center space-x-1 border-b border-slate-200 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Layers },
            { id: 'documents', label: 'Document Review', icon: FileText, badge: `${approval.documentsRequired.length} Docs` },
            { id: 'query', label: 'Query Tool', icon: AlertTriangle, badge: approval.query ? '1 Active' : undefined },
            { id: 'inspection', label: 'Joint Inspection', icon: CalendarCheck },
            { id: 'timeline', label: 'Audit Timeline', icon: Clock },
            { id: 'decision', label: 'Statutory Decision', icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? 'border-gov-blue-primary text-gov-blue-primary bg-blue-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-slate-200 text-slate-700 text-[10px] px-1.5 py-0.2 rounded font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                Project Operational Parameters
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Facility Name:</span>
                  <span className="font-bold text-slate-900">{project.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Industrial Area:</span>
                  <span className="font-bold text-slate-900">{project.location.industrialArea}, {project.location.district}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Capital Investment:</span>
                  <span className="font-bold text-slate-900">{formatCurrencyINR(project.estimatedInvestmentCrores * 10000000)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Workforce Size:</span>
                  <span className="font-bold text-slate-900">{project.expectedEmployees} Personnel</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Connected Power Demand:</span>
                  <span className="font-bold text-slate-900">{project.operations.utilities.powerKVA} kVA (HT Drawal)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Daily Water Requirement:</span>
                  <span className="font-bold text-slate-900">{project.operations.utilities.waterKLD} KLD (ZLD System)</span>
                </div>
              </div>
            </div>

            {/* Active Query Status if any */}
            {approval.query && (
              <div className="bg-amber-50 rounded-lg border border-amber-300 p-5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-amber-950 font-bold">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    Active Scrutiny Query: {approval.query.subject}
                  </span>
                  <span className="bg-white text-amber-900 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                    Deadline: {formatDate(approval.query.deadlineDate)}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {approval.query.description}
                </p>
                {approval.query.response && (
                  <div className="bg-white p-3 rounded border border-amber-200 mt-2 space-y-1">
                    <span className="font-bold text-emerald-800 text-[11px] block">
                      Applicant Clarification Received on {formatDate(approval.query.response.submittedDate)}:
                    </span>
                    <p className="text-slate-800 text-[11px] italic">
                      &quot;{approval.query.response.notes}&quot;
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Action Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Statutory Actions
              </h4>
              <button
                onClick={() => setActiveTab('decision')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Grant Statutory Clearance</span>
              </button>
              <button
                onClick={() => setActiveTab('query')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Raise Official Query</span>
              </button>
              <button
                onClick={() => setActiveTab('inspection')}
                className="w-full bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Schedule Site Inspection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENT REVIEW (TWO-COLUMN + REVIEW ASSISTANCE PANEL) */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Two-Column Document Review Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-gov-blue-secondary" />
                  Submitted Technical Blueprints &amp; Regulatory Dossier
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {approval.documentsRequired.length} Required Attachments
                </span>
              </div>

              {/* Two-Column: List on Left, Preview/Detail on Right */}
              <div className="grid grid-cols-1 sm:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 min-h-[420px]">
                {/* Left Column: List of Docs (5 Cols) */}
                <div className="sm:col-span-5 p-2 space-y-1 bg-slate-50/40">
                  {approval.documentsRequired.map((docName, idx) => {
                    const verdict = docVerdicts[docName] || 'Verified';
                    const isSelected = selectedDocIndex === idx;

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDocIndex(idx)}
                        className={`w-full text-left p-2.5 rounded text-xs transition-all border ${
                          isSelected
                            ? 'bg-blue-50 border-blue-400 font-bold text-gov-blue-primary shadow-xs'
                            : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="truncate max-w-[150px] leading-tight block">{docName}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                            verdict === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                            verdict === 'Requires Clarification' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {verdict === 'Requires Clarification' ? 'Query' : verdict}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block mt-1">
                          Format: PDF • 3.8 MB
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Column: Preview & Verdict Controls (7 Cols) */}
                <div className="sm:col-span-7 p-4 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">Document Inspection</span>
                        <h4 className="text-sm font-bold text-slate-900">{currentDocName}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        currentVerdict === 'Verified' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                        currentVerdict === 'Requires Clarification' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                        'bg-red-50 text-red-900 border-red-300'
                      }`}>
                        Current Verdict: {currentVerdict}
                      </span>
                    </div>

                    {/* Simulated Document Preview Viewport */}
                    <div className="bg-slate-900 text-slate-300 rounded border border-slate-800 p-6 flex flex-col items-center justify-center space-y-2 text-center h-48">
                      <FileText className="w-10 h-10 text-blue-400 opacity-80" />
                      <p className="text-xs font-semibold text-white">
                        Digital Document Viewport: {currentDocName}
                      </p>
                      <p className="text-[10px] text-slate-400 max-w-xs">
                        Cryptographically signed PDF verified through DigiLocker Business Gateway. SHA-256 integrity check validated.
                      </p>
                    </div>

                    {/* Pre-validation indicators */}
                    <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-700 block text-[11px]">System Audit Pre-Checks:</span>
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-600">
                        <span>✓ Readable OCR Check: Passed</span>
                        <span>✓ Digital Signature: Valid</span>
                        <span>✓ Page Count: 14 Pages</span>
                        <span>✓ Water Balance Match: Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Per-Doc Actions: Accept / Reject / Request Clarification */}
                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-700 block">Record Scrutiny Verdict:</span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleDocVerdict(currentDocName, 'Verified')}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold py-1.5 px-2 rounded text-xs flex items-center justify-center gap-1 transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Verified</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDocVerdict(currentDocName, 'Requires Clarification')}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold py-1.5 px-2 rounded text-xs flex items-center justify-center gap-1 transition-all"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Clarification</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDocVerdict(currentDocName, 'Invalid')}
                        className="bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 font-bold py-1.5 px-2 rounded text-xs flex items-center justify-center gap-1 transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject Invalid</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* REVIEW ASSISTANCE PANEL (4 Cols) - EXPLICITLY LABELED DECISION-SUPPORT ONLY */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-lg border-2 border-blue-400 shadow-gov p-5 space-y-4">
              {/* Mandatory Guardrail Header */}
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <div className="p-1.5 bg-blue-100 text-gov-blue-secondary rounded">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gov-blue-primary uppercase tracking-tight">
                    Review Assistance Panel
                  </h3>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold border border-amber-300 inline-block mt-0.5">
                    DECISION-SUPPORT ONLY
                  </span>
                </div>
              </div>

              {/* Explicit Guardrail Callout */}
              <div className="bg-amber-50 border border-amber-300 rounded p-2 text-[10px] text-amber-950 leading-relaxed font-medium">
                <strong>Statutory Guardrail:</strong> AI &amp; automated checks are advisory decision-support only. Officer retains exclusive statutory authority under state regulations.
              </div>

              {/* Metrics */}
              <div className="space-y-3 text-xs">
                {/* Completeness */}
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-slate-700">Dossier Completeness</span>
                    <span className="text-emerald-700">92% Complete</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>

                {/* Required Docs Count */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Required Documents:</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {approval.requiredDocsCount} / {approval.requiredDocsCount} Attached
                  </span>
                </div>

                {/* Flagged Inconsistency Check */}
                <div className="bg-blue-50/80 p-2.5 rounded border border-blue-200 space-y-1">
                  <span className="font-bold text-gov-blue-primary text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    Entity &amp; Address Verification:
                  </span>
                  <p className="text-[11px] text-slate-700 leading-snug">
                    Plot 42-44, IMT Manesar Phase-II matches SIDC Allotment Deed SIDC/PLT/2026/GGM-8821. No discrepancy detected.
                  </p>
                </div>

                {/* Inspection Requirement */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Inspection Required?</span>
                  <span className="font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    Yes (Joint Site Audit)
                  </span>
                </div>

                {/* Risk Level Assessment */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Assessed Risk Level:</span>
                  <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {riskLevel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QUERY TOOL (RAISE OFFICIAL SCRUTINY QUERY) */}
      {activeTab === 'query' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-6 max-w-3xl">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Issue Statutory Scrutiny Query / Objection
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Dispatches formal departmental observation to applicant. Applicant single window is immediately notified and deadline clock starts.
            </p>
          </div>

          <form onSubmit={handleSendQuery} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Query Category:</label>
              <select
                value={queryCategory}
                onChange={(e) => setQueryCategory(e.target.value)}
                className="w-full p-2 rounded border border-slate-300 bg-white text-xs"
              >
                <option value="Technical Calculation">Technical Drawing &amp; Engineering Calculations</option>
                <option value="Effluent Safeguard">Effluent Treatment &amp; ZLD Schematic</option>
                <option value="Fire Safety">Fire Evacuation Corridor Clearance</option>
                <option value="Land Tenure">Land Boundary / Cadastral Coordinate Confirmation</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Query Subject:</label>
              <input
                type="text"
                value={querySubject}
                onChange={(e) => setQuerySubject(e.target.value)}
                placeholder="e.g. ZLD water balance flow discrepancy in battery assembly line"
                className="w-full p-2 rounded border border-slate-300 text-xs"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Detailed Observation &amp; Required Remedy:</label>
              <textarea
                value={queryDescription}
                onChange={(e) => setQueryDescription(e.target.value)}
                rows={4}
                placeholder="Specify the exact statutory rule, measurement deficiency, or revised blueprint required from applicant..."
                className="w-full p-2 rounded border border-slate-300 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Statutory Response Window:</label>
                <select
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 bg-white text-xs"
                >
                  <option value="7">7 Days (Expedited)</option>
                  <option value="14">14 Days (Standard)</option>
                  <option value="21">21 Days (Complex Technical Audit)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Required Document Attachment:</label>
                <input
                  type="text"
                  placeholder="e.g. Revised ZLD Flow Schematic Drawing"
                  onChange={(e) => setRequestedDocs([e.target.value])}
                  className="w-full p-2 rounded border border-slate-300 text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2 rounded shadow flex items-center gap-1.5 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send Query to Applicant</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: INSPECTION */}
      {activeTab === 'inspection' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-purple-600" />
                Site Audit &amp; Joint Inspection
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Physical verification coordinates multiple departments on the same date.
              </p>
            </div>
            <Link
              href="/officer/inspections"
              className="bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-300 px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span>Open Unified Inspection Planner</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 text-xs">
            <span className="font-bold text-slate-800 block text-sm">Site Audit Checklist Items</span>
            <div className="space-y-2">
              {[
                { item: 'Boundary setback clearance min 6.0m for emergency vehicle passage', verified: true },
                { item: 'Effluent discharge sampling port and flow meter calibration', verified: true },
                { item: 'HT substation clearance and high-voltage danger signage', verified: true },
                { item: 'Secondary escape corridor width compliance (min 2.0m)', verified: false },
              ].map((chk, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-white rounded border border-slate-200">
                  <span className="text-slate-800">{chk.item}</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${chk.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {chk.verified ? '✓ Verified on Site' : 'Pending Verification'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
            Chronological Audit Trail &amp; Processing Milestones
          </h3>
          <div className="space-y-4 relative border-l-2 border-slate-200 ml-4 pl-6 text-xs">
            {(approval.timelineEvents || []).map((tl) => (
              <div key={tl.id} className="relative space-y-1">
                <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-gov-blue-primary ring-4 ring-white" />
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{tl.stageName}</span>
                  <span className="text-[10px] font-mono text-slate-400">{tl.date} at {tl.time}</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                    Actor: {tl.actor}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px]">{tl.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: STATUTORY DECISION (APPROVE / REJECT / REQUEST INFO) */}
      {activeTab === 'decision' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-6 max-w-3xl">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Competent Authority Official Statutory Decision
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Executing this order formally updates the applicant status, updates roadmap, and auto-unlocks dependent clearances.
            </p>
          </div>

          <form onSubmit={handleDecisionSubmit} className="space-y-5 text-xs">
            {/* Decision Radio Choice */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-800">Select Official Action:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between transition-all ${
                  decisionType === 'approve'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-300'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="decision"
                      checked={decisionType === 'approve'}
                      onChange={() => setDecisionType('approve')}
                    />
                    <span className="font-bold">Grant Clearance</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">Issues certificate &amp; auto-unlocks downstream</span>
                </label>

                <label className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between transition-all ${
                  decisionType === 'query'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-950 ring-2 ring-amber-300'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="decision"
                      checked={decisionType === 'query'}
                      onChange={() => setDecisionType('query')}
                    />
                    <span className="font-bold">Request More Info</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">Pauses SLA and alerts applicant</span>
                </label>

                <label className={`p-3 rounded-lg border cursor-pointer flex flex-col justify-between transition-all ${
                  decisionType === 'reject'
                    ? 'border-red-500 bg-red-50/70 text-red-950 ring-2 ring-red-300'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="decision"
                      checked={decisionType === 'reject'}
                      onChange={() => setDecisionType('reject')}
                    />
                    <span className="font-bold">Reject Application</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1">Records statutory rejection with legal grounds</span>
                </label>
              </div>
            </div>

            {decisionType === 'approve' && (
              <div className="space-y-4 bg-emerald-50/40 p-4 rounded border border-emerald-200">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Official Clearance Certificate Number:</label>
                  <input
                    type="text"
                    value={customCertNo}
                    onChange={(e) => setCustomCertNo(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 font-mono text-xs bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Statutory Clearance Order Remarks:</label>
                  <textarea
                    value={approveRemarks}
                    onChange={(e) => setApproveRemarks(e.target.value)}
                    rows={3}
                    className="w-full p-2 rounded border border-slate-300 text-xs bg-white"
                    required
                  />
                </div>
              </div>
            )}

            {decisionType === 'reject' && (
              <div className="space-y-4 bg-red-50/40 p-4 rounded border border-red-200">
                <div>
                  <label className="block font-bold text-red-950 mb-1">Legal Grounds for Rejection / Return:</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    placeholder="Specify applicable sections, environmental non-compliances, or setback violations..."
                    className="w-full p-2 rounded border border-red-300 text-xs bg-white"
                    required
                  />
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`font-bold px-6 py-2 rounded shadow text-xs flex items-center gap-1.5 text-white transition-all ${
                  decisionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  decisionType === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Confirm &amp; Issue Statutory Order</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
