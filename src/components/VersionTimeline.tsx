import { User, Calendar, FileText, ArrowRight, Check } from 'lucide-react';
import type { DrawingVersion, VersionStatus } from '../types/index';
import StatusBadge from './StatusBadge';

interface Props {
  versions: DrawingVersion[];
  selectedId?: string;
  onSelect?: (v: DrawingVersion) => void;
}

const LINE_COLOR: Record<VersionStatus, string> = {
  ACTIVE: 'bg-status-active',
  OBSOLETE: 'bg-status-obsolete',
  SUPERSEDED: 'bg-status-superseded',
};
const NODE_COLOR: Record<VersionStatus, string> = {
  ACTIVE: 'bg-status-active border-emerald-800',
  OBSOLETE: 'bg-status-obsolete border-red-900',
  SUPERSEDED: 'bg-status-superseded border-amber-800',
};

export default function VersionTimeline({ versions, selectedId, onSelect }: Props) {
  const fmtSize = (b: number) => {
    if (!b) return '-';
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1024 / 1024).toFixed(2) + ' MB';
  };
  return (
    <div className="relative">
      <div className="absolute left-[22px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-industrial-700 via-steel-300 to-steel-200" />
      <div className="space-y-1">
        {versions.map((v, i) => {
          const selected = v.id === selectedId;
          return (
            <div
              key={v.id}
              onClick={() => onSelect?.(v)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`group relative flex gap-4 rounded-sm border p-4 transition-all animate-slide-in-right cursor-pointer ${
                selected
                  ? 'border-industrial-600 bg-industrial-50/80 shadow-industrial'
                  : 'border-steel-200 bg-white hover:border-industrial-400 hover:bg-industrial-50/40 hover:shadow-sm'
              }`}
            >
              <div className="relative z-10 flex h-11 shrink-0 items-center justify-center">
                <div className={`h-11 w-11 rounded-full border-2 ${NODE_COLOR[v.status]} flex items-center justify-center font-oswald text-lg font-bold text-white shadow-md ${v.status === 'ACTIVE' ? 'animate-breath' : ''}`}>
                  {v.version.replace(/Rev\./, '')}
                </div>
              </div>

              <div className="relative flex flex-1 flex-col gap-2 pl-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-oswald text-base font-bold tracking-wider text-steel-800">{v.version}</div>
                  <StatusBadge status={v.status} pulse={v.status === 'ACTIVE'} size="md" />
                  {v.supersedesVersionId && (
                    <span className="flex items-center gap-1 rounded border border-steel-200 bg-steel-50 px-2 py-0.5 text-[11px] text-steel-500">
                      <ArrowRight className="h-3 w-3" strokeWidth={2} />
                      替代旧版
                    </span>
                  )}
                  {selected && (
                    <span className="flex items-center gap-1 rounded border border-industrial-600 bg-industrial-700 px-2 py-0.5 text-[11px] text-white">
                      <Check className="h-3 w-3" strokeWidth={2} />
                      当前选中
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-steel-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" strokeWidth={2} />
                    发布日期：<span className="font-mono text-steel-700">{v.releaseDate}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" strokeWidth={2} />
                    发布人：<span className="text-steel-700">{v.releasedBy}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" strokeWidth={2} />
                    文件：<span className="font-mono text-steel-700">{v.fileFormat} · {v.pageCount}页 · {fmtSize(v.fileSize)}</span>
                  </span>
                </div>
                {v.changeNotes && (
                  <div className="mt-1 border-l-2 border-industrial-400 bg-steel-50 px-3 py-1.5 text-[12px] leading-relaxed text-steel-700">
                    <span className="font-semibold text-steel-600">变更说明：</span>
                    {v.changeNotes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
