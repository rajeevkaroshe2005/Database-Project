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
      sql: 'SELECT b.id, b.booking_reference, u.email, s.title\nFROM bookings b\nJOIN users u ON b.user_id = u.id\nJOIN services s ON b.parent_type = s.parent_type\nWHERE b.status = \'confirmed\'\nLIMIT 10;'
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
      return { label: type, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', desc: 'O(1) Unique Key Lookup' };
    }
    if (t === 'ref') {
      return { label: type, color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', desc: 'Non-unique B-Tree Index Scan' };
    }
    if (t === 'range') {
      return { label: type, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', desc: 'B-Tree Index Range Scan' };
    }
    if (t === 'index') {
      return { label: type, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', desc: 'Full Index Tree Scan' };
    }
    if (t === 'all') {
      return { label: type, color: 'bg-red-500/20 text-red-300 border-red-500/30', desc: 'Full Table Sequential Scan' };
    }
    return { label: type || 'N/A', color: 'bg-white/10 text-[#38342F] border-[#E8DFD1]', desc: 'Custom Scan' };
  };

  return (
    <div className="space-y-6">
      {/* Console Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-space-900 to-cyan-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-black text-[#171513]">Interactive SQL Console & EXPLAIN Optimizer</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
              MySQL 8.0 Engine & Query Cost Analyzer
            </span>
          </div>
          <p className="text-xs text-[#38342F] mt-1 max-w-2xl leading-relaxed">
            Execute live DQL queries, inspect database views, execute stored procedures, or run MySQL <code className="text-cyan-300 font-mono">EXPLAIN</code> to visualize B-Tree index lookups, examined rows, and execution plan costs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#5C554B]">
          <span>Run shortcut:</span>
          <kbd className="px-2 py-1 rounded bg-white border border-[#E8DFD1] text-cyan-300">Ctrl + Enter</kbd>
        </div>
      </div>

      {/* Preset Queries Bar */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-[#5C554B] mb-2 flex items-center gap-1.5">
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
              className="px-3 py-1.5 rounded-xl glass-panel text-xs font-medium border border-[#E8DFD1] hover:border-cyan-500/40 hover:text-cyan-300 transition-all flex items-center gap-1.5"
            >
              <Database className="w-3 h-3 text-[#B86B4B]" />
              <span>{pq.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SQL Editor Area */}
      <div className="glass-panel rounded-2xl border border-white/15 overflow-hidden shadow-2xl">
        <div className="bg-[#FAF8F3] px-4 py-2.5 border-b border-[#E8DFD1] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#5C554B]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-[#38342F] font-semibold">booksphere_db &gt; Query Editor</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-white/10 text-[#5C554B] hover:text-[#171513]"
              title="Clear Editor"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* EXPLAIN Button */}
            <button
              onClick={handleExplain}
              disabled={explainLoading || loading}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold glass-panel border border-purple-500/40 text-purple-300 hover:text-[#171513] hover:bg-purple-500/20 flex items-center gap-1.5 transition-all shadow-glow-purple"
              title="Inspect query execution plan with EXPLAIN"
            >
              <Search className="w-3.5 h-3.5 text-purple-400" />
              <span>{explainLoading ? 'Analyzing...' : 'Analyze with EXPLAIN'}</span>
            </button>

            {/* Run Query Button */}
            <button
              onClick={handleExecute}
              disabled={loading || explainLoading}
              className="glow-button px-4 py-1.5 rounded-xl text-xs font-bold text-[#171513] flex items-center gap-1.5 shadow-glow-cyan"
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
          className="w-full bg-white p-4 text-xs font-mono text-cyan-300 selection:bg-cyan-500/30 outline-none leading-relaxed resize-y border-none"
          spellCheck={false}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-panel p-4 rounded-2xl border border-red-500/40 bg-red-950/20 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. EXPLAIN EXECUTION PLAN VISUALIZER */}
      {explainResult && (
        <div className="glass-panel rounded-3xl border border-purple-500/30 overflow-hidden space-y-6 p-6 animate-in fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8DFD1] text-xs">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
                <Search className="w-4 h-4 text-purple-300" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-[#171513]">MySQL Query Execution Plan (EXPLAIN Output)</h4>
                <p className="text-[11px] text-[#5C554B]">Analysis of how MySQL Cost-Based Optimizer executes this query</p>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs text-[#5C554B]">
              <span className="flex items-center gap-1 text-cyan-300">
                <Clock className="w-3.5 h-3.5" />
                {explainResult.executionTimeMs} ms
              </span>
              <span>•</span>
              <span className="text-purple-300 font-bold">{explainResult.plan?.length || 0} Plan Step(s)</span>
            </div>
          </div>

          {/* Execution Plan Table */}
          <div className="overflow-x-auto rounded-2xl border border-[#E8DFD1] bg-white/80">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FAF8F3] text-[#5C554B] uppercase text-[10px] tracking-wider border-b border-[#E8DFD1]">
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
              <tbody className="divide-y divide-white/5 text-[11px]">
                {explainResult.plan?.map((step, idx) => {
                  const badge = getAccessTypeBadge(step.type);
                  return (
                    <tr key={idx} className="hover:bg-[#FAF8F3] transition-colors">
                      <td className="p-3 font-bold text-[#171513]">{step.id}</td>
                      <td className="p-3 text-cyan-300">{step.select_type}</td>
                      <td className="p-3 font-bold text-purple-300">{step.table}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${badge.color}`} title={badge.desc}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-3 text-[#5C554B]">{step.possible_keys || 'NULL'}</td>
                      <td className="p-3 font-bold text-emerald-300">{step.key || 'None (Table Scan)'}</td>
                      <td className="p-3 text-[#38342F]">{step.key_len || 'NULL'}</td>
                      <td className="p-3 text-amber-300 font-bold">{step.rows}</td>
                      <td className="p-3 text-[#38342F]">{step.filtered ? `${step.filtered}%` : '100%'}</td>
                      <td className="p-3 font-sans text-[#38342F] max-w-xs truncate" title={step.Extra}>
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
            <div className="bg-white p-4 rounded-2xl border border-[#DDD3C4] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <ShieldCheck className="w-4 h-4 text-[#B86B4B]" />
                <span>Access Type Efficiency</span>
              </div>
              <p className="text-[11px] text-[#38342F] leading-relaxed">
                {explainResult.plan?.[0]?.type === 'ALL'
                  ? '⚠️ Access type is ALL (Full Table Scan). For massive production datasets, add an index on the WHERE filter column to reduce IO.'
                  : '✅ Query utilizes an index scan (ref / eq_ref / range / const), dramatically reducing disk block reads.'}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DDD3C4] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Database className="w-4 h-4 text-purple-400" />
                <span>Chosen Index Key</span>
              </div>
              <div className="font-mono text-xs text-[#171513]">
                {explainResult.plan?.[0]?.key ? (
                  <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {explainResult.plan[0].key}
                  </span>
                ) : (
                  <span className="text-[#5C554B]">No B-Tree Index used</span>
                )}
              </div>
              <p className="text-[11px] text-[#5C554B]">
                The MySQL optimizer selected this key from possible candidates based on cardinality statistics.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DDD3C4] shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Rows Examined Ratio</span>
              </div>
              <div className="text-base font-black text-[#171513] font-mono">
                {explainResult.plan?.[0]?.rows || 0} row(s) inspected
              </div>
              <p className="text-[11px] text-[#5C554B]">
                High filtered percentage with low row examination confirms high query selectivity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. REGULAR DQL QUERY RESULT GRID */}
      {result && (
        <div className="glass-panel rounded-2xl border border-white/15 overflow-hidden space-y-3 p-5 animate-in fade-in">
          {/* Result Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8DFD1] text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-[#171513]">Execution Succeeded</span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-[#38342F] font-mono text-[11px]">
                {result.queryType}
              </span>
            </div>

            <div className="flex items-center gap-3 text-[#5C554B] text-xs font-mono">
              <span className="flex items-center gap-1 text-cyan-300">
                <Clock className="w-3.5 h-3.5" />
                {result.executionTimeMs} ms
              </span>
              <span>•</span>
              <span className="text-[#171513] font-bold">{result.rowCount} rows</span>
            </div>
          </div>

          {/* Table Data */}
          <div className="overflow-x-auto rounded-xl border border-[#E8DFD1] bg-white/70">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] text-[#5C554B] uppercase text-[10px] tracking-wider border-b border-[#E8DFD1] font-mono">
                <tr>
                  {result.columns.map((col, idx) => (
                    <th key={idx} className="p-3 whitespace-nowrap text-cyan-300">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                {result.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[#FAF8F3] transition-colors">
                    {result.columns.map((col, cIdx) => (
                      <td key={cIdx} className="p-3 whitespace-nowrap text-slate-200">
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
