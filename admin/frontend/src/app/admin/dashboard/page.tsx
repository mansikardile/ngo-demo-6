'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileSpreadsheet,
  LogOut,
  PlusCircle,
  Search,
  Filter,
  Bell,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  Building2,
  Download,
  MoreVertical,
  QrCode,
  CheckCircle2,
  Eye,
  Trash2,
} from 'lucide-react';

import StatCards from '@/components/admin/StatCards';
import FunnelVisualizer from '@/components/admin/FunnelVisualizer';
import EventsList, { EventItem } from '@/components/admin/EventsList';
import LeadsTable, { StudentLeadItem } from '@/components/admin/LeadsTable';
import CreateEventModal from '@/components/admin/CreateEventModal';
import QRCodeModal from '@/components/admin/QRCodeModal';
import GoogleSheetsSyncCard from '@/components/admin/GoogleSheetsSyncCard';

interface AdminProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentNav, setCurrentNav] = useState<'overview' | 'events' | 'leads' | 'sync'>('overview');

  // Filter and Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [qrModalEvent, setQrModalEvent] = useState<EventItem | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('katalyst_token');
    if (!token) {
      router.replace('/admin/login');
    }
  }, [router]);

  // Fetch Admin Profile
  const {
    data: admin,
    isLoading: isProfileLoading,
  } = useQuery<AdminProfile>({
    queryKey: ['admin-me'],
    queryFn: async () => {
      const res = await api.get('/auth/me');
      return res.data.data;
    },
    enabled: isClient,
  });

  // Fetch Dashboard Analytics
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      const res = await api.get('/analytics/funnel');
      return res.data.data;
    },
    enabled: isClient,
    refetchInterval: 8000,
  });

  // Fetch Outreach Events
  const { data: eventsData, isLoading: isEventsLoading } = useQuery<EventItem[]>({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await api.get('/events');
      return res.data.data;
    },
    enabled: isClient,
    refetchInterval: 8000,
  });

  // Fetch Student Leads with filters
  const { data: leadsData, isLoading: isLeadsLoading } = useQuery<StudentLeadItem[]>({
    queryKey: ['leads', selectedEventId, selectedStatus, searchQuery],
    queryFn: async () => {
      const res = await api.get('/leads', {
        params: {
          eventId: selectedEventId,
          status: selectedStatus,
          search: searchQuery,
        },
      });
      return res.data.data;
    },
    enabled: isClient,
    refetchInterval: 8000,
  });

  const handleLogout = () => {
    localStorage.removeItem('katalyst_token');
    localStorage.removeItem('katalyst_admin_user');
    router.replace('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-800 font-sans antialiased">
      {/* LEFT SIDEBAR (Skills Fusion Layout) */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 hidden lg:flex">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-rose-500/20">
              K
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
                Katalyst Admin
              </h2>
              <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider mt-0.5 block">
                Outreach & Scholars
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-6">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
                General
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentNav('overview')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    currentNav === 'overview'
                      ? 'bg-rose-50 text-rose-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard Overview</span>
                </button>

                <button
                  onClick={() => setCurrentNav('events')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    currentNav === 'events'
                      ? 'bg-rose-50 text-rose-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Campus Outreach Events</span>
                </button>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 block">
                Scholars & Pipeline
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setCurrentNav('leads')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    currentNav === 'leads'
                      ? 'bg-rose-50 text-rose-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>Candidate Leads</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                    {leadsData?.length || 0}
                  </span>
                </button>

                <button
                  onClick={() => setCurrentNav('sync')}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    currentNav === 'sync'
                      ? 'bg-rose-50 text-rose-700 font-extrabold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Google Sheets Live Sync</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold text-xs flex items-center justify-center">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{admin?.name || 'Admin'}</p>
              <span className="text-[10px] text-rose-600 font-bold uppercase">{admin?.role || 'SUPER_ADMIN'}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-8 h-8 rounded-lg bg-rose-600 text-white font-bold flex items-center justify-center">
              K
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span>Dashboard</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-700 font-bold capitalize">{currentNav}</span>
              </div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
                {currentNav === 'overview' && 'Executive Outreach Command Center'}
                {currentNav === 'events' && 'Campus Outreach & Drive Sessions'}
                {currentNav === 'leads' && 'Candidate Leads & Attribution'}
                {currentNav === 'sync' && 'Google Sheets & Supabase Sync'}
              </h1>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Event Drive</span>
            </button>
          </div>
        </header>

        {/* View Content */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {/* KPI Stats */}
          <StatCards
            analytics={analyticsData}
            data={analyticsData}
            isLoading={isAnalyticsLoading}
          />

          {/* Funnel Visualizer */}
          {analyticsData && (
            <FunnelVisualizer
              funnel={analyticsData.funnel}
              totalLeads={analyticsData.totalLeads}
            />
          )}

          {/* Events Section */}
          {(currentNav === 'overview' || currentNav === 'events') && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Campus Outreach Sessions</h3>
                  <p className="text-xs text-slate-500">Scheduled drives with scannable event QR codes.</p>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Drive</span>
                </button>
              </div>

              <EventsList
                events={eventsData || []}
                isLoading={isEventsLoading}
                onSelectEvent={(event) => {
                  setSelectedEventId(event.id);
                  setCurrentNav('leads');
                }}
                onShowQR={(event) => setQrModalEvent(event)}
              />
            </div>
          )}

          {/* Leads Table Section */}
          {(currentNav === 'overview' || currentNav === 'leads') && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
              <LeadsTable
                leads={leadsData || []}
                isLoading={isLeadsLoading}
                events={eventsData || []}
                selectedEventId={selectedEventId}
                selectedStatus={selectedStatus}
                searchQuery={searchQuery}
                onEventChange={setSelectedEventId}
                onStatusChange={setSelectedStatus}
                onSearchChange={setSearchQuery}
              />
            </div>
          )}

          {/* Google Sheets Sync Card */}
          {(currentNav === 'overview' || currentNav === 'sync') && (
            <GoogleSheetsSyncCard />
          )}
        </main>
      </div>

      {/* MODALS */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <QRCodeModal
        isOpen={!!qrModalEvent}
        onClose={() => setQrModalEvent(null)}
        event={qrModalEvent}
      />
    </div>
  );
}
