'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/common/Header';
import { ApplicantNav } from '@/components/applicant/ApplicantNav';
import { useApp } from '@/lib/context/AppContext';

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, setRole } = useApp();

  useEffect(() => {
    if (role !== 'applicant') {
      setRole('applicant');
    }
  }, [role, setRole]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <ApplicantNav />
      <main className="flex-1 pb-16">
        {children}
      </main>
      
      {/* Gov standard footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Samanvay समन्वय</span>
                <span className="text-slate-500">|</span>
                <span>Government-to-Business (G2B) Unified Regulatory Portal</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                A single digital interface for statutory industrial clearances, time-bound deemed approvals, and inter-departmental synergy.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="hover:text-slate-200 cursor-pointer">Terms of Service</span>
              <span className="text-slate-700">•</span>
              <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
              <span className="text-slate-700">•</span>
              <span className="hover:text-slate-200 cursor-pointer">Hyperlinking Policy</span>
              <span className="text-slate-700">•</span>
              <span className="hover:text-slate-200 cursor-pointer">Help &amp; FAQ</span>
            </div>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Samanvay Single Window Platform. Designed as per Indian Public Digital Infrastructure Standards.</p>
            <p className="mt-1 sm:mt-0">Compliant with GIGW 3.0 &amp; WCAG 2.1 AA Accessibility Guidelines.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
