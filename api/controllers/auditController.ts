import { Request, Response } from 'express';
import { downloadAuditLogs } from '../db/mockData.ts';

export const listLogs = (req: Request, res: Response): void => {
  const { userId, userName, partNumber, version, from, to, page = '1', pageSize = '20' } = req.query as {
    userId?: string;
    userName?: string;
    partNumber?: string;
    version?: string;
    from?: string;
    to?: string;
    page?: string;
    pageSize?: string;
  };

  let list = [...downloadAuditLogs];

  if (req.user && req.user.role !== 'ADMIN') {
    list = list.filter((l) => l.userId === req.user!.userId);
  }
  if (userId && userId.trim()) list = list.filter((l) => l.userId === userId.trim());
  if (userName && userName.trim()) list = list.filter((l) => l.userName.includes(userName.trim()));
  if (partNumber && partNumber.trim()) list = list.filter((l) => l.partNumber.toLowerCase().includes(partNumber.trim().toLowerCase()));
  if (version && version.trim()) list = list.filter((l) => l.version.toLowerCase().includes(version.trim().toLowerCase()));
  if (from) list = list.filter((l) => l.downloadedAt >= from);
  if (to) list = list.filter((l) => l.downloadedAt <= to + 'T23:59:59Z');

  list.sort((a, b) => (a.downloadedAt < b.downloadedAt ? 1 : -1));
  const total = list.length;
  const p = Math.max(1, parseInt(page, 10) || 1);
  const ps = Math.max(1, Math.min(100, parseInt(pageSize, 10) || 20));
  const logs = list.slice((p - 1) * ps, p * ps);

  res.json({ logs, total, page: p, pageSize: ps });
};

export const getStats = (req: Request, res: Response): void => {
  const { from, to } = req.query as { from?: string; to?: string };
  let list = [...downloadAuditLogs];
  if (req.user && req.user.role !== 'ADMIN') {
    list = list.filter((l) => l.userId === req.user!.userId);
  }
  if (from) list = list.filter((l) => l.downloadedAt >= from);
  if (to) list = list.filter((l) => l.downloadedAt <= to + 'T23:59:59Z');

  const byUser = Object.values(
    list.reduce<Record<string, { name: string; department: string; count: number }>>((acc, l) => {
      if (!acc[l.userId]) acc[l.userId] = { name: l.userName, department: l.userDepartment, count: 0 };
      acc[l.userId].count++;
      return acc;
    }, {})
  ).sort((a, b) => b.count - a.count);

  const byDrawing = Object.values(
    list.reduce<Record<string, { partNumber: string; count: number }>>((acc, l) => {
      if (!acc[l.drawingId]) acc[l.drawingId] = { partNumber: l.partNumber, count: 0 };
      acc[l.drawingId].count++;
      return acc;
    }, {})
  ).sort((a, b) => b.count - a.count);

  const byDate = Object.values(
    list.reduce<Record<string, { date: string; count: number }>>((acc, l) => {
      const d = l.downloadedAt.slice(0, 10);
      if (!acc[d]) acc[d] = { date: d, count: 0 };
      acc[d].count++;
      return acc;
    }, {})
  ).sort((a, b) => (a.date < b.date ? -1 : 1));

  res.json({ total: list.length, byUser, byDrawing, byDate });
};

export const exportLogs = (req: Request, res: Response): void => {
  const { userId, userName, partNumber, version, from, to } = (req.body || {}) as {
    userId?: string;
    userName?: string;
    partNumber?: string;
    version?: string;
    from?: string;
    to?: string;
  };

  let list = [...downloadAuditLogs];
  if (req.user && req.user.role !== 'ADMIN') list = list.filter((l) => l.userId === req.user!.userId);
  if (userId) list = list.filter((l) => l.userId === userId);
  if (userName) list = list.filter((l) => l.userName.includes(userName));
  if (partNumber) list = list.filter((l) => l.partNumber.includes(partNumber));
  if (version) list = list.filter((l) => l.version.includes(version));
  if (from) list = list.filter((l) => l.downloadedAt >= from);
  if (to) list = list.filter((l) => l.downloadedAt <= to + 'T23:59:59Z');
  list.sort((a, b) => (a.downloadedAt < b.downloadedAt ? 1 : -1));

  const header = ['下载时间', '用户名', '部门', '零件号', '版本', 'IP地址', '水印编码'];
  const rows = list.map((l) => [
    l.downloadedAt.replace('T', ' ').slice(0, 19),
    l.userName,
    l.userDepartment,
    l.partNumber,
    l.version,
    l.ipAddress,
    l.watermarkCode,
  ]);
  const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const filename = `audit-export-${new Date().toISOString().slice(0, 10)}.csv`;
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send('\uFEFF' + csv);
};
