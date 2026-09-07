import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WizardStepperProps {
  currentStep: number;
  steps: { number: number; label: string; description: string }[];
  onStepClick?: (stepNumber: number) => void;
}

export const WizardStepper: React.FC<WizardStepperProps> = ({
  currentStep,
  steps,
  onStepClick,
}) => {
  return (
    <div className="w-full py-4 px-2 sm:px-6">
      <div className="flex items-center justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-slate-200 -z-0" />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;

          return (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
              onClick={() => onStepClick && isCompleted && onStepClick(step.number)}
            >
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all border-2 shadow-sm',
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-gov-blue-primary border-gov-blue-primary text-white ring-4 ring-blue-100'
                    : 'bg-white border-slate-300 text-slate-500'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.number}
              </div>

              <div className="text-center mt-2 hidden sm:block">
                <p
                  className={cn(
                    'text-xs font-bold leading-tight',
                    isCurrent ? 'text-gov-blue-primary' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Step Name */}
      <div className="sm:hidden text-center mt-3 pt-2 border-t border-slate-200">
        <span className="text-xs font-bold text-gov-blue-primary">
          Step {currentStep}: {steps.find(s => s.number === currentStep)?.label}
        </span>
      </div>
    </div>
  );
};
