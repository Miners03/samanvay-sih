import { Project, ApprovalRoadmapItem, ApprovalStatus, ClearanceStage } from '@/lib/types';

const STATUS_MAP: Record<string, ApprovalStatus> = {
  draft: 'draft',
  submitted: 'submitted',
  under_review: 'in_progress',
  query_raised: 'action_required',
  inspection_scheduled: 'inspection_scheduled',
  awaiting_decision: 'awaiting_decision',
  approved: 'approved',
  rejected: 'rejected',
  withdrawn: 'rejected',
};

const STATUS_LABEL: Record<ApprovalStatus, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  in_progress: 'Under Review',
  action_required: 'Action Required',
  waiting: 'Waiting',
  can_apply_now: 'Can Apply Now',
  inspection_scheduled: 'Inspection Scheduled',
  awaiting_decision: 'Awaiting Decision',
  approved: 'Approved',
  rejected: 'Rejected',
};

const stageFromSequence = (seq: number): { stage: ClearanceStage; label: string } => {
  if (seq <= 1) return { stage: 'pre_establishment', label: 'Pre-Establishment' };
  if (seq === 2) return { stage: 'pre_construction', label: 'Pre-Construction' };
  if (seq === 3) return { stage: 'pre_operation', label: 'Pre-Operation' };
  return { stage: 'post_commissioning', label: 'Post-Commissioning' };
};

export function mapApprovalRow(
  aa: any,
  deptNameByTag: Record<string, string>,
  queryByApprovalId: Record<number, any>
): ApprovalRoadmapItem {
  const status = STATUS_MAP[aa.status] ?? 'draft';
  const { stage, label } = stageFromSequence(aa.phase_sequence ?? 1);
  const q = queryByApprovalId[aa.id];

  return {
    id: String(aa.id),
    projectId: String(aa.application_id),
    departmentId: aa.dept_tag ?? '',
    departmentName: deptNameByTag[aa.dept_tag] ?? aa.dept_tag ?? 'Unassigned',
    approvalName: aa.name,
    approvalCode: `${(aa.dept_tag ?? 'GEN').toUpperCase()}-${aa.id}`,
    stage,
    stageLabel: label,
    status,
    statusLabel: STATUS_LABEL[status],
    dependencies: [], // DB stores depends_on_phase as a phase number, not row IDs — not mapped yet
    canApplyNow: status === 'draft',
    estimatedDays: aa.sla_days ?? 5,
    slaDays: aa.sla_days ?? 5,
    feeAmountINR: Number(aa.fee_amount ?? 0),
    documentsRequired: [],
    documentsSubmitted: [],
    activityLogs: [],
    query: q
      ? {
          id: q.id,
          raisedBy: 'Government Officer',
          department: deptNameByTag[aa.dept_tag] ?? aa.dept_tag,
          raisedDate: q.created_at?.split('T')[0] ?? '',
          deadlineDate: q.response_deadline ?? '',
          subject: q.category,
          description: q.message,
          requestedDocuments: q.required_document_key ? [q.required_document_key] : [],
          status: q.resolved ? 'resolved' : q.awaiting === 'applicant' ? 'pending_applicant' : 'submitted_by_applicant',
          response: q.applicant_response
            ? { submittedDate: q.responded_at?.split('T')[0] ?? '', notes: q.applicant_response, documents: [] }
            : undefined,
        }
      : undefined,
  };
}

export function mapApplicationToProject(
  app: any,
  approvalRows: any[],
  deptNameByTag: Record<string, string>,
  queryRows: any[]
): Project {
  const queryByApprovalId: Record<number, any> = {};
  queryRows.forEach(q => { queryByApprovalId[q.application_approval_id] = q; });

  const approvals = approvalRows.map(aa => mapApprovalRow(aa, deptNameByTag, queryByApprovalId));

  const progress = {
    total: approvals.length,
    completed: approvals.filter(a => a.status === 'approved').length,
    inProgress: approvals.filter(a => ['in_progress', 'submitted', 'inspection_scheduled'].includes(a.status)).length,
    actionRequired: approvals.filter(a => a.status === 'action_required').length,
    waiting: approvals.filter(a => a.status === 'waiting').length,
    upcoming: approvals.filter(a => a.status === 'can_apply_now' || a.status === 'draft').length,
  };

  const data = app.submitted_data ?? {};

  return {
    id: String(app.id),
    name: data.projectName ?? app.business_name,
    referenceNo: `APP-${app.id}`,
    companyName: app.business_name,
    businessType: data.businessType ?? 'Private Limited',
    sector: data.sector ?? '',
    subSector: data.subSector ?? '',
    registrationNumber: data.registrationNumber ?? '',
    panNumber: data.panNumber ?? '',
    gstin: data.gstin ?? '',
    udyamNumber: data.udyamNumber,
    contactPerson: data.contactPerson ?? '',
    contactEmail: data.contactEmail ?? '',
    contactPhone: data.contactPhone ?? '',
    projectType: data.projectType ?? 'New Greenfield Facility',
    estimatedInvestmentCrores: data.estimatedInvestmentCrores ?? 0,
    projectSizeSqMeters: data.projectSizeSqMeters ?? 0,
    productionCapacity: data.productionCapacity ?? '',
    expectedEmployees: data.expectedEmployees ?? 0,
    expectedConstructionStartDate: data.expectedConstructionStartDate ?? '',
    expectedOperationsStartDate: data.expectedOperationsStartDate ?? '',
    location: data.location ?? {
  state: '', district: '', industrialArea: '', landType: '', address: '', pinCode: '',
  gisCoordinates: { lat: 0, lng: 0 },
},
operations: data.operations ?? ({
  environmental: { category: '', hasWastewater: false, hasEmissions: false, hasHazardousMaterials: false, wasteGeneratedDailyKg: 0 },
  utilities: { powerKVA: 0, waterKLD: 0, gasRequired: false },
  infrastructure: { requiresNewConstruction: false, builtUpAreaSqMeters: 0, buildingHeightMeters: 0, factoryPremisesType: '', hasFireSafetySystems: false, hasBoiler: false },
  labour: { totalWorkers: 0, shiftsCount: 0, contractWorkers: 0, hasHazardousOperations: false, hasFemaleWorkersNightShift: false },
} as unknown as Project['operations']),
    approvals,
    progress,
    createdAt: app.created_at,
    updatedAt: app.updated_at,
  };
}