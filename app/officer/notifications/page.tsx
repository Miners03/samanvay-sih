'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  CalendarCheck2, 
  FileText, 
  ArrowUpRight, 
  Filter,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApprovalIdentities } from '@/hooks/useApprovalIdentities';

export default function OfficerNotificationsPage() {
  const { getUuid } = useApprovalIdentities();
  const [filter, setFilter] = useState<'all' | 'unread' | 'action_required'>('all');

  const [notifications, setNotifications] = useState([
    {
      id: 'notif-off-1',
      title: 'Applicant Response Received — Action Required',
      description: 'Vikramaditya Singhania submitted the requested ZLD effluent flow diagram and dual-stage RO membrane specifications for GreenTech Advanced Battery Manufacturing Unit (Ref: SMV/2026/HR/GGM/APP-00106).',
      time: '14 minutes ago',
      category: 'query_response',
      unread: true,
      priority: 'high',
      link: getUuid('SMV/2026/HR/GGM/APP-00106') ? `/officer/review/${getUuid('SMV/2026/HR/GGM/APP-00106')}?tab=query` : '#',
      linkLabel: 'Review Applicant Clarification'
    },
    {
      id: 'notif-off-2',
      title: 'Unified Inspection Coordinated with Fire Services & Labour DISH',
      description: 'Commonality threshold met (78%). Joint site inspection scheduled for GreenTech IMT Manesar facility on 24-Mar-2026 at 10:30 AM. Parallel checklists active.',
      time: '2 hours ago',
      category: 'inspection',
      unread: true,
      priority: 'high',
      link: '/officer/inspections',
      linkLabel: 'Open Inspection Docket'
    },
    {
      id: 'notif-off-3',
      title: 'Statutory SLA Warning — 8 Days Remaining',
      description: 'DISCOM High Tension 11kV Grid Feasibility Study (Ref: SMV/2026/HR/GGM/APP-00105) has reached Day 7 of 15. Approaching statutory threshold.',
      time: '5 hours ago',
      category: 'sla',
      unread: false,
      priority: 'amber',
      link: '/officer/sla-monitor',
      linkLabel: 'Inspect SLA Docket'
    },
    {
      id: 'notif-off-4',
      title: 'Executive Level 2 Escalation Logged',
      description: 'Director of Industrial Safety has logged an inquiry regarding corridor width clearance for Factory Registration filing SMV/2026/HR/GGM/APP-00107.',
      time: '1 day ago',
      category: 'escalation',
      unread: false,
      priority: 'critical',
      link: '/officer/escalations',
      linkLabel: 'View Escalation File'
    },
    {
      id: 'notif-off-5',
      title: 'New Filing Allocated to Desk',
      description: 'New greenfield pre-establishment filing allocated from State Single Window: SunVolt CleanEnergy Unit (Ref: SMV/2026/HR/GGM/APP-00114).',
      time: '2 days ago',
      category: 'new_app',
      unread: false,
      priority: 'normal',
      link: '/officer/queue',
      linkLabel: 'View Scrutiny Queue'
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
    if (filter === 'action_required') return n.priority === 'high' || n.priority === 'critical';
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
              Officer Notification Desk
            </h1>
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Statutory docket movements, applicant responses, inspection schedules, and SLA alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gov-blue-primary bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors"
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
              ? 'bg-gov-blue-primary text-white'
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
              ? 'bg-gov-blue-primary text-white'
              : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('action_required')}
          className={cn(
            'px-3 py-1.5 rounded-md text-xs font-bold transition-colors',
            filter === 'action_required'
              ? 'bg-gov-blue-primary text-white'
              : 'text-slate-600 hover:bg-slate-100'
          )}
        >
          Immediate Attention ({notifications.filter(n => n.priority === 'high' || n.priority === 'critical').length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={cn(
              'p-4 rounded-lg border transition-all relative',
              item.unread 
                ? 'bg-blue-50/40 border-blue-200 shadow-xs' 
                : 'bg-white border-slate-200 opacity-90 hover:opacity-100'
            )}
          >
            {item.unread && (
              <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-600"></span>
            )}

            <div className="flex items-start gap-3.5">
              <div className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white font-bold',
                item.priority === 'critical' ? 'bg-red-600' :
                item.priority === 'high' ? 'bg-amber-600' :
                item.priority === 'amber' ? 'bg-amber-500' : 'bg-gov-blue-primary'
              )}>
                {item.category === 'query_response' ? <FileText className="w-4 h-4" /> :
                 item.category === 'inspection' ? <CalendarCheck2 className="w-4 h-4" /> :
                 item.category === 'sla' ? <Clock className="w-4 h-4" /> :
                 item.category === 'escalation' ? <AlertTriangle className="w-4 h-4" /> :
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
                    className="inline-flex items-center gap-1 text-xs font-bold text-gov-blue-primary hover:underline"
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

        {filtered.length === 0 && (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-800">No notifications in this filter</p>
            <p className="text-xs text-slate-500 mt-1">All departmental notices have been acknowledged.</p>
          </div>
        )}
      </div>
    </div>
  );
}
