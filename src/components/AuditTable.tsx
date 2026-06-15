import { ChevronLeft, ChevronRight, FileDown, Search } from 'lucide-react';
import type { DownloadAuditLog } from '../types/index';

interface Props {
  logs: DownloadAuditLog[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  loading?: boolean;
  showUser?: boolean;
}

export default function AuditTable({ logs, total, page, pageSize, onPageChange, loading, showUser = true }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <div className="overflow-hidden rounded-sm border border-steel-200 bg-white shadow-industrial">
      <div className="scrollbar-industrial overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-industrial-900 via-industrial-800 to-industrial-900 text-xs uppercase tracking-wider text-industrial-100">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">下载时间</th>
              {showUser && <th className="px-4 py-3 font-medium">用户名 / 部门</th>}
              <th className="px-4 py-3 font-medium">零件号</th>
              <th className="px-4 py-3 font-medium">版本</th>
              <th className="px-4 py-3 font-medium">IP 地址</th>
              <th className="px-4 py-3 font-medium">水印编码</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-100">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-steel-400">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center">
                    <Search className="h-5 w-5 animate-pulse" strokeWidth={2} />
                  </div>
                  正在加载日志…
                </td>
              </tr>
            )}
            {!loading && logs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-steel-400">
                  <FileDown className="mx-auto mb-2 h-8 w-8 text-steel-300" strokeWidth={1.5} />
                  暂无符合条件的下载记录
                </td>
              </tr>
            )}
            {!loading && logs.map((l, i) => (
              <tr key={l.id} className="transition-colors hover:bg-industrial-50/60">
                <td className="px-4 py-3 font-mono text-xs text-steel-500">{(page - 1) * pageSize + i + 1}</td>
                <td className="px-4 py-3">
                  <div className="font-mono text-xs font-semibold text-steel-800">{l.downloadedAt.replace('T', ' ').slice(0, 19)}</div>
                </td>
                {showUser && (
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-steel-800">{l.userName}</div>
                    <div className="text-[11px] text-steel-500">{l.userDepartment}</div>
                  </td>
                )}
                <td className="px-4 py-3">
                  <span className="font-mono text-xs font-bold text-industrial-800">{l.partNumber}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded border border-steel-300 bg-steel-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-steel-700">{l.version}</span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-steel-600">{l.ipAddress}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-red-50 px-2 py-0.5 font-mono text-[10px] font-bold text-red-700">{l.watermarkCode}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-steel-200 bg-steel-50 px-4 py-3 text-xs text-steel-600">
        <div>
          显示 <span className="font-semibold text-steel-800">{start}</span> - <span className="font-semibold text-steel-800">{end}</span> 条，共 <span className="font-semibold text-steel-800">{total}</span> 条
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="flex h-7 w-7 items-center justify-center border border-steel-300 bg-white transition-colors hover:bg-industrial-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <span className="px-3 font-mono font-semibold text-steel-800">{page} / {totalPages}</span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="flex h-7 w-7 items-center justify-center border border-steel-300 bg-white transition-colors hover:bg-industrial-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
