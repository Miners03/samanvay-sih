import React from 'react';
import { ApprovalStatus } from '@/lib/types';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Lock, 
  PlayCircle, 
  CalendarCheck, 
  FileText 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ApprovalStatus | string;
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
    switch (status.toLowerCase()) {
      case 'approved':
        return {
          icon: CheckCircle2,
          defaultLabel: 'Approved',
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
          iconColor: 'text-emerald-700',
        };
      case 'in_progress':
      case 'under review':
      case 'submitted':
        return {
          icon: Clock,
          defaultLabel: 'Under Review',
          classes: 'bg-blue-50 text-blue-800 border-blue-300 font-bold',
          iconColor: 'text-blue-700',
        };
      case 'can_apply_now':
      case 'can apply now':
        return {
          icon: PlayCircle,
          defaultLabel: 'Can Apply Now',
          classes: 'bg-amber-100 text-amber-950 border-amber-400 font-bold shadow-sm',
          iconColor: 'text-amber-800',
        };
      case 'action_required':
      case 'applicant action required':
      case 'query raised':
        return {
          icon: AlertTriangle,
          defaultLabel: 'Action Required',
          classes: 'bg-red-50 text-red-900 border-red-300 font-bold',
          iconColor: 'text-red-700',
        };
      case 'inspection_scheduled':
      case 'inspection scheduled':
        return {
          icon: CalendarCheck,
          defaultLabel: 'Inspection Scheduled',
          classes: 'bg-purple-50 text-purple-900 border-purple-300 font-bold',
          iconColor: 'text-purple-700',
        };
      case 'awaiting_decision':
      case 'awaiting decision':
        return {
          icon: Clock,
          defaultLabel: 'Awaiting Decision',
          classes: 'bg-indigo-50 text-indigo-900 border-indigo-300 font-bold',
          iconColor: 'text-indigo-700',
        };
      case 'rejected':
        return {
          icon: XCircle,
          defaultLabel: 'Rejected / Returned',
          classes: 'bg-red-100 text-red-950 border-red-400 font-bold',
          iconColor: 'text-red-800',
        };
      case 'draft':
        return {
          icon: FileText,
          defaultLabel: 'Draft',
          classes: 'bg-slate-100 text-slate-700 border-slate-300 font-medium',
          iconColor: 'text-slate-500',
        };
      case 'waiting':
      default:
        return {
          icon: Lock,
          defaultLabel: 'Waiting for Prerequisite',
          classes: 'bg-slate-100 text-slate-600 border-slate-300 font-medium',
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
        'inline-flex items-center rounded border tracking-tight transition-colors whitespace-nowrap',
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
