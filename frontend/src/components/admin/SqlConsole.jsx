import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Database,
  Sparkles,
  Table,
  Search,
  Zap,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { api } from '../../services/api';

export default function SqlConsole() {
  const [query, setQuery] = useState(
    'SELECT parent_type, COUNT(*) AS total_bookings, SUM(final_amount) AS total_revenue\nFROM bookings\nGROUP BY parent_type\nORDER BY total_revenue DESC;'
  );
  const [result, setResult] = useState(null);
  const [explainResult, setExplainResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [error, setError] = useState('');

  const presetQueries = [
    {
      label: 'EXPLAIN: Indexed Key (user_id)',
      category: 'Query Optimization',
      sql: 'SELECT * FROM bookings WHERE user_id = 1;'
    },
    {
      label: 'EXPLAIN: Multi-Table JOIN Plan',
      category: 'Query Optimization',
      sql: "SELECT b.id, b.booking_reference, u.email, s.title\nFROM bookings b\nJOIN users u ON b.user_id = u.id\nJOIN services s ON b.parent_type = s.parent_type\nWHERE b.status = 'confirmed'\nLIMIT 10;"
    },
    {
      label: 'GROUP BY & Revenue Analytics',
      category: 'Aggregation & DQL',
      sql: 'SELECT parent_type, COUNT(*) AS total_bookings, SUM(final_amount) AS total_revenue\nFROM bookings\nGROUP BY parent_type\nORDER BY total_revenue DESC;'
    },
    {
      label: 'Query View: v_category_analytics',
      category: 'Database View',
      sql: 'SELECT category_group, total_services, total_bookings, total_revenue, avg_rating\nFROM v_category_analytics\nORDER BY total_revenue DESC;'
    },
    {
      label: 'Call Procedure: sp_check_availability',
      category: 'Stored Procedure',
      sql: "CALL sp_check_availability(6, '2026-09-10', @available_units, @status);"
    },
    {
      label: 'Call Procedure: sp_apply_coupon',
      category: 'Stored Procedure',
      sql: "CALL sp_apply_coupon('WELCOME10', 1500.00, @discount, @status_msg);"
    }
  ];

  const handleExecute = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setExplainResult(null);
    try {
      const res = await api.executeSqlQuery(query);
      if (res.success) {
        setResult(res);
      } else {
        setError(res.message || 'Execution failed');
        setResult(null);
      }
    } catch (err) {
      setError(err.message || 'SQL Execution error');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!query.trim()) return;
    setExplainLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.explainQuery(query);
      if (res.success) {
        setExplainResult(res);
      } else {
        setError(res.message || 'EXPLAIN execution failed');
        setExplainResult(null);
      }
    } catch (err) {
      setError(err.message || 'EXPLAIN query error');
      setExplainResult(null);
    } finally {
      setExplainLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleExecute();
    }
  };

  const getAccessTypeBadge = (type) => {
    const t = String(type || '').toLowerCase();
    if (t === 'const' || t === 'eq_ref') {
      return { label: type, color: 'bg-[#243B35]/15 text-[#243B35] border border-[#243B35]/30', desc: 'O(1) Unique Key Lookup' };
    }
    if (t === 'ref') {
      return { label: type, color: 'bg-[#2E7D32]/15 text-[#2E7D32] border border-[#2E7D32]/30', desc: 'Non-unique B-Tree Index Scan' };
    }
    if (t === 'range') {
      return { label: type, color: 'bg-[#4A6FA5]/15 text-[#4A6FA5] border border-[#4A6FA5]/30', desc: 'B-Tree Index Range Scan' };
    }
    if (t === 'index') {
      return { label: type, color: 'bg-[#C9A96E]/20 text-[#8C6B28] border border-[#C9A96E]/40', desc: 'Full Index Tree Scan' };
    }
    if (t === 'all') {
      return { label: type, color: 'bg-[#C75B5B]/15 text-[#C75B5B] border border-[#C75B5B]/30', desc: 'Full Table Sequential Scan' };
    }
    return { label: type || 'N/A', color: 'bg-[#F8F6F1] text-[#1E1E1E] border border-[#E5E0D6]', desc: 'Custom Scan' };
  };

  return (
    <div className="space-y-6">
      {/* Console Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5E0D6] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#243B35]" />
            <h3 className="text-lg font-black text-[#1E1E1E] font-serif">Interactive SQL Console & EXPLAIN Optimizer</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#243B35]/10 text-[#243B35] font-mono text-xs font-bold border border-[#243B35]/20">
              MySQL 8.0 Engine & Query Cost Analyzer
            </span>
          </div>
          <p className="text-xs text-[#5E5A54] mt-1 max-w-2xl leading-relaxed">
            Execute live DQL queries, inspect database views, execute stored procedures, or run MySQL <code className="text-[#B86B4B] font-mono font-bold">EXPLAIN</code> to visualize B-Tree index lookups, examined rows, and execution plan costs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#5E5A54]">
          <span>Run shortcut:</span>
          <kbd className="px-2.5 py-1 rounded bg-[#F8F6F1] border border-[#E5E0D6] text-[#B86B4B] font-bold font-mono">Ctrl + Enter</kbd>
        </div>
      </div>

      {/* Preset Queries Bar */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-[#5E5A54] mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#B86B4B]" />
          Quick DBMS Exam & Optimization Presets:
        </div>
        <div className="flex flex-wrap gap-2">
          {presetQueries.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(pq.sql);
                setError('');
              }}
              className="px-3.5 py-2 rounded-xl bg-white text-[#1E1E1E] text-xs font-semibold border border-[#E5E0D6] hover:border-[#B86B4B] hover:text-[#B86B4B] hover:bg-[#F8F6F1] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Database className="w-3 h-3 text-[#B86B4B]" />
              <span>{pq.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SQL Editor Area */}
      <div className="bg-[#171513] rounded-2xl border border-[#3A3630] overflow-hidden shadow-lg">
        <div className="bg-[#211F1B] px-4 py-2.5 border-b border-[#3A3630] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#9E988F]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-[#C9A96E] font-semibold">booksphere_db &gt; Query Editor</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuery('')}
              className="p-1.5 rounded hover:bg-white/10 text-[#9E988F] hover:text-white transition-colors"
              title="Clear Editor"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* EXPLAIN Button */}
            <button
              onClick={handleExplain}
              disabled={explainLoading || loading}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#2A2622] border border-[#C9A96E]/40 text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#171513] flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
              title="Inspect query execution plan with EXPLAIN"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{explainLoading ? 'Analyzing...' : 'Analyze with EXPLAIN'}</span>
            </button>

            {/* Run Query Button */}
            <button
              onClick={handleExecute}
              disabled={loading || explainLoading}
              className="bg-[#B86B4B] hover:bg-[#A35C3E] text-white px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{loading ? 'Executing...' : 'Run Query (⚡)'}</span>
            </button>
          </div>
        </div>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={5}
          placeholder="SELECT * FROM services WHERE ..."
          className="w-full bg-[#171513] p-4 text-xs font-mono text-[#F8F6F1] selection:bg-[#B86B4B]/30 outline-none leading-relaxed resize-y border-none font-medium placeholder-[#6F6A62]"
          spellCheck={false}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl border border-[#C75B5B]/30 bg-[#C75B5B]/10 text-[#C75B5B] text-xs flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. EXPLAIN EXECUTION PLAN VISUALIZER */}
      {explainResult && (
        <div className="bg-white rounded-3xl border border-[#E5E0D6] shadow-sm overflow-hidden space-y-6 p-6 animate-in fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E0D6] text-xs">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#243B35]/10 border border-[#243B35]/20">
                <Search className="w-4 h-4 text-[#243B35]" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#1E1E1E] font-serif">MySQL Query Execution Plan (EXPLAIN Output)</h4>
                <p className="text-[11px] text-[#6F6A62]">Analysis of how MySQL Cost-Based Optimizer executes this query</p>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs text-[#5E5A54]">
              <span className="flex items-center gap-1 text-[#B86B4B] font-bold">
                <Clock className="w-3.5 h-3.5" />
                {explainResult.executionTimeMs} ms
              </span>
              <span>•</span>
              <span className="text-[#243B35] font-bold">{explainResult.plan?.length || 0} Plan Step(s)</span>
            </div>
          </div>

          {/* Execution Plan Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E5E0D6] bg-white">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#F8F6F1] text-[#6F6A62] uppercase text-[10px] font-bold tracking-wider border-b border-[#E5E0D6]">
                <tr>
                  <th className="p-3 whitespace-nowrap">Step (id)</th>
                  <th className="p-3 whitespace-nowrap">Select Type</th>
                  <th className="p-3 whitespace-nowrap">Target Table</th>
                  <th className="p-3 whitespace-nowrap">Access Type</th>
                  <th className="p-3 whitespace-nowrap">Possible Keys</th>
                  <th className="p-3 whitespace-nowrap">Chosen Key (Index)</th>
                  <th className="p-3 whitespace-nowrap">Key Length</th>
                  <th className="p-3 whitespace-nowrap">Examined Rows</th>
                  <th className="p-3 whitespace-nowrap">Filtered (%)</th>
                  <th className="p-3">Extra Optimizer Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6] text-[11px]">
                {explainResult.plan?.map((step, idx) => {
                  const badge = getAccessTypeBadge(step.type);
                  return (
                    <tr key={idx} className="hover:bg-[#F8F6F1]/80 transition-colors text-[#1E1E1E]">
                      <td className="p-3 font-bold text-[#1E1E1E]">{step.id}</td>
                      <td className="p-3 text-[#243B35] font-semibold">{step.select_type}</td>
                      <td className="p-3 font-bold text-[#1E1E1E]">{step.table}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.color}`} title={badge.desc}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-3 text-[#5E5A54]">{step.possible_keys || 'NULL'}</td>
                      <td className="p-3 font-bold text-[#243B35]">{step.key || 'None (Table Scan)'}</td>
                      <td className="p-3 text-[#5E5A54]">{step.key_len || 'NULL'}</td>
                      <td className="p-3 text-[#B86B4B] font-bold">{step.rows}</td>
                      <td className="p-3 text-[#5E5A54]">{step.filtered ? `${step.filtered}%` : '100%'}</td>
                      <td className="p-3 font-sans text-[#5E5A54] max-w-xs truncate" title={step.Extra}>
                        {step.Extra || 'Using where'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Optimizer Insights Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#E5E0D6] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#243B35]">
                <ShieldCheck className="w-4 h-4 text-[#243B35]" />
                <span>Access Type Efficiency</span>
              </div>
              <p className="text-[11px] text-[#5E5A54] leading-relaxed">
                {explainResult.plan?.[0]?.type === 'ALL'
                  ? '⚠️ Access type is ALL (Full Table Scan). For massive production datasets, add an index on the WHERE filter column to reduce IO.'
                  : '✅ Query utilizes an index scan (ref / eq_ref / range / const), dramatically reducing disk block reads.'}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5E0D6] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#B86B4B]">
                <Database className="w-4 h-4 text-[#B86B4B]" />
                <span>Chosen Index Key</span>
              </div>
              <div className="font-mono text-xs text-[#1E1E1E]">
                {explainResult.plan?.[0]?.key ? (
                  <span className="px-2 py-1 rounded bg-[#F8F6F1] text-[#243B35] border border-[#E5E0D6] font-bold">
                    {explainResult.plan[0].key}
                  </span>
                ) : (
                  <span className="text-[#6F6A62]">No B-Tree Index used</span>
                )}
              </div>
              <p className="text-[11px] text-[#6F6A62]">
                The MySQL optimizer selected this key from possible candidates based on cardinality statistics.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5E0D6] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#243B35]">
                <Cpu className="w-4 h-4 text-[#243B35]" />
                <span>Rows Examined Ratio</span>
              </div>
              <div className="text-base font-black text-[#1E1E1E] font-mono">
                {explainResult.plan?.[0]?.rows || 0} row(s) inspected
              </div>
              <p className="text-[11px] text-[#6F6A62]">
                High filtered percentage with low row examination confirms high query selectivity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. REGULAR DQL QUERY RESULT GRID */}
      {result && (
        <div className="bg-white rounded-2xl border border-[#E5E0D6] shadow-sm overflow-hidden space-y-3 p-5 animate-in fade-in">
          {/* Result Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E0D6] text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span className="font-bold text-[#1E1E1E]">Execution Succeeded</span>
              <span className="px-2 py-0.5 rounded bg-[#F8F6F1] text-[#243B35] border border-[#E5E0D6] font-mono text-[11px] font-bold">
                {result.queryType}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[#5E5A54] text-xs font-mono">
              <span className="flex items-center gap-1 text-[#B86B4B] font-bold">
                <Clock className="w-3.5 h-3.5" />
                {result.executionTimeMs} ms
              </span>
              <span>•</span>
              <span className="text-[#1E1E1E] font-bold">{result.rowCount} rows</span>
            </div>
          </div>

          {/* Table Data */}
          <div className="overflow-x-auto rounded-xl border border-[#E5E0D6] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F6F1] text-[#6F6A62] uppercase text-[10px] font-bold tracking-wider border-b border-[#E5E0D6] font-mono">
                <tr>
                  {result.columns.map((col, idx) => (
                    <th key={idx} className="p-3 whitespace-nowrap text-[#243B35]">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D6] font-mono text-[11px]">
                {result.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#F8F6F1]/80 transition-colors">
                    {result.columns.map((col, cIdx) => (
                      <td key={cIdx} className="p-3 whitespace-nowrap text-[#1E1E1E]">
                        {row[col] !== undefined ? String(row[col]) : 'NULL'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
