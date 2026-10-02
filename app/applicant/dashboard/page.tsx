'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { StatCard } from '@/components/common/StatCard';
import { ActiveProjectCard } from '@/components/applicant/ActiveProjectCard';
import { ActionRequiredSection } from '@/components/applicant/ActionRequiredSection';
import { 
  FolderKanban, 
  Clock, 
  AlertTriangle, 
  CalendarClock, 
  PlusCircle, 
  ShieldCheck, 
  FileCheck2, 
  Award,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function ApplicantDashboardPage() {
  const { project, projectExists, renewals, incentives } = useApp();

  if (!projectExists || !project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">No project registered yet</h2>
        <p className="text-sm text-slate-500 mt-2">Register your first project to generate an approval roadmap.</p>
        <Link href="/applicant/register-project" className="inline-block mt-6 bg-gov-blue-primary text-white font-bold px-5 py-2.5 rounded">
          Register New Project
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gov-blue-secondary uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Welcome back
            </span>
            <span className="text-xs text-slate-500 font-mono">
              CIN: {project.registrationNumber}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Namaste, {project.contactPerson}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
            
          </p>
        </div>

        {/* Primary CTA */}
        <div className="shrink-0 flex items-center gap-3">
          <Link
            href="/applicant/register-project"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2.5 rounded-md text-xs font-bold transition-all shadow hover:shadow-md border border-amber-400"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register New Project</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Projects"
          value="1"
          subtitle="Greenfield Unit (Manesar)"
          icon={FolderKanban}
          variant="primary"
          badge={{ text: "On Track", type: "positive" }}
        />
        <StatCard
          title="Approvals In Progress"
          value={project.progress.inProgress}
          subtitle="Under nodal scrutiny"
          icon={Clock}
          variant="info"
          badge={{ text: "SLA Monitored", type: "neutral" }}
        />
        <StatCard
          title="Action Required"
          value={project.progress.actionRequired}
          subtitle="Department queries awaiting response"
          icon={AlertTriangle}
          variant="warning"
          badge={{ text: "Urgent", type: "warning" }}
        />
        <StatCard
          title="Upcoming Renewals"
          value={renewals.length}
          subtitle="Licences & consents"
          icon={CalendarClock}
          variant="neutral"
          badge={{ text: "Valid", type: "positive" }}
        />
      </div>

      {/* Active Project Card */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            Active Industrial Enterprise
          </h3>
          <Link
            href="/applicant/projects"
            className="text-xs text-gov-blue-secondary hover:underline font-medium flex items-center gap-1"
          >
            <span>All Enterprise Portfolios</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <ActiveProjectCard project={project} />
      </div>

      {/* Action Required Section */}
      <ActionRequiredSection project={project} />

      {/* Bottom Service Grid: Document Vault, Renewals, Incentives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Document Vault Summary */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-gov flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-50 text-gov-blue-secondary rounded">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                DigiLocker Linked
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-3">Verified Document Vault</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Upload once, reuse across all 8+ state departments. Securely store your CIN, lease deeds, EIA dossiers, and architectural blueprints.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">6 Master Documents</span>
            <Link
              href="/applicant/vault"
              className="text-xs font-bold text-gov-blue-secondary hover:underline flex items-center gap-1"
            >
              <span>Manage Vault</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Renewals & Compliance Summary */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-gov flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-amber-50 text-amber-800 rounded">
                <CalendarClock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                1 Renewal in 37 Days
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-3">Statutory Renewals Calendar</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Automated reminders for SPCB consents, Factory Licences, and Fire NOC expirations to maintain seamless zero-downtime compliance.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">3 Tracked Licences</span>
            <Link
              href="/applicant/renewals"
              className="text-xs font-bold text-gov-blue-secondary hover:underline flex items-center gap-1"
            >
              <span>View Compliance</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Incentives & Subsidies Summary */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-gov flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                ₹14.14 Cr Potential
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-3">Industrial Incentives &amp; Subsidies</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Auto-matched state and central subsidies for clean technology, stamp duty reimbursement, and 100% electricity duty exemption.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">3 Eligible Schemes</span>
            <Link
              href="/applicant/incentives"
              className="text-xs font-bold text-gov-blue-secondary hover:underline flex items-center gap-1"
            >
              <span>Explore Schemes</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
