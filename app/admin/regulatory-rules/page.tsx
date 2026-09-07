'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { RegulatoryRule } from '@/lib/types';
import { 
  BookOpen, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Layers, 
  Eye, 
  History, 
  ToggleLeft, 
  ToggleRight, 
  ShieldCheck, 
  FileText,
  X,
  Search,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminRegulatoryRulesPage() {
  const { regulatoryRules, toggleRegulatoryRule, addRegulatoryRule } = useApp();
  const [filterSector, setFilterSector] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [selectedRuleHistory, setSelectedRuleHistory] = useState<RegulatoryRule | null>(null);

  // New Rule Form State
  const [newRule, setNewRule] = useState({
    sector: 'Renewable Energy & High-Tech Hardware',
    state: 'Haryana',
    department: 'State Pollution Control Board',
    approvalName: '',
    prerequisite: 'Land Title / Allotment Possession',
    requiredDocuments: 'DPR, Technical Layout Drawing, Water Balance Plan',
    slaDays: 21,
    inspectionRequired: true,
    renewalPeriod: '3 Years',
    effectiveDate: new Date().toISOString().split('T')[0],
    version: 'v1.0',
    status: 'active' as const,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.approvalName) {
      alert('Approval name is required');
      return;
    }

    addRegulatoryRule({
      sector: newRule.sector,
      state: newRule.state,
      department: newRule.department,
      approvalName: newRule.approvalName,
      prerequisite: newRule.prerequisite,
      requiredDocuments: newRule.requiredDocuments.split(',').map(d => d.trim()),
      slaDays: Number(newRule.slaDays),
      inspectionRequired: newRule.inspectionRequired,
      renewalPeriod: newRule.renewalPeriod,
      effectiveDate: newRule.effectiveDate,
      version: newRule.version,
      status: 'active',
    });

    setIsAddModalOpen(false);
    setNewRule({
      sector: 'Renewable Energy & High-Tech Hardware',
      state: 'Haryana',
      department: 'State Pollution Control Board',
      approvalName: '',
      prerequisite: 'Land Title / Allotment Possession',
      requiredDocuments: 'DPR, Technical Layout Drawing, Water Balance Plan',
      slaDays: 21,
      inspectionRequired: true,
      renewalPeriod: '3 Years',
      effectiveDate: new Date().toISOString().split('T')[0],
      version: 'v1.0',
      status: 'active',
    });
  };

  const filteredRules = regulatoryRules.filter(r => {
    const matchesSector = filterSector === 'all' || r.sector.toLowerCase().includes(filterSector.toLowerCase());
    const matchesDept = filterDept === 'all' || r.department.toLowerCase().includes(filterDept.toLowerCase());
    const matchesSearch = !searchQuery || 
      r.approvalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.prerequisite.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesDept && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Regulatory Roadmap Rules Engine
            </h1>
            <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded border border-purple-200">
              BACKEND INTELLIGENCE
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Statutory prerequisites, mandated documents, SLAs, and deemed approval rules powering the auto-unlock roadmap engine.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gov-blue-primary hover:bg-gov-blue-secondary text-white text-xs font-bold px-4 py-2 rounded-md shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Regulatory Rule</span>
        </button>
      </div>

      {/* Intelligence Banner */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div className="text-xs text-purple-950 leading-relaxed">
          <strong>Roadmap Rule Engine Core:</strong> These statutory rules define the deterministic graph of clearances. When an applicant selects a sector and project location during onboarding, the platform matches these rules to calculate parallel tracks, sequential locks, and mandatory prerequisite dependencies.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by approval name, prerequisite, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs w-full focus:outline-none text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="text-xs font-semibold p-2 border border-slate-200 rounded bg-white text-slate-700"
          >
            <option value="all">All Departments</option>
            <option value="Pollution">Pollution Control (HSPCB)</option>
            <option value="Fire">Fire & Emergency Services</option>
            <option value="Safety">Labour / DISH</option>
            <option value="Power">DISCOM / Electricity</option>
            <option value="Industries">Industries & Commerce</option>
          </select>

          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="text-xs font-semibold p-2 border border-slate-200 rounded bg-white text-slate-700"
          >
            <option value="all">All Sectors</option>
            <option value="Renewable">Renewable Energy & Battery</option>
            <option value="Engineering">Heavy Engineering</option>
            <option value="Industrial">All Industrial (&gt;50 Workers)</option>
          </select>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gov-blue-primary" />
            Statutory Approval Rules Matrix ({filteredRules.length} Active Rules)
          </h2>
          <span className="text-xs text-slate-500">
            Haryana State Single Window Act 2016 Compliant
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Approval & Sector</th>
                <th className="py-3 px-4">Department & State</th>
                <th className="py-3 px-4">Prerequisite Dependency</th>
                <th className="py-3 px-4">Mandated Docs</th>
                <th className="py-3 px-4">SLA / Inspection</th>
                <th className="py-3 px-4">Renewal / Effective</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4 text-right">Rule Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRules.map((rule) => {
                const isActive = rule.status === 'active';

                return (
                  <tr key={rule.id} className={cn('hover:bg-slate-50 transition-colors', !isActive && 'bg-slate-50/60 opacity-60')}>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{rule.approvalName}</div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{rule.sector}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{rule.department}</div>
                      <span className="text-[10px] text-slate-500 font-mono">{rule.state}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="bg-blue-50 text-gov-blue-primary px-2 py-0.5 rounded font-mono font-bold text-[10px] border border-blue-200">
                        {rule.prerequisite}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-bold text-slate-800">{rule.requiredDocuments.length} Documents</span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px] block" title={rule.requiredDocuments.join(', ')}>
                        {rule.requiredDocuments[0]}, ...
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-slate-900">{rule.slaDays} Days</span>
                      <span className="text-[10px] text-slate-500 block">
                        {rule.inspectionRequired ? 'Site Inspection Mandatory' : 'Desk Clearance Only'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[11px]">
                      <div className="font-medium text-slate-800">{rule.renewalPeriod}</div>
                      <span className="text-[10px] text-slate-400 font-mono">Eff: {rule.effectiveDate}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-600">
                      {rule.version}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedRuleHistory(rule)}
                        className="text-slate-500 hover:text-slate-900 p-1 text-xs font-bold"
                        title="View History & Audit Trail"
                      >
                        <History className="w-3.5 h-3.5 inline" />
                      </button>

                      <button
                        onClick={() => toggleRegulatoryRule(rule.id)}
                        className={cn(
                          'px-2 py-0.5 rounded text-[11px] font-bold transition-colors',
                          isActive 
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-red-100 hover:text-red-800 border border-emerald-300' 
                            : 'bg-slate-200 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                        )}
                      >
                        {isActive ? 'Active' : 'Deactivated'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Rule Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Regulatory Clearance Rule</h3>
                  <p className="text-xs text-slate-500">Configure roadmap prerequisites and statutory rules</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Approval Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hazardous Waste Authorization (HWA)"
                    value={newRule.approvalName}
                    onChange={(e) => setNewRule({ ...newRule, approvalName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Department *</label>
                  <select
                    value={newRule.department}
                    onChange={(e) => setNewRule({ ...newRule, department: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="State Pollution Control Board">State Pollution Control Board</option>
                    <option value="State Fire & Emergency Services">State Fire & Emergency Services</option>
                    <option value="Directorate of Industrial Safety & Health">Labour Dept / DISH</option>
                    <option value="Power Distribution Corporation (DISCOM)">Electricity DISCOM</option>
                    <option value="Town & Country Planning Department">Town & Country Planning</option>
                    <option value="Department of Industries & Commerce">Industries & Commerce</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Sector</label>
                  <input
                    type="text"
                    value={newRule.sector}
                    onChange={(e) => setNewRule({ ...newRule, sector: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">State / Jurisdiction</label>
                  <input
                    type="text"
                    value={newRule.state}
                    onChange={(e) => setNewRule({ ...newRule, state: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prerequisite Clearance</label>
                  <input
                    type="text"
                    placeholder="e.g. SPCB Consent to Establish (CTE)"
                    value={newRule.prerequisite}
                    onChange={(e) => setNewRule({ ...newRule, prerequisite: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Statutory SLA (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={newRule.slaDays}
                    onChange={(e) => setNewRule({ ...newRule, slaDays: parseInt(e.target.value) || 15 })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Renewal Cycle</label>
                  <input
                    type="text"
                    value={newRule.renewalPeriod}
                    onChange={(e) => setNewRule({ ...newRule, renewalPeriod: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Version Tag</label>
                  <input
                    type="text"
                    value={newRule.version}
                    onChange={(e) => setNewRule({ ...newRule, version: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mandated Documents (comma-separated)
                </label>
                <textarea
                  rows={2}
                  value={newRule.requiredDocuments}
                  onChange={(e) => setNewRule({ ...newRule, requiredDocuments: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="inspReq"
                  checked={newRule.inspectionRequired}
                  onChange={(e) => setNewRule({ ...newRule, inspectionRequired: e.target.checked })}
                  className="rounded border-slate-300 text-gov-blue-primary"
                />
                <label htmlFor="inspReq" className="font-bold text-slate-700">
                  Mandatory on-site physical inspection before grant
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-gov-blue-primary hover:bg-gov-blue-secondary rounded shadow-xs"
                >
                  Publish Rule to Engine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {selectedRuleHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Regulatory Rule Audit History</h3>
                <p className="text-xs text-slate-500">{selectedRuleHistory.approvalName} ({selectedRuleHistory.version})</p>
              </div>
              <button onClick={() => setSelectedRuleHistory(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Gazette Notification Ref: HR-IND-2024/09</span>
                  <span className="text-slate-500 font-mono">Eff: {selectedRuleHistory.effectiveDate}</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Adopted pursuant to Section 6 of Haryana Single Window Act 2016. Fast-track SLA set to {selectedRuleHistory.slaDays} days.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Previous Version: v2.0 (Archived)</span>
                  <span className="text-slate-500 font-mono">2023-04-01</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Pre-amendment SLA was 45 days. Reduced to {selectedRuleHistory.slaDays} days under Business Reforms Action Plan (BRAP).
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                onClick={() => setSelectedRuleHistory(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
