import React, { useState, useEffect } from 'react';
import {
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  Percent,
  Calendar,
  Layers,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  FileText,
  Activity,
  Search,
  RefreshCw,
  Database,
  Table,
  Code,
  Terminal,
  Share2,
  Download,
  Zap,
  BookOpen
} from 'lucide-react';
import { api } from '../../services/api';
import SqlConsole from './SqlConsole';
import ErDiagramViewer from './ErDiagramViewer';
import ConcurrencySimulator from './ConcurrencySimulator';
import NormalizationProofs from './NormalizationProofs';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | services | bookings | audit | database | sql-console | concurrency | normalization | er-diagram
  const [exporting, setExporting] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [dbData, setDbData] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Service Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('SPORTS');
  const [newCategory, setNewCategory] = useState('turf');
  const [newCity, setNewCity] = useState('Mumbai');
  const [newPrice, setNewPrice] = useState(1200);
  const [newUnit, setNewUnit] = useState('per hour');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, servicesRes, bookingsRes, auditRes, dbRes] = await Promise.all([
        api.getAdminAnalytics(),
        api.getServices(),
        api.getAllBookings(),
        api.getAuditLogs(),
        api.getDatabaseExplorer()
      ]);

      if (analyticsRes.success) setAnalytics(analyticsRes.data);
      if (servicesRes.success) setServices(servicesRes.data || []);
      if (bookingsRes.success) setBookings(bookingsRes.data || []);
      if (auditRes.success) setAuditLogs(auditRes.data || []);
      if (dbRes.success) {
        setDbData(dbRes);
        if (!selectedTable && dbRes.data && dbRes.data.length > 0) {
          setSelectedTable(dbRes.data[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportSql = async () => {
    setExporting(true);
    try {
      const res = await api.exportSqlDump();
      if (res.success && res.sqlDump) {
        const blob = new Blob([res.sqlDump], { type: 'text/sql;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', res.filename || 'booksphere_database_dump.sql');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert(res.message || 'Failed to export SQL dump');
      }
    } catch (err) {
      alert(err.message || 'Failed to export SQL dump');
    } finally {
      setExporting(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      const res = await api.createService({
        title: newTitle,
        parent_type: newType,
        category_slug: newCategory,
        city: newCity,
        base_price: newPrice,
        price_unit: newUnit
      });
      if (res.success) {
        alert('Service published successfully!');
        setShowAddModal(false);
        setNewTitle('');
        fetchData();
      }
    } catch (err) {
      alert(err.message || 'Failed to create service');
    }
  };

  const handleToggleStatus = async (service) => {
    const nextStatus = service.status === 'active' ? 'inactive' : 'active';
    try {
      await api.updateService(service.id, { status: nextStatus });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.deleteService(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#243B35]">
            <Shield className="w-4 h-4 text-[#243B35]" />
            <span>Platform Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1E1E] mt-1 font-serif tracking-tight">
            Admin Management & Analytics
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportSql}
            disabled={exporting}
            className="p-2.5 rounded-xl bg-[#243B35] text-white hover:bg-[#1B2D29] border border-[#243B35] flex items-center gap-2 text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            title="Download full MySQL DDL Schema + DML Inserts .sql dump"
          >
            <Download className={`w-3.5 h-3.5 text-[#C9A96E] ${exporting ? 'animate-bounce' : ''}`} />
            <span>{exporting ? 'Exporting SQL...' : 'Export Database (.sql)'}</span>
          </button>

          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-white text-[#1E1E1E] hover:bg-[#F8F6F1] border border-[#E5E0D6] flex items-center gap-2 text-xs font-bold transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#243B35] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Metrics</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#E5E0D6] pb-3 mb-8 overflow-x-auto">
        {[
          { id: 'analytics', label: 'Analytics & KPIs', icon: TrendingUp },
          { id: 'database', label: '🗄️ Database Tables Explorer', icon: Database },
          { id: 'sql-console', label: '⚡ Live SQL & EXPLAIN Console', icon: Terminal },
          { id: 'concurrency', label: '🏎️ ACID Concurrency Simulator', icon: Zap },
          { id: 'normalization', label: '📐 3NF Proofs & Dictionary', icon: BookOpen },
          { id: 'er-diagram', label: '🕸️ Interactive ER Diagram', icon: Share2 },
          { id: 'services', label: 'Service Inventory & CRUD', icon: Layers },
          { id: 'bookings', label: 'Global Bookings Ledger', icon: FileText },
          { id: 'audit', label: 'Live Database Audit Trail', icon: Activity },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#243B35] text-white shadow-sm font-bold border border-[#243B35]'
                  : 'bg-white text-[#5E5A54] hover:text-[#1E1E1E] hover:bg-[#F8F6F1] border border-[#E5E0D6] font-semibold'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C9A96E]' : 'text-[#6F6A62]'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && !analytics && (
        <div className="py-24 flex flex-col items-center justify-center space-y-4 bg-white rounded-3xl border border-[#E5E0D6] shadow-sm">
          <RefreshCw className="w-10 h-10 text-[#243B35] animate-spin" />
          <div className="text-center">
            <h3 className="text-base font-bold text-[#1E1E1E] font-serif">Loading Platform Data & MySQL Metrics...</h3>
            <p className="text-xs text-[#6F6A62] mt-1 font-semibold">Connecting to Dual-Mode Database Engine & 25 Tables</p>
          </div>
        </div>
      )}

      {/* 1. ANALYTICS TAB */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-sm hover:border-[#C9A96E] transition-all">
              <div className="text-[#6F6A62] text-xs font-bold uppercase tracking-wider flex items-center justify-between mb-1">
                <span>Total Revenue</span>
                <div className="w-7 h-7 rounded-lg bg-[#C9A96E]/15 flex items-center justify-center text-[#C9A96E]">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#1E1E1E] font-serif tracking-tight">
                ₹{analytics.totalRevenue.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-[#243B35] font-semibold mt-1">↑ 18.4% vs last month</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-sm hover:border-[#243B35] transition-all">
              <div className="text-[#6F6A62] text-xs font-bold uppercase tracking-wider flex items-center justify-between mb-1">
                <span>Total Bookings</span>
                <div className="w-7 h-7 rounded-lg bg-[#243B35]/15 flex items-center justify-center text-[#243B35]">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#1E1E1E] font-serif tracking-tight">
                {analytics.totalBookings}
              </div>
              <div className="text-[11px] text-[#B86B4B] font-semibold mt-1">Confirmed reservations</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-sm hover:border-[#B86B4B] transition-all">
              <div className="text-[#6F6A62] text-xs font-bold uppercase tracking-wider flex items-center justify-between mb-1">
                <span>Active Users</span>
                <div className="w-7 h-7 rounded-lg bg-[#B86B4B]/15 flex items-center justify-center text-[#B86B4B]">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#1E1E1E] font-serif tracking-tight">
                {analytics.activeUsers}
              </div>
              <div className="text-[11px] text-[#6F6A62] font-semibold mt-1">Verified accounts</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-sm hover:border-[#243B35] transition-all">
              <div className="text-[#6F6A62] text-xs font-bold uppercase tracking-wider flex items-center justify-between mb-1">
                <span>Occupancy Rate</span>
                <div className="w-7 h-7 rounded-lg bg-[#243B35]/15 flex items-center justify-center text-[#243B35]">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#1E1E1E] font-serif tracking-tight">
                {analytics.occupancyRate}%
              </div>
              <div className="text-[11px] text-[#243B35] font-semibold mt-1">High venue utilization</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#E5E0D6] shadow-sm hover:border-[#B86B4B] transition-all">
              <div className="text-[#6F6A62] text-xs font-bold uppercase tracking-wider flex items-center justify-between mb-1">
                <span>Cancellation Rate</span>
                <div className="w-7 h-7 rounded-lg bg-[#B86B4B]/15 flex items-center justify-center text-[#B86B4B]">
                  <XCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#1E1E1E] font-serif tracking-tight">
                {analytics.cancellationRate}%
              </div>
              <div className="text-[11px] text-[#6F6A62] font-semibold mt-1">Healthy low churn</div>
            </div>
          </div>

          {/* Interactive Chart Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Revenue Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#1E1E1E] uppercase tracking-wider font-serif">
                Revenue by Vertical
              </h3>
              <div className="space-y-3">
                {analytics.categoryBreakdown.map((c, idx) => {
                  const maxRev = Math.max(...analytics.categoryBreakdown.map(x => x.revenue || 1));
                  const pct = Math.round((c.revenue / (maxRev || 1)) * 100);
                  const barColor = idx % 2 === 0 ? 'bg-[#243B35]' : 'bg-[#B86B4B]';

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-[#1E1E1E]">{c.name}</span>
                        <span className="text-[#B86B4B] font-mono font-bold">₹{c.revenue.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-[#F3EFE7] border border-[#E5E0D6] overflow-hidden">
                        <div
                          className={`h-full ${barColor} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.max(8, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Trend Bars */}
            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#1E1E1E] uppercase tracking-wider font-serif">
                Monthly Growth & Booking Trajectory
              </h3>
              <div className="h-48 flex items-end justify-between gap-3 pt-6 border-b border-[#E5E0D6] pb-2">
                {analytics.monthlyTrends.map((m, idx) => {
                  const maxTrend = 450000;
                  const height = Math.round((m.revenue / maxTrend) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="text-[10px] text-[#B86B4B] opacity-0 group-hover:opacity-100 transition-opacity font-mono font-bold">
                        ₹{Math.round(m.revenue / 1000)}k
                      </div>
                      <div
                        className="w-full rounded-t-lg bg-[#243B35] hover:bg-[#B86B4B] transition-all duration-300 shadow-sm"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[11px] text-[#6F6A62] font-medium">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Peak Hours & Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#1E1E1E] uppercase tracking-wider font-serif">
                Peak Booking Windows
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {analytics.peakHours.map((h, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#F8F6F1] border border-[#E5E0D6] text-center">
                    <span className="text-[10px] text-[#6F6A62] font-bold uppercase tracking-wider block">{h.hour}</span>
                    <span className="text-base font-bold text-[#1E1E1E] font-serif mt-1 block">{h.bookings} bookings</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5E0D6] shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-[#1E1E1E] uppercase tracking-wider font-serif">
                Payment Method Share
              </h3>
              <div className="space-y-2.5">
                {analytics.paymentMethods.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-3 rounded-xl bg-[#F8F6F1] border border-[#E5E0D6]">
                    <span className="font-semibold text-[#1E1E1E]">{p.method}</span>
                    <span className="font-mono text-[#B86B4B] font-bold">{p.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SERVICES CRUD TAB */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#5E5A54] font-medium">Manage all bookable services in database</span>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#243B35] hover:bg-[#1B2D29] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#C9A96E]" />
              Add New Service
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E0D6] overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F6F1] text-[#6F6A62] uppercase text-[10px] font-bold tracking-wider border-b border-[#E5E0D6]">
                <tr>
                  <th className="p-4">Service</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6]">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F8F6F1]/80 transition-colors">
                    <td className="p-4 font-bold text-[#1E1E1E] flex items-center gap-2.5">
                      <img src={s.cover_image} className="w-8 h-8 rounded-lg object-cover border border-[#E5E0D6]" />
                      <span>{s.title}</span>
                    </td>
                    <td className="p-4 text-[#B86B4B] font-semibold">{s.parent_type}</td>
                    <td className="p-4 text-[#5E5A54]">{s.city}</td>
                    <td className="p-4 font-mono font-bold text-[#1E1E1E]">₹{s.base_price}</td>
                    <td className="p-4">
                      <span
                        onClick={() => handleToggleStatus(s)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase cursor-pointer transition-colors ${
                          s.status === 'active'
                            ? 'bg-[#243B35]/15 text-[#243B35] border border-[#243B35]/30'
                            : 'bg-[#B86B4B]/15 text-[#B86B4B] border border-[#B86B4B]/30'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleDeleteService(s.id)}
                        className="p-1.5 rounded-lg text-[#C75B5B] hover:bg-red-50 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. GLOBAL BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-[#E5E0D6] overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F6F1] text-[#6F6A62] uppercase text-[10px] font-bold tracking-wider border-b border-[#E5E0D6]">
              <tr>
                <th className="p-4">Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D6]">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#F8F6F1]/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-[#243B35]">{b.booking_ref}</td>
                  <td className="p-4 text-[#1E1E1E] font-medium">{b.customer_name || 'Customer'}</td>
                  <td className="p-4 text-[#5E5A54]">{b.service_title}</td>
                  <td className="p-4 text-[#6F6A62]">{b.scheduled_date}</td>
                  <td className="p-4 font-mono font-bold text-[#1E1E1E]">₹{b.final_amount?.toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        b.status === 'confirmed'
                          ? 'bg-[#243B35]/15 text-[#243B35] border border-[#243B35]/30'
                          : b.status === 'completed'
                          ? 'bg-[#4A6FA5]/15 text-[#4A6FA5] border border-[#4A6FA5]/30'
                          : 'bg-[#B86B4B]/15 text-[#B86B4B] border border-[#B86B4B]/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. AUDIT LOGS TAB */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-[#E5E0D6] overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#E5E0D6] bg-[#F8F6F1] flex justify-between items-center">
            <span className="text-xs font-bold text-[#1E1E1E] uppercase tracking-wider font-serif">
              Immutable MySQL System Audit Trail
            </span>
            <span className="text-[11px] text-[#6F6A62] font-semibold">{auditLogs.length} events logged</span>
          </div>

          <div className="divide-y divide-[#E5E0D6] max-h-[500px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 text-xs hover:bg-[#F8F6F1] transition-colors flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#243B35]/15 text-[#243B35] border border-[#243B35]/30 font-mono text-[10px] font-bold">
                      {log.action_type}
                    </span>
                    <span className="font-semibold text-[#1E1E1E]">Entity: {log.entity_name} #{log.entity_id}</span>
                  </div>
                  <pre className="mt-2 text-[11px] font-mono text-[#1E1E1E] bg-[#F8F6F1] border border-[#E5E0D6] p-2.5 rounded-xl max-w-xl overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
                <div className="text-[10px] text-[#6F6A62] whitespace-nowrap font-medium">
                  {new Date(log.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. DATABASE EXPLORER TAB (25 TABLES) */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          {/* Database System Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-[#E5E0D6] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#243B35]" />
                <span className="text-lg font-black text-[#1E1E1E] font-serif">Database Catalog: booksphere_db</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#243B35]/10 text-[#243B35] font-mono text-xs font-bold border border-[#243B35]/20">
                  MySQL 8.0 / 3NF Normalization
                </span>
              </div>
              <p className="text-xs text-[#5E5A54] max-w-2xl leading-relaxed">
                The database is organized into 25 normalized tables across Authentication, Catalog, Granular Inventory, Booking Engine, Financials, and Audit subsystems.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-[#F8F6F1] px-3.5 py-2 rounded-xl text-center border border-[#E5E0D6]">
                <div className="text-[10px] uppercase text-[#6F6A62] font-bold">Total Tables</div>
                <div className="text-base font-extrabold text-[#1E1E1E]">25</div>
              </div>
              <div className="bg-[#F8F6F1] px-3.5 py-2 rounded-xl text-center border border-[#E5E0D6]">
                <div className="text-[10px] uppercase text-[#6F6A62] font-bold">Triggers</div>
                <div className="text-base font-extrabold text-[#B86B4B]">Active</div>
              </div>
              <div className="bg-[#F8F6F1] px-3.5 py-2 rounded-xl text-center border border-[#E5E0D6]">
                <div className="text-[10px] uppercase text-[#6F6A62] font-bold">ACID Mode</div>
                <div className="text-base font-extrabold text-[#243B35]">Strict</div>
              </div>
            </div>
          </div>

          {/* Table Selector Grid */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#5E5A54] mb-3">
              Select Table to Inspect Schema & Live Rows:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {dbData?.data?.map((tbl) => {
                const isSelected = selectedTable?.name === tbl.name;
                return (
                  <button
                    key={tbl.name}
                    onClick={() => setSelectedTable(tbl)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#243B35] border-[#243B35] text-white shadow-sm'
                        : 'bg-white hover:bg-[#F8F6F1] border-[#E5E0D6] text-[#1E1E1E] shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Table className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C9A96E]' : 'text-[#6F6A62]'}`} />
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#F8F6F1] text-[#6F6A62] border border-[#E5E0D6]'
                      }`}>
                        {tbl.rowCount} rows
                      </span>
                    </div>
                    <div className="text-xs font-bold truncate">{tbl.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Table Detail View */}
          {selectedTable && (
            <div className="bg-white rounded-3xl border border-[#E5E0D6] shadow-sm overflow-hidden space-y-6 p-6">
              {/* Table Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E0D6] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-[#1E1E1E] font-mono">TABLE: {selectedTable.name}</span>
                    <span className="text-xs text-[#6F6A62]">({selectedTable.rowCount} records)</span>
                  </div>
                  <p className="text-xs text-[#5E5A54] mt-0.5">{selectedTable.description}</p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#5E5A54]">File location:</span>
                  <code className="text-[#B86B4B] bg-[#F8F6F1] px-2 py-1 rounded border border-[#E5E0D6] font-mono text-[11px] font-semibold">
                    database/schema.sql
                  </code>
                </div>
              </div>

              {/* Columns / Schema Definitions */}
              <div>
                <h4 className="text-xs font-bold text-[#1E1E1E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-[#243B35]" />
                  Table Columns & Data Types:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTable.columns?.map((col, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#F8F6F1] border border-[#E5E0D6] text-xs font-mono text-[#243B35] font-semibold"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </div>

              {/* Live Table Rows Data Grid */}
              <div>
                <h4 className="text-xs font-bold text-[#1E1E1E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Table className="w-3.5 h-3.5 text-[#243B35]" />
                  Live Data Records in Database:
                </h4>

                <div className="overflow-x-auto rounded-2xl border border-[#E5E0D6] bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8F6F1] text-[#6F6A62] uppercase text-[10px] font-bold tracking-wider border-b border-[#E5E0D6]">
                      <tr>
                        {selectedTable.rows && selectedTable.rows[0] ? (
                          Object.keys(selectedTable.rows[0]).map((key) => (
                            <th key={key} className="p-3 whitespace-nowrap">{key}</th>
                          ))
                        ) : (
                          <th className="p-3">Data</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D6] font-mono text-[11px]">
                      {selectedTable.rows && selectedTable.rows.length > 0 ? (
                        selectedTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[#F8F6F1]/80 transition-colors">
                            {Object.entries(row).map(([k, val], cIdx) => (
                              <td key={cIdx} className="p-3 max-w-xs truncate text-[#1E1E1E]">
                                {typeof val === 'object' && val !== null
                                  ? JSON.stringify(val)
                                  : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="p-4 text-center text-[#6F6A62]" colSpan={5}>
                            No active records in this table currently.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. LIVE SQL QUERY CONSOLE */}
      {activeTab === 'sql-console' && (
        <SqlConsole />
      )}

      {/* 7. CONCURRENCY SIMULATOR */}
      {activeTab === 'concurrency' && (
        <ConcurrencySimulator />
      )}

      {/* 8. NORMALIZATION PROOFS & DATA DICTIONARY */}
      {activeTab === 'normalization' && (
        <NormalizationProofs />
      )}

      {/* 9. INTERACTIVE ER DIAGRAM */}
      {activeTab === 'er-diagram' && (
        <ErDiagramViewer />
      )}

      {/* ADD SERVICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171513]/60 backdrop-blur-sm">
          <form onSubmit={handleCreateService} className="bg-white p-6 rounded-3xl border border-[#E5E0D6] shadow-xl max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-[#1E1E1E] font-serif">Add New Service to Database</h3>

            <div>
              <label className="text-[11px] text-[#5E5A54] font-medium block mb-1">Service Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Apex Tennis Arena"
                className="w-full bg-[#F8F6F1] border border-[#E5E0D6] text-[#1E1E1E] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#B86B4B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-[#5E5A54] font-medium block mb-1">Vertical</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-[#F8F6F1] border border-[#E5E0D6] text-[#1E1E1E] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#B86B4B]"
                >
                  <option value="TRANSPORT">Transport</option>
                  <option value="ENTERTAINMENT">Entertainment</option>
                  <option value="SPORTS">Sports</option>
                  <option value="HOTEL">Hotel</option>
                  <option value="RESTAURANT">Restaurant</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#5E5A54] font-medium block mb-1">City</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="w-full bg-[#F8F6F1] border border-[#E5E0D6] text-[#1E1E1E] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#B86B4B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-[#5E5A54] font-medium block mb-1">Base Price (₹)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-[#F8F6F1] border border-[#E5E0D6] text-[#1E1E1E] rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#B86B4B]"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#5E5A54] font-medium block mb-1">Unit</label>
                <input
                  type="text"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  placeholder="per hour"
                  className="w-full bg-[#F8F6F1] border border-[#E5E0D6] text-[#1E1E1E] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#B86B4B]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-white text-[#5E5A54] hover:bg-[#F8F6F1] border border-[#E5E0D6] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-[#243B35] hover:bg-[#1B2D29] text-white transition-colors shadow-sm"
              >
                Publish Service
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
