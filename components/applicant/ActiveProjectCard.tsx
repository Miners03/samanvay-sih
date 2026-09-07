import React from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import { ProgressBar } from '@/components/common/ProgressBar';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  FileCheck 
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '@/lib/utils';

interface ActiveProjectCardProps {
  project: Project;
}

export const ActiveProjectCard: React.FC<ActiveProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden transition-all hover:border-slate-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/40 px-5 sm:px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-gov-blue-primary text-white text-[11px] font-bold px-2 py-0.5 rounded tracking-wide">
              PRIMARY ACTIVE FACILITY
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Ref: {project.referenceNo}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {project.projectType}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5">
            {project.name}
          </h2>

          <div className="flex items-center gap-4 text-xs text-slate-600 mt-1 flex-wrap">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {project.location.industrialArea}, {project.location.district}, {project.location.state}
            </span>
            <span className="flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
              Investment: <strong>{formatCurrencyINR(project.estimatedInvestmentCrores * 10000000)}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              Workforce: <strong>{project.expectedEmployees} personnel</strong>
            </span>
          </div>
        </div>

        {/* CTA Button: View Approval Roadmap */}
        <div className="shrink-0 pt-1 md:pt-0">
          <Link
            href={`/applicant/roadmap/${project.id}`}
            className="inline-flex items-center gap-2 bg-gov-blue-secondary hover:bg-gov-blue-primary text-white text-xs font-bold px-4 py-2.5 rounded shadow hover:shadow-md transition-all border border-blue-900 focus:ring-2 focus:ring-blue-300"
          >
            <span>View Approval Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Progress Breakdown Section */}
      <div className="p-5 sm:p-6 bg-white">
        <div className="mb-4">
          <ProgressBar
            completed={project.progress.completed}
            total={project.progress.total}
            inProgress={project.progress.inProgress}
            actionRequired={project.progress.actionRequired}
            waiting={project.progress.waiting}
          />
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Target Production</span>
            <span className="font-semibold text-slate-800 mt-0.5 block truncate">
              {formatDate(project.expectedOperationsStartDate)}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Environmental Class</span>
            <span className="font-semibold text-amber-800 mt-0.5 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {project.operations.environmental.category} Category Unit
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Contractor Licence</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {project.operations.labour.contractWorkers} Contract Workers
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded border border-slate-100">
            <span className="text-slate-500 text-[11px] block">Connected Power</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {project.operations.utilities.powerKVA} kVA (HT Drawal)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
