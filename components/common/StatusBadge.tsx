import React from 'react';
import { ApprovalStatus } from '@/lib/types';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ApprovalStatus;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  size = 'md',
  className,
}) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle2,
          defaultLabel: 'Approved',
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium',
          iconColor: 'text-emerald-700',
        };
      case 'in_progress':
        return {
          icon: Clock,
          defaultLabel: 'Under Review',
          classes: 'bg-blue-50 text-blue-800 border-blue-300 font-medium',
          iconColor: 'text-blue-700',
        };
      case 'action_required':
        return {
          icon: AlertTriangle,
          defaultLabel: 'Action Required',
          classes: 'bg-amber-50 text-amber-900 border-amber-300 font-medium',
          iconColor: 'text-amber-700',
        };
      case 'rejected':
        return {
          icon: XCircle,
          defaultLabel: 'Rejected / Returned',
          classes: 'bg-red-50 text-red-900 border-red-300 font-medium',
          iconColor: 'text-red-700',
        };
      case 'waiting':
      default:
        return {
          icon: Lock,
          defaultLabel: 'Waiting for Prerequisites',
          classes: 'bg-slate-100 text-slate-700 border-slate-300 font-medium',
          iconColor: 'text-slate-500',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;
  const displayLabel = label || config.defaultLabel;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded border tracking-tight transition-colors',
        config.classes,
        sizeClasses,
        className
      )}
    >
      <Icon className={cn(iconSizes, config.iconColor, 'shrink-0')} aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
};
