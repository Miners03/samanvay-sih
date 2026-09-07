export type UserRole = 'applicant' | 'officer' | 'admin';

export type ApprovalStatus = 
  | 'approved' 
  | 'in_progress' 
  | 'action_required' 
  | 'rejected' 
  | 'waiting';

export type ClearanceStage = 
  | 'pre_establishment' 
  | 'pre_construction' 
  | 'pre_operation' 
  | 'post_commissioning';

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
}

export interface ApprovalRoadmapItem {
  id: string;
  projectId: string;
  departmentId: string;
  departmentName: string;
  approvalName: string;
  approvalCode: string;
  stage: ClearanceStage;
  stageLabel: string;
  status: ApprovalStatus;
  statusLabel: string;
  dependencies: string[]; // IDs of prerequisites
  unlockReason?: string;
  appliedDate?: string;
  estimatedDays: number;
  slaDays: number;
  slaDaysRemaining?: number;
  isDeemedApprovalEligible?: boolean;
  isParallelWith?: string[];
  officerAssigned?: string;
  certificateNo?: string;
  feeAmountINR: number;
  query?: ApprovalQuery;
  inspection?: InspectionRecord;
  documentsRequired: string[];
  documentsSubmitted: string[];
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
  registrationNumber: string; // CIN or LLPIN
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
  category: 'Corporate' | 'Land & Building' | 'Environmental' | 'Technical / Engineering' | 'Statutory Licences';
  docNumber: string;
  issuingAuthority: string;
  issuedDate: string;
  validUntil: string;
  fileSize: string;
  fileFormat: string;
  verified: boolean;
  isDigiLockerLinked: boolean;
  linkedDepartmentClearances: string[];
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
}

export interface IncentiveScheme {
  id: string;
  code: string;
  name: string;
  administeringBody: string;
  type: 'Capital Subsidy' | 'Power Tariff Reimbursement' | 'Stamp Duty Exemption' | 'Employment Grant' | 'Green Transition Subsidy';
  maxBenefit: string;
  eligibilityHighlight: string;
  status: 'eligible' | 'applied' | 'under_scrutiny' | 'sanctioned';
  claimAmountINR?: number;
  sanctionedAmountINR?: number;
  applicationDeadline: string;
}

export interface PlatformNotification {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  timestamp: string;
  type: 'action' | 'alert' | 'success' | 'info';
  read: boolean;
  department?: string;
  actionLabel?: string;
  actionUrl?: string;
}
