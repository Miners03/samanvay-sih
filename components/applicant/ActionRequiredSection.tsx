'use client';

import React, { useState } from 'react';
import { Project, ApprovalRoadmapItem } from '@/lib/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { QueryResponseModal } from './QueryResponseModal';
import { 
  AlertTriangle, 
  Clock, 
  Building2, 
  Calendar, 
  FileQuestion, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ActionRequiredSectionProps {
  project: Project;
}

export const ActionRequiredSection: React.FC<ActionRequiredSectionProps> = ({ project }) => {
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRoadmapItem | null>(null);

  // Filter approvals that require applicant action
  const actionItems = project.approvals.filter(
    (a) => a.status === 'action_required' && a.query
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-amber-100 rounded text-amber-800">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Action Required by You ({actionItems.length})
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          Resolving queries quickly accelerates your statutory SLA timeline.
        </span>
      </div>

      {actionItems.length === 0 ? (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-5 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-emerald-950">No Pending Departmental Actions</p>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              All submitted applications are currently under active scrutiny by the respective nodal departments.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actionItems.map((item) => {
            const query = item.query!;
            return (
              <div
                key={item.id}
                className="bg-white rounded-lg border-l-4 border-l-amber-500 border border-slate-200 p-5 shadow-gov flex flex-col justify-between transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block uppercase">
                        {item.approvalCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                        {item.approvalName}
                      </h4>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        {item.departmentName}
                      </p>
                    </div>
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  {/* Query Callout Box */}
                  <div className="mt-3 bg-amber-50/80 rounded border border-amber-200 p-3 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-amber-900">
                      <span className="font-semibold flex items-center gap-1">
                        <FileQuestion className="w-3.5 h-3.5 text-amber-700" />
                        {query.subject}
                      </span>
                    </div>
                    <p className="text-slate-700 line-clamp-2 leading-relaxed text-[11px]">
                      &quot;{query.description}&quot;
                    </p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-amber-200/60">
                      <span>Raised by: {query.raisedBy}</span>
                      <span className="font-bold text-amber-900 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        Due: {formatDate(query.deadlineDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Area */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {query.requestedDocuments.length > 0 ? (
                      <span className="font-medium text-amber-800">
                        {query.requestedDocuments.length} document(s) requested
                      </span>
                    ) : (
                      'Written response required'
                    )}
                  </span>
                  <button
                    onClick={() => setSelectedApproval(item)}
                    className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 px-3.5 py-1.5 rounded text-xs font-bold transition-colors shadow-sm"
                  >
                    <span>Respond</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedApproval && (
        <QueryResponseModal
          approval={selectedApproval}
          isOpen={Boolean(selectedApproval)}
          onClose={() => setSelectedApproval(null)}
        />
      )}
    </div>
  );
};
