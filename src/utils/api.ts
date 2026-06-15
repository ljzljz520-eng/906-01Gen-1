import { useAuthStore } from '../store/authStore';

const base = '/api';

export interface FetchOptions extends RequestInit {
  raw?: boolean;
}

export const http = async <T = unknown>(url: string, opts: FetchOptions = {}): Promise<T> => {
  const { token } = useAuthStore.getState();
  const headers: Record<string, string> = {
    ...(opts.headers as Record<string, string> || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (opts.body && !(opts.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${base}${url}`, {
    ...opts,
    headers,
  });
  if (opts.raw) return res as unknown as T;
  if (res.status === 401) {
    useAuthStore.getState().clearAuth();
    if (typeof window !== 'undefined' && !location.pathname.startsWith('/login')) {
      location.href = '/login';
    }
    throw new Error('登录已失效');
  }
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    throw new Error((data as any)?.error || `HTTP ${res.status}`);
  }
  return data as T;
};

export const api = {
  login: (employeeId: string, password: string) =>
    http<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ employeeId, password }),
    }),
  me: () => http<{ user: any }>('/auth/me'),

  meta: () => http<any>('/drawings/meta'),
  searchDrawings: (params: Record<string, any>) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
    });
    return http<{ drawings: any[]; total: number }>(`/drawings?${q.toString()}`);
  },
  getDrawing: (id: string) => http<{ drawing: any; versions: any[] }>(`/drawings/${id}`),
  getVersionRelation: (id: string, vid: string) =>
    http<{ chain: any[]; activeId?: string; currentId?: string }>(`/drawings/${id}/versions/${vid}/relation`),
  downloadVersion: async (id: string, vid: string, onProgress?: (p: number) => void) => {
    const { token } = useAuthStore.getState();
    onProgress?.(10);
    const res = await fetch(`${base}/drawings/${id}/versions/${vid}/download?watermark=true`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    onProgress?.(45);
    if (!res.ok) throw new Error('下载失败');
    const blob = await res.blob();
    onProgress?.(85);
    const watermarkCode = res.headers.get('X-Watermark-Code') || '';
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cd = res.headers.get('Content-Disposition') || '';
    const m = cd.match(/filename\*=UTF-8''(.+)/);
    a.download = m ? decodeURIComponent(m[1]) : `${id}-${vid}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    onProgress?.(100);
    return { watermarkCode };
  },

  listAudit: (params: Record<string, any>) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
    });
    return http<{ logs: any[]; total: number; page: number; pageSize: number }>(`/audit/logs?${q.toString()}`);
  },
  auditStats: (params: Record<string, any>) => {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
    });
    return http<any>(`/audit/stats?${q.toString()}`);
  },
  exportAudit: (body: Record<string, any>) =>
    http<Response>('/audit/logs/export', {
      method: 'POST',
      body: JSON.stringify(body),
      raw: true,
    } as any),
};
