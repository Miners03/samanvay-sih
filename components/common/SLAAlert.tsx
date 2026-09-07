import React from 'react';
import { AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SLAAlertProps {
  daysRemaining: number;
  slaDays: number;
  isDeemedApprovalEligible?: boolean;
  departmentName?: string;
  className?: string;
}

export const SLAAlert: React.FC<SLAAlertProps> = ({
  daysRemaining,
  slaDays,
  isDeemedApprovalEligible = true,
  departmentName,
  className,
}) => {
  const isBreached = daysRemaining <= 0;
  const isAtRisk = daysRemaining <= 5 && daysRemaining > 0;

  let bgClass = "bg-blue-50 border-blue-200 text-blue-900";
  let icon = <Clock className="w-4 h-4 text-blue-700 shrink-0" />;
  let title = `SLA Clock: ${daysRemaining} of ${slaDays} days remaining`;

  if (isBreached) {
    bgClass = "bg-red-50 border-red-200 text-red-900";
    icon = <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />;
    title = `SLA Breached by ${Math.abs(daysRemaining)} days`;
  } else if (isAtRisk) {
    bgClass = "bg-amber-50 border-amber-200 text-amber-900";
    icon = <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />;
    title = `SLA At Risk: Only ${daysRemaining} days left`;
  }

  return (
    <div
      className={cn(
        "rounded border p-2.5 text-xs flex items-center justify-between gap-3",
        bgClass,
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <span className="font-semibold">{title}</span>
          {departmentName && (
            <span className="ml-2 text-[11px] opacity-80">({departmentName})</span>
          )}
        </div>
      </div>

      {isDeemedApprovalEligible && (
        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/80 border border-slate-300">
          Deemed Approval Protection
        </span>
      )}
    </div>
  );
};
