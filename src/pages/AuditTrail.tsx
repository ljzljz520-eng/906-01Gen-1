import { useEffect, useState } from 'react';
import {
  ShieldCheck, Search, Download, Users, FileText, TrendingUp,
  BarChart3, Calendar as CalendarIcon, AlertTriangle, X,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import AuditTable from '../components/AuditTable';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';
import type { DownloadAuditLog } from '../types/index';

interface Filter {
  userName: string;
  partNumber: string;
  version: string;
  from: string;
  to: string;
}

export default function AuditTrail() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [filters, setFilters] = useState<Filter>({ userName: '', partNumber: '', version: '', from: '', to: '' });
  const [applied, setApplied] = useState<Filter>(filters);
  const [logs, setLogs] = useState<DownloadAuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<{ total: number; byUser: any[]; byDrawing: any[]; byDate: any[] }>({
    total: 0, byUser: [], byDrawing: [], byDate: [],
  });

  const fetch = async (f: Filter, p: number) => {
    setLoading(true);
    try {
      const params: any = { page: p, pageSize };
      if (isAdmin && f.userName) params.userName = f.userName;
      if (f.partNumber) params.partNumber = f.partNumber;
      if (f.version) params.version = f.version;
      if (f.from) params.from = f.from;
      if (f.to) params.to = f.to;
      const [{ logs: L, total: T }, S] = await Promise.all([
        api.listAudit(params),
        api.auditStats({ from: f.from, to: f.to }),
      ]);
      setLogs(L);
      setTotal(T);
      setStats(S);
      setApplied(f);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(filters, 1);
  }, []);

  const handleSearch = () => {
    setPage(1);
    fetch(filters, 1);
  };

  const handleReset = () => {
    const empty = { userName: '', partNumber: '', version: '', from: '', to: '' };
    setFilters(empty);
    setPage(1);
    fetch(empty, 1);
  };

  const handleExport = async () => {
    try {
      const body: any = {};
      if (applied.userName) body.userName = applied.userName;
      if (applied.partNumber) body.partNumber = applied.partNumber;
      if (applied.version) body.version = applied.version;
      if (applied.from) body.from = applied.from;
      if (applied.to) body.to = applied.to;
      const res = await api.exportAudit(body) as unknown as Response;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `审计日志-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e.message || '导出失败');
    }
  };

  const maxUser = Math.max(1, ...stats.byUser.map((x) => x.count));
  const maxDrawing = Math.max(1, ...stats.byDrawing.map((x) => x.count));
  const maxDate = Math.max(1, ...stats.byDate.map((x) => x.count));

  return (
    <div className="min-h-screen bg-steel-100">
      <Navbar />

      <div className="border-b border-steel-200 bg-gradient-to-r from-industrial-950 via-industrial-900 to-industrial-950 text-white diagonal-stripe">
        <div className="container py-6">
          <div className="animate-slide-in-right flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-industrial-400 bg-industrial-800">
                <ShieldCheck className="h-6 w-6 text-industrial-200" strokeWidth={2} />
              </div>
              <div>
                <h1 className="font-oswald text-2xl font-bold uppercase tracking-widest text-industrial-50">审计追踪中心</h1>
                <p className="text-xs text-industrial-400">全流程下载溯源 · 水印编码一一匹配 · 合规审计留痕</p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 border-2 border-amber-500 bg-gradient-to-b from-amber-500 to-amber-700 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-[0_3px_0_0_#92400E] transition-all hover:from-amber-400 hover:to-amber-600"
              >
                <Download className="h-4 w-4" strokeWidth={2} />
                导出 CSV 报表
              </button>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<FileText className="h-5 w-5" strokeWidth={2} />} label="总下载次数" value={stats.total} color="industrial" delay={0} />
            <StatCard icon={<Users className="h-5 w-5" strokeWidth={2} />} label="涉及用户" value={stats.byUser.length} color="emerald" delay={60} />
            <StatCard icon={<BarChart3 className="h-5 w-5" strokeWidth={2} />} label="涉及图纸" value={stats.byDrawing.length} color="amber" delay={120} />
            <StatCard icon={<TrendingUp className="h-5 w-5" strokeWidth={2} />} label="活跃天数" value={stats.byDate.length} color="rose" delay={180} />
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="mb-5 rounded-sm border border-steel-200 bg-white p-4 shadow-sm animate-slide-in-up">
          <div className="mb-3 flex items-center gap-2">
            <Search className="h-4 w-4 text-steel-600" strokeWidth={2} />
            <span className="font-oswald text-xs font-bold uppercase tracking-widest text-steel-700">筛选条件</span>
            {!isAdmin && (
              <span className="ml-2 flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] text-amber-700">
                <AlertTriangle className="h-3 w-3" strokeWidth={2} />
                当前账号非管理员，仅可查看您本人的下载记录
              </span>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-5">
            {isAdmin && (
              <Field label="用户名" value={filters.userName} onChange={(v) => setFilters({ ...filters, userName: v })} placeholder="张工程师" />
            )}
            <Field label="零件号" value={filters.partNumber} onChange={(v) => setFilters({ ...filters, partNumber: v })} placeholder="MOT-GEAR-001" mono />
            <Field label="版本" value={filters.version} onChange={(v) => setFilters({ ...filters, version: v })} placeholder="Rev.C" />
            <div>
              <label className="mb-1 block text-xs font-medium text-steel-600">起始日期</label>
              <div className="relative">
                <CalendarIcon className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-steel-400" strokeWidth={2} />
                <input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })}
                  className="w-full border border-steel-300 bg-white py-2 pl-8 pr-6 text-sm focus:border-industrial-600 focus:outline-none focus:ring-1 focus:ring-industrial-600/50" />
                {filters.from && <button onClick={() => setFilters({ ...filters, from: '' })} className="absolute right-1 top-1.5 text-steel-400 hover:text-steel-700"><X className="h-4 w-4" strokeWidth={2} /></button>}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-steel-600">结束日期</label>
              <div className="relative">
                <CalendarIcon className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-steel-400" strokeWidth={2} />
                <input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })}
                  className="w-full border border-steel-300 bg-white py-2 pl-8 pr-6 text-sm focus:border-industrial-600 focus:outline-none focus:ring-1 focus:ring-industrial-600/50" />
                {filters.to && <button onClick={() => setFilters({ ...filters, to: '' })} className="absolute right-1 top-1.5 text-steel-400 hover:text-steel-700"><X className="h-4 w-4" strokeWidth={2} /></button>}
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSearch} className="border-2 border-industrial-800 bg-industrial-700 px-4 py-2 text-sm font-bold text-white shadow-[0_2px_0_0_#172554] transition-colors hover:bg-industrial-600">
              <span className="inline-flex items-center gap-1.5"><Search className="h-4 w-4" strokeWidth={2} /> 应用筛选</span>
            </button>
            <button onClick={handleReset} className="border border-steel-300 bg-white px-4 py-2 text-sm font-medium text-steel-700 transition-colors hover:bg-steel-50">
              重置
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AuditTable
              logs={logs}
              total={total}
              page={page}
              pageSize={pageSize}
              onPageChange={(p) => { setPage(p); fetch(applied, p); }}
              loading={loading}
              showUser={isAdmin}
            />
          </div>

          <div className="space-y-5">
            {isAdmin && (
              <StatPanel title="下载次数排行 · 用户" icon={<Users className="h-4 w-4" strokeWidth={2} />}>
                {stats.byUser.length === 0 ? <Empty /> : stats.byUser.slice(0, 6).map((u, i) => (
                  <BarRow key={u.name} rank={i + 1} name={u.name} sub={u.department} value={u.count} max={maxUser} color="industrial" />
                ))}
              </StatPanel>
            )}
            <StatPanel title="热门图纸 Top" icon={<FileText className="h-4 w-4" strokeWidth={2} />}>
              {stats.byDrawing.length === 0 ? <Empty /> : stats.byDrawing.slice(0, 6).map((d, i) => (
                <BarRow key={d.partNumber} rank={i + 1} name={d.partNumber} sub={`${d.count} 次下载`} value={d.count} max={maxDrawing} color="emerald" mono />
              ))}
            </StatPanel>
            <StatPanel title="按日下载趋势" icon={<TrendingUp className="h-4 w-4" strokeWidth={2} />}>
              {stats.byDate.length === 0 ? <Empty /> : (
                <div className="space-y-2">
                  <div className="flex h-32 items-end gap-1 rounded-sm border border-steel-200 bg-gradient-to-b from-industrial-50/50 to-white p-3">
                    {stats.byDate.map((d) => (
                      <div key={d.date} className="group relative flex-1">
                        <div className="w-full bg-gradient-to-t from-industrial-700 to-industrial-400 transition-all hover:from-industrial-600 hover:to-industrial-300"
                          style={{ height: `${(d.count / maxDate) * 100}%`, minHeight: '4px' }} />
                        <div className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-steel-900 px-2 py-0.5 font-mono text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                          {d.date} · {d.count}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-steel-500">
                    <span>{stats.byDate[0]?.date}</span>
                    <span>↑ {maxDate} 峰值</span>
                    <span>{stats.byDate[stats.byDate.length - 1]?.date}</span>
                  </div>
                </div>
              )}
            </StatPanel>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, mono }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-steel-600">{label}</label>
      <div className="relative">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border border-steel-300 bg-white py-2 px-3 pr-6 text-sm focus:border-industrial-600 focus:outline-none focus:ring-1 focus:ring-industrial-600/50 ${mono ? 'font-mono' : ''}`}
        />
        {value && <button onClick={() => onChange('')} className="absolute right-1 top-1.5 text-steel-400 hover:text-steel-700"><X className="h-4 w-4" strokeWidth={2} /></button>}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, delay }: { icon: React.ReactNode; label: string; value: number; color: string; delay: number }) {
  const map: Record<string, string> = {
    industrial: 'from-industrial-600/90 to-industrial-900 border-industrial-400/60 text-industrial-100',
    emerald: 'from-emerald-600/90 to-emerald-900 border-emerald-400/60 text-emerald-100',
    amber: 'from-amber-600/90 to-amber-900 border-amber-400/60 text-amber-100',
    rose: 'from-rose-600/90 to-rose-900 border-rose-400/60 text-rose-100',
  };
  return (
    <div style={{ animationDelay: `${delay}ms` }} className={`animate-slide-in-up rounded-sm border bg-gradient-to-br p-4 shadow-lg ${map[color]}`}>
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-widest opacity-80">{label}</div>
        <div className="opacity-80">{icon}</div>
      </div>
      <div className="mt-1.5 font-oswald text-3xl font-bold leading-none tracking-wider">{value}</div>
    </div>
  );
}

function StatPanel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-steel-200 bg-white shadow-industrial animate-slide-in-up">
      <div className="flex items-center gap-2 border-b border-steel-200 bg-gradient-to-r from-steel-50 to-white px-4 py-3">
        <span className="text-industrial-700">{icon}</span>
        <h3 className="font-oswald text-xs font-bold uppercase tracking-widest text-steel-800">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function BarRow({ rank, name, sub, value, max, color, mono }: { rank: number; name: string; sub: string; value: number; max: number; color: string; mono?: boolean }) {
  const bg: Record<string, string> = {
    industrial: 'from-industrial-500 to-industrial-700',
    emerald: 'from-emerald-500 to-emerald-700',
  };
  const rankColor = ['bg-amber-400 text-amber-950', 'bg-steel-400 text-steel-950', 'bg-orange-300 text-orange-950'];
  return (
    <div className="mb-2.5 last:mb-0">
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`flex h-5 w-5 shrink-0 items-center justify-center font-mono text-[10px] font-bold ${rankColor[rank - 1] || 'bg-steel-200 text-steel-700'}`}>{rank}</span>
          <div className={`text-sm font-semibold text-steel-800 ${mono ? 'font-mono' : ''}`}>{name}</div>
        </div>
        <div className="font-mono text-xs font-bold text-steel-600">{value}</div>
      </div>
      <div className="ml-7 h-2 rounded-sm bg-steel-100 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${bg[color]} transition-all`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <div className="ml-7 mt-0.5 text-[10px] text-steel-500">{sub}</div>
    </div>
  );
}

function Empty() {
  return <div className="py-4 text-center text-xs text-steel-400">暂无数据</div>;
}
