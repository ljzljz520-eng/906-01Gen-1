import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileSearch, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import FilterPanel, { FilterValues } from '../components/FilterPanel';
import DrawingCard from '../components/DrawingCard';
import { api } from '../utils/api';
import type { Drawing, MetaOption, VersionStatus } from '../types/index';

export default function DrawingSearch() {
  const [meta, setMeta] = useState<MetaOption | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    partNumber: '', process: '', equipment: '', version: '', status: [] as VersionStatus[],
  });
  const [applied, setApplied] = useState<FilterValues>(filters);
  const [list, setList] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    api.meta().then(setMeta).catch(() => {});
    handleSearch(filters, true);
  }, []);

  const handleSearch = async (f: FilterValues, initial = false) => {
    if (!initial) setLoading(true);
    setErr('');
    try {
      const params: any = {};
      if (f.partNumber) params.partNumber = f.partNumber;
      if (f.process) params.process = f.process;
      if (f.equipment) params.equipment = f.equipment;
      if (f.version) params.version = f.version;
      if (f.status.length > 0) params.status = f.status.join(',');
      const { drawings } = await api.searchDrawings(params);
      setList(drawings);
      setApplied(f);
    } catch (e: any) {
      setErr(e.message || '检索失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-steel-100">
      <Navbar />

      <div className="flex">
        <FilterPanel
          value={filters}
          onChange={setFilters}
          onSearch={() => handleSearch(filters)}
          onReset={() => {
            const empty = { partNumber: '', process: '', equipment: '', version: '', status: [] as VersionStatus[] };
            setFilters(empty);
            handleSearch(empty);
          }}
          meta={meta}
          loading={loading}
          total={list.length}
        />

        <main className="flex-1 min-w-0">
          <div className="border-b border-steel-200 bg-white">
            <div className="container py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="animate-slide-in-right">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center border-2 border-industrial-700 bg-industrial-50">
                      <FileSearch className="h-5 w-5 text-industrial-800" strokeWidth={2} />
                    </div>
                    <div>
                      <h1 className="font-oswald text-xl font-bold uppercase tracking-widest text-steel-800">图纸检索中心</h1>
                      <p className="text-xs text-steel-500">多维度快速定位 · 版本状态实时可视</p>
                    </div>
                  </div>
                </div>
                <div className="animate-slide-in-left flex items-center gap-3" style={{ animationDelay: '80ms' }}>
                  <div className="rounded bg-industrial-800 px-4 py-2 text-center text-white">
                    <div className="font-oswald text-2xl font-bold leading-none">{list.length}</div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-wider text-industrial-300">Total</div>
                  </div>
                  <div className="rounded bg-white border border-steel-200 px-4 py-2 text-center">
                    <div className="font-oswald text-2xl font-bold leading-none text-emerald-600">
                      {list.filter((d) => d.activeVersion?.status === 'ACTIVE').length}
                    </div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-wider text-steel-500">Active</div>
                  </div>
                </div>
              </div>

              {applied.partNumber || applied.process || applied.equipment || applied.version || applied.status.length > 0 ? (
                <div className="mt-4 flex flex-wrap items-center gap-2 rounded-sm border border-industrial-200 bg-industrial-50/70 px-3 py-2 text-xs text-steel-600 animate-fade-in">
                  <Search className="h-3.5 w-3.5 text-industrial-700" strokeWidth={2} />
                  <span className="font-semibold text-industrial-800">已应用条件：</span>
                  {applied.partNumber && <span className="rounded bg-white border border-steel-300 px-2 py-0.5">零件号 ≈ "{applied.partNumber}"</span>}
                  {applied.process && <span className="rounded bg-white border border-steel-300 px-2 py-0.5">工艺 = {applied.process}</span>}
                  {applied.equipment && <span className="rounded bg-white border border-steel-300 px-2 py-0.5 font-mono text-[11px]">设备 = {applied.equipment}</span>}
                  {applied.version && <span className="rounded bg-white border border-steel-300 px-2 py-0.5">版本 ≈ "{applied.version}"</span>}
                  {applied.status.length > 0 && <span className="rounded bg-white border border-steel-300 px-2 py-0.5">状态 = {applied.status.join(', ')}</span>}
                </div>
              ) : null}
            </div>
          </div>

          <div className="container py-6">
            {err && (
              <div className="mb-4 flex items-center gap-2 border border-red-200 bg-red-50 p-3 text-sm text-red-700 animate-fade-in">
                <AlertCircle className="h-4 w-4" strokeWidth={2} />
                {err}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse overflow-hidden border border-steel-200 bg-white">
                    <div className="h-36 bg-steel-200" />
                    <div className="space-y-3 p-4">
                      <div className="h-3 w-2/3 bg-steel-200" />
                      <div className="h-4 w-5/6 bg-steel-200" />
                      <div className="space-y-2 pt-2">
                        <div className="h-2.5 w-full bg-steel-100" />
                        <div className="h-2.5 w-4/5 bg-steel-100" />
                        <div className="h-2.5 w-3/5 bg-steel-100" />
                      </div>
                      <div className="border-t border-steel-100 pt-3">
                        <div className="h-6 w-20 bg-steel-200 ml-auto" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : list.length === 0 ? (
              <div className="rounded-sm border border-dashed border-steel-300 bg-white py-20 text-center">
                <FileSearch className="mx-auto mb-3 h-12 w-12 text-steel-300" strokeWidth={1.5} />
                <div className="text-sm font-medium text-steel-600">没有找到匹配的图纸</div>
                <div className="mt-1 text-xs text-steel-400">请尝试减少筛选条件或清空关键词重新搜索</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {list.map((d, i) => (
                  <DrawingCard key={d.id} drawing={d} index={i} onClick={() => nav(`/drawings/${d.id}`)} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
