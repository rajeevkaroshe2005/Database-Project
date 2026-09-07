import React, { useState } from 'react';
import {
  Zap,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Activity,
  Layers,
  ArrowRight,
  Database,
  Cpu
} from 'lucide-react';
import { api } from '../../services/api';

export default function ConcurrencySimulator() {
  const [selectedResource, setSelectedResource] = useState('Flight AI-804 Seat 1A (Business Class)');
  const [concurrencyCount, setConcurrencyCount] = useState(25);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const resourceOptions = [
    'Flight AI-804 Seat 1A (Business Class)',
    'PVR INOX IMAX Laser - Recliner Row A Seat 1',
    'KickOff Pro 7v7 AstroTurf BKC - Slot 07:00 PM',
    'The Azure Bay Cliffside Pool Villa - Ocean Suite'
  ];

  const handleSimulate = async () => {
    setRunning(true);
    setResult(null);
    try {
      const res = await api.simulateConcurrency({
        resourceName: selectedResource,
        concurrencyCount: concurrencyCount
      });
      if (res.success) {
        setResult(res);
      } else {
        alert(res.message || 'Simulation returned failure');
      }
    } catch (err) {
      alert(err.message || 'Simulation failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-[#DDD3C4] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#243B35]">
            <Zap className="w-4 h-4" />
            <span>ACID Concurrency & Row-Level Lock Benchmark</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#171513] mt-1">
            Live Race Condition & Lock Stress Simulator
          </h2>
          <p className="text-xs text-[#38342F] mt-1 max-w-2xl leading-relaxed">
            Simulate dozens of competing sessions requesting the exact same seat at the exact same millisecond. Observe row-level lock acquisition, atomic hold timers, and automatic rollback resolution.
          </p>
        </div>

        <button
          onClick={handleSimulate}
          disabled={running}
          className="btn-primary px-6 py-3 rounded-2xl text-xs font-bold text-[#171513] flex items-center gap-2 shadow-glow-cyan shrink-0 self-start md:self-auto disabled:opacity-50"
        >
          <Play className={"w-4 h-4 fill-white " + (running ? "animate-spin" : "")} />
          <span>{running ? 'Simulating Transactions...' : 'Trigger Race Simulation'}</span>
        </button>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Resource Selector */}
        <div className="bg-white p-5 rounded-2xl border border-[#DDD3C4] shadow-sm space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#5C554B] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#243B35]" />
            Select Highly Contended Target Resource:
          </label>
          <div className="space-y-2">
            {resourceOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedResource(opt)}
                className={"w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all " +
                  (selectedResource === opt
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-glow-cyan"
                    : "glass-panel hover:bg-[#FAF8F3] border-[#E8DFD1] text-[#38342F]")}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Concurrency Level & Engine Settings */}
        <div className="bg-white p-5 rounded-2xl border border-[#DDD3C4] shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#5C554B] flex items-center gap-1.5 mb-3">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Concurrent Competing Transactions:
            </label>
            <div className="flex gap-2">
              {[10, 25, 50].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setConcurrencyCount(num)}
                  className={"flex-1 py-2.5 rounded-xl text-xs font-bold transition-all " +
                    (concurrencyCount === num
                      ? "bg-purple-600 text-[#171513] shadow-glow-purple border border-purple-400"
                      : "glass-panel text-[#5C554B] hover:text-[#171513] border-[#E8DFD1]")}
                >
                  {num} Threads
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#5C554B] mt-2">
              Number of concurrent asynchronous promises dispatched in parallel with zero throttle.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/80 border border-[#E8DFD1] space-y-1.5 text-[11px] font-mono">
            <div className="flex justify-between text-[#5C554B]">
              <span>Isolation Level:</span>
              <span className="text-cyan-300 font-bold">REPEATABLE READ</span>
            </div>
            <div className="flex justify-between text-[#5C554B]">
              <span>Lock Primitive:</span>
              <span className="text-purple-300 font-bold">SELECT ... FOR UPDATE</span>
            </div>
            <div className="flex justify-between text-[#5C554B]">
              <span>Resolution:</span>
              <span className="text-emerald-300 font-bold">First Committer Wins / Conflict 409</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Results Display */}
      {result && (
        <div className="space-y-6 animate-in fade-in">
          {/* Winner Showcase Card */}
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-space-900 to-space-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-glow-emerald">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                    EXCLUSIVE ROW LOCK ACQUIRED
                  </span>
                  <span className="text-xs text-[#5C554B] font-mono">Status: 200 OK</span>
                </div>
                <h3 className="text-base font-extrabold text-[#171513] mt-1">
                  Winner: {result.winner?.userName || 'Transaction #1'} ({result.winner?.transactionId})
                </h3>
                <p className="text-xs text-[#38342F] mt-0.5">
                  Successfully acquired row lock in {result.winner?.latencyMs} ms for target "{result.resourceName}".
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs self-end md:self-auto">
              <div className="text-right">
                <div className="text-[10px] uppercase text-[#5C554B]">Total Conflicts Blocked</div>
                <div className="text-lg font-black text-amber-400">{result.conflictsCount} / {result.totalRequests}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase text-[#5C554B]">Total Run Latency</div>
                <div className="text-lg font-black text-[#243B35]">{result.totalDurationMs} ms</div>
              </div>
            </div>
          </div>

          {/* ACID Guarantee Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#DDD3C4] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-cyan-300">Atomicity (A)</span>
                <ShieldCheck className="w-4 h-4 text-[#243B35]" />
              </div>
              <p className="text-[11px] text-[#38342F] leading-relaxed">
                All changes (seat reserve, invoice creation, ledger entry) committed as 1 single atomic unit or rolled back completely.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DDD3C4] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-purple-300">Consistency (C)</span>
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-[11px] text-[#38342F] leading-relaxed">
                Referential integrity constraints, unique indexes, and check constraints remain 100% valid post-transaction.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DDD3C4] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-300">Isolation (I)</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-[#38342F] leading-relaxed">
                Pessimistic row-level exclusive lock prevents dirty reads, non-repeatable reads, and phantom double-bookings.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#DDD3C4] shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-300">Durability (D)</span>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-[11px] text-[#38342F] leading-relaxed">
                Transaction write-ahead logging (WAL) guarantees committed lock state survives crashes and power outages.
              </p>
            </div>
          </div>

          {/* Competing Transaction Logs Stream */}
          <div className="glass-panel rounded-3xl border border-white/15 overflow-hidden space-y-3 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1] text-xs">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#243B35]" />
                <h4 className="font-bold text-[#171513]">Live Competing Transaction Execution Log</h4>
              </div>
              <span className="text-[#5C554B] font-mono text-[11px]">
                Showing {result.requests?.length || 0} interleaved execution traces
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E8DFD1] bg-white/80 max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FAF8F3] text-[#5C554B] uppercase text-[10px] tracking-wider border-b border-[#E8DFD1] sticky top-0">
                  <tr>
                    <th className="p-3 whitespace-nowrap">Tx ID</th>
                    <th className="p-3 whitespace-nowrap">Simulated User</th>
                    <th className="p-3 whitespace-nowrap">Status Code</th>
                    <th className="p-3 whitespace-nowrap">Lock State</th>
                    <th className="p-3 whitespace-nowrap">Latency</th>
                    <th className="p-3">DBMS Resolution Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-[11px]">
                  {result.requests?.map((req, idx) => {
                    const isWinner = req.status === 200;
                    return (
                      <tr key={idx} className={isWinner ? "bg-emerald-500/10" : "hover:bg-[#FAF8F3] transition-colors"}>
                        <td className="p-3 text-cyan-300 font-bold">{req.txId}</td>
                        <td className="p-3 text-[#38342F]">{req.user}</td>
                        <td className="p-3">
                          <span className={"px-2 py-0.5 rounded text-[10px] font-bold " + (isWinner ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300")}>
                            {req.status} {isWinner ? "OK" : "CONFLICT"}
                          </span>
                        </td>
                        <td className="p-3">
                          {isWinner ? (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              ACQUIRED
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-400">
                              <XCircle className="w-3.5 h-3.5" />
                              BLOCKED
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[#5C554B]">{req.latencyMs} ms</td>
                        <td className="p-3 font-sans text-[#38342F]">
                          {req.message}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
