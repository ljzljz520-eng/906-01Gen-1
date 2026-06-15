import { FileSearch, Search, ShieldCheck, LogOut, User, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const { user, clearAuth, isAdmin } = useAuthStore();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  const logout = () => {
    clearAuth();
    nav('/login');
  };

  const isActive = (path: string) => loc.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-industrial-800 bg-industrial-900 diagonal-stripe text-white shadow-lg">
      <div className="container flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border-2 border-industrial-400 bg-industrial-800 shadow-inner-inset">
            <FileSearch className="h-6 w-6 text-industrial-200" strokeWidth={2} />
          </div>
          <div className="leading-tight">
            <div className="font-oswald text-xl font-bold tracking-[0.2em] text-industrial-50">IDR-PORTAL</div>
            <div className="text-[10px] uppercase tracking-widest text-industrial-400">Industrial Drawing Retrieval</div>
          </div>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          <a
            className={`flex items-center gap-2 border-b-2 px-4 py-[18px] text-sm font-medium transition-colors ${
              isActive('/drawings')
                ? 'border-industrial-300 bg-industrial-800/60 text-white'
                : 'border-transparent text-industrial-200 hover:bg-industrial-800/40 hover:text-white'
            }`}
            href="#/drawings"
            onClick={(e) => { e.preventDefault(); nav('/drawings'); }}
          >
            <Search className="h-4 w-4" strokeWidth={2} />
            图纸检索
          </a>
          {isAdmin() && (
            <a
              className={`flex items-center gap-2 border-b-2 px-4 py-[18px] text-sm font-medium transition-colors ${
                isActive('/audit')
                  ? 'border-industrial-300 bg-industrial-800/60 text-white'
                  : 'border-transparent text-industrial-200 hover:bg-industrial-800/40 hover:text-white'
              }`}
              href="#/audit"
              onClick={(e) => { e.preventDefault(); nav('/audit'); }}
            >
              <ShieldCheck className="h-4 w-4" strokeWidth={2} />
              审计追踪
            </a>
          )}
        </nav>

        <div className="relative flex items-center gap-3">
          <div className="hidden items-center gap-2 border-r border-industrial-700 pr-3 text-right md:flex">
            <div className="text-xs text-industrial-400">{user?.department}</div>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-breath" />
              <span className="text-sm font-medium text-white">{user?.name}</span>
              <span className="rounded bg-industrial-800 px-1.5 py-0.5 font-mono text-[10px] text-industrial-300">{user?.employeeId}</span>
            </div>
          </div>
          <button
            className="flex h-9 w-9 items-center justify-center border border-industrial-700 bg-industrial-800 hover:bg-industrial-700"
            onClick={() => setOpen(!open)}
          >
            <User className="h-4 w-4" strokeWidth={2} />
          </button>
          {open && (
            <div className="absolute right-0 top-12 w-56 border border-industrial-800 bg-steel-900 shadow-xl animate-fade-in">
              <div className="border-b border-industrial-800 px-4 py-3">
                <div className="text-sm font-medium text-white">{user?.name}</div>
                <div className="mt-0.5 font-mono text-[11px] text-industrial-400">{user?.employeeId} · {user?.department}</div>
                <div className="mt-1 text-[11px] text-industrial-400">
                  角色：{isAdmin() ? '文档管理员' : '工程师'}
                </div>
              </div>
              <div className="py-1">
                <a
                  href="#/drawings"
                  onClick={(e) => { e.preventDefault(); nav('/drawings'); setOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-industrial-200 hover:bg-industrial-800/60 hover:text-white"
                >
                  <FileSearch className="h-4 w-4" strokeWidth={2} />
                  图纸检索
                </a>
                {isAdmin() && (
                  <a
                    href="#/audit"
                    onClick={(e) => { e.preventDefault(); nav('/audit'); setOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-industrial-200 hover:bg-industrial-800/60 hover:text-white"
                  >
                    <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                    审计追踪
                  </a>
                )}
              </div>
              <div className="border-t border-industrial-800 p-2">
                <button
                  onClick={logout}
                  className="flex w-full items-center justify-center gap-2 border border-red-900/50 bg-red-950/40 py-2 text-sm font-medium text-red-300 hover:bg-red-900/60 hover:text-red-200"
                >
                  <LogOut className="h-4 w-4" strokeWidth={2} />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
