'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { ProgressBar } from '@/components/common/ProgressBar';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SLAAlert } from '@/components/common/SLAAlert';
import { QueryResponseModal } from '@/components/applicant/QueryResponseModal';
import { ApprovalRoadmapItem, ClearanceStage, ApprovalStatus } from '@/lib/types';
import { 
  Building2, 
  MapPin, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  Download, 
  ArrowRight, 
  Calendar, 
  ExternalLink, 
  Filter, 
  Layers, 
  GitFork, 
  ShieldCheck, 
  IndianRupee 
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '@/lib/utils';

export default function ApprovalRoadmapPage() {
  const { id } = useParams();
  const { project } = useApp();

  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQueryModalApproval, setActiveQueryModalApproval] = useState<ApprovalRoadmapItem | null>(null);

  // Group approvals by stage
  const stages: { id: ClearanceStage; title: string; subtitle: string; description: string }[] = [
    {
      id: 'pre_establishment',
      title: 'Stage 1: Pre-Establishment Clearances',
      subtitle: 'Land, Zoning, Initial Environmental & Fire Consents',
      description: 'Foundational statutory clearances required before ground is broken on site.',
    },
    {
      id: 'pre_construction',
      title: 'Stage 2: Pre-Construction Clearances',
      subtitle: 'Factory Safety Layouts, Architectural Sanctions & Water Intake',
      description: 'Department approvals needed to begin civil structural engineering.',
    },
    {
      id: 'pre_operation',
      title: 'Stage 3: Pre-Operation Clearances',
      subtitle: 'Final Fire Safety, Consent to Operate (CTO), Factory Licence & Boilers',
      description: 'Operational licences required before machinery trials and workforce commissioning.',
    },
    {
      id: 'post_commissioning',
      title: 'Stage 4: Post-Commissioning & Incentives',
      subtitle: 'Capital Subsidies, Power Tariff Relief & Statutory Compliance',
      description: 'Fiscal incentives and ongoing recurring statutory returns.',
    },
  ];

  const filteredApprovals = project.approvals.filter((app) => {
    if (selectedStage !== 'all' && app.stage !== selectedStage) return false;
    if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.approvalName.toLowerCase().includes(q) ||
        app.departmentName.toLowerCase().includes(q) ||
        app.approvalCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Integrated Approval Roadmap"
        subtitle={`One Project → One Coordinated Journey. Live statutory dependencies across all state regulatory bodies for ${project.name}.`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Projects', href: '/applicant/projects' },
          { label: 'Roadmap', current: true },
        ]}
        badge={
          <span className="bg-blue-100 text-gov-blue-secondary text-xs font-mono font-semibold px-2 py-0.5 rounded border border-blue-200">
            {project.referenceNo}
          </span>
        }
      />

      {/* Project Master Info & Progress Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{project.name}</h2>
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-1 flex-wrap">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                {project.companyName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {project.location.industrialArea}, {project.location.district}
              </span>
              <span>•</span>
              <span>
                Investment: <strong>{formatCurrencyINR(project.estimatedInvestmentCrores * 10000000)}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Deemed Approval Guarantee:</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              State Business Facilitation Act 2024
            </span>
          </div>
        </div>

        {/* Coordinated Progress Bar */}
        <ProgressBar
          completed={project.progress.completed}
          total={project.progress.total}
          inProgress={project.progress.inProgress}
          actionRequired={project.progress.actionRequired}
          waiting={project.progress.waiting}
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Filter Stage:
          </span>
          <button
            onClick={() => setSelectedStage('all')}
            className={`px-2.5 py-1 rounded font-semibold transition-colors ${selectedStage === 'all' ? 'bg-gov-blue-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            All Stages ({project.approvals.length})
          </button>
          {stages.map((stg) => {
            const count = project.approvals.filter(a => a.stage === stg.id).length;
            return (
              <button
                key={stg.id}
                onClick={() => setSelectedStage(stg.id)}
                className={`px-2.5 py-1 rounded font-semibold transition-colors ${selectedStage === stg.id ? 'bg-gov-blue-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {stg.id === 'pre_establishment' && 'Stage 1'}
                {stg.id === 'pre_construction' && 'Stage 2'}
                {stg.id === 'pre_operation' && 'Stage 3'}
                {stg.id === 'post_commissioning' && 'Stage 4'} ({count})
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search approval or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-1.5 px-3 rounded border border-slate-300 text-xs w-full sm:w-56 focus:ring-1 focus:ring-gov-blue-secondary"
          />
        </div>
      </div>

      {/* Roadmap Stages & Cards */}
      <div className="space-y-8">
        {stages
          .filter((stg) => selectedStage === 'all' || selectedStage === stg.id)
          .map((stage) => {
            const stageApprovals = filteredApprovals.filter((a) => a.stage === stage.id);
            if (stageApprovals.length === 0 && selectedStage === 'all') return null;

            return (
              <div key={stage.id} className="space-y-3">
                {/* Stage Header */}
                <div className="border-b-2 border-gov-blue-primary pb-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-gov-blue-secondary" />
                      {stage.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {stage.subtitle} — {stage.description}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    {stageApprovals.length} Statutory Clearances
                  </span>
                </div>

                {/* Stage Approval Cards Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {stageApprovals.map((approval) => {
                    const isApproved = approval.status === 'approved';
                    const isActionReq = approval.status === 'action_required';
                    const isInProgress = approval.status === 'in_progress';
                    const isWaiting = approval.status === 'waiting';

                    return (
                      <div
                        key={approval.id}
                        className={`bg-white rounded-lg border transition-all p-5 shadow-gov ${
                          isActionReq
                            ? 'border-l-4 border-l-amber-500 border-amber-200'
                            : isApproved
                            ? 'border-l-4 border-l-emerald-600 border-slate-200'
                            : isInProgress
                            ? 'border-l-4 border-l-blue-600 border-slate-200'
                            : 'border-l-4 border-l-slate-400 border-slate-200 bg-slate-50/50'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            {/* Card Header Labels */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {approval.approvalCode}
                              </span>
                              <span className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                                {approval.departmentName}
                              </span>
                              {approval.isParallelWith && approval.isParallelWith.length > 0 && (
                                <span className="text-[10px] font-bold text-blue-900 bg-blue-100/70 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1">
                                  <GitFork className="w-3 h-3 text-blue-700" />
                                  Parallel Track Enabled
                                </span>
                              )}
                            </div>

                            {/* Title */}
                            <h4 className="text-base font-bold text-slate-900 leading-snug">
                              {approval.approvalName}
                            </h4>

                            {/* Dependencies or Microcopy Explanation */}
                            {isWaiting && approval.unlockReason && (
                              <div className="bg-slate-100 rounded p-2.5 text-xs text-slate-700 flex items-start gap-2 border border-slate-200">
                                <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-semibold text-slate-900 block">
                                    Dependency Status:
                                  </span>
                                  <p className="text-[11px] text-slate-600 mt-0.5">
                                    {approval.unlockReason}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* In Progress SLA Box */}
                            {isInProgress && (
                              <div className="space-y-2">
                                <SLAAlert
                                  daysRemaining={approval.slaDaysRemaining ?? 12}
                                  slaDays={approval.slaDays}
                                  isDeemedApprovalEligible={approval.isDeemedApprovalEligible}
                                  departmentName={approval.departmentName}
                                />
                                <p className="text-[11px] text-slate-500">
                                  Application submitted on {formatDate(approval.appliedDate)}. Scrutiny officer reviewing compliance drawings.
                                </p>
                              </div>
                            )}

                            {/* Action Required Box */}
                            {isActionReq && approval.query && (
                              <div className="bg-amber-50 rounded-md border border-amber-300 p-3 space-y-2 text-xs">
                                <div className="flex items-center justify-between text-amber-900 font-bold">
                                  <span className="flex items-center gap-1.5">
                                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                                    Departmental Query: &quot;{approval.query.subject}&quot;
                                  </span>
                                  <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-amber-200">
                                    Due: {formatDate(approval.query.deadlineDate)}
                                  </span>
                                </div>
                                <p className="text-slate-700 text-[11px] leading-relaxed">
                                  {approval.query.description}
                                </p>
                                <div className="pt-1 flex items-center justify-between">
                                  <span className="text-[10px] text-amber-800 font-medium">
                                    Officer: {approval.query.raisedBy}
                                  </span>
                                  <button
                                    onClick={() => setActiveQueryModalApproval(approval)}
                                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1 rounded text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                                  >
                                    <span>Respond to Query</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Approved State Details */}
                            {isApproved && (
                              <div className="flex items-center gap-3 text-xs flex-wrap pt-1">
                                {approval.certificateNo && (
                                  <span className="text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-mono font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                    Certificate: {approval.certificateNo}
                                  </span>
                                )}
                                <span className="text-slate-500">
                                  Issued on {formatDate(approval.appliedDate)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Right Side Status & Actions */}
                          <div className="lg:text-right flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-2 lg:pt-0">
                            <StatusBadge status={approval.status} size="md" />

                            <div className="text-xs text-slate-500">
                              <span>Fee: <strong>{formatCurrencyINR(approval.feeAmountINR)}</strong></span>
                            </div>

                            {isApproved && (
                              <button
                                onClick={() => alert(`Downloading official clearance certificate for ${approval.approvalName} (${approval.certificateNo})...`)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-gov-blue-secondary hover:text-gov-blue-primary bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded border border-blue-200 transition-colors"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Certificate</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

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
