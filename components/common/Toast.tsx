'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0">
      {toasts.map((toast) => {
        let icon = <Info className="w-5 h-5 text-blue-700 shrink-0" />;
        let borderClass = "border-l-4 border-l-blue-600 bg-white border border-slate-200";

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />;
          borderClass = "border-l-4 border-l-green-600 bg-white border border-slate-200";
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />;
          borderClass = "border-l-4 border-l-amber-600 bg-white border border-slate-200";
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />;
          borderClass = "border-l-4 border-l-red-600 bg-white border border-slate-200";
        }

        return (
          <div
            key={toast.id}
            role="alert"
            className={`shadow-lg rounded-md p-4 flex items-start gap-3 transition-all transform ease-out duration-300 ${borderClass}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded focus:ring-1 focus:ring-slate-400"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
