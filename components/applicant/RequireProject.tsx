'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';

export function RequireProject({ children }: { children: React.ReactNode }) {
  const { project, projectExists } = useApp();

  if (!projectExists || !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">No project registered yet</h2>
        <p className="text-sm text-slate-500 mt-2">
          Register your first project to generate an approval roadmap.
        </p>
        <Link
          href="/applicant/register-project"
          className="inline-block mt-6 bg-gov-blue-primary text-white font-bold px-5 py-2.5 rounded"
        >
          Register New Project
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}