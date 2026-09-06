import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Database,
  Sparkles,
  Table
} from 'lucide-react';
import { api } from '../../services/api';

export default function SqlConsole() {
  const [query, setQuery] = useState(
    'SELECT parent_type, COUNT(*) AS total_bookings, SUM(final_amount) AS total_revenue\nFROM bookings\nGROUP BY parent_type\nORDER BY total_revenue DESC;'
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const presetQueries = [
    {
      label: 'GROUP BY & Revenue',
      category: 'Aggregation & DQL',
      sql: 'SELECT parent_type, COUNT(*) AS total_bookings, SUM(final_amount) AS total_revenue\nFROM bookings\nGROUP BY parent_type\nORDER BY total_revenue DESC;'
    },
    {
      label: 'Query View: v_category_analytics',
      category: 'Database View',
      sql: 'SELECT category_group, total_services, total_bookings, total_revenue, avg_rating\nFROM v_category_analytics\nORDER BY total_revenue DESC;'
    },
    {
      label: 'Query View: v_active_services',
      category: 'Database View',
      sql: 'SELECT service_id, title, parent_type, city, base_price, rating, status\nFROM v_active_services\nLIMIT 10;'
    },
    {
      label: 'Filter: Services with Price > 1000',
      category: 'DQL (WHERE)',
      sql: "SELECT id, title, parent_type, city, base_price, rating\nFROM services\nWHERE base_price > 1000\nORDER BY base_price DESC;"
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

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleExecute();
    }
  };

  return (
    <div className="space-y-6">
      {/* Console Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-space-900 to-cyan-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-black text-white">Interactive SQL Query Console</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/30">
              DBMS DQL / View / SP Runner
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Execute queries, evaluate stored procedures, and inspect database views in real time with millisecond latency metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Shortcuts:</span>
          <kbd className="px-2 py-1 rounded bg-space-950 border border-white/10 text-cyan-300">Ctrl + Enter</kbd>
        </div>
      </div>

      {/* Preset Queries Bar */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Quick DBMS Exam / Viva Presets:
        </div>
        <div className="flex flex-wrap gap-2">
          {presetQueries.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(pq.sql);
                setError('');
              }}
              className="px-3 py-1.5 rounded-xl glass-panel text-xs font-medium border border-white/10 hover:border-cyan-500/40 hover:text-cyan-300 transition-all flex items-center gap-1.5"
            >
              <Database className="w-3 h-3 text-cyan-400" />
              <span>{pq.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SQL Editor Area */}
      <div className="glass-panel rounded-2xl border border-white/15 overflow-hidden shadow-2xl">
        <div className="bg-space-900 px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-slate-300 font-semibold">booksphere_db &gt; Query Editor</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white"
              title="Clear Editor"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleExecute}
              disabled={loading}
              className="glow-button px-4 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-glow-cyan"
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
          className="w-full bg-space-950 p-4 text-xs font-mono text-cyan-300 selection:bg-cyan-500/30 outline-none leading-relaxed resize-y border-none"
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

      {/* Query Result Grid */}
      {result && (
        <div className="glass-panel rounded-2xl border border-white/15 overflow-hidden space-y-3 p-5 animate-in fade-in">
          {/* Result Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">Execution Succeeded</span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[11px]">
                {result.queryType}
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-400 text-xs font-mono">
              <span className="flex items-center gap-1 text-cyan-300">
                <Clock className="w-3.5 h-3.5" />
                {result.executionTimeMs} ms
              </span>
              <span>•</span>
              <span className="text-white font-bold">{result.rowCount} rows</span>
            </div>
          </div>

          {/* Table Data */}
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-space-950/70">
            <table className="w-full text-left text-xs">
              <thead className="bg-space-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
                <tr>
                  {result.columns.map((col, idx) => (
                    <th key={idx} className="p-3 whitespace-nowrap text-cyan-300">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                {result.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/5 transition-colors">
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
