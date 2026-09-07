export type UserRole = 'applicant' | 'officer' | 'admin';

export type ApprovalStatus = 
  | 'approved' 
  | 'in_progress' 
  | 'action_required' 
  | 'rejected' 
  | 'waiting'
  | 'can_apply_now'
  | 'draft'
  | 'submitted'
  | 'inspection_scheduled'
  | 'awaiting_decision';

export type ClearanceStage = 
  | 'pre_establishment' 
  | 'pre_construction' 
  | 'pre_operation' 
  | 'post_commissioning';

export type VaultCategory = 
  | 'Company'
  | 'Land'
  | 'Project'
  | 'Financial'
  | 'Environmental'
  | 'Licences'
  | 'Certificates'
  | 'Inspection Reports';

export type DocumentVerificationStatus = 
  | 'Verified' 
  | 'Pending Verification' 
  | 'Expiring Soon' 
  | 'Expired';

export interface SmartValidationCheck {
  isReadable: boolean;
  pagesPresent: boolean;
  nameTypeMatch: boolean;
  signaturePresent: boolean;
  formatValid: boolean;
  warningMessage?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  shortName: string;
  nodalOfficer: string;
  designation: string;
  email: string;
  phone: string;
  avgClearanceDays: number;
  slaDays: number;
  totalActiveApplications: number;
  deemedApprovalThresholdDays: number;
  iconName: string;
}

export interface ProjectLocation {
  state: string;
  district: string;
  industrialArea: string;
  landType: 'Industrial Park' | 'Agricultural (Converted)' | 'Private Industrial Land' | 'SEZ Zone';
  address: string;
  pinCode: string;
  surveyNo?: string;
  gisCoordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ProjectOperations {
  environmental: {
    category: 'Red' | 'Orange' | 'Green' | 'White';
    hasWastewater: boolean;
    wastewaterVolumeKLD?: number;
    hasEmissions: boolean;
    emissionTypes?: string[];
    hasHazardousMaterials: boolean;
    hazardousWasteTypes?: string[];
    wasteGeneratedDailyKg?: number;
  };
  utilities: {
    powerKVA: number;
    waterKLD: number;
    gasRequired: boolean;
    gasUsageSCMD?: number;
  };
  infrastructure: {
    requiresNewConstruction: boolean;
    builtUpAreaSqMeters: number;
    buildingHeightMeters: number;
    factoryPremisesType: 'Industrial Shed' | 'Multi-storey Factory' | 'Warehouse' | 'Assembly Unit';
    hasFireSafetySystems: boolean;
    hasBoiler: boolean;
    boilerPressurePSI?: number;
  };
  labour: {
    totalWorkers: number;
    shiftsCount: number;
    contractWorkers: number;
    hasHazardousOperations: boolean;
    hasFemaleWorkersNightShift: boolean;
  };
}

export interface ApprovalQuery {
  id: string;
  raisedBy: string;
  department: string;
  raisedDate: string;
  deadlineDate: string;
  subject: string;
  description: string;
  requestedDocuments: string[];
  status: 'pending_applicant' | 'submitted_by_applicant' | 'resolved';
  response?: {
    submittedDate: string;
    notes: string;
    documents: string[];
  };
}

export interface InspectionRecord {
  id: string;
  type: 'joint_site_visit' | 'safety_compliance' | 'environmental_audit';
  scheduledDate: string;
  departments: string[];
  leadOfficer: string;
  status: 'scheduled' | 'completed' | 'report_generated';
  findings?: string;
  reportRef?: string;
  checklist?: { item: string; verified: boolean }[];
}

export interface TimelineEvent {
  id: string;
  stageName: string;
  date: string;
  time?: string;
  actor: string;
  description: string;
  isCompleted: boolean;
  isCurrent?: boolean;
}

export interface AuthorityReplyTracker {
  lastAuthorityAction: string;
  lastAuthorityActionDate: string;
  applicantResponse: string;
  applicantResponseDate?: string;
  currentState: string;
  expectedNextAction: string;
  responsibleOfficer: string;
  slaRemainingDays: number;
}

export interface ApprovalRoadmapItem {
  id: string;
  projectId: string;
  departmentId: string;
  departmentName: string;
  approvalName: string;
  approvalCode: string;
  approvalType?: string; // e.g. 'Statutory NOC', 'Consent', 'Building Permit', 'Operational Licence'
  stage: ClearanceStage;
  stageLabel: string;
  status: ApprovalStatus;
  statusLabel: string;
  priority?: 'High' | 'Medium' | 'Standard';
  dependencies: string[]; // IDs of prerequisites
  dependencyNames?: string[]; // Readable names of prerequisites
  unlockReason?: string;
  canApplyNow?: boolean;
  isParallelTrack?: boolean;
  appliedDate?: string;
  estimatedDays: number;
  slaDays: number;
  slaDaysRemaining?: number;
  isDeemedApprovalEligible?: boolean;
  isParallelWith?: string[];
  officerAssigned?: string;
  certificateNo?: string;
  feeAmountINR: number;
  inspectionRequired?: boolean;
  requiredDocsCount?: number;
  query?: ApprovalQuery;
  inspection?: InspectionRecord;
  documentsRequired: string[];
  documentsSubmitted: string[];
  authorityTracker?: AuthorityReplyTracker;
  timelineEvents?: TimelineEvent[];
  activityLogs: {
    date: string;
    actor: string;
    action: string;
    notes?: string;
  }[];
}

export interface Project {
  id: string;
  name: string;
  referenceNo: string;
  companyName: string;
  businessType: 'Private Limited' | 'Public Limited' | 'LLP' | 'Partnership' | 'Proprietorship';
  sector: string;
  subSector: string;
  registrationNumber: string;
  panNumber: string;
  gstin: string;
  udyamNumber?: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  projectType: 'New Greenfield Facility' | 'Expansion of Existing Unit' | 'Modernization / Modification';
  estimatedInvestmentCrores: number;
  projectSizeSqMeters: number;
  productionCapacity: string;
  expectedEmployees: number;
  expectedConstructionStartDate: string;
  expectedOperationsStartDate: string;
  location: ProjectLocation;
  operations: ProjectOperations;
  approvals: ApprovalRoadmapItem[];
  progress: {
    total: number;
    completed: number;
    inProgress: number;
    actionRequired: number;
    waiting: number;
    upcoming: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface VaultDocument {
  id: string;
  title: string;
  category: VaultCategory;
  docNumber: string;
  issuingAuthority: string;
  issuedDate: string;
  validUntil: string;
  fileSize: string;
  fileFormat: string;
  verificationStatus: DocumentVerificationStatus;
  verified: boolean;
  isDigiLockerLinked: boolean;
  linkedDepartmentClearances: string[];
  usedInApplications: string[];
  smartChecks: SmartValidationCheck;
}

export interface ComplianceRenewal {
  id: string;
  licenceName: string;
  approvalCode: string;
  department: string;
  licenceNumber: string;
  issuedDate: string;
  expiryDate: string;
  daysRemaining: number;
  status: 'valid' | 'expiring_soon' | 'expired';
  renewalFee: number;
  autoRenewalEligible: boolean;
  frequency: 'Annual' | 'Bi-annual' | '5 Years';
  expiryIntelligenceMessage: string;
  reusedDetails: {
    businessName: string;
    pan: string;
    premisesAddress: string;
    previousConsentNo: string;
    vaultDocumentsReused: string[];
    updatedFieldsRequired: string[];
  };
}

export interface IncentiveScheme {
  id: string;
  code: string;
  name: string;
  administeringBody: string;
  type: 'Capital Subsidy' | 'Power Tariff Reimbursement' | 'Stamp Duty Exemption' | 'Employment Grant' | 'Green Transition Subsidy';
  matchRating: 'High Match' | 'Medium Match' | 'Low Match';
  maxBenefit: string;
  eligibilityHighlight: string;
  status: 'eligible' | 'applied' | 'under_scrutiny' | 'sanctioned';
  claimAmountINR?: number;
  sanctionedAmountINR?: number;
  applicationDeadline: string;
  requiredDocuments: string[];
}

export interface PlatformNotification {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  timestamp: string;
  type: 'application_update' | 'query' | 'approval' | 'dependency' | 'renewal' | 'sla' | 'info';
  read: boolean;
  department?: string;
  actionLabel?: string;
  actionUrl?: string;
}

export interface UnifiedInspectionProposal {
  id: string;
  projectId: string;
  projectName: string;
  facilityLocation: string;
  commonalityScore: number; // e.g. 78
  status: 'recommended' | 'proposed' | 'confirmed' | 'completed';
  proposedDate: string;
  proposedTime: string;
  participatingDepartments: {
    departmentId: string;
    departmentName: string;
    officerName: string;
    approvalId: string;
    approvalCode: string;
    checklistSubmitted: boolean;
  }[];
  parallelChecklists: {
    fire: { id: string; item: string; verified: boolean; remarks?: string }[];
    pollution: { id: string; item: string; verified: boolean; remarks?: string }[];
    factory: { id: string; item: string; verified: boolean; remarks?: string }[];
  };
  reports: Record<string, {
    officer: string;
    observations: string;
    remarks: string;
    recommendation: 'Approve' | 'Reject' | 'Request More Info';
    submittedDate: string;
  }>;
}

export interface EscalationItem {
  id: string;
  applicationId: string;
  applicationName: string;
  approvalCode: string;
  departmentName: string;
  officerName: string;
  severity: 'Medium' | 'High' | 'Critical';
  reason: string;
  timeOverdue: string;
  escalationLevel: 'Level 1: Nodal Officer' | 'Level 2: Joint Director' | 'Level 3: Apex Committee';
  status: 'active' | 'resolved';
  remarks: string[];
}

export interface RegulatoryRule {
  id: string;
  sector: string;
  state: string;
  department: string;
  approvalName: string;
  prerequisite: string;
  requiredDocuments: string[];
  slaDays: number;
  inspectionRequired: boolean;
  renewalPeriod: string;
  effectiveDate: string;
  version: string;
  status: 'active' | 'draft' | 'deprecated';
}

export interface OfficerWorkloadItem {
  id: string;
  name: string;
  department: string;
  departmentCode?: string;
  designation: string;
  activeCases: number;
  slaRiskCases: number;
  avgProcessingDays: number;
  maxCapacity?: number;
  status: string;
}

