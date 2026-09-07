'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { 
  Users, 
  RefreshCw, 
  ArrowRightLeft, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  Info,
  Building2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminWorkloadPage() {
  const { officerWorkload, rebalanceOfficerWorkload } = useApp();
  const [selectedSource, setSelectedSource] = useState<string>('off-02');
  const [selectedTarget, setSelectedTarget] = useState<string>('off-01');
  const [transferCount, setTransferCount] = useState<number>(2);
  const [isRebalanceModalOpen, setIsRebalanceModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleRebalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSource === selectedTarget) {
      alert('Source and target officers must be different.');
      return;
    }

    rebalanceOfficerWorkload(selectedSource, selectedTarget, transferCount);
    const sourceObj = officerWorkload.find(o => o.id === selectedSource);
    const targetObj = officerWorkload.find(o => o.id === selectedTarget);

    setToastMessage(`Workload successfully rebalanced: ${transferCount} dockets transferred from ${sourceObj?.name} to ${targetObj?.name}.`);
    setIsRebalanceModalOpen(false);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const totalActiveCases = officerWorkload.reduce((sum, o) => sum + o.activeCases, 0);
  const totalSlaAtRisk = officerWorkload.reduce((sum, o) => sum + (o.slaRiskCases || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Officer Workload & Desk Balance Center
            </h1>
            <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2 py-0.5 rounded border border-purple-200">
              STATE SCRUTINY DISTRIBUTION
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Dynamic scrutiny desk allocation, capacity tracking, and inter-officer rebalancing to prevent SLA bottlenecks.
          </p>
        </div>

        <button
          onClick={() => setIsRebalanceModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gov-blue-primary hover:bg-gov-blue-secondary text-white text-xs font-bold px-4 py-2 rounded-md shadow-sm transition-colors"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Rebalance Desk Allocation</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Statutory Advisory */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950 leading-relaxed">
          <strong>Administrative Reassignment Notice:</strong> Scrutiny desk reallocation is authorized under Haryana Single Window Rules Section 14 to alleviate docket concentration. Real statutory reassignment updates digital sign-off delegations and logs an immutable entry in the state audit trail.
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-l-4 border-l-blue-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Active Dockets</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{totalActiveCases}</p>
          <span className="text-xs text-slate-500 mt-1 block">Assigned across 5 scrutiny officers</span>
        </div>

        <div className="bg-white border-l-4 border-l-amber-500 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dockets at SLA Risk</span>
          <p className="text-2xl font-black text-amber-600 mt-2">{totalSlaAtRisk}</p>
          <span className="text-xs text-slate-500 mt-1 block">Require capacity relief (&le;3 days left)</span>
        </div>

        <div className="bg-white border-l-4 border-l-emerald-600 rounded-lg p-5 shadow-xs border border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Workload Balance Index</span>
          <p className="text-2xl font-black text-emerald-700 mt-2">78.4%</p>
          <span className="text-xs text-emerald-700 mt-1 block">Optimal distribution target: &ge;75%</span>
        </div>
      </div>

      {/* Workload Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-gov overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-gov-blue-primary" />
            Nodal Officer Scrutiny Load & SLA Performance Index
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {officerWorkload.length} Officers Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Officer / Desk</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Active Cases</th>
                <th className="py-3 px-4">SLA Risk Cases</th>
                <th className="py-3 px-4">Avg Processing Time</th>
                <th className="py-3 px-4">Capacity Load</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {officerWorkload.map((officer) => {
                const capacity = officer.maxCapacity || 30;
                const loadPercent = Math.min(100, Math.round((officer.activeCases / capacity) * 100));
                const isOverloaded = loadPercent >= 85;
                const isModerate = loadPercent >= 50 && loadPercent < 85;

                return (
                  <tr key={officer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{officer.name}</div>
                      <span className="text-[10px] text-slate-500">{officer.designation} • {officer.id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{officer.department}</div>
                      <span className="text-[10px] text-slate-400 font-mono">{officer.departmentCode || officer.department}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                      {officer.activeCases}
                      <span className="text-[11px] text-slate-400 font-normal"> / {capacity} max</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {officer.slaRiskCases > 0 ? (
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold text-xs border border-amber-300">
                          {officer.slaRiskCases} dockets
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">0 dockets</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      {officer.avgProcessingDays} Days
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-36">
                        <div className="flex justify-between text-[10px] font-bold mb-1">
                          <span className={isOverloaded ? 'text-red-700' : isModerate ? 'text-amber-700' : 'text-emerald-700'}>
                            {loadPercent}%
                          </span>
                          <span className="text-slate-400">
                            {isOverloaded ? 'Heavy Load' : isModerate ? 'Moderate' : 'Underutilized'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              isOverloaded ? 'bg-red-500' : isModerate ? 'bg-amber-500' : 'bg-emerald-500'
                            )}
                            style={{ width: `${loadPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedSource(officer.id);
                          const target = officerWorkload.find(o => o.id !== officer.id && o.department === officer.department) || 
                                         officerWorkload.find(o => o.id !== officer.id);
                          if (target) setSelectedTarget(target.id);
                          setIsRebalanceModalOpen(true);
                        }}
                        className="text-xs font-bold text-gov-blue-primary hover:underline"
                      >
                        Rebalance
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rebalance Modal */}
      {isRebalanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Rebalance Scrutiny Desk Allocation</h3>
                  <p className="text-xs text-slate-500">Transfer pending dockets to relieve overburdened officers</p>
                </div>
              </div>
              <button
                onClick={() => setIsRebalanceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRebalance} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Source Officer (Relieve Load)
                </label>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded bg-slate-50 focus:ring-1 focus:ring-blue-500"
                >
                  {officerWorkload.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.departmentCode || o.department}) — {o.activeCases} Active Cases ({o.slaRiskCases} at risk)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Officer (Assign Dockets)
                </label>
                <select
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded bg-slate-50 focus:ring-1 focus:ring-blue-500"
                >
                  {officerWorkload.map((o) => (
                    <option key={o.id} value={o.id} disabled={o.id === selectedSource}>
                      {o.name} ({o.departmentCode || o.department}) — {o.activeCases} Active Cases (Capacity: {o.maxCapacity || 30})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Number of Dockets to Reassign
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={transferCount}
                  onChange={(e) => setTransferCount(parseInt(e.target.value) || 1)}
                  className="w-full text-xs font-semibold p-2.5 border border-slate-300 rounded bg-white"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Prioritizes dockets without scheduled physical inspections to maintain continuity.
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
                <span className="font-bold text-slate-800 block mb-1">Audit Trail Confirmation</span>
                Reassignment reason: <em>Workload balancing to mitigate statutory Deemed Approval default risk.</em>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRebalanceModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-gov-blue-primary hover:bg-gov-blue-secondary rounded shadow-xs"
                >
                  Confirm Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
