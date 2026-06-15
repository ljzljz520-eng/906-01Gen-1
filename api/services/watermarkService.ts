import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import type { Drawing, DrawingVersion } from '../types/index.ts';

export interface WatermarkInfo {
  projectName: string;
  userName: string;
  department: string;
  downloadTime: string;
  watermarkCode: string;
  partNumber: string;
  version: string;
}

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;

const makeDiagramPage = (drawing: Drawing, version: DrawingVersion): PDFDocument => {
  throw new Error('placeholder');
};

export const generateMockBasePdf = async (
  drawing: Drawing,
  version: DrawingVersion
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const totalPages = version.pageCount || 1;
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let p = 0; p < totalPages; p++) {
    const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    const { width, height } = page.getSize();

    page.drawRectangle({ x: 30, y: 30, width: width - 60, height: height - 60, borderColor: rgb(0.1, 0.1, 0.1), borderWidth: 1.2 });
    page.drawRectangle({ x: 30, y: 30, width: width - 60, height: 40, color: rgb(0.12, 0.23, 0.54), opacity: 0.08 });
    page.drawLine({ start: { x: 30, y: height - 90 }, end: { x: width - 30, y: height - 90 }, color: rgb(0.1, 0.1, 0.1), thickness: 0.8 });
    page.drawLine({ start: { x: 30, y: 70 }, end: { x: width - 30, y: 70 }, color: rgb(0.1, 0.1, 0.1), thickness: 0.8 });

    page.drawText('ENGINEERING DRAWING  /  工程图纸', {
      x: 45, y: height - 70, size: 16, font: helveticaBold, color: rgb(0.12, 0.23, 0.54),
    });
    page.drawText(`DWG NO / 图纸编号: ${drawing.partNumber}`, {
      x: 45, y: height - 110, size: 11, font: helveticaBold, color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(`TITLE / 标题: ${drawing.name}`, {
      x: 45, y: height - 128, size: 11, font: helvetica, color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(`REV / 版本: ${version.version}   STATUS / 状态: ${version.status}`, {
      x: 45, y: height - 146, size: 11, font: helvetica, color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(`PROCESS / 工艺: ${drawing.process}   EQUIPMENT / 设备: ${drawing.equipmentModel}`, {
      x: 45, y: height - 164, size: 10, font: helvetica, color: rgb(0.3, 0.3, 0.3),
    });
    page.drawText(`PROJECT / 项目: ${drawing.project}`, {
      x: 45, y: height - 182, size: 10, font: helvetica, color: rgb(0.3, 0.3, 0.3),
    });
    page.drawText(`RELEASED BY / 发布人: ${version.releasedBy}   DATE / 日期: ${version.releaseDate}`, {
      x: 45, y: height - 200, size: 10, font: helvetica, color: rgb(0.3, 0.3, 0.3),
    });

    const cx = width / 2;
    const cy = height / 2 + 30;
    const w = 420;
    const h = 260;
    page.drawRectangle({ x: cx - w / 2, y: cy - h / 2, width: w, height: h, color: rgb(0.97, 0.97, 0.99), borderColor: rgb(0.7, 0.7, 0.7), borderWidth: 1 });

    const lineColor = rgb(0.12, 0.23, 0.54);
    page.drawLine({ start: { x: cx - 180, y: cy + 80 }, end: { x: cx - 180, y: cy - 80 }, color: lineColor, thickness: 1.4 });
    page.drawLine({ start: { x: cx - 180, y: cy - 80 }, end: { x: cx + 120, y: cy - 80 }, color: lineColor, thickness: 1.4 });
    page.drawLine({ start: { x: cx + 120, y: cy - 80 }, end: { x: cx + 120, y: cy + 20 }, color: lineColor, thickness: 1.4 });
    page.drawLine({ start: { x: cx + 120, y: cy + 20 }, end: { x: cx + 60, y: cy + 20 }, color: lineColor, thickness: 1.4 });
    page.drawLine({ start: { x: cx + 60, y: cy + 20 }, end: { x: cx + 60, y: cy + 80 }, color: lineColor, thickness: 1.4 });
    page.drawLine({ start: { x: cx + 60, y: cy + 80 }, end: { x: cx - 180, y: cy + 80 }, color: lineColor, thickness: 1.4 });
    page.drawCircle({ x: cx - 80, y: cy, size: 45, borderColor: lineColor, borderWidth: 1.2, color: rgb(0.92, 0.95, 1) });
    page.drawCircle({ x: cx - 80, y: cy, size: 18, borderColor: lineColor, borderWidth: 1 });
    page.drawCircle({ x: cx + 40, y: cy + 30, size: 20, borderColor: lineColor, borderWidth: 1.2, color: rgb(0.92, 0.95, 1) });

    for (let i = 0; i < 8; i++) {
      const x0 = cx - 175 + i * 40;
      page.drawLine({ start: { x: x0, y: cy - 78 }, end: { x: x0, y: cy - 92 }, color: rgb(0.5, 0.5, 0.5), thickness: 0.6 });
      page.drawText(`${i * 40}`, { x: x0 - 5, y: cy - 102, size: 7, font: helvetica, color: rgb(0.5, 0.5, 0.5) });
    }

    page.drawText('FIG. 1  MAIN VIEW  /  主视图', {
      x: cx - 180, y: cy - 108, size: 9, font: helveticaBold, color: rgb(0.3, 0.3, 0.3),
    });

    page.drawRectangle({ x: width - 200, y: 42, width: 170, height: 20, color: rgb(0.12, 0.23, 0.54) });
    page.drawText(`${drawing.partNumber}  ${version.version}`, {
      x: width - 190, y: 48, size: 10, font: helveticaBold, color: rgb(1, 1, 1),
    });
    page.drawText(`SHEET ${p + 1} / ${totalPages}`, {
      x: 60, y: 48, size: 9, font: helvetica, color: rgb(0.3, 0.3, 0.3),
    });
  }

  return await pdfDoc.save();
};

export const addWatermarkToPdf = async (
  pdfBytes: Uint8Array,
  info: WatermarkInfo
): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  const line1 = `PROJECT: ${info.projectName}  |  PART: ${info.partNumber} ${info.version}`;
  const line2 = `DOWNLOADED BY: ${info.userName} / ${info.department}`;
  const line3 = `TIME: ${info.downloadTime}`;
  const line4 = `WM-CODE: ${info.watermarkCode}  -  CONFIDENTIAL -`;

  for (const page of pages) {
    const { width, height } = page.getSize();

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        const x = 60 + col * (width - 120) / 2;
        const y = 80 + row * (height - 160) / 4;
        page.drawText(line4, {
          x, y,
          size: 10,
          font: helvetica,
          color: rgb(0.6, 0.1, 0.1),
          opacity: 0.18,
          rotate: degrees(-22),
        });
      }
    }

    page.drawText(line1, {
      x: width / 2, y: height - 30, size: 9, font: helvetica,
      color: rgb(0.6, 0.1, 0.1), opacity: 0.6,
    }, );
    page.drawText(line2, {
      x: width / 2, y: height - 42, size: 9, font: helvetica,
      color: rgb(0.6, 0.1, 0.1), opacity: 0.6,
    });
    page.drawText(line3, {
      x: width / 2, y: 30, size: 9, font: helvetica,
      color: rgb(0.6, 0.1, 0.1), opacity: 0.6,
    });
    page.drawText(line4, {
      x: width / 2, y: 18, size: 9, font: helvetica,
      color: rgb(0.6, 0.1, 0.1), opacity: 0.6,
    });
  }

  return await pdfDoc.save();
};
