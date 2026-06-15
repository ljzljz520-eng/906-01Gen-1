import { Search, RotateCcw, SlidersHorizontal, Hash, Settings, Cpu, Tag, X } from 'lucide-react';
import type { VersionStatus } from '../types/index';

export interface FilterValues {
  partNumber: string;
  process: string;
  equipment: string;
  version: string;
  status: VersionStatus[];
}

interface Props {
  value: FilterValues;
  onChange: (v: FilterValues) => void;
  onSearch: () => void;
  onReset: () => void;
  meta: {
    processes: string[];
    equipments: string[];
    statuses: { value: VersionStatus; label: string }[];
  } | null;
  loading?: boolean;
  total?: number;
}

const STATUS_STYLE: Record<VersionStatus, { on: string; off: string }> = {
  ACTIVE: { on: 'bg-emerald-600 border-emerald-700 text-white', off: 'bg-white border-steel-300 text-steel-600 hover:border-emerald-500 hover:text-emerald-700' },
  OBSOLETE: { on: 'bg-red-600 border-red-700 text-white', off: 'bg-white border-steel-300 text-steel-600 hover:border-red-500 hover:text-red-700' },
  SUPERSEDED: { on: 'bg-amber-500 border-amber-600 text-white', off: 'bg-white border-steel-300 text-steel-600 hover:border-amber-500 hover:text-amber-700' },
};

export default function FilterPanel({ value, onChange, onSearch, onReset, meta, loading, total }: Props) {
  const toggleStatus = (s: VersionStatus) => {
    const cur = value.status.includes(s) ? value.status.filter((x) => x !== s) : [...value.status, s];
    onChange({ ...value, status: cur });
  };

  const field = (label: string, icon: React.ReactNode, children: React.ReactNode, delay = 0) => (
    <div style={{ animationDelay: `${delay}ms` }} className="animate-slide-in-left">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-steel-300">
        {icon}
        {label}
      </div>
      {children}
    </div>
  );

  return (
    <aside className="sticky top-16 flex h-[calc(100vh-4rem)] w-72 shrink-0 flex-col border-r border-steel-200 bg-steel-900 text-white shadow-xl">
      <div className="border-b border-steel-800 bg-industrial-950/60 px-5 py-4 diagonal-stripe">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-industrial-300" strokeWidth={2} />
          <div className="font-oswald text-sm font-bold uppercase tracking-widest text-industrial-100">筛选条件</div>
        </div>
        {total !== undefined && (
          <div className="mt-2 font-mono text-[11px] text-industrial-400">
            命中结果：<span className="font-bold text-industrial-200">{total}</span> 份图纸
          </div>
        )}
      </div>

      <div className="scrollbar-industrial flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {field('零件号 / 关键词', <Hash className="h-3.5 w-3.5" strokeWidth={2} />, (
          <div className="relative">
            <input
              value={value.partNumber}
              onChange={(e) => onChange({ ...value, partNumber: e.target.value })}
              placeholder="如 MOT-GEAR-001"
              className="w-full border border-steel-700 bg-steel-800 px-3 py-2 pr-8 font-mono text-sm text-white placeholder:text-steel-500 focus:border-industrial-500 focus:outline-none focus:ring-1 focus:ring-industrial-500"
            />
            {value.partNumber && (
              <button onClick={() => onChange({ ...value, partNumber: '' })} className="absolute right-2 top-2 text-steel-400 hover:text-white">
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            )}
          </div>
        ), 40)}

        {field('工艺类型', <Settings className="h-3.5 w-3.5" strokeWidth={2} />, (
          <div className="relative">
            <select
              value={value.process}
              onChange={(e) => onChange({ ...value, process: e.target.value })}
              className="w-full appearance-none border border-steel-700 bg-steel-800 px-3 py-2 pr-8 text-sm text-white focus:border-industrial-500 focus:outline-none focus:ring-1 focus:ring-industrial-500"
            >
              <option value="">全部工艺</option>
              {meta?.processes.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-steel-400" />
          </div>
        ), 80)}

        {field('设备型号', <Cpu className="h-3.5 w-3.5" strokeWidth={2} />, (
          <div className="relative">
            <select
              value={value.equipment}
              onChange={(e) => onChange({ ...value, equipment: e.target.value })}
              className="w-full appearance-none border border-steel-700 bg-steel-800 px-3 py-2 pr-8 font-mono text-[13px] text-white focus:border-industrial-500 focus:outline-none focus:ring-1 focus:ring-industrial-500"
            >
              <option value="">全部设备</option>
              {meta?.equipments.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-steel-400" />
          </div>
        ), 120)}

        {field('版本号', <Tag className="h-3.5 w-3.5" strokeWidth={2} />, (
          <div className="relative">
            <input
              value={value.version}
              onChange={(e) => onChange({ ...value, version: e.target.value })}
              placeholder="如 Rev.C 或 C"
              className="w-full border border-steel-700 bg-steel-800 px-3 py-2 pr-8 font-mono text-sm text-white placeholder:text-steel-500 focus:border-industrial-500 focus:outline-none focus:ring-1 focus:ring-industrial-500"
            />
            {value.version && (
              <button onClick={() => onChange({ ...value, version: '' })} className="absolute right-2 top-2 text-steel-400 hover:text-white">
                <X className="h-4 w-4" strokeWidth={2} />
              </button>
            )}
          </div>
        ), 160)}

        {field('版本状态', <Tag className="h-3.5 w-3.5" strokeWidth={2} />, (
          <div className="flex flex-col gap-2">
            {meta?.statuses.map((s) => {
              const on = value.status.includes(s.value);
              const style = STATUS_STYLE[s.value];
              return (
                <button
                  key={s.value}
                  onClick={() => toggleStatus(s.value)}
                  className={`flex items-center justify-between border px-3 py-1.5 text-xs font-medium transition-all ${on ? style.on : style.off}`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${on ? 'bg-white' : s.value === 'ACTIVE' ? 'bg-status-active' : s.value === 'OBSOLETE' ? 'bg-status-obsolete' : 'bg-status-superseded'}`} />
                    {s.label}
                  </span>
                  {on && <span className="font-mono text-[10px] opacity-80">✓</span>}
                </button>
              );
            })}
          </div>
        ), 200)}
      </div>

      <div className="space-y-2 border-t border-steel-800 bg-steel-950/60 p-4">
        <button
          onClick={onSearch}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 border border-industrial-500 bg-industrial-700 py-2.5 text-sm font-semibold text-white shadow-[0_2px_0_0_#1E3A8A] transition-all hover:bg-industrial-600 disabled:opacity-60"
        >
          <Search className="h-4 w-4" strokeWidth={2} />
          {loading ? '搜索中…' : '执行检索'}
        </button>
        <button
          onClick={onReset}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 border border-steel-600 bg-steel-800 py-2 text-xs font-medium text-steel-200 transition-all hover:bg-steel-700"
        >
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
          重置条件
        </button>
      </div>
    </aside>
  );
}
