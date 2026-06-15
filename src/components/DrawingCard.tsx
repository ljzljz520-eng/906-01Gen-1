import { Eye, Cpu, Settings, Calendar, Hash } from 'lucide-react';
import type { Drawing } from '../types/index';
import StatusBadge from './StatusBadge';

interface Props {
  drawing: Drawing;
  onClick?: () => void;
  index?: number;
}

export default function DrawingCard({ drawing, onClick, index = 0 }: Props) {
  const { partNumber, name, process, equipmentModel, thumbnail, activeVersion, totalVersions, project, createdAt } = drawing;

  const fmtSize = (b: number) => {
    if (!b) return '-';
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1024 / 1024).toFixed(2) + ' MB';
  };

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
      className="group relative flex cursor-pointer flex-col overflow-hidden border border-steel-200 bg-white shadow-industrial transition-all duration-200 hover:-translate-y-1 hover:border-industrial-600 hover:shadow-industrial-lg animate-slide-in-up"
    >
      <div className="relative h-36 w-full overflow-hidden border-b-2 border-steel-200 bg-industrial-50">
        {thumbnail ? (
          <img src={thumbnail} alt={partNumber} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="hatch-pattern flex h-full w-full items-center justify-center">
            <Hash className="h-12 w-12 text-industrial-400" strokeWidth={1.5} />
          </div>
        )}
        <div className="absolute left-2 top-2 flex items-center gap-1.5">
          {activeVersion && (
            <StatusBadge status={activeVersion.status} pulse={activeVersion.status === 'ACTIVE'} />
          )}
        </div>
        <div className="absolute right-2 top-2 rounded bg-steel-900/85 px-2 py-0.5 font-mono text-[11px] font-bold text-white">
          {totalVersions || 1} 版
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-industrial-700 via-industrial-500 to-industrial-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-mono text-sm font-bold tracking-wide text-industrial-800">{partNumber}</div>
              <div className="mt-0.5 text-[15px] font-semibold leading-snug text-steel-800 line-clamp-1">{name}</div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-steel-600">
          <div className="flex items-center gap-2">
            <Settings className="h-3.5 w-3.5 text-steel-400" strokeWidth={2} />
            <span className="w-10 shrink-0 text-steel-500">工艺</span>
            <span className="rounded bg-steel-100 px-1.5 py-0.5 font-medium text-steel-700">{process}</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-steel-400" strokeWidth={2} />
            <span className="w-10 shrink-0 text-steel-500">设备</span>
            <span className="truncate font-mono text-[11px] text-steel-700">{equipmentModel}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-steel-400" strokeWidth={2} />
            <span className="w-10 shrink-0 text-steel-500">发布</span>
            <span className="font-mono text-steel-700">{createdAt.slice(0, 10)}</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-steel-100 pt-3">
          <div className="text-[11px] text-steel-500">
            所属项目：<span className="font-medium text-steel-700">{project}</span>
          </div>
          <button className="flex items-center gap-1 border border-industrial-700 bg-industrial-800 px-2.5 py-1 text-[11px] font-medium text-white transition-colors group-hover:bg-industrial-700">
            <Eye className="h-3.5 w-3.5" strokeWidth={2} />
            查看
          </button>
        </div>
      </div>
    </div>
  );
}
