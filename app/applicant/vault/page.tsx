'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { PageHeader } from '@/components/common/PageHeader';
import { VaultCategory, DocumentVerificationStatus } from '@/lib/types';
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
  Building2, 
  AlertTriangle, 
  Clock, 
  Eye, 
  HelpCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function DocumentVaultPage() {
  const { vaultDocuments, addVaultDocument } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [inspectingDoc, setInspectingDoc] = useState<any | null>(null);

  // Expiring docs for prominent alert banner
  const expiringDocs = vaultDocuments.filter((doc) => doc.verificationStatus === 'Expiring Soon');

  // New document form state
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<VaultCategory>('Company');
  const [docNumber, setDocNumber] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const [validUntil, setValidUntil] = useState('2028-12-31');
  
  // File upload state & ref
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Exact 8 categories specified in prompt:
  const categories: (VaultCategory | 'All')[] = [
    'All',
    'Company',
    'Land',
    'Project',
    'Financial',
    'Environmental',
    'Licences',
    'Certificates',
    'Inspection Reports',
  ];

  const filteredDocs = vaultDocuments.filter((doc) => {
    if (selectedCategory !== 'All' && doc.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && doc.verificationStatus !== selectedStatus) return false;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

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
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '3.8 MB',
      fileFormat: selectedFile?.name.endsWith('.dwg') ? 'CAD (DWG Dossier)' : 'PDF (Digital Sign)',
      verificationStatus: 'Verified',
      verified: true,
      isDigiLockerLinked: true,
      linkedDepartmentClearances: ['dept-spcb', 'dept-labour', 'dept-fire'],
      usedInApplications: ['Active Application Dockets'],
      smartChecks: {
        isReadable: true,
        pagesPresent: true,
        nameTypeMatch: true,
        signaturePresent: true,
        formatValid: true,
      },
    });

    setDocTitle('');
    setDocNumber('');
    setSelectedFile(null);
    setShowUploadModal(false);
  };

  const getStatusBadge = (status: DocumentVerificationStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            Verified
          </span>
        );
      case 'Expiring Soon':
        return (
          <span className="bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            Expiring Soon
          </span>
        );
      case 'Pending Verification':
        return (
          <span className="bg-blue-50 text-blue-900 border border-blue-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-700" />
            Pending Verification
          </span>
        );
      case 'Expired':
        return (
          <span className="bg-red-50 text-red-900 border border-red-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <X className="w-3 h-3 text-red-700" />
            Expired
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Document Vault"
        subtitle="Universal Verified Dossier: Store company credentials, land titles, and technical blueprints once for instant reuse across all departmental clearances."
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
            <span>Upload Document</span>
          </button>
        }
      />

      {/* Prominent Expiry Alert Banner */}
      {expiringDocs.length > 0 && (
        <div className="bg-amber-50 border-l-4 border-l-amber-500 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-md shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-amber-950 text-sm">
                Building Plan Sanction expires in 18 days — Initiate Renewal
              </p>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Statutory validity expires soon. 2 active applications depend on this clearance. File one-click renewal docket now to avoid suspension.
              </p>
            </div>
          </div>
          <Link
            href="/applicant/renewals"
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded shadow text-xs flex items-center gap-1.5 transition-all"
          >
            <span>Initiate Renewal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Simulated Validation Advisory Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 text-blue-300 rounded-md shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">Simulated Pre-Submission Smart Validation</span>
              <span className="bg-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded">SIMULATED CHECK</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Automated pre-flight checks inspect page counts, digital signatures, legibility, and expiry dates before transmission. (Simulated experience, not real OCR/AI accuracy).
            </p>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-[11px] text-slate-400 block">Total Certified Documents</span>
          <span className="text-xl font-bold text-emerald-400">{vaultDocuments.length} Active Files</span>
        </div>
      </div>

      {/* Category Tabs (Exact 8 Categories) */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-3 text-xs">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-bold text-slate-700 mr-1">Categories:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-md font-semibold text-xs whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-gov-blue-primary text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search document name, category or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 p-1.5 px-3 rounded border border-slate-300 text-xs w-64 focus:ring-1 focus:ring-gov-blue-secondary"
            />
          </div>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-lg border border-slate-200 shadow-gov p-5 flex flex-col justify-between hover:border-slate-300 transition-all space-y-4"
          >
            <div>
              {/* Card Header: Category & Status */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {doc.category}
                </span>
                {getStatusBadge(doc.verificationStatus)}
              </div>

              {/* Title & Reference */}
              <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-2 leading-snug">
                {doc.title}
              </h4>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5 truncate">
                {doc.docNumber}
              </p>

              {/* Metadata Box */}
              <div className="mt-3 bg-slate-50 p-2.5 rounded border border-slate-100 text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Issuing Authority:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[170px] text-[11px]">{doc.issuingAuthority}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Uploaded Date:</span>
                  <span className="font-medium text-slate-800 text-[11px]">{formatDate(doc.issuedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Expiry Date:</span>
                  <span className="font-medium text-slate-800 text-[11px]">{doc.validUntil}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Used in Applications:</span>
                  <span className="font-medium text-gov-blue-secondary text-[11px]">{doc.usedInApplications.length} Dockets</span>
                </div>
              </div>

              {/* Smart Validation Simulation Box */}
              <div className="mt-3 bg-blue-50/60 p-2.5 rounded border border-blue-100 text-[11px] space-y-1.5">
                <span className="font-bold text-gov-blue-primary block flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  Smart Validation Checks:
                </span>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-700">
                  <span className="flex items-center gap-1">✓ Readable OCR Check</span>
                  <span className="flex items-center gap-1">✓ All Pages Present</span>
                  <span className="flex items-center gap-1">✓ Name &amp; Entity Match</span>
                  <span className="flex items-center gap-1">✓ Digital Signature</span>
                </div>

                {/* Expiry Warning Callout */}
                {doc.smartChecks.warningMessage && (
                  <div className="mt-1 bg-amber-100 text-amber-950 p-1.5 rounded text-[10px] font-semibold flex items-center gap-1 border border-amber-300">
                    <AlertTriangle className="w-3 h-3 text-amber-800 shrink-0" />
                    <span>{doc.smartChecks.warningMessage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => setInspectingDoc(doc)}
                className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspection View</span>
              </button>

              <button
                onClick={() => alert(`Downloading verified document ${doc.title}...`)}
                className="text-gov-blue-secondary hover:text-gov-blue-primary font-bold flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Inspecting Doc Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-lg w-full p-6 text-xs space-y-4 animate-in fade-in duration-150">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase bg-slate-100 px-2 py-0.5 rounded">{inspectingDoc.category}</span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{inspectingDoc.title}</h3>
              </div>
              <button onClick={() => setInspectingDoc(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-slate-700">
              <p><strong>Certificate / Document Number:</strong> <span className="font-mono">{inspectingDoc.docNumber}</span></p>
              <p><strong>Issuing Authority:</strong> {inspectingDoc.issuingAuthority}</p>
              <p><strong>File Specifications:</strong> {inspectingDoc.fileFormat} ({inspectingDoc.fileSize})</p>
              <p><strong>Used in Applications:</strong> {inspectingDoc.usedInApplications.join(', ')}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800">Pre-Validation Verification Parameters:</span>
              <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-0.5">
                <li>Cryptographic hash registered with MCA / State Portal.</li>
                <li>Digital signature certificate valid and untampered.</li>
                <li>Legibility resolution exceeds 300 DPI standard.</li>
              </ul>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectingDoc(null)}
                className="px-4 py-2 bg-gov-blue-secondary text-white font-bold rounded"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-lg w-full p-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Upload Certified Document</h3>
              <button 
                onClick={() => {
                  setSelectedFile(null);
                  setShowUploadModal(false);
                }} 
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
                  placeholder="e.g. Factory Premises Sectional Blueprint"
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Document Category (Select 1 of 8)</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded border border-slate-300 text-xs bg-white font-medium"
                >
                  <option value="Company">Company</option>
                  <option value="Land">Land</option>
                  <option value="Project">Project</option>
                  <option value="Financial">Financial</option>
                  <option value="Environmental">Environmental</option>
                  <option value="Licences">Licences</option>
                  <option value="Certificates">Certificates</option>
                  <option value="Inspection Reports">Inspection Reports</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Document Number / Reference</label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="e.g. HSPCB/EIA/2026/099"
                  className="w-full p-2.5 rounded border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800">Issuing Authority / Agency</label>
                <input
                  type="text"
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  placeholder="e.g. NABET Accredited Environmental Auditor"
                  className="w-full p-2.5 rounded border border-slate-300 text-xs"
                />
              </div>

              {/* Clickable Dropzone Area with Label Wrapper & Hidden File Input */}
              <label className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-100 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors block text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.dwg"
                  className="hidden"
                />

                <Upload className="w-8 h-8 text-slate-400 mb-2" />

                {selectedFile ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Selected: {selectedFile.name}</span>
                    <span className="text-slate-400 font-normal">
                      ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-bold text-slate-800">
                      Upload Signed PDF / CAD Dossier
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Supports PDF, DWG up to 25 MB
                    </p>
                  </>
                )}
              </label>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setShowUploadModal(false);
                  }}
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