'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ApprovalRoadmapItem } from '@/lib/types';
import { 
  ArrowRight, 
  Sparkles, 
  GitCommit, 
  GitFork, 
  CheckCircle2, 
  Lock, 
  PlayCircle, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';

interface VisualDependencyGraphProps {
  onStartApplication?: (approval: ApprovalRoadmapItem) => void;
}

export const VisualDependencyGraph: React.FC<VisualDependencyGraphProps> = ({
  onStartApplication,
}) => {
  const { project, simulatePrerequisiteApproval } = useApp();

  const landApp = project.approvals.find(a => a.id === 'SMV/2026/HR/GGM/APP-00101' || a.id === 'app-land-01' || a.approvalCode?.includes('ALLOT')) || project.approvals[0];
  const bldApp = project.approvals.find(a => a.id === 'SMV/2026/HR/GGM/APP-00102' || a.id === 'app-bld-05' || a.approvalCode?.includes('BLD')) || project.approvals[1];
  const facApp = project.approvals.find(a => a.id === 'SMV/2026/HR/GGM/APP-00109' || a.id === 'app-fac-06' || a.approvalCode?.includes('DISH')) || project.approvals[2];
  const finalApp = project.approvals.find(a => a.id === 'SMV/2026/HR/GGM/APP-00110' || a.id === 'app-final-07' || a.approvalCode?.includes('SUB-BATT')) || project.approvals[project.approvals.length - 1];

  const fireApp = project.approvals.find(a => a.id === 'SMV/2026/HR/GGM/APP-00108' || a.id === 'app-fire-02' || a.approvalCode?.includes('FIRE') || a.approvalCode?.includes('SFES'));
  const spcbApp = project.approvals.find(a => a.id === 'SMV/2026/HR/GGM/APP-00106' || a.id === 'app-spcb-03' || a.approvalCode?.includes('SPCB'));
  const labourApp = project.approvals.find(a => a.id === 'SMV/2026/HR/GGM/APP-00104' || a.id === 'app-labour-04' || a.approvalCode?.includes('LABOUR') || a.approvalCode?.includes('CESS'));

  const getNodeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'border-emerald-500 bg-emerald-50/80 text-emerald-950 shadow-sm';
      case 'in_progress':
      case 'under review':
        return 'border-blue-500 bg-blue-50/80 text-blue-950 shadow-sm';
      case 'can_apply_now':
        return 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-300 shadow-md';
      case 'action_required':
        return 'border-red-500 bg-red-50 text-red-950 ring-1 ring-red-400 shadow-sm';
      case 'waiting':
      default:
        return 'border-slate-300 bg-slate-100/80 text-slate-500';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 sm:p-6 space-y-6">
      {/* Header & Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase">
              Statutory Dependency &amp; Coordination Flowchart
            </h3>
            <span className="text-[10px] font-bold text-gov-blue-secondary bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              CORE ROADMAP ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sequential spine links primary construction milestones, while independent clearances feed in parallel.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 flex-wrap bg-slate-50 p-2 rounded border border-slate-200">
          <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Legend:</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
            Approved
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            In Progress
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            Can Apply Now
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
            Action Required
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
            Waiting
          </span>
        </div>
      </div>

      {/* Main Flow Visualizer */}
      <div className="space-y-6 overflow-x-auto pb-4">
        {/* TOP: Primary Sequential Spine */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <GitCommit className="w-3.5 h-3.5 text-gov-blue-secondary" />
            <span>Sequential Spine: Primary Construction Milestones</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Node 1: Land Verification */}
            <div className={`p-4 rounded-lg border-2 transition-all flex flex-col justify-between ${getNodeColor(landApp.status)}`}>
              <div>
                <div className="flex items-start justify-between gap-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Step 1</span>
                  <StatusBadge status={landApp.status} size="sm" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-2 leading-tight">
                  Land Verification
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{landApp.departmentName}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Prerequisites: None</span>
                {landApp.status === 'approved' ? (
                  <span className="text-emerald-700 font-bold">✓ Cleared</span>
                ) : (
                  <button
                    onClick={() => simulatePrerequisiteApproval(landApp.id)}
                    className="text-xs text-blue-700 font-bold hover:underline"
                  >
                    Simulate Approval
                  </button>
                )}
              </div>
            </div>

            {/* Node 2: Building Approval */}
            <div className={`p-4 rounded-lg border-2 transition-all flex flex-col justify-between ${getNodeColor(bldApp.status)}`}>
              <div>
                <div className="flex items-start justify-between gap-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Step 2</span>
                  <StatusBadge status={bldApp.status} size="sm" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-2 leading-tight">
                  Building Approval
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{bldApp.departmentName}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] space-y-1">
                <span className="text-slate-500 block">Requires: Land Verification</span>
                {bldApp.status === 'can_apply_now' && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onStartApplication && onStartApplication(bldApp)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-2 py-0.5 rounded font-bold text-[10px]"
                    >
                      Start Application
                    </button>
                    <button
                      onClick={() => simulatePrerequisiteApproval(bldApp.id)}
                      className="text-blue-700 font-bold hover:underline"
                    >
                      Simulate Approval
                    </button>
                  </div>
                )}
                {bldApp.status === 'approved' && (
                  <span className="text-emerald-700 font-bold block text-right">✓ Cleared</span>
                )}
              </div>
            </div>

            {/* Node 3: Factory Registration */}
            <div className={`p-4 rounded-lg border-2 transition-all flex flex-col justify-between ${getNodeColor(facApp.status)}`}>
              <div>
                <div className="flex items-start justify-between gap-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Step 3</span>
                  <StatusBadge status={facApp.status} size="sm" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-2 leading-tight">
                  Factory Registration
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{facApp.departmentName}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] space-y-1">
                <span className="text-slate-500 block">Requires: Building Approval</span>
                {facApp.status === 'waiting' && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-400 italic">Locked until Step 2 clears</span>
                    <button
                      onClick={() => simulatePrerequisiteApproval(bldApp.id)}
                      className="text-[10px] text-gov-blue-secondary hover:underline font-bold"
                      title="Test live auto-unlock"
                    >
                      Unlock Demo
                    </button>
                  </div>
                )}
                {facApp.status === 'can_apply_now' && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onStartApplication && onStartApplication(facApp)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-2 py-0.5 rounded font-bold text-[10px]"
                    >
                      Start Application
                    </button>
                    <button
                      onClick={() => simulatePrerequisiteApproval(facApp.id)}
                      className="text-blue-700 font-bold hover:underline"
                    >
                      Simulate Approval
                    </button>
                  </div>
                )}
                {facApp.status === 'approved' && (
                  <span className="text-emerald-700 font-bold block text-right">✓ Cleared</span>
                )}
              </div>
            </div>

            {/* Node 4: Final Operational Approval (Master Convergence) */}
            <div className={`p-4 rounded-lg border-2 transition-all flex flex-col justify-between ${getNodeColor(finalApp.status)}`}>
              <div>
                <div className="flex items-start justify-between gap-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Final Gate</span>
                  <StatusBadge status={finalApp.status} size="sm" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-2 leading-tight">
                  Final Operational Approval
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{finalApp.departmentName}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                <span>Requires Factory Reg + Parallel Tracks</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM: Parallel Inlets feeding independently into Final Operational Approval */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-blue-600" />
            <span>Independent Parallel Inlets (Can run concurrently and feed into Final Operational Approval)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Fire Safety NOC */}
            {fireApp && (
              <div className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between ${getNodeColor(fireApp.status)}`}>
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">PARALLEL TRACK A</span>
                    <StatusBadge status={fireApp.status} size="sm" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 mt-1.5">{fireApp.approvalName}</h5>
                  <p className="text-[10px] text-slate-500">{fireApp.departmentName}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">
                    {fireApp.status === 'waiting' ? 'Locked: Needs SPCB CTE' : 'Feeds into Final Approval'}
                  </span>
                  {fireApp.status === 'waiting' && (
                    <span className="text-slate-400 italic">Unlocks on SPCB CTE</span>
                  )}
                  {fireApp.status === 'can_apply_now' && (
                    <button
                      onClick={() => onStartApplication && onStartApplication(fireApp)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-2 py-0.5 rounded font-bold text-[10px] animate-pulse"
                    >
                      Start Application
                    </button>
                  )}
                  {fireApp.status === 'in_progress' && (
                    <button
                      onClick={() => simulatePrerequisiteApproval(fireApp.id)}
                      className="text-blue-700 font-bold hover:underline"
                    >
                      Simulate Approval
                    </button>
                  )}
                  {fireApp.status === 'approved' && (
                    <span className="text-emerald-700 font-bold">✓ Cleared</span>
                  )}
                </div>
              </div>
            )}

            {/* Pollution Consent (CTE) */}
            {spcbApp && (
              <div className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between ${getNodeColor(spcbApp.status)}`}>
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">PARALLEL TRACK B</span>
                    <StatusBadge status={spcbApp.status} size="sm" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 mt-1.5">{spcbApp.approvalName}</h5>
                  <p className="text-[10px] text-slate-500">{spcbApp.departmentName}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-red-700 font-semibold">Query Raised (Action Required)</span>
                  <button
                    onClick={() => simulatePrerequisiteApproval(spcbApp.id)}
                    className="text-blue-700 font-bold hover:underline"
                  >
                    Simulate Clearance
                  </button>
                </div>
              </div>
            )}

            {/* Labour Registration */}
            {labourApp && (
              <div className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between ${getNodeColor(labourApp.status)}`}>
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">PARALLEL TRACK C</span>
                    <StatusBadge status={labourApp.status} size="sm" />
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 mt-1.5">{labourApp.approvalName}</h5>
                  <p className="text-[10px] text-slate-500">{labourApp.departmentName}</p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Independent filing</span>
                  {labourApp.status === 'can_apply_now' ? (
                    <button
                      onClick={() => onStartApplication && onStartApplication(labourApp)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px]"
                    >
                      Start Application
                    </button>
                  ) : (
                    <span className="text-emerald-700 font-bold">✓ Cleared</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
