'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { ProgressBar } from '@/components/common/ProgressBar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { VisualDependencyGraph } from '@/components/applicant/VisualDependencyGraph';
import { StartApplicationModal } from '@/components/applicant/StartApplicationModal';
import { QueryResponseModal } from '@/components/applicant/QueryResponseModal';
import { ApprovalRoadmapItem, ClearanceStage } from '@/lib/types';
import { 
  Building2, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  ArrowRight, 
  Layers, 
  GitFork, 
  ShieldCheck, 
  PlayCircle, 
  Sparkles, 
  HelpCircle, 
  Eye,
  Check,
  ChevronRight
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '@/lib/utils';

export default function ApprovalRoadmapPage() {
  const { id } = useParams();
  const { project, simulatePrerequisiteApproval } = useApp();

  const [viewMode, setViewMode] = useState<'stage' | 'graph' | 'split'>('stage');
  const [selectedApplicationToStart, setSelectedApplicationToStart] = useState<ApprovalRoadmapItem | null>(null);
  const [activeQueryModalApproval, setActiveQueryModalApproval] = useState<ApprovalRoadmapItem | null>(null);

  // Group approvals by stage for Stage view
  const stages: { id: ClearanceStage; title: string; subtitle: string; stageNo: number }[] = [
    {
      id: 'pre_establishment',
      stageNo: 1,
      title: 'Stage 1: Pre-Establishment Clearances',
      subtitle: 'Site acquisition, environmental consents, and utility sanction before any physical construction starts.',
    },
    {
      id: 'pre_construction',
      stageNo: 2,
      title: 'Stage 2: Pre-Construction Approvals',
      subtitle: 'Building plan sanctions, tree felling permissions, and statutory worker welfare cess clearance.',
    },
    {
      id: 'pre_operation',
      stageNo: 3,
      title: 'Stage 3: Pre-Operation & Safety Inspections',
      subtitle: 'Plant equipment certification, boiler hydraulic testing, and joint factory safety registration.',
    },
    {
      id: 'post_commissioning',
      stageNo: 4,
      title: 'Stage 4: Incentives & Commissioning',
      subtitle: 'Final operational subsidies, green tech capital grants, and commercial production go-ahead.',
    },
  ];

  // Grouping for Split view
  const canApplyNowItems = project.approvals.filter(
    (a) => a.status === 'can_apply_now' || (a.isParallelTrack && a.status !== 'approved' && a.status !== 'waiting')
  );

  const waitingPrereqItems = project.approvals.filter(
    (a) => a.status === 'waiting'
  );

  const approvedOrUnderReviewItems = project.approvals.filter(
    (a) => a.status === 'approved' || (a.status === 'in_progress' && !a.isParallelTrack)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Your Approval Roadmap"
        subtitle="Based on your project profile, location and operational requirements, the following approvals may apply. (Simulated mapping, not a legal determination)."
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Projects', href: '/applicant/projects' },
          { label: 'Your Approval Roadmap', current: true },
        ]}
        badge={
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2 py-0.5 rounded">
            SIMULATED REGULATORY ENGINE
          </span>
        }
      />

      {/* Legal & Simulated Disclaimer Callout */}
      <div className="bg-blue-50 border border-gov-blue-border rounded-lg p-4 text-xs text-blue-950 flex items-start gap-3 shadow-sm">
        <HelpCircle className="w-5 h-5 text-gov-blue-secondary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-gov-blue-primary">
            Official Advisory on Coordinated Roadmap Mapping
          </p>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            This approval roadmap dynamically determines permits, licences and clearances based on your stated operations, power requirements, and workforce. <strong>This is a simulated mapping, not a legal determination.</strong> Statutory conditions remain subject to departmental scrutiny rules under the respective state and central Acts.
          </p>
        </div>
      </div>

      {/* Master Project Summary & 4-Segment Progress Bar */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                {project.referenceNo}
              </span>
              <span className="text-xs font-bold text-slate-900">
                {project.name}
              </span>
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                {project.projectType}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {project.companyName} • {project.location.industrialArea}, {project.location.district} • Investment: <strong>{formatCurrencyINR(project.estimatedInvestmentCrores * 10000000)}</strong> • Workforce: <strong>{project.expectedEmployees} Personnel</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              SLA Deemed Approval Active
            </span>
          </div>
        </div>

        <ProgressBar
          completed={project.progress.completed}
          total={project.progress.total}
          inProgress={project.progress.inProgress}
          actionRequired={project.progress.actionRequired}
          waiting={project.progress.waiting}
        />
      </div>

      {/* VIEW MODE SELECTOR TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('stage')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'stage'
                ? 'bg-gov-blue-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>4-Stage Lifecycle View</span>
          </button>
          <button
            onClick={() => setViewMode('graph')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'graph'
                ? 'bg-gov-blue-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Visual Dependency Graph</span>
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'split'
                ? 'bg-gov-blue-primary text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Can Apply Now vs Locked</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Live Auto-Unlock Demo:</span>
          <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-medium">
            Approve SPCB CTE ➔ Unlocks Fire Provisional NOC
          </span>
        </div>
      </div>

      {/* VIEW 1: 4-STAGE LIFECYCLE VIEW */}
      {viewMode === 'stage' && (
        <div className="space-y-8">
          {stages.map((stg) => {
            const stageApprovals = project.approvals.filter((a) => a.stage === stg.id);
            const approvedCount = stageApprovals.filter((a) => a.status === 'approved').length;
            const isCompleted = approvedCount === stageApprovals.length && stageApprovals.length > 0;

            // Separate sequential vs parallel in stage 1
            const parallelTracks = stageApprovals.filter((a) => a.isParallelTrack);
            const standardTracks = stageApprovals.filter((a) => !a.isParallelTrack);

            return (
              <div key={stg.id} className="space-y-4">
                {/* Stage Header Banner */}
                <div className="bg-slate-50 border-l-4 border-l-gov-blue-primary border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gov-blue-primary text-white text-[11px] font-bold flex items-center justify-center">
                        {stg.stageNo}
                      </span>
                      <h3 className="text-sm font-black text-gov-blue-primary uppercase tracking-tight">
                        {stg.title}
                      </h3>
                      {isCompleted && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-700" />
                          Stage Cleared
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {stg.subtitle}
                    </p>
                  </div>

                  <div className="text-xs font-semibold text-slate-600 shrink-0">
                    <span className="text-emerald-700 font-bold">{approvedCount}</span> / {stageApprovals.length} Clearances Obtained
                  </div>
                </div>

                {/* Standard / Foundation Approvals in this stage */}
                {standardTracks.length > 0 && (
                  <div className="grid grid-cols-1 gap-4">
                    {standardTracks.map((approval) => (
                      <RoadmapCard
                        key={approval.id}
                        approval={approval}
                        onStartApplication={setSelectedApplicationToStart}
                        onRespondQuery={setActiveQueryModalApproval}
                        onSimulatePrereq={simulatePrerequisiteApproval}
                      />
                    ))}
                  </div>
                )}

                {/* Parallel Tracks Cluster (e.g. SPCB CTE, DISCOM HT, Fire Provisional NOC in Stage 1) */}
                {parallelTracks.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <GitFork className="w-4 h-4 text-gov-blue-secondary" />
                      <span>Parallel Track Approvals (Can be processed concurrently once prerequisites clear):</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {parallelTracks.map((approval) => (
                        <RoadmapCard
                          key={approval.id}
                          approval={approval}
                          isCompact={true}
                          onStartApplication={setSelectedApplicationToStart}
                          onRespondQuery={setActiveQueryModalApproval}
                          onSimulatePrereq={simulatePrerequisiteApproval}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: VISUAL DEPENDENCY GRAPH */}
      {viewMode === 'graph' && (
        <VisualDependencyGraph
          onStartApplication={(app) => setSelectedApplicationToStart(app)}
        />
      )}

      {/* VIEW 3: CAN APPLY NOW VS LOCKED (CATEGORIZED SPLIT) */}
      {viewMode === 'split' && (
        <div className="space-y-8">
          {/* Section A: Can Apply Now (Parallel & Unlocked) */}
          <div className="space-y-4">
            <div className="border-b-2 border-amber-500 pb-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-amber-600" />
                  Can Apply Now (Parallel Tracks)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Independent clearances and unlocked milestones that can be filed immediately in parallel without waiting.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                {canApplyNowItems.length} Available to Proceed
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {canApplyNowItems.map((approval) => (
                <RoadmapCard
                  key={approval.id}
                  approval={approval}
                  onStartApplication={setSelectedApplicationToStart}
                  onRespondQuery={setActiveQueryModalApproval}
                  onSimulatePrereq={simulatePrerequisiteApproval}
                />
              ))}
            </div>
          </div>

          {/* Section B: Waiting for Prerequisite (Sequential Tracks) */}
          <div className="space-y-4 pt-4">
            <div className="border-b-2 border-slate-400 pb-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-slate-500" />
                  Waiting for Prerequisite (Sequential Tracks)
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Locked until upstream statutory prerequisites are cleared by preceding departments.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-300">
                {waitingPrereqItems.length} Locked Steps
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {waitingPrereqItems.map((approval) => (
                <RoadmapCard
                  key={approval.id}
                  approval={approval}
                  onStartApplication={setSelectedApplicationToStart}
                  onRespondQuery={setActiveQueryModalApproval}
                  onSimulatePrereq={simulatePrerequisiteApproval}
                />
              ))}
            </div>
          </div>

          {/* Section C: Completed Milestone Clearances */}
          {approvedOrUnderReviewItems.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="border-b border-slate-300 pb-2 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Completed Milestone Clearances ({approvedOrUnderReviewItems.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvedOrUnderReviewItems.map((approval) => (
                  <RoadmapCard
                    key={approval.id}
                    approval={approval}
                    isCompact={true}
                    onStartApplication={setSelectedApplicationToStart}
                    onRespondQuery={setActiveQueryModalApproval}
                    onSimulatePrereq={simulatePrerequisiteApproval}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Start Application Modal */}
      {selectedApplicationToStart && (
        <StartApplicationModal
          approval={selectedApplicationToStart}
          isOpen={Boolean(selectedApplicationToStart)}
          onClose={() => setSelectedApplicationToStart(null)}
        />
      )}

      {/* Query Modal */}
      {activeQueryModalApproval && (
        <QueryResponseModal
          approval={activeQueryModalApproval}
          isOpen={Boolean(activeQueryModalApproval)}
          onClose={() => setActiveQueryModalApproval(null)}
        />
      )}
    </div>
  );
}

// Sub-component for individual roadmap card
interface RoadmapCardProps {
  approval: ApprovalRoadmapItem;
  isCompact?: boolean;
  onStartApplication: (app: ApprovalRoadmapItem) => void;
  onRespondQuery: (app: ApprovalRoadmapItem) => void;
  onSimulatePrereq: (depId: string) => void;
}

function RoadmapCard({
  approval,
  isCompact,
  onStartApplication,
  onRespondQuery,
  onSimulatePrereq,
}: RoadmapCardProps) {
  const isLocked = approval.status === 'waiting';
  const isCanApply = approval.status === 'can_apply_now';
  const isActionReq = approval.status === 'action_required';
  const isApproved = approval.status === 'approved';

  // Card border styling based on status
  let borderStyle = 'border-slate-200 border-l-4 border-l-slate-400 bg-white';
  if (isApproved) {
    borderStyle = 'border-slate-200 border-l-4 border-l-emerald-600 bg-white';
  } else if (isCanApply) {
    borderStyle = 'border-amber-400 border-l-4 border-l-amber-500 bg-amber-50/20 shadow-sm ring-1 ring-amber-300';
  } else if (isActionReq) {
    borderStyle = 'border-red-300 border-l-4 border-l-red-600 bg-white shadow-sm';
  } else if (isLocked) {
    borderStyle = 'border-slate-200 border-l-4 border-l-slate-300 bg-slate-50/80 opacity-90';
  } else {
    borderStyle = 'border-slate-200 border-l-4 border-l-blue-600 bg-white';
  }

  return (
    <div className={`rounded-lg border shadow-gov p-5 space-y-4 transition-all hover:border-slate-300 ${borderStyle}`}>
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          {/* Header Badges */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-mono font-bold text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
              {approval.approvalCode}
            </span>
            <span className="text-slate-600 flex items-center gap-1 font-medium">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {approval.departmentName}
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-medium text-slate-600">
              Type: <strong>{approval.approvalType}</strong>
            </span>
            {approval.isParallelTrack && (
              <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border border-blue-200">
                <GitFork className="w-3 h-3" />
                Parallel Track
              </span>
            )}
          </div>

          {/* Approval Name */}
          <h4 className="text-base font-bold text-slate-900">
            {approval.approvalName}
          </h4>

          {/* Locked Blocker explanation */}
          {isLocked && (
            <div className="bg-slate-100 rounded-md p-3 text-xs border border-slate-200 text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Statutory Prerequisite Lock:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                {approval.unlockReason || 'Locked until preceding department clears prerequisites.'}
              </p>
              {approval.dependencies && approval.dependencies.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Awaiting clearance of:</span>
                  {approval.dependencyNames?.map((dep, idx) => (
                    <span key={idx} className="bg-white px-2 py-0.5 rounded text-[10px] font-medium text-slate-700 border border-slate-200">
                      {dep}
                    </span>
                  ))}
                  {/* Interactive Demo Simulate Button */}
                  <button
                    onClick={() => onSimulatePrereq(approval.dependencies[0])}
                    className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-gov-blue-secondary text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 shadow-xs"
                    title="Simulate prerequisite approval to test auto-unlock"
                  >
                    <Sparkles className="w-3 h-3 text-gov-blue-secondary" />
                    <span>Simulate Clearance of Prerequisite</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Unlocked Announcement */}
          {approval.unlockReason && !isLocked && (
            <p className="text-xs text-emerald-800 bg-emerald-50/80 p-2 rounded border border-emerald-200 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{approval.unlockReason}</span>
            </p>
          )}

          {/* Metrics Grid */}
          {!isCompact && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Statutory SLA</span>
                <span className="font-bold text-slate-800">{approval.slaDays} Days</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Required Docs</span>
                <span className="font-bold text-slate-800">{approval.requiredDocsCount} Documents</span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Inspection Required?</span>
                <span className="font-bold text-slate-800">
                  {approval.inspectionRequired ? 'Yes (Joint Audit)' : 'No (Desk Scrutiny)'}
                </span>
              </div>
              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Statutory Fee</span>
                <span className="font-bold text-slate-800">{formatCurrencyINR(approval.feeAmountINR)}</span>
              </div>
            </div>
          )}

          {/* Action Required Query Callout */}
          {isActionReq && approval.query && (
            <div className="bg-red-50 rounded-md border border-red-300 p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-red-950 font-bold">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Official Scrutiny Query: &quot;{approval.query.subject}&quot;
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded border border-red-200">
                  Due: {formatDate(approval.query.deadlineDate)}
                </span>
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {approval.query.description}
              </p>
              <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                {/* Live Demo Simulate Prerequisite Clearance on SPCB CTE */}
                {approval.id === 'SMV/2026/HR/GGM/APP-00106' && (
                  <button
                    onClick={() => onSimulatePrereq(approval.id)}
                    className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded text-xs font-bold transition-all shadow-xs"
                    title="Simulate official approval to test auto-unlock of Fire Provisional NOC"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Simulate Approval (Test Auto-Unlock)</span>
                  </button>
                )}
                <button
                  onClick={() => onRespondQuery(approval)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1 ml-auto shadow-sm"
                >
                  <span>Respond to Query</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Approved Certificate Details */}
          {isApproved && approval.certificateNo && (
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="text-slate-500">Official Certificate No:</span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {approval.certificateNo}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls Column */}
        <div className="shrink-0 flex lg:flex-col items-center lg:items-end justify-between gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          <StatusBadge status={approval.status} size="md" />

          <div className="flex items-center gap-2">
            <Link
              href={`/applicant/applications/${approval.id}`}
              className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Dossier</span>
            </Link>

            {isCanApply && (
              <button
                onClick={() => onStartApplication(approval)}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-1.5 rounded shadow hover:shadow-md transition-all flex items-center gap-1.5 ring-2 ring-amber-300 animate-pulse"
              >
                <span>Start Application</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Live Demo Button on SPCB CTE if not approved yet */}
            {approval.id === 'SMV/2026/HR/GGM/APP-00106' && !isApproved && !isActionReq && (
              <button
                onClick={() => onSimulatePrereq(approval.id)}
                className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded text-xs font-bold transition-all shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulate Approval</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
