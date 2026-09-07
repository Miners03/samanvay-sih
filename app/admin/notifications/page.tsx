'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  CalendarCheck2, 
  ShieldAlert, 
  ArrowUpRight, 
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminNotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  const [notifications, setNotifications] = useState([
    {
      id: 'admin-notif-1',
      title: 'CRITICAL SLA ALERT: SPCB Consent to Establish Approaching Deemed Clearance',
      description: 'GreenTech Advanced Battery & Solar Cell Manufacturing Unit (SMV/2026/HR/GGM/APP-00106) has reached Day 12 of 15. Applicant response received; officer scrutiny required within 72 hours.',
      time: '18 minutes ago',
      category: 'sla',
      unread: true,
      priority: 'critical',
      link: '/admin/dashboard',
      linkLabel: 'Open Master Radar'
    },
    {
      id: 'admin-notif-2',
      title: 'Unified Site Inspection Confirmed for IMT Manesar',
      description: 'Fire Services, Pollution Control, and Labour DISH scheduled for joint site inspection on 24-Mar-2026 at 10:30 AM. Commonality score: 78%.',
      time: '3 hours ago',
      category: 'inspection',
      unread: true,
      priority: 'high',
      link: '/admin/inspections',
      linkLabel: 'Inspect Coordinated Schedule'
    },
    {
      id: 'admin-notif-3',
      title: 'Scrutiny Desk Workload Imbalance Detected in Gurugram Sector',
      description: 'Labour DISH scrutiny officer desk has exceeded 85% capacity threshold (26 active dockets). Rebalancing recommended to maintain SLA.',
      time: '6 hours ago',
      category: 'workload',
      unread: false,
      priority: 'amber',
      link: '/admin/workload',
      linkLabel: 'Rebalance Desk Allocation'
    },
    {
      id: 'admin-notif-4',
      title: 'Regulatory Rule v4.0 Activated for Factory Building Approvals',
      description: 'State Directorate of Industrial Safety & Health published updated statutory rule with 21-day expedited SLA benchmark.',
      time: '1 day ago',
      category: 'rules',
      unread: false,
      priority: 'normal',
      link: '/admin/regulatory-rules',
      linkLabel: 'View Rules Matrix'
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? ({ ...n, unread: false }) : n));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return n.unread;
    if (filter === 'critical') return n.priority === 'critical';
    return true;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              State Administrative Notification Hub
            </h1>
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Systemic SLA warnings, cross-department coordination alerts, and deemed approval warnings.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-md transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-bold transition-colors',
            filter === 'all'
              ? 'bg-purple-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-bold transition-colors',
            filter === 'unread'
              ? 'bg-purple-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('critical')}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-bold transition-colors',
            filter === 'critical'
              ? 'bg-red-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          Critical Threats ({notifications.filter(n => n.priority === 'critical').length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={cn(
              'p-4 rounded-lg border transition-all relative',
              item.unread 
                ? 'bg-purple-50/40 border-purple-200 shadow-xs' 
                : 'bg-white border-slate-200 opacity-90 hover:opacity-100'
            )}
          >
            {item.unread && (
              <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-purple-600"></span>
            )}

            <div className="flex items-start gap-3.5">
              <div className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white font-bold',
                item.priority === 'critical' ? 'bg-red-600' :
                item.priority === 'high' ? 'bg-purple-700' :
                item.priority === 'amber' ? 'bg-amber-500' : 'bg-gov-blue-primary'
              )}>
                {item.category === 'sla' ? <Clock className="w-4 h-4" /> :
                 item.category === 'inspection' ? <CalendarCheck2 className="w-4 h-4" /> :
                 item.category === 'workload' ? <AlertTriangle className="w-4 h-4" /> :
                 <Bell className="w-4 h-4" />}
              </div>

              <div className="flex-1 pr-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">{item.title}</h2>
                  <span className="text-[11px] text-slate-400 font-mono">• {item.time}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex items-center gap-4 mt-3">
                  <Link
                    href={item.link}
                    onClick={() => markAsRead(item.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-900 hover:underline"
                  >
                    {item.linkLabel}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  {item.unread && (
                    <button
                      onClick={() => markAsRead(item.id)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 font-medium"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
