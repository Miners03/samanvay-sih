'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Project, 
  VaultDocument, 
  ComplianceRenewal, 
  IncentiveScheme, 
  PlatformNotification,
  ApprovalRoadmapItem 
} from '../types';
import { 
  INITIAL_PROJECT, 
  INITIAL_VAULT_DOCUMENTS, 
  INITIAL_RENEWALS, 
  INITIAL_INCENTIVES, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
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
  registerProject: (newProjectData: Omit<Project, 'id' | 'referenceNo' | 'progress' | 'createdAt' | 'updatedAt'>) => Project;
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

  // Load from localStorage if present on client
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
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const recalculateProgress = (approvals: ApprovalRoadmapItem[]) => {
    const total = approvals.length;
    const approved = approvals.filter(a => a.status === 'approved').length;
    const inProgress = approvals.filter(a => a.status === 'in_progress').length;
    const actionRequired = approvals.filter(a => a.status === 'action_required').length;
    const waiting = approvals.filter(a => a.status === 'waiting').length;
    const upcoming = approvals.filter(a => a.status === 'rejected').length;

    return {
      total,
      completed: approved,
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

  const resolveQuery = (approvalId: string, responseNotes: string, attachedDocs: string[]) => {
    setProject(prev => {
      const updatedApprovals = prev.approvals.map(app => {
        if (app.id === approvalId && app.query) {
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
            activityLogs: [
              ...app.activityLogs,
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
    const cert = certificateNo || `GOV/CLEARANCE/${Date.now().toString().slice(-6)}`;
    setProject(prev => {
      const updatedApprovals = prev.approvals.map(app => {
        if (app.id === approvalId) {
          return {
            ...app,
            status: 'approved' as const,
            statusLabel: 'Approved',
            certificateNo: cert,
            slaDaysRemaining: 0,
            activityLogs: [
              ...app.activityLogs,
              {
                date: new Date().toISOString().split('T')[0],
                actor: 'Government Officer',
                action: 'Clearance Granted & Certificate Dispatched',
                notes: remarks,
              },
            ],
          };
        }
        return app;
      });

      // Unlock downstream items if all dependencies are now approved
      const newlyApprovedIds = new Set(
        updatedApprovals.filter(a => a.status === 'approved').map(a => a.id)
      );

      const resolvedApprovals = updatedApprovals.map(app => {
        if (app.status === 'waiting' && app.dependencies.length > 0) {
          const allDepsMet = app.dependencies.every(depId => newlyApprovedIds.has(depId));
          if (allDepsMet) {
            return {
              ...app,
              status: 'in_progress' as const,
              statusLabel: 'Ready for Review',
              unlockReason: 'All prerequisite statutory approvals completed.',
            };
          }
        }
        return app;
      });

      const updatedProj: Project = {
        ...prev,
        approvals: resolvedApprovals,
        progress: recalculateProgress(resolvedApprovals),
        updatedAt: new Date().toISOString(),
      };
      updateProjectAndPersist(updatedProj);
      return updatedProj;
    });

    showToast(
      'Clearance Order Issued',
      `Approval granted with Certificate No. ${cert}. Downstream stages unlocked.`,
      'success'
    );
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
              ...app.activityLogs,
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
              ...app.activityLogs,
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
            },
            activityLogs: [
              ...app.activityLogs,
              {
                date: new Date().toISOString().split('T')[0],
                actor: 'Government Officer',
                action: `Site inspection scheduled for ${date}`,
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
      'Inspection Scheduled',
      `Joint site inspection logged for ${date}. Applicant notified.`,
      'info'
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

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        selectedOfficerDept,
        setSelectedOfficerDept,
        project,
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
        registerProject,
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
