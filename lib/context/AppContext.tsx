'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Project, 
  VaultDocument, 
  ComplianceRenewal, 
  IncentiveScheme, 
  PlatformNotification,
  ApprovalRoadmapItem,
  UnifiedInspectionProposal,
  EscalationItem,
  RegulatoryRule
} from '../types';
import { 
  INITIAL_PROJECT, 
  INITIAL_VAULT_DOCUMENTS, 
  INITIAL_RENEWALS, 
  INITIAL_INCENTIVES, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { 
  INITIAL_UNIFIED_INSPECTION, 
  INITIAL_ESCALATIONS, 
  INITIAL_REGULATORY_RULES, 
  INITIAL_OFFICER_WORKLOAD 
} from '../data/officerMockData';
import { DEPARTMENTS } from '../data/departments';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  selectedOfficerDept: string;
  setSelectedOfficerDept: (deptId: string) => void;
  project: Project;
  projectApprovals: ApprovalRoadmapItem[];
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  vaultDocuments: VaultDocument[];
  addVaultDocument: (doc: Omit<VaultDocument, 'id'>) => void;
  renewals: ComplianceRenewal[];
  incentives: IncentiveScheme[];
  notifications: PlatformNotification[];
  markNotificationAsRead: (id: string) => void;
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  resolveQuery: (approvalId: string, responseNotes: string, attachedDocs: string[]) => void;
  officerApprove: (approvalId: string, remarks: string, certificateNo?: string) => void;
  officerReject: (approvalId: string, reason: string) => void;
  officerRaiseQuery: (approvalId: string, subject: string, description: string, docs: string[]) => void;
  officerScheduleInspection: (approvalId: string, date: string, type: 'joint_site_visit' | 'safety_compliance') => void;
  simulatePrerequisiteApproval: (approvalId: string) => void;
  startApplication: (approvalId: string, docsUsed: string[]) => void;
  submitSmartRenewal: (renewalId: string, updatedFields?: Record<string, string>) => void;
  registerProject: (newProjectData: Omit<Project, 'id' | 'referenceNo' | 'progress' | 'createdAt' | 'updatedAt'>) => Project;
  unifiedInspection: UnifiedInspectionProposal;
  proposeUnifiedInspection: (date: string, time: string) => void;
  submitDepartmentInspectionChecklist: (dept: 'fire' | 'pollution' | 'factory', checklist: { id: string; item: string; verified: boolean; remarks?: string }[], officerReport: { observations: string; remarks: string; recommendation: 'Approve' | 'Reject' | 'Request More Info' }) => void;
  escalations: EscalationItem[];
  addEscalationRemark: (id: string, remark: string) => void;
  escalateItem: (itemOrId: string | Partial<EscalationItem>) => void;
  regulatoryRules: RegulatoryRule[];
  toggleRegulatoryRule: (id: string) => void;
  addRegulatoryRule: (rule: Omit<RegulatoryRule, 'id'>) => void;
  officerWorkload: typeof INITIAL_OFFICER_WORKLOAD;
  rebalanceOfficerWorkload: (sourceOfficerId: string, targetOfficerId: string, count: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('applicant');
  const [selectedOfficerDept, setSelectedOfficerDept] = useState<string>('dept-spcb');
  const [project, setProject] = useState<Project>(INITIAL_PROJECT);
  const [vaultDocuments, setVaultDocuments] = useState<VaultDocument[]>(INITIAL_VAULT_DOCUMENTS);
  const [renewals, setRenewals] = useState<ComplianceRenewal[]>(INITIAL_RENEWALS);
  const [incentives, setIncentives] = useState<IncentiveScheme[]>(INITIAL_INCENTIVES);
  const [notifications, setNotifications] = useState<PlatformNotification[]>(INITIAL_NOTIFICATIONS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [unifiedInspection, setUnifiedInspection] = useState<UnifiedInspectionProposal>(INITIAL_UNIFIED_INSPECTION);
  const [escalations, setEscalations] = useState<EscalationItem[]>(INITIAL_ESCALATIONS);
  const [regulatoryRules, setRegulatoryRules] = useState<RegulatoryRule[]>(INITIAL_REGULATORY_RULES);
  const [officerWorkload, setOfficerWorkload] = useState(INITIAL_OFFICER_WORKLOAD);

  useEffect(() => {
    try {
      const savedRole = localStorage.getItem('samanvay_role');
      if (savedRole && (savedRole === 'applicant' || savedRole === 'officer' || savedRole === 'admin')) {
        setRoleState(savedRole as UserRole);
      }
      const savedProject = localStorage.getItem('samanvay_project');
      if (savedProject) {
        setProject(JSON.parse(savedProject));
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem('samanvay_role', newRole);
    } catch (e) {
      // ignore
    }
  };

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const recalculateProgress = (approvals: ApprovalRoadmapItem[]) => {
    const total = approvals.length;
    const completed = approvals.filter(a => a.status === 'approved').length;
    const inProgress = approvals.filter(a => a.status === 'in_progress' || a.status === 'submitted' || a.status === 'inspection_scheduled').length;
    const actionRequired = approvals.filter(a => a.status === 'action_required').length;
    const waiting = approvals.filter(a => a.status === 'waiting').length;
    const upcoming = approvals.filter(a => a.status === 'can_apply_now').length;

    return {
      total,
      completed,
      inProgress,
      actionRequired,
      waiting,
      upcoming,
    };
  };

  const updateProjectAndPersist = (updatedProj: Project) => {
    setProject(updatedProj);
    try {
      localStorage.setItem('samanvay_project', JSON.stringify(updatedProj));
    } catch (e) {
      // ignore
    }
  };

  // LIVE DEMO AUTO-UNLOCK: When a prerequisite is approved, downstream items automatically flip to Can Apply Now
  const simulatePrerequisiteApproval = (approvalId: string) => {
    setProject(prev => {
      let approvedItemName = '';
      const updatedApprovals = prev.approvals.map(app => {
        if (app.id === approvalId) {
          approvedItemName = app.approvalName;
          return {
            ...app,
            status: 'approved' as const,
            statusLabel: 'Approved',
            canApplyNow: false,
            certificateNo: `GOV/CERT/${Date.now().toString().slice(-5)}`,
            slaDaysRemaining: 0,
            activityLogs: [
              ...(app.activityLogs || []),
              {
                date: new Date().toISOString().split('T')[0],
                actor: 'Government Officer',
                action: 'Clearance Granted (Simulated Verification)',
              },
            ],
          };
        }
        return app;
      });

      const approvedIds = new Set(
        updatedApprovals.filter(a => a.status === 'approved').map(a => a.id)
      );

      const newlyUnlocked: { name: string; shortMsg: string }[] = [];

      const fullyUpdated = updatedApprovals.map(app => {
        if (app.status === 'waiting' && app.dependencies.length > 0) {
          const allMet = app.dependencies.every(depId => approvedIds.has(depId));
          if (allMet) {
            const shortApproved = (approvalId === 'SMV/2026/HR/GGM/APP-00106' || approvedItemName.includes('SPCB')) 
              ? 'SPCB CTE' 
              : approvedItemName;
            const shortApp = (app.id === 'SMV/2026/HR/GGM/APP-00108' || app.approvalCode === 'SFES-NOC-PROV')
              ? 'Fire Provisional NOC'
              : app.approvalName;

            newlyUnlocked.push({
              name: app.approvalName,
              shortMsg: `${shortApp} is now available because ${shortApproved} has been approved.`
            });

            return {
              ...app,
              status: 'can_apply_now' as const,
              statusLabel: 'Can Apply Now',
              canApplyNow: true,
              unlockReason: `Unlocked because prerequisite ${approvedItemName} has been approved.`,
              activityLogs: [
                ...(app.activityLogs || []),
                {
                  date: new Date().toISOString().split('T')[0],
                  actor: 'System Rule Engine',
                  action: `Unlocked automatically after ${approvedItemName} approval`,
                },
              ],
            };
          }
        }
        return app;
      });

      const updatedProj = {
        ...prev,
        approvals: fullyUpdated,
        progress: recalculateProgress(fullyUpdated),
        updatedAt: new Date().toISOString(),
      };

      updateProjectAndPersist(updatedProj);

      // Trigger high-priority toasts & notifications for newly unlocked items
      if (newlyUnlocked.length > 0) {
        newlyUnlocked.forEach(item => {
          showToast(
            'Dependency Cleared: Approval Unlocked!',
            item.shortMsg,
            'success'
          );

          setNotifications(nPrev => [
            {
              id: `notif-${Date.now()}`,
              title: `${item.name} is now available`,
              description: item.shortMsg,
              timeAgo: 'Just now',
              timestamp: new Date().toISOString(),
              type: 'dependency',
              read: false,
              actionLabel: 'Start Application',
              actionUrl: `/applicant/roadmap/${prev.id}`,
            },
            ...nPrev,
          ]);
        });
      } else {
        showToast(
          'Prerequisite Clearance Granted',
          `${approvedItemName} has been marked Approved.`,
          'info'
        );
      }

      return updatedProj;
    });
  };

  // Start Application flow: transitions item from Can Apply Now to Under Review
  const startApplication = (approvalId: string, docsUsed: string[]) => {
    setProject(prev => {
      let targetName = '';
      const updatedApprovals = prev.approvals.map(app => {
        if (app.id === approvalId) {
          targetName = app.approvalName;
          return {
            ...app,
            status: 'in_progress' as const,
            statusLabel: 'Under Review',
            canApplyNow: false,
            appliedDate: new Date().toISOString().split('T')[0],
            documentsSubmitted: docsUsed,
            authorityTracker: {
              lastAuthorityAction: 'Application Formally Lodged',
              lastAuthorityActionDate: new Date().toISOString().split('T')[0],
              applicantResponse: `${docsUsed.length} documents attached from verified vault`,
              applicantResponseDate: new Date().toISOString().split('T')[0],
              currentState: 'In Departmental Scrutiny Queue',
              expectedNextAction: 'Initial Scrutiny & Officer Assignment',
              responsibleOfficer: 'Nodal Scrutiny Cell',
              slaRemainingDays: app.slaDays,
            },
            timelineEvents: [
              ...(app.timelineEvents || []),
              {
                id: `tl-${Date.now()}`,
                stageName: 'Submitted to Department',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                actor: 'Applicant',
                description: `Application lodged online using ${docsUsed.length} verified vault documents`,
                isCompleted: true,
                isCurrent: true,
              },
            ],
            activityLogs: [
              ...(app.activityLogs || []),
              {
                date: new Date().toISOString().split('T')[0],
                actor: 'Applicant',
                action: 'Online application submitted via Samanvay single window',
              },
            ],
          };
        }
        return app;
      });

      const updatedProj = {
        ...prev,
        approvals: updatedApprovals,
        progress: recalculateProgress(updatedApprovals),
        updatedAt: new Date().toISOString(),
      };
      updateProjectAndPersist(updatedProj);

      showToast(
        'Application Lodged Successfully',
        `Your application for ${targetName} is now lodged with the competent authority. Statutory SLA timer started.`,
        'success'
      );

      return updatedProj;
    });
  };

  const resolveQuery = (approvalId: string, responseNotes: string, attachedDocs: string[]) => {
    setProject(prev => {
      let targetName = '';
      const updatedApprovals = prev.approvals.map(app => {
        if (app.id === approvalId && app.query) {
          targetName = app.approvalName;
          return {
            ...app,
            status: 'in_progress' as const,
            statusLabel: 'Under Review',
            query: {
              ...app.query,
              status: 'submitted_by_applicant' as const,
              response: {
                submittedDate: new Date().toISOString().split('T')[0],
                notes: responseNotes,
                documents: attachedDocs,
              },
            },
            authorityTracker: app.authorityTracker ? {
              ...app.authorityTracker,
              applicantResponse: responseNotes,
              applicantResponseDate: new Date().toISOString().split('T')[0],
              currentState: 'Applicant response received; under re-scrutiny',
              expectedNextAction: 'Officer review of revised submission',
            } : undefined,
            timelineEvents: [
              ...(app.timelineEvents || []),
              {
                id: `tl-${Date.now()}`,
                stageName: 'Applicant Responded',
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                actor: 'Applicant',
                description: `Clarifications submitted: "${responseNotes.slice(0, 60)}..."`,
                isCompleted: true,
                isCurrent: true,
              },
            ],
            activityLogs: [
              ...(app.activityLogs || []),
              {
                date: new Date().toISOString().split('T')[0],
                actor: 'Applicant',
                action: 'Clarification & documents submitted',
                notes: responseNotes,
              },
            ],
          };
        }
        return app;
      });

      const updatedProj: Project = {
        ...prev,
        approvals: updatedApprovals,
        progress: recalculateProgress(updatedApprovals),
        updatedAt: new Date().toISOString(),
      };
      updateProjectAndPersist(updatedProj);
      return updatedProj;
    });

    showToast(
      'Response Submitted Successfully',
      'Your response and supplementary documents have been transmitted to the departmental scrutiny desk.',
      'success'
    );
  };

  const officerApprove = (approvalId: string, remarks: string, certificateNo?: string) => {
    simulatePrerequisiteApproval(approvalId);
  };

  const officerReject = (approvalId: string, reason: string) => {
    setProject(prev => {
      const updatedApprovals = prev.approvals.map(app => {
        if (app.id === approvalId) {
          return {
            ...app,
            status: 'rejected' as const,
            statusLabel: 'Rejected / Returned',
            activityLogs: [
              ...(app.activityLogs || []),
              {
                date: new Date().toISOString().split('T')[0],
                actor: 'Government Officer',
                action: 'Application Returned / Rejected with Grounds',
                notes: reason,
              },
            ],
          };
        }
        return app;
      });

      const updatedProj: Project = {
        ...prev,
        approvals: updatedApprovals,
        progress: recalculateProgress(updatedApprovals),
        updatedAt: new Date().toISOString(),
      };
      updateProjectAndPersist(updatedProj);
      return updatedProj;
    });

    showToast(
      'Application Formally Returned',
      `Rejection recorded: ${reason}`,
      'warning'
    );
  };

  const officerRaiseQuery = (approvalId: string, subject: string, description: string, docs: string[]) => {
    setProject(prev => {
      const updatedApprovals = prev.approvals.map(app => {
        if (app.id === approvalId) {
          return {
            ...app,
            status: 'action_required' as const,
            statusLabel: 'Action Required',
            query: {
              id: `qry-${approvalId}-${Date.now()}`,
              raisedBy: 'Department Scrutiny Officer',
              department: app.departmentName,
              raisedDate: new Date().toISOString().split('T')[0],
              deadlineDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              subject,
              description,
              requestedDocuments: docs,
              status: 'pending_applicant' as const,
            },
            activityLogs: [
              ...(app.activityLogs || []),
              {
                date: new Date().toISOString().split('T')[0],
                actor: 'Government Officer',
                action: 'Official Query Raised',
                notes: subject,
              },
            ],
          };
        }
        return app;
      });

      const updatedProj: Project = {
        ...prev,
        approvals: updatedApprovals,
        progress: recalculateProgress(updatedApprovals),
        updatedAt: new Date().toISOString(),
      };
      updateProjectAndPersist(updatedProj);
      return updatedProj;
    });

    showToast(
      'Official Scrutiny Query Dispatched',
      'Applicant has been alerted via email, SMS, and dashboard notification.',
      'info'
    );
  };

  const officerScheduleInspection = (approvalId: string, date: string, type: 'joint_site_visit' | 'safety_compliance') => {
    setProject(prev => {
      const updatedApprovals = prev.approvals.map(app => {
        if (app.id === approvalId) {
          return {
            ...app,
            inspection: {
              id: `insp-${Date.now()}`,
              type,
              scheduledDate: date,
              departments: [app.departmentName, 'State Fire & Emergency Services Department'],
              leadOfficer: 'Joint Inspection Team Leader',
              status: 'scheduled' as const,
              checklist: [
                { item: 'Boundary setbacks and clear fire lane width (min 6.0m)', verified: true },
                { item: 'Effluent pipeline containment & sampling point', verified: true },
                { item: 'Overhead HT electrical clearance height', verified: true },
                { item: 'Emergency exit stairway illumination and signage', verified: false },
              ],
            },
            status: 'inspection_scheduled' as const,
            statusLabel: 'Inspection Scheduled',
            activityLogs: [
              ...(app.activityLogs || []),
              {
                date: new Date().toISOString().split('T')[0],
                actor: 'Government Officer',
                action: `Joint site visit scheduled for ${date}`,
              },
            ],
          };
        }
        return app;
      });

      const updatedProj: Project = {
        ...prev,
        approvals: updatedApprovals,
        progress: recalculateProgress(updatedApprovals),
        updatedAt: new Date().toISOString(),
      };
      updateProjectAndPersist(updatedProj);
      return updatedProj;
    });

    showToast(
      'Joint Inspection Scheduled',
      `Site inspection confirmed for ${date}. Multi-department teams coordinated.`,
      'info'
    );
  };

  const submitSmartRenewal = (renewalId: string, updatedFields?: Record<string, string>) => {
    setRenewals(prev => prev.map(ren => {
      if (ren.id === renewalId) {
        return {
          ...ren,
          status: 'valid' as const,
          daysRemaining: 365,
          expiryDate: '2027-10-08',
          expiryIntelligenceMessage: 'Certificate is in good standing and renewed for another 365 days.',
        };
      }
      return ren;
    }));

    showToast(
      'Smart Renewal Application Dispatched',
      'We reused your business and document details from previous filing. Renewal docket lodged with zero paperwork.',
      'success'
    );
  };

  const registerProject = (newProjectData: Omit<Project, 'id' | 'referenceNo' | 'progress' | 'createdAt' | 'updatedAt'>): Project => {
    const id = `proj-${Date.now()}`;
    const referenceNo = `SMV/2026/IND/${Math.floor(10000 + Math.random() * 90000)}`;
    const progress = recalculateProgress(newProjectData.approvals);
    const newProj: Project = {
      ...newProjectData,
      id,
      referenceNo,
      progress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    updateProjectAndPersist(newProj);
    showToast(
      'Project Registered & Roadmap Generated',
      `Approval roadmap successfully initialized for ${newProj.name}. Reference: ${referenceNo}`,
      'success'
    );
    return newProj;
  };

  const addVaultDocument = (doc: Omit<VaultDocument, 'id'>) => {
    const newDoc: VaultDocument = {
      ...doc,
      id: `doc-${Date.now()}`,
    };
    setVaultDocuments(prev => [newDoc, ...prev]);
    showToast('Document Vault Updated', `${doc.title} has been added and verified for multi-department use.`, 'success');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const proposeUnifiedInspection = (date: string, time: string) => {
    setUnifiedInspection(prev => ({
      ...prev,
      status: 'confirmed',
      proposedDate: date,
      proposedTime: time,
    }));
    showToast(
      'Unified Inspection Coordinated!',
      `Coordinated site inspection proposed for ${date} at ${time}. 3 individual visits unified into 1.`,
      'success'
    );
    setNotifications(nPrev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Unified Site Inspection Scheduled',
        description: `Joint inspection across Fire, SPCB, and Labour departments confirmed for ${date} at ${time}.`,
        timeAgo: 'Just now',
        timestamp: new Date().toISOString(),
        type: 'application_update',
        read: false,
        actionLabel: 'View Inspection Plan',
        actionUrl: '/officer/inspections',
      },
      ...nPrev,
    ]);
  };

  const submitDepartmentInspectionChecklist = (
    dept: 'fire' | 'pollution' | 'factory',
    checklist: { id: string; item: string; verified: boolean; remarks?: string }[],
    officerReport: { observations: string; remarks: string; recommendation: 'Approve' | 'Reject' | 'Request More Info' }
  ) => {
    setUnifiedInspection(prev => {
      const updatedChecklists = {
        ...prev.parallelChecklists,
        [dept]: checklist,
      };
      const updatedReports = {
        ...prev.reports,
        [dept]: {
          ...officerReport,
          officer: dept === 'fire' ? 'Chief Fire Officer M. S. Hooda' : dept === 'pollution' ? 'Er. R. K. Sharma (SEE)' : 'Shri A. P. Varma (Joint Director)',
          submittedDate: new Date().toISOString().split('T')[0],
        },
      };

      const updatedDepts = prev.participatingDepartments.map(d => {
        if ((dept === 'fire' && d.departmentId === 'dept-fire') ||
            (dept === 'pollution' && d.departmentId === 'dept-spcb') ||
            (dept === 'factory' && d.departmentId === 'dept-labour')) {
          return { ...d, checklistSubmitted: true };
        }
        return d;
      });

      return {
        ...prev,
        participatingDepartments: updatedDepts,
        parallelChecklists: updatedChecklists,
        reports: updatedReports,
      };
    });

    showToast(
      'Department Checklist & Report Submitted',
      `Independent inspection findings recorded for ${dept.toUpperCase()}. Officer keeps full statutory discretion.`,
      'success'
    );
  };

  const addEscalationRemark = (id: string, remark: string) => {
    setEscalations(prev => prev.map(esc => {
      if (esc.id === id) {
        return {
          ...esc,
          remarks: [...esc.remarks, `${new Date().toISOString().split('T')[0]}: ${remark}`],
        };
      }
      return esc;
    }));
    showToast('Escalation Remark Logged', 'Official note added to escalation file.', 'info');
  };

  const escalateItem = (itemOrId: string | Partial<EscalationItem>) => {
    if (typeof itemOrId === 'string') {
      setEscalations(prev => prev.map(esc => {
        if (esc.id === itemOrId) {
          return {
            ...esc,
            severity: 'Critical' as const,
            escalationLevel: 'Level 3: Apex Committee' as const,
            remarks: [...esc.remarks, `${new Date().toISOString().split('T')[0]}: Escalated to Apex Committee`],
          };
        }
        return esc;
      }));
    } else {
      const newEsc: EscalationItem = {
        id: `esc-${Date.now()}`,
        applicationId: itemOrId.applicationId || 'SMV/2026/HR/GGM/APP-00106',
        applicationName: itemOrId.applicationName || 'SPCB Regulatory Pipeline',
        approvalCode: itemOrId.approvalCode || 'HSPCB-CTE',
        departmentName: itemOrId.departmentName || 'State Pollution Control Board',
        officerName: itemOrId.officerName || 'Directorate Technical Scrutiny Cell',
        severity: itemOrId.severity || 'Critical',
        reason: itemOrId.reason || 'Escalation triggered by administrative oversight',
        timeOverdue: itemOrId.timeOverdue || 'Immediate',
        escalationLevel: itemOrId.escalationLevel || 'Level 3: Apex Committee',
        status: 'active',
        remarks: [`${new Date().toISOString().split('T')[0]}: Escalated by Apex Administration`],
      };
      setEscalations(prev => [newEsc, ...prev]);
    }
    showToast('Escalated to Apex Committee', 'Immediate executive notice dispatched to Nodal Department Head.', 'warning');
  };

  const toggleRegulatoryRule = (id: string) => {
    setRegulatoryRules(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: r.status === 'active' ? 'deprecated' : 'active',
        };
      }
      return r;
    }));
    showToast('Rule Status Updated', 'Regulatory roadmap engine cache updated.', 'info');
  };

  const addRegulatoryRule = (newRule: Omit<RegulatoryRule, 'id'>) => {
    const id = `rule-${Date.now()}`;
    setRegulatoryRules(prev => [{ id, ...newRule }, ...prev]);
    showToast('Regulatory Rule Added', `Rule for ${newRule.approvalName} is now active in rule engine.`, 'success');
  };

  const rebalanceOfficerWorkload = (sourceOfficerId: string, targetOfficerId: string, count: number) => {
    setOfficerWorkload(prev => prev.map(off => {
      if (off.id === sourceOfficerId) {
        const newCount = Math.max(0, off.activeCases - count);
        return {
          ...off,
          activeCases: newCount,
          status: newCount > 24 ? 'High Load' : 'Optimal',
        };
      }
      if (off.id === targetOfficerId) {
        const newCount = off.activeCases + count;
        return {
          ...off,
          activeCases: newCount,
          status: newCount > 24 ? 'High Load' : 'Optimal',
        };
      }
      return off;
    }));
    showToast('Workload Rebalanced', `${count} dockets successfully transferred between desks.`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        selectedOfficerDept,
        setSelectedOfficerDept,
        project,
        projectApprovals: project.approvals,
        setProject,
        vaultDocuments,
        addVaultDocument,
        renewals,
        incentives,
        notifications,
        markNotificationAsRead,
        toasts,
        showToast,
        removeToast,
        resolveQuery,
        officerApprove,
        officerReject,
        officerRaiseQuery,
        officerScheduleInspection,
        simulatePrerequisiteApproval,
        startApplication,
        submitSmartRenewal,
        registerProject,
        unifiedInspection,
        proposeUnifiedInspection,
        submitDepartmentInspectionChecklist,
        escalations,
        addEscalationRemark,
        escalateItem,
        regulatoryRules,
        toggleRegulatoryRule,
        addRegulatoryRule,
        officerWorkload,
        rebalanceOfficerWorkload,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
