'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { 
  ShieldCheck, 
  Upload, 
  FileText, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Search, 
  Plus, 
  X, 
  Building2 
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function DocumentVaultPage() {
  const { vaultDocuments, addVaultDocument } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New document form
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'Corporate' | 'Land & Building' | 'Environmental' | 'Technical / Engineering' | 'Statutory Licences'>('Corporate');
  const [docNumber, setDocNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const [validUntil, setValidUntil] = useState('2028-12-31');

  const categories = ['All', 'Corporate', 'Land & Building', 'Environmental', 'Technical / Engineering', 'Statutory Licences'];

  const filteredDocs = vaultDocuments.filter((doc) => {
    if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        doc.title.toLowerCase().includes(q) ||
        doc.docNumber.toLowerCase().includes(q) ||
        doc.issuingAuthority.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle) return;

    addVaultDocument({
      title: docTitle,
      category: docCategory,
      docNumber: docNumber || `DOC/REF/${Date.now().toString().slice(-6)}`,
      issuingAuthority: issuingAuthority || 'Government Regulatory Authority',
      issuedDate: new Date().toISOString().split('T')[0],
      validUntil: validUntil || 'Permanent',
      fileSize: '3.8 MB',
      fileFormat: 'PDF (Digital Sign)',
      verified: true,
      isDigiLockerLinked: true,
      linkedDepartmentClearances: ['dept-spcb', 'dept-labour', 'dept-fire'],
    });

    setDocTitle('');
    setDocNumber('');
    setShowUploadModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Enterprise Document Vault"
        subtitle="Single-Upload Multi-Department Repository: Store certified company credentials, engineering blueprints and statutory NOCs once for seamless reuse across all clearances."
        breadcrumbs={[
          { label: 'Dashboard', href: '/applicant/dashboard' },
          { label: 'Document Vault', current: true },
        ]}
        action={
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 bg-gov-blue-secondary hover:bg-gov-blue-primary text-white text-xs font-bold px-4 py-2 rounded shadow hover:shadow-md transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Certified Document</span>
          </button>
        }
      />

      {/* DigiLocker Trust Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-gov-blue-primary text-white rounded-lg p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-lg text-emerald-300">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base">DigiLocker Verified Repository</h3>
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-blue-100 mt-0.5 max-w-2xl">
              All documents in this vault are cryptographically hashed and digitally signed under the Information Technology Act, 2000. Once verified, department officers do not require physical submissions.
            </p>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <span className="text-xs text-blue-200 block">Total Certified Vault Documents</span>
          <span className="text-2xl font-black text-white">{vaultDocuments.length}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded font-semibold whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-gov-blue-primary text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search vault documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 p-1.5 px-3 rounded border border-slate-300 text-xs w-full sm:w-64 focus:ring-1 focus:ring-gov-blue-secondary"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {doc.category}
                </span>
                {doc.verified && (
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    Verified
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2 leading-snug">
                {doc.title}
              </h4>

              <p className="text-xs font-mono text-slate-500 mt-1 truncate">
                {doc.docNumber}
              </p>

              <div className="mt-3 text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Issuer:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[170px]">
                    {doc.issuingAuthority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Validity:</span>
                  <span className="font-medium text-slate-800">{doc.validUntil}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">File Type:</span>
                  <span className="font-mono">{doc.fileFormat} ({doc.fileSize})</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Linked to {doc.linkedDepartmentClearances.length} Clearances
              </span>
              <button
                onClick={() => alert(`Opening secure preview for ${doc.title}...`)}
                className="inline-flex items-center gap-1 text-xs font-bold text-gov-blue-secondary hover:text-gov-blue-primary"
              >
                <Download className="w-3.5 h-3.5" />
                <span>View / Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-lg w-full p-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Upload Certified Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800">Document Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Factory Layout Plan (Fire Escape Revision)"
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Document Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs bg-white"
                >
                  <option value="Corporate">Corporate &amp; Registration</option>
                  <option value="Land & Building">Land &amp; Building Tenure</option>
                  <option value="Environmental">Environmental &amp; Pollution Reports</option>
                  <option value="Technical / Engineering">Technical &amp; Architectural Engineering</option>
                  <option value="Statutory Licences">Statutory Licences &amp; NOCs</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Document / Certificate Reference No.</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="e.g. ARCH/2026/DWG-002"
                  className="w-full p-2.5 rounded border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Issuing Authority / Agency</label>
                <input
                  type="text"
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  placeholder="e.g. Council of Architecture Registered Architect"
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-semibold text-slate-700 mt-2">Upload Signed PDF / CAD Dossier</p>
                <p className="text-[11px] text-slate-500">Supports PDF, DWG, DXF up to 25 MB</p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
