import type { VersionStatus } from '../types/index';

interface Props {
  status: VersionStatus;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

const CONFIG: Record<VersionStatus, { label: string; classes: string; dot: string; ring?: string }> = {
  ACTIVE: {
    label: '在用',
    classes: 'bg-emerald-50 text-emerald-700 border-emerald-600/30',
    dot: 'bg-status-active',
    ring: 'animate-breath',
  },
  OBSOLETE: {
    label: '过期',
    classes: 'bg-red-50 text-red-700 border-red-600/30',
    dot: 'bg-status-obsolete',
  },
  SUPERSEDED: {
    label: '已替代',
    classes: 'bg-amber-50 text-amber-700 border-amber-600/30',
    dot: 'bg-status-superseded',
  },
};

export default function StatusBadge({ status, size = 'sm', pulse = false }: Props) {
  const cfg = CONFIG[status];
  const sz = size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-none border font-medium tracking-wide ${sz} ${cfg.classes}`}>
      <span className={`relative h-2 w-2 rounded-full ${cfg.dot} ${pulse && cfg.ring ? cfg.ring : ''}`} />
      {cfg.label}
    </span>
  );
}
