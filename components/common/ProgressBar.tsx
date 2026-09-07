import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Lock } from 'lucide-react';

interface ProgressBarProps {
  completed: number;
  total: number;
  inProgress: number;
  actionRequired: number;
  waiting: number;
  showLabels?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
  inProgress,
  actionRequired,
  waiting,
  showLabels = true,
}) => {
  const safeTotal = total > 0 ? total : 1;
  const approvedPct = Math.round((completed / safeTotal) * 100);
  const inProgressPct = Math.round((inProgress / safeTotal) * 100);
  const actionPct = Math.round((actionRequired / safeTotal) * 100);
  const waitingPct = Math.max(0, 100 - (approvedPct + inProgressPct + actionPct));

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-900 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-gov-blue-secondary" />
          Overall Approval Progress: <strong className="text-gov-blue-primary">{completed}/{total} Completed</strong>
        </span>
        <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
          {approvedPct}% Cleared
        </span>
      </div>

      {/* Multi-segment Segmented Bar */}
      <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner border border-slate-300">
        {approvedPct > 0 && (
          <div
            style={{ width: `${approvedPct}%` }}
            className="bg-emerald-600 h-full transition-all duration-500 relative group"
            title={`Approved: ${completed} (${approvedPct}%)`}
          />
        )}
        {actionPct > 0 && (
          <div
            style={{ width: `${actionPct}%` }}
            className="bg-amber-500 h-full transition-all duration-500 relative group"
            title={`Action Required: ${actionRequired} (${actionPct}%)`}
          />
        )}
        {inProgressPct > 0 && (
          <div
            style={{ width: `${inProgressPct}%` }}
            className="bg-blue-600 h-full transition-all duration-500 relative group"
            title={`Under Review: ${inProgress} (${inProgressPct}%)`}
          />
        )}
        {waitingPct > 0 && (
          <div
            style={{ width: `${waitingPct}%` }}
            className="bg-slate-300 h-full transition-all duration-500 relative group"
            title={`Waiting / Locked: ${waiting} (${waitingPct}%)`}
          />
        )}
      </div>

      {showLabels && (
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-600 pt-1">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 inline-block" />
            <span>Approved: <strong className="text-slate-800">{completed}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block" />
            <span>Action Required: <strong className="text-slate-800">{actionRequired}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
            <span>Under Review: <strong className="text-slate-800">{inProgress}</strong></span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-300 inline-block" />
            <span>Waiting / Locked: <strong className="text-slate-800">{waiting}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
