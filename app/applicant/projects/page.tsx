'use client';

import React from 'react';
import Link from 'next/link';
import { RequireProject } from '@/components/applicant/RequireProject';
import { useProject } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { ProgressBar } from '@/components/common/ProgressBar';
import { 
  Building2, 
  MapPin, 
  PlusCircle, 
  ArrowRight
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '@/lib/utils';

// 1. Default Export Wrapper (guards against null project)
export default function ProjectsPage() {
  return (
    <RequireProject>
      <ProjectsPageContent />
    </RequireProject>
  );
}

// 2. Main Page Content (runs safely when project exists)
function ProjectsPageContent() {
  const project = useProject();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Industrial Projects & Units"
        subtitle="Comprehensive register of your manufacturing facilities, expansion roadmaps, and statutory portfolios."
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Projects', current: true },
        ]}
        action={
          <Link
            href="/applicant/register-project"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-md text-xs font-bold transition-all shadow hover:shadow-md border border-amber-400"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New Project</span>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6">
        {/* Project Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-gov p-6 space-y-5 hover:border-slate-300 transition-all">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-gov-blue-primary text-white text-[11px] font-bold px-2 py-0.5 rounded font-mono">
                  {project.referenceNo ?? 'N/A'}
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Active Single Window File
                </span>
                <span className="text-xs text-slate-500">
                  Created: {formatDate(project.createdAt)}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mt-2">
                {project.name}
              </h2>

              <p className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {project.companyName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {project.location?.address}, {project.location?.district}
                </span>
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <Link
                href={`/applicant/roadmap/${project.id}`}
                className="inline-flex items-center gap-1.5 bg-gov-blue-secondary hover:bg-gov-blue-primary text-white text-xs font-bold px-4 py-2 rounded shadow hover:shadow-md transition-all"
              >
                <span>Open Approval Roadmap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Detailed Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded border border-slate-100">
              <span className="text-slate-500 text-[11px] block">Capital Outlay</span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {formatCurrencyINR((project.estimatedInvestmentCrores ?? 0) * 10000000)}
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-100">
              <span className="text-slate-500 text-[11px] block">Land Plot Area</span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {project.projectSizeSqMeters?.toLocaleString() ?? 0} Sq.M
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-100">
              <span className="text-slate-500 text-[11px] block">Pollution Category</span>
              <span className="font-bold text-amber-800 mt-0.5 block">
                {project.operations?.environmental?.category ?? 'N/A'} Category
              </span>
            </div>
            <div className="bg-slate-50 p-3 rounded border border-slate-100">
              <span className="text-slate-500 text-[11px] block">Commercial Target</span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {formatDate(project.expectedOperationsStartDate)}
              </span>
            </div>
          </div>

          {/* Progress */}
          {project.progress && (
            <div className="pt-2">
              <ProgressBar
                completed={project.progress.completed}
                total={project.progress.total}
                inProgress={project.progress.inProgress}
                actionRequired={project.progress.actionRequired}
                waiting={project.progress.waiting}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}