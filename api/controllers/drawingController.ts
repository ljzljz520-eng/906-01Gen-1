import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { drawings, drawingVersions, downloadAuditLogs, processOptions, equipmentOptions } from '../db/mockData.ts';
import { generateMockBasePdf, addWatermarkToPdf } from '../services/watermarkService.ts';
import type { VersionStatus, Drawing, DrawingVersion } from '../types/index.ts';

const getActiveVersion = (drawingId: string): DrawingVersion | undefined => {
  return drawingVersions
    .filter((v) => v.drawingId === drawingId)
    .sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1))
    .find((v) => v.status === 'ACTIVE');
};

export const meta = (_req: Request, res: Response): void => {
  res.json({
    processes: processOptions,
    equipments: equipmentOptions,
    statuses: [
      { value: 'ACTIVE', label: '在用' },
      { value: 'OBSOLETE', label: '过期' },
      { value: 'SUPERSEDED', label: '已替代' },
    ],
  });
};

export const searchDrawings = (req: Request, res: Response): void => {
  const { partNumber, process, equipment, version, status } = req.query as {
    partNumber?: string;
    process?: string;
    equipment?: string;
    version?: string;
    status?: string;
  };
  let list = [...drawings];
  if (partNumber && partNumber.trim()) {
    const kw = partNumber.trim().toLowerCase();
    list = list.filter((d) => d.partNumber.toLowerCase().includes(kw) || d.name.toLowerCase().includes(kw));
  }
  if (process && process.trim()) {
    list = list.filter((d) => d.process === process.trim());
  }
  if (equipment && equipment.trim()) {
    list = list.filter((d) => d.equipmentModel === equipment.trim());
  }
  const statusList: VersionStatus[] = status ? (status.split(',').filter(Boolean) as VersionStatus[]) : [];
  const verKw = version?.trim();

  if (verKw || statusList.length > 0) {
    const filteredDrawingIds = new Set<string>();
    for (const v of drawingVersions) {
      let match = true;
      if (verKw && !v.version.toLowerCase().includes(verKw.toLowerCase())) match = false;
      if (statusList.length > 0 && !statusList.includes(v.status)) match = false;
      if (match) filteredDrawingIds.add(v.drawingId);
    }
    list = list.filter((d) => filteredDrawingIds.has(d.id));
  }

  const withActive = list.map((d: Drawing & { activeVersion?: DrawingVersion; totalVersions?: number; allStatuses?: VersionStatus[] }) => {
    const versions = drawingVersions.filter((v) => v.drawingId === d.id);
    const statuses = Array.from(new Set(versions.map((v) => v.status)));
    return { ...d, activeVersion: getActiveVersion(d.id), totalVersions: versions.length, allStatuses: statuses };
  });

  withActive.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  res.json({ drawings: withActive, total: withActive.length });
};

export const getDrawingDetail = (req: Request, res: Response): void => {
  const { id } = req.params;
  const drawing = drawings.find((d) => d.id === id);
  if (!drawing) {
    res.status(404).json({ error: '图纸不存在' });
    return;
  }
  const versions = drawingVersions
    .filter((v) => v.drawingId === id)
    .sort((a, b) => (a.releaseDate < b.releaseDate ? 1 : -1));
  res.json({ drawing, versions });
};

export const getVersionRelation = (req: Request, res: Response): void => {
  const { id, vid } = req.params;
  const versions = drawingVersions
    .filter((v) => v.drawingId === id)
    .sort((a, b) => (a.releaseDate < b.releaseDate ? -1 : 1));
  const active = versions.find((v) => v.status === 'ACTIVE');
  const start = versions.find((v) => !v.supersedesVersionId);
  const chain: DrawingVersion[] = [];
  let cur = start;
  let guard = 0;
  while (cur && guard++ < 20) {
    chain.push(cur);
    const next = versions.find((v) => v.supersedesVersionId === cur!.id);
    if (!next) break;
    cur = next;
  }
  res.json({ chain, activeId: active?.id, currentId: vid });
};

export const downloadVersion = async (req: Request, res: Response): Promise<void> => {
  const { id, vid } = req.params;
  const drawing = drawings.find((d) => d.id === id);
  const version = drawingVersions.find((v) => v.id === vid && v.drawingId === id);
  if (!drawing || !version) {
    res.status(404).json({ error: '图纸或版本不存在' });
    return;
  }
  const user = req.user!;
  const watermarkCode = `WM-${uuidv4().slice(0, 10).toUpperCase()}`;
  const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 19);
  try {
    const baseBytes = await generateMockBasePdf(drawing, version);
    const watermarkedBytes = await addWatermarkToPdf(baseBytes, {
      projectName: drawing.project,
      userName: user.name,
      department: user.department,
      downloadTime: nowStr,
      watermarkCode,
      partNumber: drawing.partNumber,
      version: version.version,
    });

    const log = {
      id: `log-${Date.now()}`,
      userId: user.userId,
      userName: user.name,
      userDepartment: user.department,
      drawingId: drawing.id,
      partNumber: drawing.partNumber,
      versionId: version.id,
      version: version.version,
      downloadedAt: new Date().toISOString(),
      ipAddress: (req.ip || req.socket.remoteAddress || '127.0.0.1').replace('::ffff:', ''),
      watermarkCode,
    };
    downloadAuditLogs.unshift(log);

    const filename = encodeURIComponent(`${drawing.partNumber}_${version.version}_${watermarkCode}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${filename}`);
    res.setHeader('X-Watermark-Code', watermarkCode);
    res.send(Buffer.from(watermarkedBytes));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '文件生成失败' });
  }
};
