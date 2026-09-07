'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { UserRole } from '@/lib/types';
import { DEPARTMENTS } from '@/lib/data/departments';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  Mail, 
  Phone, 
  Key, 
  RotateCw, 
  ArrowRight, 
  ShieldAlert, 
  HelpCircle, 
  Sparkles 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { role, setRole, selectedOfficerDept, setSelectedOfficerDept, showToast } = useApp();

  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>('applicant');

  // Applicant form
  const [applicantIdentifier, setApplicantIdentifier] = useState('vikram.singhania@greentechbharat.in');
  const [applicantPassword, setApplicantPassword] = useState('••••••••••••');
  const [applicantCaptcha, setApplicantCaptcha] = useState('7N4K9');

  // Officer form
  const [officerId, setOfficerId] = useState('OFF-HR-SPCB-8841');
  const [officerPassword, setOfficerPassword] = useState('••••••••••••');
  const [officerOtp, setOfficerOtp] = useState('482910');

  // Admin form
  const [adminId, setAdminId] = useState('DIR-SINGLEWINDOW-01');
  const [adminPassword, setAdminPassword] = useState('••••••••••••');
  const [adminOtp, setAdminOtp] = useState('994821');

  // Simulated Captcha Code
  const [captchaCode, setCaptchaCode] = useState('7N4K9');

  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let res = '';
    for (let i = 0; i < 5; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(res);
    setApplicantCaptcha(res);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setRole(activeRoleTab);

    if (activeRoleTab === 'applicant') {
      showToast('Welcome to Samanvay', 'Logged in as Enterprise Applicant. Accessing your project workspace...', 'success');
      router.push('/applicant/dashboard');
    } else if (activeRoleTab === 'officer') {
      showToast('Department Access Granted', `Logged in as Scrutiny Officer. Loading departmental inbox...`, 'info');
      router.push('/officer/queue');
    } else if (activeRoleTab === 'admin') {
      showToast('Apex Administrative Access', 'Logged in as State Single Window Administrator.', 'info');
      router.push('/admin/dashboard');
    }
  };

  const handleQuickDemoAccess = (targetRole: UserRole) => {
    setRole(targetRole);
    setActiveRoleTab(targetRole);
    if (targetRole === 'applicant') {
      router.push('/applicant/dashboard');
    } else if (targetRole === 'officer') {
      router.push('/officer/queue');
    } else if (targetRole === 'admin') {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      {/* Top Banner */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1 flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-wide">
            Government of India &amp; States Single Window Coordination Initiative
          </span>
          <span className="text-[11px] text-slate-400">
            Official Regulatory Framework
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Geometric Seal (No illegal emblem) */}
            <div className="w-11 h-11 rounded bg-gov-blue-primary text-white flex items-center justify-center font-serif font-black text-2xl shadow-inner border border-blue-900">
              <span>स</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="text-2xl font-black tracking-tight text-gov-blue-primary">
                  Samanvay
                </h1>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  समन्वय
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700 leading-none">
                Integrated Approval &amp; Compliance Management Platform
              </p>
              <p className="text-[11px] text-slate-500 hidden sm:block mt-0.5">
                Simplifying approvals. Coordinating departments. Enabling transparent progress.
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Evaluation Demo Mode:</span>
            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold border border-emerald-300">
              Interactive Prototype
            </span>
          </div>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 flex flex-col items-center justify-center">
        {/* Quick 1-Click Role Demonstrator Bar */}
        <div className="w-full mb-6 bg-blue-50/80 border border-blue-200 rounded-lg p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gov-blue-primary font-bold">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Quick 1-Click Persona Access for Evaluators:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleQuickDemoAccess('applicant')}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded transition-all shadow-sm"
            >
              Enter as Applicant
            </button>
            <button
              onClick={() => handleQuickDemoAccess('officer')}
              className="bg-gov-blue-secondary hover:bg-gov-blue-primary text-white font-bold px-3 py-1.5 rounded transition-all shadow-sm"
            >
              Enter as Officer
            </button>
            <button
              onClick={() => handleQuickDemoAccess('admin')}
              className="bg-purple-800 hover:bg-purple-900 text-white font-bold px-3 py-1.5 rounded transition-all shadow-sm"
            >
              Enter as Admin
            </button>
          </div>
        </div>

        {/* The Authentic Form Card */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-govCard w-full max-w-xl overflow-hidden">
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-bold text-center">
            <button
              onClick={() => setActiveRoleTab('applicant')}
              className={`py-3.5 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${activeRoleTab === 'applicant' ? 'bg-white border-b-gov-blue-primary text-gov-blue-primary shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Applicant</span>
            </button>

            <button
              onClick={() => setActiveRoleTab('officer')}
              className={`py-3.5 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${activeRoleTab === 'officer' ? 'bg-white border-b-gov-blue-primary text-gov-blue-primary shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Building2 className="w-4 h-4" />
              <span>Government Officer</span>
            </button>

            <button
              onClick={() => setActiveRoleTab('admin')}
              className={`py-3.5 px-2 flex items-center justify-center gap-1.5 border-b-2 transition-all ${activeRoleTab === 'admin' ? 'bg-white border-b-purple-700 text-purple-900 shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator</span>
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5 text-xs">
            {/* ROLE 1: APPLICANT FORM */}
            {activeRoleTab === 'applicant' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Industry &amp; Enterprise Login
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Access your unified project roadmap, upload vault documents, and resolve scrutiny queries.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    Registered Mobile Number or Email ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={applicantIdentifier}
                      onChange={(e) => setApplicantIdentifier(e.target.value)}
                      placeholder="e.g. entrepreneur@company.com or 98101XXXXX"
                      className="w-full pl-9 p-2.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-gov-blue-secondary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-gov-blue-secondary hover:underline cursor-pointer">
                      Forgot Password?
                    </span>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={applicantPassword}
                      onChange={(e) => setApplicantPassword(e.target.value)}
                      className="w-full pl-9 p-2.5 rounded border border-slate-300 text-xs focus:ring-1 focus:ring-gov-blue-secondary"
                      required
                    />
                  </div>
                </div>

                {/* Captcha Box */}
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Security Captcha</span>
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="text-[11px] text-gov-blue-secondary hover:text-gov-blue-primary flex items-center gap-1 font-semibold"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Refresh Code</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-200 px-4 py-2 rounded text-slate-800 font-mono font-black text-base tracking-widest select-none line-through decoration-slate-400">
                      {captchaCode}
                    </div>
                    <input
                      type="text"
                      value={applicantCaptcha}
                      onChange={(e) => setApplicantCaptcha(e.target.value)}
                      placeholder="Enter text shown"
                      className="flex-1 p-2 rounded border border-slate-300 text-xs uppercase font-mono"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gov-blue-primary hover:bg-gov-blue-secondary text-white font-bold text-xs rounded-md shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Login to Applicant Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>First time establishing an enterprise?</span>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoAccess('applicant')}
                    className="text-gov-blue-secondary font-bold hover:underline"
                  >
                    Register as Applicant
                  </button>
                </div>
              </div>
            )}

            {/* ROLE 2: OFFICER FORM */}
            {activeRoleTab === 'officer' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-gov-blue-primary">
                    <Building2 className="w-4 h-4" />
                    <span>Government Officer Portal</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Authorised access only. All activities may be recorded for statutory audit purposes.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    Jurisdiction / Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedOfficerDept}
                    onChange={(e) => setSelectedOfficerDept(e.target.value)}
                    className="w-full p-2.5 rounded border border-slate-300 text-xs bg-white focus:ring-1 focus:ring-gov-blue-secondary"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} ({dept.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    Government Officer Employee ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={officerId}
                    onChange={(e) => setOfficerId(e.target.value)}
                    className="w-full p-2.5 rounded border border-slate-300 text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    Official Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={officerPassword}
                    onChange={(e) => setOfficerPassword(e.target.value)}
                    className="w-full p-2.5 rounded border border-slate-300 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">
                      e-Office Two-Factor OTP (Simulated)
                    </label>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      OTP Sent to Registered NIC Mobile
                    </span>
                  </div>
                  <input
                    type="text"
                    value={officerOtp}
                    onChange={(e) => setOfficerOtp(e.target.value)}
                    className="w-full p-2.5 rounded border border-slate-300 text-xs font-mono tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-md shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Authenticate Officer Access</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ROLE 3: ADMINISTRATOR FORM */}
            {activeRoleTab === 'admin' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="bg-purple-50 border border-purple-200 rounded p-3 text-xs text-purple-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-purple-950">
                    <ShieldAlert className="w-4 h-4 text-purple-800" />
                    <span>State Single Window Administration Portal</span>
                  </div>
                  <p className="text-[11px] text-purple-800">
                    Apex directorate access for cross-departmental coordination, bottleneck overrides, and statutory SLA policy configuration.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    Apex Administrative ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full p-2.5 rounded border border-slate-300 text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    Directorate Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-2.5 rounded border border-slate-300 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800">
                    Hardware Token / TOTP Authenticator (Simulated)
                  </label>
                  <input
                    type="text"
                    value={adminOtp}
                    onChange={(e) => setAdminOtp(e.target.value)}
                    className="w-full p-2.5 rounded border border-slate-300 text-xs font-mono tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs rounded-md shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Authenticate Administration Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Security and Accessibility Assurance */}
        <div className="mt-8 text-center text-xs text-slate-500 space-y-1">
          <p>
            Secure 256-bit TLS Encryption • National Single Window System (NSWS) Technical Alignment
          </p>
          <p className="text-[11px] text-slate-400">
            For assistance with registration, call toll-free Helpline 1800-180-2133 or email support.samanvay@gov.in
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <span>© {new Date().getFullYear()} Samanvay (समन्वय) G2B Regulatory Coordination Platform.</span>
          <span>Designed under Indian Public Digital Infrastructure Guidelines.</span>
        </div>
      </footer>
    </div>
  );
}
