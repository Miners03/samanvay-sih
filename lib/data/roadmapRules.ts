import { ApprovalRoadmapItem, ProjectOperations, ClearanceStage } from '../types';

export function generateRoadmapFromOperations(
  projectId: string,
  projectName: string,
  operations: ProjectOperations,
  landType: string,
  investmentCrores: number
): ApprovalRoadmapItem[] {
  const approvals: ApprovalRoadmapItem[] = [];

  // 1. STAGE: PRE-ESTABLISHMENT (Site, Land, Initial Environmental & Fire clearances)
  // Approval 1: Industrial Land Allotment / Possession or Land Use Permission
  const landApprovalId = `app-${projectId}-land`;
  approvals.push({
    id: landApprovalId,
    projectId,
    departmentId: 'dept-sidc',
    departmentName: 'State Industrial Development Corporation',
    approvalName: landType.includes('Industrial') 
      ? 'Industrial Plot Allotment & Possession Handover'
      : 'Change of Land Use (CLU) & Site Suitability Clearance',
    approvalCode: landType.includes('Industrial') ? 'SIDC-ALLOT-01' : 'TCPD-CLU-02',
    stage: 'pre_establishment',
    stageLabel: 'Stage 1: Pre-Establishment',
    status: 'approved', // Typically verified at start
    statusLabel: 'Approved',
    dependencies: [],
    estimatedDays: 14,
    slaDays: 20,
    slaDaysRemaining: 0,
    isDeemedApprovalEligible: true,
    appliedDate: '2026-08-01',
    certificateNo: 'SIDC/PLT/2026/GGM-8821',
    feeAmountINR: 15000,
    documentsRequired: ['Site Key Plan', 'Ownership / Lease Deed', 'Board Resolution'],
    documentsSubmitted: ['Site Key Plan', 'Ownership / Lease Deed'],
    activityLogs: [
      { date: '2026-08-01', actor: 'Applicant', action: 'Application submitted with lease deed' },
      { date: '2026-08-08', actor: 'Estate Officer (SIDC)', action: 'Site verification completed' },
      { date: '2026-08-10', actor: 'SIDC Regional Head', action: 'Possession letter & allotment approved' },
    ],
  });

  // Approval 2: Consent to Establish (CTE) from SPCB
  const cteApprovalId = `app-${projectId}-cte`;
  const isRedOrange = operations.environmental.category === 'Red' || operations.environmental.category === 'Orange';
  approvals.push({
    id: cteApprovalId,
    projectId,
    departmentId: 'dept-spcb',
    departmentName: 'State Pollution Control Board',
    approvalName: `Consent to Establish (CTE) - ${operations.environmental.category} Category`,
    approvalCode: `SPCB-CTE-${operations.environmental.category.toUpperCase()}`,
    stage: 'pre_establishment',
    stageLabel: 'Stage 1: Pre-Establishment',
    status: 'action_required', // Realistic initial active state requiring applicant action
    statusLabel: 'Action Required',
    dependencies: [landApprovalId],
    unlockReason: 'Prerequisite Land Allotment is approved. Immediate action needed on queries.',
    appliedDate: '2026-08-12',
    estimatedDays: isRedOrange ? 30 : 15,
    slaDays: 30,
    slaDaysRemaining: 8,
    isDeemedApprovalEligible: true,
    isParallelWith: [`app-${projectId}-fire-prov`, `app-${projectId}-discom-ht`],
    feeAmountINR: isRedOrange ? 45000 : 20000,
    query: {
      id: `qry-${cteApprovalId}-1`,
      raisedBy: 'Er. R. K. Sharma (SPCB Reviewer)',
      department: 'State Pollution Control Board',
      raisedDate: '2026-08-25',
      deadlineDate: '2026-09-12',
      subject: 'Clarification regarding Effluent Treatment Plant (ETP) flow diagram',
      description: 'Please submit the revised engineering flow diagram and mass balance sheet for the 45 KLD Zero Liquid Discharge (ZLD) plant, specifically addressing secondary treatment recovery.',
      requestedDocuments: ['Revised ZLD Engineering Drawing', 'Mass Balance Calculation Sheet'],
      status: 'pending_applicant',
    },
    documentsRequired: ['Project Detailed Project Report (DPR)', 'Layout Plan', 'Effluent Management Plan', 'Air Pollution Control Measure Drawing'],
    documentsSubmitted: ['Project Detailed Project Report (DPR)', 'Layout Plan'],
    activityLogs: [
      { date: '2026-08-12', actor: 'Applicant', action: 'CTE Application lodged online' },
      { date: '2026-08-25', actor: 'SPCB Officer', action: 'Scrutiny query raised on ETP schematic' },
    ],
  });

  // Approval 3: Provisional Fire Safety NOC
  const provFireId = `app-${projectId}-fire-prov`;
  approvals.push({
    id: provFireId,
    projectId,
    departmentId: 'dept-fire',
    departmentName: 'State Fire & Emergency Services Department',
    approvalName: 'Provisional Fire Safety Recommendation (Pre-Construction NOC)',
    approvalCode: 'SFES-NOC-PROV',
    stage: 'pre_establishment',
    stageLabel: 'Stage 1: Pre-Establishment',
    status: 'approved',
    statusLabel: 'Approved',
    dependencies: [landApprovalId],
    unlockReason: 'Unlocks after Land Possession is verified.',
    appliedDate: '2026-08-14',
    estimatedDays: 14,
    slaDays: 15,
    slaDaysRemaining: 0,
    isDeemedApprovalEligible: true,
    isParallelWith: [cteApprovalId],
    certificateNo: 'SFES/GGM/NOC/2026/092',
    feeAmountINR: 12000,
    documentsRequired: ['Building Elevations', 'Fire Hydrant & Sprinkler Scheme', 'Means of Egress Plan'],
    documentsSubmitted: ['Building Elevations', 'Fire Hydrant & Sprinkler Scheme', 'Means of Egress Plan'],
    activityLogs: [
      { date: '2026-08-14', actor: 'Applicant', action: 'Fire drawing submitted' },
      { date: '2026-08-20', actor: 'Fire Inspector', action: 'Architectural setback verification' },
      { date: '2026-08-23', actor: 'Chief Fire Officer', action: 'Provisional NOC issued' },
    ],
  });

  // Approval 4: DISCOM Power Load Sanction & HT Feasibility
  const discomHtId = `app-${projectId}-discom-ht`;
  approvals.push({
    id: discomHtId,
    projectId,
    departmentId: 'dept-discom',
    departmentName: 'State Power Distribution Corporation (DISCOM)',
    approvalName: `HT Industrial Power Load Feasibility (${operations.utilities.powerKVA} kVA)`,
    approvalCode: 'DISCOM-HT-SANC',
    stage: 'pre_establishment',
    stageLabel: 'Stage 1: Pre-Establishment',
    status: 'in_progress',
    statusLabel: 'Under Review',
    dependencies: [landApprovalId],
    unlockReason: 'Runs in parallel with environmental approvals once land is locked.',
    appliedDate: '2026-08-18',
    estimatedDays: 20,
    slaDays: 25,
    slaDaysRemaining: 11,
    isDeemedApprovalEligible: true,
    isParallelWith: [cteApprovalId, provFireId],
    feeAmountINR: 35000,
    documentsRequired: ['Connected Load Estimation Sheet', 'Single Line Electrical Diagram (SLD)', 'Substation Location Plan'],
    documentsSubmitted: ['Connected Load Estimation Sheet', 'Single Line Electrical Diagram (SLD)'],
    activityLogs: [
      { date: '2026-08-18', actor: 'Applicant', action: 'Application submitted for HT load' },
      { date: '2026-08-28', actor: 'DISCOM Executive Engineer', action: 'Substation feeder load study under progress' },
    ],
  });

  // 2. STAGE: PRE-CONSTRUCTION (Factory Plan Approval, Building Permits)
  // Approval 5: Factory Building Plan Approval (Labour / DISH)
  const factoryPlanId = `app-${projectId}-factory-plan`;
  approvals.push({
    id: factoryPlanId,
    projectId,
    departmentId: 'dept-labour',
    departmentName: 'Directorate of Industrial Safety & Health (Labour Dept)',
    approvalName: 'Factory Building Plan Approval (Under Factories Act, 1948)',
    approvalCode: 'DISH-FPA-01',
    stage: 'pre_construction',
    stageLabel: 'Stage 2: Pre-Construction',
    status: 'action_required',
    statusLabel: 'Action Required',
    dependencies: [provFireId, cteApprovalId],
    unlockReason: 'Requires Provisional Fire NOC and SPCB Consent to Establish (CTE).',
    appliedDate: '2026-08-22',
    estimatedDays: 18,
    slaDays: 21,
    slaDaysRemaining: 5,
    isDeemedApprovalEligible: true,
    feeAmountINR: 18000,
    query: {
      id: `qry-${factoryPlanId}-2`,
      raisedBy: 'Shri A. P. Varma (Joint Director)',
      department: 'Directorate of Industrial Safety & Health',
      raisedDate: '2026-08-30',
      deadlineDate: '2026-09-14',
      subject: 'Emergency evacuation corridor width discrepancy',
      description: 'The sectional drawing shows secondary exit passageway width as 1.5m, whereas under Rule 6(3) for 200+ workers, minimum clear width of 2.0m is mandatory.',
      requestedDocuments: ['Revised Ground Floor Exit Plan'],
      status: 'pending_applicant',
    },
    documentsRequired: ['Architectural Layout with Machine Positions', 'Ventilation & Natural Light Calculation', 'Sanitary Facilities Map'],
    documentsSubmitted: ['Architectural Layout with Machine Positions', 'Ventilation & Natural Light Calculation'],
    activityLogs: [
      { date: '2026-08-22', actor: 'Applicant', action: 'Factory plans uploaded' },
      { date: '2026-08-30', actor: 'DISH Scrutiny Officer', action: 'Query raised on evacuation corridor width' },
    ],
  });

  // Approval 6: Municipal / Town Planning Building Construction Permit
  const municipalBuildingId = `app-${projectId}-bld-permit`;
  approvals.push({
    id: municipalBuildingId,
    projectId,
    departmentId: 'dept-tcp',
    departmentName: 'Town & Country Planning Department',
    approvalName: 'Sanction of Industrial Building Architectural Drawings',
    approvalCode: 'TCPD-BLD-SANC',
    stage: 'pre_construction',
    stageLabel: 'Stage 2: Pre-Construction',
    status: 'approved',
    statusLabel: 'Approved',
    dependencies: [factoryPlanId],
    unlockReason: 'Unlocks once Factory Building Plan is approved by Labour Department.',
    appliedDate: '2026-08-20',
    estimatedDays: 25,
    slaDays: 30,
    slaDaysRemaining: 0,
    certificateNo: 'TCPD/IND/2026/0441',
    feeAmountINR: 65000,
    documentsRequired: ['Structural Stability Certificate', 'Rainwater Harvesting Layout', 'Soil Testing Report'],
    documentsSubmitted: ['Structural Stability Certificate', 'Rainwater Harvesting Layout', 'Soil Testing Report'],
    activityLogs: [
      { date: '2026-08-20', actor: 'Applicant', action: 'Drawings lodged' },
      { date: '2026-08-27', actor: 'Town Planner', action: 'Drawings stamped and approved' },
    ],
  });

  // Approval 7: Industrial Water Supply Connection & Ground Water NOC
  const waterId = `app-${projectId}-water`;
  approvals.push({
    id: waterId,
    projectId,
    departmentId: 'dept-phed',
    departmentName: 'Public Health Engineering & Water Resources',
    approvalName: `Industrial Water Supply Allocation (${operations.utilities.waterKLD} KLD)`,
    approvalCode: 'PHED-IND-WTR',
    stage: 'pre_construction',
    stageLabel: 'Stage 2: Pre-Construction',
    status: 'approved',
    statusLabel: 'Approved',
    dependencies: [landApprovalId],
    unlockReason: 'Can proceed simultaneously with pre-construction design.',
    appliedDate: '2026-08-15',
    estimatedDays: 12,
    slaDays: 15,
    slaDaysRemaining: 0,
    certificateNo: 'PHED/GGM/WTR/2026/109',
    feeAmountINR: 10000,
    documentsRequired: ['Water Balance Chart', 'Internal Plumbing Pipeline Plan'],
    documentsSubmitted: ['Water Balance Chart', 'Internal Plumbing Pipeline Plan'],
    activityLogs: [
      { date: '2026-08-15', actor: 'Applicant', action: 'Water pipeline intake plan filed' },
      { date: '2026-08-24', actor: 'PHED Executive Engineer', action: 'Bulk industrial supply line sanctioned' },
    ],
  });

  // 3. STAGE: PRE-OPERATION (Final Clearances, CTO, Final Fire, Boiler, Factory Licence)
  // Approval 8: Final Fire Safety Certificate
  const finalFireId = `app-${projectId}-fire-final`;
  approvals.push({
    id: finalFireId,
    projectId,
    departmentId: 'dept-fire',
    departmentName: 'State Fire & Emergency Services Department',
    approvalName: 'Final Fire Safety Certificate (Post-Construction Inspection)',
    approvalCode: 'SFES-NOC-FINAL',
    stage: 'pre_operation',
    stageLabel: 'Stage 3: Pre-Operation',
    status: 'waiting',
    statusLabel: 'Waiting for Prerequisites',
    dependencies: [provFireId, municipalBuildingId],
    unlockReason: 'Unlocks after building construction is completed and verified against provisional NOC.',
    estimatedDays: 14,
    slaDays: 15,
    slaDaysRemaining: 15,
    feeAmountINR: 20000,
    documentsRequired: ['Fire Fighting Equipment Installation Invoice', 'Mock Drill & Training Report', 'As-Built Architectural Drawings'],
    documentsSubmitted: [],
    activityLogs: [
      { date: '2026-08-25', actor: 'System', action: 'Pending construction completion notification' },
    ],
  });

  // Approval 9: Consent to Operate (CTO)
  const ctoId = `app-${projectId}-cto`;
  approvals.push({
    id: ctoId,
    projectId,
    departmentId: 'dept-spcb',
    departmentName: 'State Pollution Control Board',
    approvalName: `Consent to Operate (CTO) - Air & Water Acts`,
    approvalCode: 'SPCB-CTO-01',
    stage: 'pre_operation',
    stageLabel: 'Stage 3: Pre-Operation',
    status: 'waiting',
    statusLabel: 'Waiting for Prerequisites',
    dependencies: [cteApprovalId, finalFireId],
    unlockReason: 'Unlocks once Consent to Establish (CTE) is verified and Final Fire Safety is in place.',
    estimatedDays: 25,
    slaDays: 30,
    slaDaysRemaining: 30,
    feeAmountINR: 50000,
    documentsRequired: ['ETP Commissioning Report', 'Air Emission Stack Test Report', 'Hazardous Waste Storage Manifest'],
    documentsSubmitted: [],
    activityLogs: [
      { date: '2026-08-25', actor: 'System', action: 'Awaiting CTE clearance and plant erection' },
    ],
  });

  // Approval 10: Factory Licence (Final Registration under Factories Act)
  const factoryLicenceId = `app-${projectId}-factory-lic`;
  approvals.push({
    id: factoryLicenceId,
    projectId,
    departmentId: 'dept-labour',
    departmentName: 'Directorate of Industrial Safety & Health (Labour Dept)',
    approvalName: 'Factory Operational Licence & Registration Certificate',
    approvalCode: 'DISH-LIC-REG',
    stage: 'pre_operation',
    stageLabel: 'Stage 3: Pre-Operation',
    status: 'waiting',
    statusLabel: 'Waiting for Prerequisites',
    dependencies: [factoryPlanId, ctoId, finalFireId],
    unlockReason: 'Unlocks once Factory Plan Approval, CTO, and Fire Certificate are secured.',
    estimatedDays: 15,
    slaDays: 21,
    slaDaysRemaining: 21,
    feeAmountINR: 25000,
    documentsRequired: ['Notice of Occupation (Form 2)', 'Boiler / Machinery Test Certificates', 'Appointment of Factory Manager'],
    documentsSubmitted: [],
    activityLogs: [
      { date: '2026-08-25', actor: 'System', action: 'Scheduled after CTO submission' },
    ],
  });

  // Conditional Approval: Boiler Registration if hasBoiler is true
  if (operations.infrastructure.hasBoiler) {
    const boilerId = `app-${projectId}-boiler`;
    approvals.push({
      id: boilerId,
      projectId,
      departmentId: 'dept-boilers',
      departmentName: 'Chief Inspectorate of Boilers',
      approvalName: `Industrial Boiler Registration & Steam Pipeline Certificate (${operations.infrastructure.boilerPressurePSI || 150} PSI)`,
      approvalCode: 'CIB-BLR-REG',
      stage: 'pre_operation',
      stageLabel: 'Stage 3: Pre-Operation',
      status: 'waiting',
      statusLabel: 'Waiting for Prerequisites',
      dependencies: [factoryPlanId],
      unlockReason: 'Unlocks after factory premises foundations are erected.',
      estimatedDays: 12,
      slaDays: 14,
      slaDaysRemaining: 14,
      feeAmountINR: 15000,
      documentsRequired: ['IBR Boiler Manufacturer Certificate (Form II)', 'Erector Certificate (Form II-A)', 'Radiography Test Report'],
      documentsSubmitted: [],
      activityLogs: [
        { date: '2026-08-25', actor: 'System', action: 'Waiting for factory structural completion' },
      ],
    });
  }

  // 4. STAGE: POST-COMMISSIONING & INCENTIVES
  // Approval 11: State Industrial Policy Capital Investment Subsidy
  const subsidyId = `app-${projectId}-subsidy`;
  approvals.push({
    id: subsidyId,
    projectId,
    departmentId: 'dept-dic',
    departmentName: 'Department of Industries & Commerce (Single Window Cell)',
    approvalName: investmentCrores >= 25 
      ? 'Mega Project Capital Investment Subsidy (15% on Eligible Fixed Capital)' 
      : 'MSME Fixed Capital Investment Subsidy & Stamp Duty Reimbursement',
    approvalCode: 'DIC-SUB-INV',
    stage: 'post_commissioning',
    stageLabel: 'Stage 4: Incentives & Commissioning',
    status: 'waiting',
    statusLabel: 'Locked until Commercial Production',
    dependencies: [factoryLicenceId, ctoId],
    unlockReason: 'Unlocks upon commencement of commercial operations and submission of CA audit certificate.',
    estimatedDays: 30,
    slaDays: 45,
    slaDaysRemaining: 45,
    feeAmountINR: 0,
    documentsRequired: ['First Sale Invoice / Commercial Production Proof', 'CA Fixed Asset Expenditure Certificate', 'Bank Term Loan Sanction Letter'],
    documentsSubmitted: [],
    activityLogs: [
      { date: '2026-08-25', actor: 'System', action: 'Incentive claim window unlocks post commissioning' },
    ],
  });

  return approvals;
}
