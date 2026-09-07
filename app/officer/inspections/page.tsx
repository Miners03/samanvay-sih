'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { 
  CalendarCheck2, 
  MapPin, 
  Users, 
  Building2, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  Check, 
  X, 
  FileText, 
  Upload, 
  ShieldCheck, 
  Flame, 
  Leaf, 
  HardHat, 
  ChevronRight,
  Send,
  HelpCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function UnifiedInspectionsPage() {
  const { 
    project, 
    unifiedInspection, 
    proposeUnifiedInspection, 
    submitDepartmentInspectionChecklist, 
    officerApprove, 
    showToast 
  } = useApp();

  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposedDate, setProposedDate] = useState(unifiedInspection.proposedDate || '2026-09-24');
  const [proposedTime, setProposedTime] = useState(unifiedInspection.proposedTime || '10:30 AM');

  // Active department viewing/filling checklist
  const [activeChecklistDept, setActiveChecklistDept] = useState<'fire' | 'pollution' | 'factory'>('pollution');

  // Local state for checklists
  const [fireChecklist, setFireChecklist] = useState(unifiedInspection.parallelChecklists.fire);
  const [pollutionChecklist, setPollutionChecklist] = useState(unifiedInspection.parallelChecklists.pollution);
  const [factoryChecklist, setFactoryChecklist] = useState(unifiedInspection.parallelChecklists.factory);

  // Officer report state
  const [observations, setObservations] = useState('All civil containment foundations and physical setbacks match the sanctioned architectural drawings. Flow sampling ports installed compliant with regulatory norms.');
  const [recommendation, setRecommendation] = useState<'Approve' | 'Reject' | 'Request More Info'>('Approve');
  const [remarks, setRemarks] = useState('Recommended for statutory clearance. Boundary setbacks clear for emergency vehicle circulation.');

  // Handle proposal submission
  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    proposeUnifiedInspection(proposedDate, proposedTime);
    setShowProposalModal(false);
  };

  // Toggle checklist item
  const handleToggleChecklist = (dept: 'fire' | 'pollution' | 'factory', id: string) => {
    if (dept === 'fire') {
      setFireChecklist(prev => prev.map(item => item.id === id ? { ...item, verified: !item.verified } : item));
    } else if (dept === 'pollution') {
      setPollutionChecklist(prev => prev.map(item => item.id === id ? { ...item, verified: !item.verified } : item));
    } else {
      setFactoryChecklist(prev => prev.map(item => item.id === id ? { ...item, verified: !item.verified } : item));
    }
  };

  // Submit report for active department
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    const currentList = activeChecklistDept === 'fire' ? fireChecklist : activeChecklistDept === 'pollution' ? pollutionChecklist : factoryChecklist;
    submitDepartmentInspectionChecklist(activeChecklistDept, currentList, {
      observations,
      remarks,
      recommendation,
    });

    if (recommendation === 'Approve') {
      // Find corresponding approval
      const approvalCode = activeChecklistDept === 'fire' ? 'SFES-NOC-PROV' : activeChecklistDept === 'pollution' ? 'SPCB-CTE-ORG' : 'DISH-FACT-REG';
      const targetApp = project.approvals.find(a => a.approvalCode === approvalCode);
      if (targetApp) {
        officerApprove(targetApp.id, remarks);
      }
    }
  };

  // Commonality Matrix criteria
  const commonalityMatrix = [
    { criterion: 'Physical Site Visit & Landmark Access', fire: true, pollution: true, factory: true },
    { criterion: 'Plot Address & Boundary Setback Verification (min 6.0m)', fire: true, pollution: true, factory: true },
    { criterion: 'Facility Layout & Structural Cross-Sections', fire: true, pollution: true, factory: true },
    { criterion: 'Emergency Fire Extinguishers & Egress Paths', fire: true, pollution: false, factory: true },
    { criterion: 'Environmental Safeguards, ETP & Emission Ports', fire: false, pollution: true, factory: false },
    { criterion: 'Worker Safety, Machinery Guards & PPE Stations', fire: false, pollution: false, factory: true },
  ];

  const isCoordinated = unifiedInspection.status === 'confirmed' || unifiedInspection.status === 'completed';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Unified Inspection Planning System"
        subtitle="Single Window Joint Site Audit Engine: Transform fragmented multi-department visits into one synchronized site inspection while preserving independent statutory authority."
        breadcrumbs={[
          { label: 'Government Portal', href: '/officer/dashboard' },
          { label: 'Unified Inspection Planning', current: true },
        ]}
        badge={
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            MAJOR USP
          </span>
        }
      />

      {/* CORE USP: COMMONALITY ANALYSIS CARD */}
      <div className="bg-white rounded-lg border-2 border-gov-blue-secondary shadow-gov p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 text-gov-blue-primary text-xs font-mono font-bold px-2.5 py-0.5 rounded border border-blue-200">
                MULTI-DEPARTMENT AUDIT OVERLAP DETECTED
              </span>
              <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded border border-emerald-300">
                Commonality Score: {unifiedInspection.commonalityScore}%
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900">
              Coordinated Inspection Opportunity: {project.name}
            </h3>
            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{unifiedInspection.facilityLocation} (Ref: {project.referenceNo})</span>
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            {!isCoordinated ? (
              <button
                onClick={() => setShowProposalModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded shadow text-xs flex items-center gap-2 transition-all ring-2 ring-amber-300 animate-pulse"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Propose Unified Inspection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="text-right">
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs px-3 py-1.5 rounded inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Coordinated Site Audit Confirmed</span>
                </span>
                <span className="block text-[11px] font-mono text-slate-500 mt-1">
                  Scheduled: {unifiedInspection.proposedDate} at {unifiedInspection.proposedTime}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Commonality Intelligence Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 text-xs text-blue-950 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-gov-blue-secondary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-gov-blue-primary">
              Requirement Overlap Intelligence (78% Commonality)
            </p>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              These inspections contain overlapping site-verification requirements (perimeter setbacks, boundary survey, layout verification) and are suitable for a coordinated visit. 
              <strong> 3 individual visits ➔ 1 coordinated site visit.</strong> Saves 14 days of sequential delays and avoids repeated factory downtime.
            </p>
          </div>
        </div>

        {/* Requirement-Overlap Matrix Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Inspection Parameter / Audit Scope</th>
                <th className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 text-orange-700">
                    <Flame className="w-3.5 h-3.5" />
                    Fire Dept
                  </span>
                </th>
                <th className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 text-emerald-700">
                    <Leaf className="w-3.5 h-3.5" />
                    Pollution (SPCB)
                  </span>
                </th>
                <th className="py-2.5 px-3 text-center">
                  <span className="inline-flex items-center gap-1 text-blue-700">
                    <HardHat className="w-3.5 h-3.5" />
                    Factory (DISH)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {commonalityMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="py-2 px-4 font-medium text-slate-800">{row.criterion}</td>
                  <td className="py-2 px-3 text-center font-bold">
                    {row.fire ? <span className="text-emerald-600">✓ Overlap</span> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="py-2 px-3 text-center font-bold">
                    {row.pollution ? <span className="text-emerald-600">✓ Overlap</span> : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="py-2 px-3 text-center font-bold">
                    {row.factory ? <span className="text-emerald-600">✓ Overlap</span> : <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Explicit Statutory Guardrail Callout */}
        <div className="bg-amber-50 border-l-4 border-l-amber-500 border border-amber-200 rounded p-3 text-xs text-amber-950 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Mandatory Statutory Guardrail:</strong> Each department strictly maintains its own independent checklist, observations, and statutory decision under the respective state enactments. The platform only coordinates physical visit logistics, never merging or overriding official statutory discretion.
          </p>
        </div>
      </div>

      {/* EXECUTION INTERFACE: THREE PARALLEL CHECKLISTS SHOWN SIDE BY SIDE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck2 className="w-5 h-5 text-gov-blue-secondary" />
              Unified Execution: Three Parallel Departmental Checklists
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Conducted concurrently on site. Each inspecting officer submits independently.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveChecklistDept('pollution')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                activeChecklistDept === 'pollution' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Pollution (SPCB)</span>
            </button>
            <button
              onClick={() => setActiveChecklistDept('fire')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                activeChecklistDept === 'fire' ? 'bg-orange-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Fire Services</span>
            </button>
            <button
              onClick={() => setActiveChecklistDept('factory')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                activeChecklistDept === 'factory' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Labour (DISH)</span>
            </button>
          </div>
        </div>

        {/* 3 Columns Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Track 1: State Fire & Emergency Services */}
          <div className={`bg-white rounded-lg border shadow-gov p-4 space-y-3 transition-all ${
            activeChecklistDept === 'fire' ? 'border-2 border-orange-500 ring-2 ring-orange-200' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-xs text-orange-950 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-600" />
                Fire Safety Checklist
              </span>
              <span className="text-[10px] font-mono text-slate-400">SFES-NOC-PROV</span>
            </div>

            <p className="text-[11px] text-slate-500">
              Officer: <strong>Chief Fire Officer M. S. Hooda</strong>
            </p>

            <div className="space-y-2 text-xs">
              {fireChecklist.map((item) => (
                <label
                  key={item.id}
                  className={`p-2.5 rounded border block cursor-pointer transition-colors ${
                    item.verified ? 'bg-emerald-50/80 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={item.verified}
                      onChange={() => handleToggleChecklist('fire', item.id)}
                      className="mt-0.5 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-slate-800 leading-snug font-medium text-[11px]">{item.item}</span>
                  </div>
                  {item.remarks && (
                    <span className="text-[10px] text-slate-500 block mt-1 ml-5 italic">
                      Obs: {item.remarks}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Track 2: State Pollution Control Board */}
          <div className={`bg-white rounded-lg border shadow-gov p-4 space-y-3 transition-all ${
            activeChecklistDept === 'pollution' ? 'border-2 border-emerald-600 ring-2 ring-emerald-200' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                Pollution Safeguards Checklist
              </span>
              <span className="text-[10px] font-mono text-slate-400">SPCB-CTE-ORG</span>
            </div>

            <p className="text-[11px] text-slate-500">
              Officer: <strong>Er. R. K. Sharma (SEE)</strong>
            </p>

            <div className="space-y-2 text-xs">
              {pollutionChecklist.map((item) => (
                <label
                  key={item.id}
                  className={`p-2.5 rounded border block cursor-pointer transition-colors ${
                    item.verified ? 'bg-emerald-50/80 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={item.verified}
                      onChange={() => handleToggleChecklist('pollution', item.id)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-slate-800 leading-snug font-medium text-[11px]">{item.item}</span>
                  </div>
                  {item.remarks && (
                    <span className="text-[10px] text-slate-500 block mt-1 ml-5 italic">
                      Obs: {item.remarks}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Track 3: Directorate of Industrial Safety & Health */}
          <div className={`bg-white rounded-lg border shadow-gov p-4 space-y-3 transition-all ${
            activeChecklistDept === 'factory' ? 'border-2 border-blue-600 ring-2 ring-blue-200' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-xs text-blue-950 flex items-center gap-1.5">
                <HardHat className="w-4 h-4 text-blue-600" />
                Factory Safety Checklist
              </span>
              <span className="text-[10px] font-mono text-slate-400">DISH-FACT-REG</span>
            </div>

            <p className="text-[11px] text-slate-500">
              Officer: <strong>Shri A. P. Varma (Joint Director)</strong>
            </p>

            <div className="space-y-2 text-xs">
              {factoryChecklist.map((item) => (
                <label
                  key={item.id}
                  className={`p-2.5 rounded border block cursor-pointer transition-colors ${
                    item.verified ? 'bg-emerald-50/80 border-emerald-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={item.verified}
                      onChange={() => handleToggleChecklist('factory', item.id)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-slate-800 leading-snug font-medium text-[11px]">{item.item}</span>
                  </div>
                  {item.remarks && (
                    <span className="text-[10px] text-slate-500 block mt-1 ml-5 italic">
                      Obs: {item.remarks}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* OFFICER INSPECTION REPORT FORM & STATUTORY DECISION */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-5 max-w-3xl">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gov-blue-secondary" />
            Submit Department Inspection Report &amp; Decision ({activeChecklistDept.toUpperCase()})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Record official site findings, upload photographic evidence, and submit statutory recommendation.
          </p>
        </div>

        <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Site Observations &amp; Verification Findings:</label>
            <textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
              className="w-full p-2.5 rounded border border-slate-300 text-xs"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Photographic &amp; Evidentiary Logs (Simulated Upload):</label>
            <div className="border-2 border-dashed border-slate-300 rounded p-4 text-center hover:bg-slate-50 cursor-pointer">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="font-semibold text-slate-700">Attach site photographs with GIS geotag</p>
              <p className="text-[10px] text-slate-400">Supported: JPG, PNG, PDF • Auto-stamped with lat/long coordinates</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Statutory Recommendation:</label>
              <select
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value as any)}
                className="w-full p-2 rounded border border-slate-300 bg-white text-xs font-semibold"
              >
                <option value="Approve">Approve / Grant Clearance</option>
                <option value="Request More Info">Request More Information / Minor Rectification</option>
                <option value="Reject">Reject / Statutory Non-Compliance</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Official Remarks:</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2 rounded border border-slate-300 text-xs"
                required
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => showToast('Draft Saved', 'Inspection observations saved to local session draft.', 'info')}
              className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="bg-gov-blue-primary hover:bg-gov-blue-secondary text-white font-bold px-6 py-2 rounded shadow flex items-center gap-1.5 transition-all text-xs"
            >
              <Check className="w-4 h-4" />
              <span>Submit Inspection Report &amp; Update Docket</span>
            </button>
          </div>
        </form>
      </div>

      {/* PROPOSAL MODAL */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-lg w-full p-6 text-xs space-y-4 animate-in fade-in duration-150">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  COORDINATED SITE AUDIT PROPOSAL
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Propose Unified Inspection
                </h3>
              </div>
              <button
                onClick={() => setShowProposalModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed text-[11px]">
              You are proposing to coordinate <strong>3 independent department visits</strong> into a single physical visit on site at <strong>{project.name}</strong>, IMT Manesar.
            </p>

            <form onSubmit={handleProposalSubmit} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Participating Regulatory Bodies:</label>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1 text-[11px] text-slate-700">
                  <p>✓ State Fire &amp; Emergency Services (NOC Verification)</p>
                  <p>✓ State Pollution Control Board (Consent to Establish)</p>
                  <p>✓ Directorate of Industrial Safety &amp; Health (Factory Registration)</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Proposed Inspection Date:</label>
                  <input
                    type="date"
                    value={proposedDate}
                    onChange={(e) => setProposedDate(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Proposed Time Slot:</label>
                  <input
                    type="text"
                    value={proposedTime}
                    onChange={(e) => setProposedTime(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded p-2.5 text-[10px] text-amber-950 leading-relaxed font-medium">
                <strong>Statutory Notice:</strong> This proposal synchronizes physical transport and entry. Each department officer will conduct their independent evaluation and issue separate statutory orders.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProposalModal(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gov-blue-primary hover:bg-gov-blue-secondary text-white font-bold px-5 py-2 rounded shadow text-xs flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm &amp; Coordinate Visit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
