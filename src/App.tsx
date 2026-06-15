import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Login from "@/pages/Login";
import DrawingSearch from "@/pages/DrawingSearch";
import DrawingDetail from "@/pages/DrawingDetail";
import AuditTrail from "@/pages/AuditTrail";
import { useAuthStore } from "@/store/authStore";
import type { ReactNode } from "react";

function RequireAuth({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) {
  const { isLoggedIn, isAdmin } = useAuthStore();
  const loc = useLocation();
  if (!isLoggedIn()) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (requireAdmin && !isAdmin()) return <Navigate to="/drawings" replace />;
  return <>{children}</>;
}

function RedirectIfLogged() {
  const { isLoggedIn } = useAuthStore();
  const nav = useNavigate();
  useEffect(() => {
    if (isLoggedIn()) nav('/drawings', { replace: true });
  }, [isLoggedIn, nav]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<><RedirectIfLogged /><Login /></>} />
        <Route path="/drawings" element={<RequireAuth><DrawingSearch /></RequireAuth>} />
        <Route path="/drawings/:id" element={<RequireAuth><DrawingDetail /></RequireAuth>} />
        <Route path="/audit" element={<RequireAuth requireAdmin><AuditTrail /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/drawings" replace />} />
      </Routes>
    </HashRouter>
  );
}
