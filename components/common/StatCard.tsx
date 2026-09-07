import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'neutral';
  onClick?: () => void;
  badge?: {
    text: string;
    type: 'positive' | 'warning' | 'neutral';
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'neutral',
  onClick,
  badge,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          border: 'border-l-4 border-l-gov-blue-secondary',
          iconBg: 'bg-blue-100 text-gov-blue-secondary',
        };
      case 'success':
        return {
          border: 'border-l-4 border-l-emerald-600',
          iconBg: 'bg-emerald-100 text-emerald-800',
        };
      case 'warning':
        return {
          border: 'border-l-4 border-l-amber-500',
          iconBg: 'bg-amber-100 text-amber-800',
        };
      case 'info':
        return {
          border: 'border-l-4 border-l-sky-500',
          iconBg: 'bg-sky-100 text-sky-800',
        };
      case 'neutral':
      default:
        return {
          border: 'border-l-4 border-l-slate-400',
          iconBg: 'bg-slate-100 text-slate-700',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-md border border-slate-200 p-4 sm:p-5 shadow-gov transition-all hover:shadow-md flex flex-col justify-between',
        styles.border,
        onClick ? 'cursor-pointer hover:border-slate-300' : ''
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={cn('p-2.5 rounded-md shrink-0', styles.iconBg)}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>

      {(subtitle || badge) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{subtitle}</span>
          {badge && (
            <span
              className={cn(
                'px-1.5 py-0.5 rounded text-[10px] font-semibold',
                badge.type === 'positive' && 'bg-emerald-100 text-emerald-800',
                badge.type === 'warning' && 'bg-amber-100 text-amber-800',
                badge.type === 'neutral' && 'bg-slate-100 text-slate-700'
              )}
            >
              {badge.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
