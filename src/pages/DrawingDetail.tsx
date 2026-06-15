import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Download, Calendar, FileText, AlertCircle, Check,
  Hash, Settings, Cpu, FolderKanban, User, Loader2, FileDown
} from 'lucide-react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import VersionTimeline from '../components/VersionTimeline';
import VersionRelationGraph from '../components/VersionRelationGraph';
import { api } from '../utils/api';
import type { Drawing, DrawingVersion } from '../types/index';

export default function DrawingDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [drawing, setDrawing] = useState<Drawing | null>(null);
  const [versions, setVersions] = useState<DrawingVersion[]>([]);
  const [relation, setRelation] = useState<{ chain: DrawingVersion[]; activeId?: string }>({ chain: [] });
  const [selected, setSelected] = useState<DrawingVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [dlProgress, setDlProgress] = useState<number | null>(null);
  const [dlResult, setDlResult] = useState<string | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const { drawing: d, versions: vs } = await api.getDrawing(id);
        setDrawing(d);
        setVersions(vs);
        const active = vs.find((v) => v.status === 'ACTIVE') || vs[0];
        if (active) {
          setSelected(active);
          try {
            const rel = await api.getVersionRelation(id, active.id);
            setRelation(rel);
          } catch {}
        }
      } catch (e: any) {
        setErr(e.message || '加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const selectVersion = async (v: DrawingVersion) => {
    setSelected(v);
    if (id) {
      try {
        const rel = await api.getVersionRelation(id, v.id);
        setRelation(rel);
      } catch {}
    }
  };

  const handleDownload = async () => {
    if (!id || !selected) return;
    setDlProgress(0);
    setDlResult(null);
    try {
      const { watermarkCode } = await api.downloadVersion(id, selected.id, (p) => setDlProgress(p));
      setDlProgress(100);
      setDlResult(watermarkCode);
      setTimeout(() => setDlResult(null), 6000);
    } catch (e: any) {
      setDlProgress(null);
      setErr(e.message || '下载失败');
      setTimeout(() => setErr(''), 4000);
    }
  };

  const fmtSize = (b: number) => {
    if (!b) return '-';
    if (b < 1024) return b + ' B';
    if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1024 / 1024).toFixed(2) + ' MB';
  };

  const activeVer = useMemo(() => versions.find((v) => v.status === 'ACTIVE'), [versions]);

  return (
    <div className="min-h-screen bg-steel-100">
      <Navbar />

      <div className="border-b border-steel-200 bg-white">
        <div className="container py-4">
          <button
            onClick={() => nav('/drawings')}
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-steel-600 transition-colors hover:text-industrial-700"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            返回检索结果
          </button>

          {loading ? (
            <div className="h-20 animate-pulse bg-steel-100" />
          ) : err ? (
            <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" strokeWidth={2} />
              {err}
            </div>
          ) : drawing ? (
            <div className="animate-fade-in">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="font-oswald text-2xl font-bold tracking-wider text-steel-800">{drawing.partNumber}</div>
                    <StatusBadge status={activeVer?.status || 'ACTIVE'} pulse={activeVer?.status === 'ACTIVE'} size="md" />
                    {activeVer && (
                      <span className="rounded bg-industrial-50 border border-industrial-200 px-2 py-0.5 text-xs font-semibold text-industrial-800">
                        当前版：{activeVer.version}
                      </span>
                    )}
                  </div>
                  <h1 className="mt-1 text-[22px] font-bold leading-tight text-steel-900">{drawing.name}</h1>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={!selected || dlProgress !== null && dlProgress < 100}
                    className="group relative inline-flex items-center gap-2 border-2 border-industrial-800 bg-gradient-to-b from-industrial-600 to-industrial-800 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_3px_0_0_#172554] transition-all hover:from-industrial-500 hover:to-industrial-700 disabled:opacity-60"
                  >
                    {dlProgress !== null && dlProgress < 100 ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.2} />
                        正在生成带水印文件… {dlProgress}%
                      </>
                    ) : dlProgress === 100 ? (
                      <>
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                        下载完成
                      </>
                    ) : (
                      <>
                        <FileDown className="h-4 w-4" strokeWidth={2} />
                        带水印下载 {selected?.version || ''}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {dlResult && (
                <div className="mt-3 flex flex-wrap items-center gap-2 rounded-sm border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs animate-slide-in-up">
                  <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.2} />
                  <span className="font-semibold text-emerald-800">文件已生成并记录审计日志：</span>
                  <span className="font-mono font-bold text-red-700">水印编码 {dlResult}</span>
                  <span className="text-emerald-700">（含项目名、您的姓名、下载时间）</span>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <InfoCell icon={<Settings className="h-4 w-4" strokeWidth={2} />} label="工艺类型" value={drawing.process} />
                <InfoCell icon={<Cpu className="h-4 w-4" strokeWidth={2} />} label="设备型号" value={drawing.equipmentModel} mono />
                <InfoCell icon={<FolderKanban className="h-4 w-4" strokeWidth={2} />} label="所属项目" value={drawing.project} />
                <InfoCell icon={<Calendar className="h-4 w-4" strokeWidth={2} />} label="首次建档" value={drawing.createdAt.slice(0, 10)} mono />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {drawing && !loading && (
        <div className="container py-6">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-3">
              <Section title="版本时间轴" subtitle="按发布时间倒序展示所有历史版本，点击切换选中版本">
                <VersionTimeline
                  versions={versions}
                  selectedId={selected?.id}
                  onSelect={selectVersion}
                />
              </Section>

              <Section title="版本演进链路" subtitle="展示该图纸各版本之间的替代关系，清晰追溯生命周期">
                <VersionRelationGraph
                  chain={relation.chain}
                  activeId={relation.activeId}
                  currentId={selected?.id}
                  onSelect={selectVersion}
                />
              </Section>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <Section title="当前选中版本详情">
                {selected ? (
                  <div className="space-y-4 animate-fade-in">
                    <div className="rounded-sm border-l-4 border-industrial-600 bg-industrial-50/80 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="font-oswald text-xl font-bold tracking-wider text-steel-800">{selected.version}</div>
                          <div className="mt-0.5 text-xs text-steel-500">Drawing Version</div>
                        </div>
                        <StatusBadge status={selected.status} pulse={selected.status === 'ACTIVE'} size="md" />
                      </div>
                    </div>

                    <div className="space-y-2.5 text-sm">
                      <KVRow icon={<Hash className="h-3.5 w-3.5" strokeWidth={2} />} label="版本号" value={selected.version} mono />
                      <KVRow icon={<Calendar className="h-3.5 w-3.5" strokeWidth={2} />} label="发布日期" value={selected.releaseDate} mono />
                      <KVRow icon={<User className="h-3.5 w-3.5" strokeWidth={2} />} label="发布人" value={selected.releasedBy} />
                      <KVRow icon={<FileText className="h-3.5 w-3.5" strokeWidth={2} />} label="文件格式" value={`${selected.fileFormat} · ${selected.pageCount}页 · ${fmtSize(selected.fileSize)}`} />
                    </div>

                    {selected.changeNotes && (
                      <div className="rounded-sm border border-steel-200 bg-white p-3">
                        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-steel-500">变更说明</div>
                        <div className="text-sm leading-relaxed text-steel-700">{selected.changeNotes}</div>
                      </div>
                    )}

                    <div className="rounded-sm border-t-2 border-steel-800 bg-steel-900 p-4 text-white">
                      <div className="mb-3 flex items-center gap-2">
                        <Download className="h-4 w-4 text-industrial-300" strokeWidth={2} />
                        <div className="font-oswald text-xs font-bold uppercase tracking-widest text-industrial-200">水印信息预览</div>
                      </div>
                      <div className="space-y-1.5 font-mono text-[11px] text-steel-300">
                        <div>├─ 项目: <span className="text-white">{drawing.project}</span></div>
                        <div>├─ 图纸: <span className="text-white">{drawing.partNumber} {selected.version}</span></div>
                        <div>├─ 下载人: <span className="text-white">当前登录用户</span></div>
                        <div>├─ 时间: <span className="text-white">{new Date().toISOString().replace('T', ' ').slice(0, 19)}</span></div>
                        <div>└─ 水印码: <span className="font-bold text-red-400">WM-XXXXXXXX</span></div>
                      </div>
                      <div className="mt-3 border-t border-steel-700 pt-3 text-[10px] leading-relaxed text-steel-400">
                        下载文件将以斜向水印、顶部/底部显式水印形式嵌入以上信息，水印编码与审计日志一一对应，可追溯具体下载人员与时间。
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-steel-400">请在左侧选择版本</div>
                )}
              </Section>

              <Section title="状态图例">
                <div className="space-y-2.5 rounded-sm border border-steel-200 bg-white p-4 text-sm">
                  <LegendRow color="bg-status-active" title="在用 ACTIVE" desc="当前生产、维修、采购环节的标准依据版本" />
                  <LegendRow color="bg-status-superseded" title="已替代 SUPERSEDED" desc="已被新版本替代，允许在过渡期内参考" />
                  <LegendRow color="bg-status-obsolete" title="过期 OBSOLETE" desc="已作废，不得用于任何生产或采购活动" />
                </div>
              </Section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="animate-slide-in-up">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-oswald text-sm font-bold uppercase tracking-widest text-steel-800">
            <span className="h-3 w-1 bg-industrial-700" />
            {title}
          </h2>
          {subtitle && <p className="mt-1 ml-3 text-xs text-steel-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function InfoCell({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-sm border border-steel-200 bg-white px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-steel-500">
        {icon}
        {label}
      </div>
      <div className={`text-sm font-semibold text-steel-800 ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  );
}

function KVRow({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-2 border-b border-steel-100 pb-2 last:border-0">
      <span className="text-steel-400">{icon}</span>
      <span className="w-20 shrink-0 text-xs text-steel-500">{label}</span>
      <span className={`text-sm text-steel-800 ${mono ? 'font-mono font-semibold' : 'font-medium'}`}>{value}</span>
    </div>
  );
}

function LegendRow({ color, title, desc }: { color: string; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${color} animate-breath`} />
      <div>
        <div className="font-mono text-xs font-bold text-steel-800">{title}</div>
        <div className="text-[11px] text-steel-500">{desc}</div>
      </div>
    </div>
  );
}
