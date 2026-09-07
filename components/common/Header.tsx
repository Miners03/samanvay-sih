'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { UserRole } from '@/lib/types';
import { 
  Bell, 
  Building, 
  ShieldCheck, 
  UserCheck, 
  ExternalLink, 
  ChevronDown, 
  Globe, 
  FileText,
  HelpCircle,
  LogOut
} from 'lucide-react';

export const Header: React.FC = () => {
  const { role, setRole, notifications, markNotificationAsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setShowRoleMenu(false);
    if (newRole === 'applicant') {
      router.push('/applicant/dashboard');
    } else if (newRole === 'officer') {
      router.push('/officer/dashboard');
    } else if (newRole === 'admin') {
      router.push('/admin/dashboard');
    }
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'applicant':
        return { label: 'Applicant / Industry Portal', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'officer':
        return { label: 'Government Officer Portal', color: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 'admin':
        return { label: 'Apex Administrative Portal', color: 'bg-purple-100 text-purple-900 border-purple-300' };
    }
  };

  const roleInfo = getRoleBadge();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-[3px] z-40 shadow-sm">
      {/* Top Utility Bar (Gov Standard) */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium tracking-wide">
            Government of India & State Coordination Initiative
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-[11px] text-slate-400">
            National Single Window Coordination Framework
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          {/* Language Toggle Mock */}
          <div className="flex items-center gap-1 text-slate-300 hover:text-white cursor-pointer">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-white">English</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">हिन्दी</span>
          </div>

          {/* Quick Role Switcher for seamless prototype evaluation */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="bg-gov-blue-secondary hover:bg-gov-blue-primary text-white text-[11px] px-2.5 py-0.5 rounded flex items-center gap-1.5 transition-colors border border-blue-400/30"
              title="Switch role for demo evaluation"
            >
              <span>Role: <strong className="capitalize">{role}</strong></span>
              <ChevronDown className="w-3 h-3 text-blue-200" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-xl border border-slate-200 py-1 text-slate-800 z-50">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Active Portal Role
                </div>
                <button
                  onClick={() => handleRoleChange('applicant')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors ${role === 'applicant' ? 'bg-blue-50/70 font-semibold text-gov-blue-secondary' : ''}`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="leading-tight">Applicant Portal</p>
                    <p className="text-[10px] text-slate-500 font-normal">Entrepreneur / Enterprise</p>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleChange('officer')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors ${role === 'officer' ? 'bg-blue-50/70 font-semibold text-gov-blue-secondary' : ''}`}
                >
                  <Building className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="leading-tight">Government Officer</p>
                    <p className="text-[10px] text-slate-500 font-normal">Departmental Scrutiny Desk</p>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-50 transition-colors ${role === 'admin' ? 'bg-blue-50/70 font-semibold text-gov-blue-secondary' : ''}`}
                >
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="leading-tight">Administrator</p>
                    <p className="text-[10px] text-slate-500 font-normal">Single-Window Directorate</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Branding Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Emblem-style Geometric Seal Placeholder (No illegal emblem) */}
          <div className="w-10 h-10 rounded bg-gov-blue-primary text-white flex items-center justify-center font-serif font-black text-xl shadow-inner border border-blue-900 group-hover:bg-gov-blue-secondary transition-colors">
            <span>स</span>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-xl font-black tracking-tight text-gov-blue-primary">
                Samanvay
              </h1>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                समन्वय
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-700 leading-none">
              Integrated Approval &amp; Compliance Management Platform
            </p>
            <p className="text-[10px] text-slate-500 hidden sm:block mt-0.5">
              Simplifying approvals. Coordinating departments. Enabling transparent progress.
            </p>
          </div>
        </Link>

        {/* Right Tools & Role Display */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end">
            <span className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${roleInfo.color}`}>
              {roleInfo.label}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {role === 'applicant' && 'GreenTech CleanEnergy Pvt. Ltd.'}
              {role === 'officer' && 'State Pollution Control Board (SPCB)'}
              {role === 'admin' && 'State Single Window Directorate'}
            </span>
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-600 hover:text-gov-blue-primary hover:bg-slate-100 rounded-md transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Flyout */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-xl border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Notifications &amp; Alerts ({unreadCount})
                  </h3>
                  <Link
                    href="/applicant/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-gov-blue-secondary hover:underline font-medium"
                  >
                    View All
                  </Link>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No new alerts</div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-left transition-colors cursor-pointer hover:bg-slate-50 ${!n.read ? 'bg-blue-50/40' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs font-semibold text-slate-900 leading-tight">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">{n.timeAgo}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">{n.description}</p>
                        {n.department && (
                          <span className="inline-block mt-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {n.department}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Exit / Switch to Login */}
          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-red-700 p-2 rounded hover:bg-red-50 flex items-center gap-1 transition-colors"
            title="Return to Login Gateway"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
