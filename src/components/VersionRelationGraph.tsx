import { ArrowRight, CheckCircle2, AlertTriangle, Ban } from 'lucide-react';
import type { DrawingVersion, VersionStatus } from '../types/index';
import StatusBadge from './StatusBadge';

interface Props {
  chain: DrawingVersion[];
  activeId?: string;
  currentId?: string;
  onSelect?: (v: DrawingVersion) => void;
}

const STATUS_INFO: Record<VersionStatus, { icon: React.ReactNode; border: string; bg: string; glow?: string }> = {
  ACTIVE: {
    icon: <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />,
    border: 'border-emerald-500',
    bg: 'from-emerald-50 to-white',
    glow: 'shadow-[0_0_20px_rgba(5,150,105,0.25)]',
  },
  SUPERSEDED: {
    icon: <ArrowRight className="h-4 w-4" strokeWidth={2.2} />,
    border: 'border-amber-500',
    bg: 'from-amber-50 to-white',
  },
  OBSOLETE: {
    icon: <Ban className="h-4 w-4" strokeWidth={2.2} />,
    border: 'border-red-400',
    bg: 'from-red-50 to-white',
  },
};

export default function VersionRelationGraph({ chain, activeId, currentId, onSelect }: Props) {
  if (!chain.length) {
    return (
      <div className="rounded border border-dashed border-steel-300 bg-white p-8 text-center text-sm text-steel-500">
        <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-amber-500" />
        暂无版本关系数据
      </div>
    );
  }

  return (
    <div className="rounded-sm border border-steel-200 bg-gradient-to-br from-industrial-50/60 to-white p-6 shadow-inner-inset">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-1 bg-industrial-700" />
          <span className="font-oswald text-sm font-bold uppercase tracking-widest text-industrial-800">版本演进链路</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-steel-500">
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-status-active" /> 当前版</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-status-superseded" /> 已替代</span>
          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-status-obsolete" /> 已过期</span>
        </div>
      </div>

      <div className="scrollbar-industrial flex items-center gap-2 overflow-x-auto pb-2">
        {chain.map((v, idx) => {
          const info = STATUS_INFO[v.status];
          const isActive = v.id === activeId;
          const isCur = v.id === currentId;
          return (
            <div key={v.id} className="flex items-center gap-2">
              <div
                onClick={() => onSelect?.(v)}
                className={`group relative w-44 shrink-0 cursor-pointer border-t-2 ${info.border} bg-gradient-to-b ${info.bg} p-3 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg ${isActive ? info.glow || '' : ''} ${isCur ? 'ring-2 ring-industrial-600 ring-offset-2' : ''}`}
              >
                {isActive && (
                  <div className="absolute -top-1 -right-1 rounded bg-emerald-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow animate-breath">
                    在用
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="font-oswald text-xl font-bold tracking-wider text-steel-800">{v.version.replace(/Rev\./, '')}</div>
                  <div className={
                    v.status === 'ACTIVE' ? 'text-emerald-600' :
                    v.status === 'SUPERSEDED' ? 'text-amber-600' : 'text-red-500'
                  }>{info.icon}</div>
                </div>
                <div className="mt-1">
                  <StatusBadge status={v.status} size="sm" />
                </div>
                <div className="mt-2 border-t border-steel-200/80 pt-2 font-mono text-[10px] text-steel-500">
                  {v.releaseDate}
                </div>
                {isCur && (
                  <div className="mt-1 text-[10px] font-semibold text-industrial-700">◀ 您选中的版本</div>
                )}
              </div>
              {idx < chain.length - 1 && (
                <div className="flex shrink-0 items-center gap-1 px-1">
                  <div className="h-0.5 w-6 bg-gradient-to-r from-steel-400 to-steel-300" />
                  <ArrowRight className="h-5 w-5 text-steel-400" strokeWidth={2} />
                  <div className="h-0.5 w-6 bg-gradient-to-r from-steel-300 to-steel-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {activeId && (
        <div className="mt-4 rounded border border-emerald-200 bg-emerald-50/60 px-4 py-2 text-xs text-emerald-800">
          <span className="font-semibold">提示：</span>
          当前在用版本为 <span className="font-mono font-bold">{chain.find((c) => c.id === activeId)?.version}</span>，
          生产与维修环节请以此版本为准，其他版本仅作历史追溯用途。
        </div>
      )}
    </div>
  );
}
