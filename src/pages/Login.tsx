import { useState } from 'react';
import { FileSearch, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [employeeId, setEmployeeId] = useState('ENG001');
  const [password, setPassword] = useState('123456');
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { setAuth } = useAuthStore();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const { token, user } = await api.login(employeeId.trim(), password);
      setAuth(token, user);
      setTimeout(() => nav('/drawings'), 100);
    } catch (e: any) {
      setErr(e.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (id: string, pwd: string) => {
    setEmployeeId(id);
    setPassword(pwd);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-steel-950 via-industrial-950 to-steel-950">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 30% 20%, rgba(30, 58, 138, 0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 55%)'
      }} />
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-industrial-500 via-industrial-400 to-industrial-700" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 flex flex-col items-center gap-3 animate-fade-in">
          <div className="relative flex h-20 w-20 items-center justify-center border-2 border-industrial-500 bg-industrial-900 shadow-[0_0_40px_rgba(30,58,138,0.5)]">
            <FileSearch className="h-10 w-10 text-industrial-200" strokeWidth={1.8} />
            <div className="absolute -inset-1 border border-industrial-600/50" />
          </div>
          <div className="text-center">
            <h1 className="font-oswald text-4xl font-bold tracking-[0.3em] text-industrial-100">IDR · PORTAL</h1>
            <p className="mt-1.5 text-[11px] uppercase tracking-[0.4em] text-industrial-400">Industrial Drawing Retrieval System</p>
            <p className="mt-2 text-sm text-industrial-300/80">工业图纸检索台 · 版本管控 · 水印溯源</p>
          </div>
        </div>

        <div className="w-full max-w-md animate-slide-in-up" style={{ animationDelay: '120ms' }}>
          <div className="relative border-t-4 border-industrial-500 bg-steel-900/90 p-8 backdrop-blur-sm shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
            <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-industrial-300/60 to-transparent" />

            <div className="mb-6">
              <h2 className="font-oswald text-lg font-bold uppercase tracking-widest text-industrial-100">账号登录</h2>
              <p className="mt-1 text-[11px] text-steel-400">请使用企业工号登录系统</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-industrial-300">工号</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" strokeWidth={2} />
                  <input
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="如 ENG001"
                    className="w-full border border-steel-700 bg-steel-800/80 py-2.5 pl-10 pr-3 font-mono text-sm text-white placeholder:text-steel-500 focus:border-industrial-500 focus:outline-none focus:ring-1 focus:ring-industrial-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-industrial-300">密码</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" strokeWidth={2} />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••"
                    className="w-full border border-steel-700 bg-steel-800/80 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-steel-500 focus:border-industrial-500 focus:outline-none focus:ring-1 focus:ring-industrial-500/60"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-400 hover:text-white">
                    {showPwd ? <EyeOff className="h-4 w-4" strokeWidth={2} /> : <Eye className="h-4 w-4" strokeWidth={2} />}
                  </button>
                </div>
              </div>

              {err && (
                <div className="flex items-start gap-2 border border-red-900/60 bg-red-950/50 p-2.5 text-xs text-red-300 animate-fade-in">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} />
                  <span>{err}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden border border-industrial-500 bg-gradient-to-b from-industrial-600 to-industrial-800 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_3px_0_0_#172554] transition-all hover:from-industrial-500 hover:to-industrial-700 disabled:opacity-60"
              >
                <span className="relative z-10">{loading ? '登录中…' : '登 录 系 统'}</span>
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-industrial-300/60 to-transparent" />
              </button>
            </form>

            <div className="mt-6 border-t border-steel-800 pt-4">
              <div className="mb-2 text-[10px] uppercase tracking-widest text-steel-500">演示账号（密码均为 123456）</div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button onClick={() => quickLogin('ENG001', '123456')} className="border border-steel-700 bg-steel-800/50 px-2 py-2 text-left text-steel-300 transition-colors hover:border-industrial-500 hover:text-white">
                  <div className="font-mono font-bold text-industrial-300">ENG001</div>
                  <div className="text-[10px] text-steel-400">张工程师 · 机械设计</div>
                </button>
                <button onClick={() => quickLogin('ENG002', '123456')} className="border border-steel-700 bg-steel-800/50 px-2 py-2 text-left text-steel-300 transition-colors hover:border-industrial-500 hover:text-white">
                  <div className="font-mono font-bold text-industrial-300">ENG002</div>
                  <div className="text-[10px] text-steel-400">李工程师 · 工艺工程</div>
                </button>
                <button onClick={() => quickLogin('ADM001', '123456')} className="col-span-2 border border-amber-900/60 bg-amber-950/30 px-2 py-2 text-left text-amber-200 transition-colors hover:border-amber-500 hover:text-white">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-300">ADM001</span>
                    <span className="rounded bg-amber-900/60 px-1.5 py-0.5 text-[9px] uppercase">管理员</span>
                  </div>
                  <div className="text-[10px] text-amber-200/70">王管理员 · 文档管控中心（可查看审计）</div>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center font-mono text-[10px] text-steel-500">
            © 2025 IDR-PORTAL · Industrial Drawing Retrieval System
          </div>
        </div>
      </div>
    </div>
  );
}
