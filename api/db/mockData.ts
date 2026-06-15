import type { User, Drawing, DrawingVersion, DownloadAuditLog } from '../types/index.ts';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const hash = (pw: string) => bcrypt.hashSync(pw, 6);

export const users: User[] = [
  {
    id: 'u-001',
    employeeId: 'ENG001',
    name: '张工程师',
    department: '机械设计部',
    role: 'ENGINEER',
    passwordHash: hash('123456'),
  },
  {
    id: 'u-002',
    employeeId: 'ENG002',
    name: '李工程师',
    department: '工艺工程部',
    role: 'ENGINEER',
    passwordHash: hash('123456'),
  },
  {
    id: 'u-003',
    employeeId: 'ADM001',
    name: '王管理员',
    department: '文档管控中心',
    role: 'ADMIN',
    passwordHash: hash('123456'),
  },
];

const svgThumb = (color: string, text: string) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='140' viewBox='0 0 200 140'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${color}' stop-opacity='0.12'/>
        <stop offset='100%' stop-color='${color}' stop-opacity='0.35'/>
      </linearGradient>
      <pattern id='h' width='10' height='10' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'>
        <line x1='0' y1='0' x2='0' y2='10' stroke='${color}' stroke-opacity='0.18' stroke-width='1'/>
      </pattern>
    </defs>
    <rect width='200' height='140' fill='url(#g)'/>
    <rect width='200' height='140' fill='url(#h)'/>
    <g stroke='${color}' stroke-width='1.5' fill='none' stroke-opacity='0.55'>
      <line x1='30' y1='110' x2='170' y2='110'/>
      <line x1='30' y1='110' x2='30' y2='35'/>
      <line x1='30' y1='35' x2='100' y2='35'/>
      <line x1='100' y1='35' x2='100' y2='70'/>
      <line x1='100' y1='70' x2='170' y2='70'/>
      <line x1='170' y1='70' x2='170' y2='110'/>
      <circle cx='65' cy='75' r='12'/>
      <circle cx='140' cy='52' r='10'/>
    </g>
    <text x='100' y='130' text-anchor='middle' font-family='monospace' font-size='11' fill='${color}' font-weight='600'>${text}</text>
  </svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

export const drawings: Drawing[] = [
  {
    id: 'd-001',
    partNumber: 'MOT-GEAR-001',
    name: '主轴减速齿轮组',
    process: '铣削',
    equipmentModel: 'DMG-MORI-NVX5100',
    project: '重型机床升级项目',
    createdAt: '2025-03-15T09:20:00Z',
    thumbnail: svgThumb('#1E3A8A', 'MOT-GEAR-001'),
  },
  {
    id: 'd-002',
    partNumber: 'HULL-WELD-042',
    name: '压力容器壳体焊接件',
    process: '焊接',
    equipmentModel: 'FRONIUS-TPS-5000',
    project: '新能源储罐一期',
    createdAt: '2025-05-02T14:05:00Z',
    thumbnail: svgThumb('#059669', 'HULL-WELD-042'),
  },
  {
    id: 'd-003',
    partNumber: 'SHAFT-CNC-108',
    name: '精密传动轴',
    process: '车削',
    equipmentModel: 'MAZAK-INTEGREX-i200',
    project: '航空精密件产线',
    createdAt: '2025-06-18T10:45:00Z',
    thumbnail: svgThumb('#DC2626', 'SHAFT-CNC-108'),
  },
  {
    id: 'd-004',
    partNumber: 'CAST-BODY-215',
    name: '泵体精铸件',
    process: '铸造',
    equipmentModel: 'DISAMATIC-230B',
    project: '石化泵阀扩产',
    createdAt: '2024-11-22T08:30:00Z',
    thumbnail: svgThumb('#D97706', 'CAST-BODY-215'),
  },
  {
    id: 'd-005',
    partNumber: 'STAMP-PAN-330',
    name: '结构件冲压外板',
    process: '冲压',
    equipmentModel: 'SCHULER-MSD-2000',
    project: '汽车轻量化项目',
    createdAt: '2025-01-09T16:20:00Z',
    thumbnail: svgThumb('#7C3AED', 'STAMP-PAN-330'),
  },
  {
    id: 'd-006',
    partNumber: 'BRK-CAL-077',
    name: '液压制动钳总成',
    process: '铣削',
    equipmentModel: 'HAAS-VF-4SS',
    project: '工程机械升级',
    createdAt: '2025-04-03T11:10:00Z',
    thumbnail: svgThumb('#0891B2', 'BRK-CAL-077'),
  },
  {
    id: 'd-007',
    partNumber: 'PIPE-BEND-512',
    name: '钛合金弯管组件',
    process: '焊接',
    equipmentModel: 'LINCOLN-POWERWAVE',
    project: '船舶管路改造',
    createdAt: '2024-12-01T09:00:00Z',
    thumbnail: svgThumb('#BE185D', 'PIPE-BEND-512'),
  },
  {
    id: 'd-008',
    partNumber: 'BEAR-HOU-066',
    name: '主轴轴承座',
    process: '车削',
    equipmentModel: 'OKUMA-LB4000',
    project: '风电主轴国产化',
    createdAt: '2025-02-14T13:50:00Z',
    thumbnail: svgThumb('#4338CA', 'BEAR-HOU-066'),
  },
];

export const drawingVersions: DrawingVersion[] = [
  // d-001 A(过期)→B(替代)→C(在用)
  { id: 'v-d001-a', drawingId: 'd-001', version: 'Rev.A', status: 'OBSOLETE', releaseDate: '2024-08-01', releasedBy: '张工程师', fileFormat: 'PDF', fileSize: 382731, pageCount: 4, replacesVersionId: 'v-d001-b', changeNotes: '初始版本，模数 2.5，齿数 42。' },
  { id: 'v-d001-b', drawingId: 'd-001', version: 'Rev.B', status: 'SUPERSEDED', releaseDate: '2024-12-10', releasedBy: '李工程师', fileFormat: 'PDF', fileSize: 412883, pageCount: 5, supersedesVersionId: 'v-d001-a', replacesVersionId: 'v-d001-c', changeNotes: '优化齿形，增加轮毂厚度 2mm。' },
  { id: 'v-d001-c', drawingId: 'd-001', version: 'Rev.C', status: 'ACTIVE', releaseDate: '2025-04-20', releasedBy: '李工程师', fileFormat: 'PDF', fileSize: 438210, pageCount: 5, supersedesVersionId: 'v-d001-b', changeNotes: '材料变更为 20CrMnTiH，增加渗碳层深度要求。' },

  // d-002 A(过期)→B(在用)
  { id: 'v-d002-a', drawingId: 'd-002', version: 'Rev.A', status: 'OBSOLETE', releaseDate: '2024-09-15', releasedBy: '张工程师', fileFormat: 'PDF', fileSize: 720000, pageCount: 8, replacesVersionId: 'v-d002-b', changeNotes: '初始版本，壁厚 28mm。' },
  { id: 'v-d002-b', drawingId: 'd-002', version: 'Rev.B', status: 'ACTIVE', releaseDate: '2025-05-20', releasedBy: '王管理员', fileFormat: 'PDF', fileSize: 756000, pageCount: 9, supersedesVersionId: 'v-d002-a', changeNotes: '焊缝形式变更，增加 UT 探伤要求。' },

  // d-003 A(在用)
  { id: 'v-d003-a', drawingId: 'd-003', version: 'Rev.A', status: 'ACTIVE', releaseDate: '2025-06-20', releasedBy: '李工程师', fileFormat: 'PDF', fileSize: 288000, pageCount: 3, changeNotes: '初始版本，Ra0.4 镜面加工。' },

  // d-004 A(过期)→B(替代)→C(在用)
  { id: 'v-d004-a', drawingId: 'd-004', version: 'Rev.A', status: 'OBSOLETE', releaseDate: '2024-03-10', releasedBy: '张工程师', fileFormat: 'PDF', fileSize: 512000, pageCount: 6, replacesVersionId: 'v-d004-b', changeNotes: '初始版本，HT250 材质。' },
  { id: 'v-d004-b', drawingId: 'd-004', version: 'Rev.B', status: 'SUPERSEDED', releaseDate: '2024-07-22', releasedBy: '张工程师', fileFormat: 'PDF', fileSize: 520000, pageCount: 6, supersedesVersionId: 'v-d004-a', replacesVersionId: 'v-d004-c', changeNotes: '调整浇口位置，减少缩松缺陷。' },
  { id: 'v-d004-c', drawingId: 'd-004', version: 'Rev.C', status: 'ACTIVE', releaseDate: '2025-02-28', releasedBy: '王管理员', fileFormat: 'PDF', fileSize: 548000, pageCount: 7, supersedesVersionId: 'v-d004-b', changeNotes: '材质升级为 QT500-7，增加抗拉强度要求。' },

  // d-005 A(替代)→B(在用)
  { id: 'v-d005-a', drawingId: 'd-005', version: 'Rev.A', status: 'SUPERSEDED', releaseDate: '2024-11-05', releasedBy: '李工程师', fileFormat: 'PDF', fileSize: 340000, pageCount: 4, replacesVersionId: 'v-d005-b', changeNotes: '初始版本，材料 DC04。' },
  { id: 'v-d005-b', drawingId: 'd-005', version: 'Rev.B', status: 'ACTIVE', releaseDate: '2025-03-01', releasedBy: '李工程师', fileFormat: 'PDF', fileSize: 352000, pageCount: 4, supersedesVersionId: 'v-d005-a', changeNotes: '增加翻边圆角 R3→R5，降低开裂风险。' },

  // d-006 A(在用)
  { id: 'v-d006-a', drawingId: 'd-006', version: 'Rev.A', status: 'ACTIVE', releaseDate: '2025-04-05', releasedBy: '张工程师', fileFormat: 'PDF', fileSize: 468000, pageCount: 6, changeNotes: '初始版本，含 11 个分件。' },

  // d-007 A(过期)→B(在用)
  { id: 'v-d007-a', drawingId: 'd-007', version: 'Rev.A', status: 'OBSOLETE', releaseDate: '2024-08-12', releasedBy: '张工程师', fileFormat: 'PDF', fileSize: 296000, pageCount: 5, replacesVersionId: 'v-d007-b', changeNotes: '初始版本，TA2 钛管。' },
  { id: 'v-d007-b', drawingId: 'd-007', version: 'Rev.B', status: 'ACTIVE', releaseDate: '2025-01-08', releasedBy: '王管理员', fileFormat: 'PDF', fileSize: 312000, pageCount: 5, supersedesVersionId: 'v-d007-a', changeNotes: '弯管半径调整 R2.5D，管路走向优化。' },

  // d-008 A(替代)→B(在用)
  { id: 'v-d008-a', drawingId: 'd-008', version: 'Rev.A', status: 'SUPERSEDED', releaseDate: '2024-10-18', releasedBy: '李工程师', fileFormat: 'PDF', fileSize: 320000, pageCount: 4, replacesVersionId: 'v-d008-b', changeNotes: '初始版本，配合公差 H7。' },
  { id: 'v-d008-b', drawingId: 'd-008', version: 'Rev.B', status: 'ACTIVE', releaseDate: '2025-03-12', releasedBy: '李工程师', fileFormat: 'PDF', fileSize: 328000, pageCount: 4, supersedesVersionId: 'v-d008-a', changeNotes: '公差升级 H6，增加形位公差标注。' },
];

export const downloadAuditLogs: DownloadAuditLog[] = (() => {
  const list: DownloadAuditLog[] = [];
  const scenarios = [
    { userId: 'u-001', userName: '张工程师', dept: '机械设计部', dId: 'd-001', pn: 'MOT-GEAR-001', v: 'Rev.C', vid: 'v-d001-c' },
    { userId: 'u-001', userName: '张工程师', dept: '机械设计部', dId: 'd-003', pn: 'SHAFT-CNC-108', v: 'Rev.A', vid: 'v-d003-a' },
    { userId: 'u-002', userName: '李工程师', dept: '工艺工程部', dId: 'd-001', pn: 'MOT-GEAR-001', v: 'Rev.C', vid: 'v-d001-c' },
    { userId: 'u-002', userName: '李工程师', dept: '工艺工程部', dId: 'd-004', pn: 'CAST-BODY-215', v: 'Rev.C', vid: 'v-d004-c' },
    { userId: 'u-002', userName: '李工程师', dept: '工艺工程部', dId: 'd-005', pn: 'STAMP-PAN-330', v: 'Rev.B', vid: 'v-d005-b' },
    { userId: 'u-001', userName: '张工程师', dept: '机械设计部', dId: 'd-002', pn: 'HULL-WELD-042', v: 'Rev.B', vid: 'v-d002-b' },
    { userId: 'u-003', userName: '王管理员', dept: '文档管控中心', dId: 'd-006', pn: 'BRK-CAL-077', v: 'Rev.A', vid: 'v-d006-a' },
    { userId: 'u-001', userName: '张工程师', dept: '机械设计部', dId: 'd-007', pn: 'PIPE-BEND-512', v: 'Rev.B', vid: 'v-d007-b' },
  ];
  const base = new Date('2025-06-01T08:30:00Z').getTime();
  scenarios.forEach((s, i) => {
    const t = new Date(base + i * 86400000 + i * 3600000 * 3 + Math.floor(Math.random() * 7200000));
    list.push({
      id: `log-${String(i + 1).padStart(4, '0')}`,
      userId: s.userId,
      userName: s.userName,
      userDepartment: s.dept,
      drawingId: s.dId,
      partNumber: s.pn,
      versionId: s.vid,
      version: s.v,
      downloadedAt: t.toISOString(),
      ipAddress: `192.168.10.${100 + i}`,
      watermarkCode: `WM-${uuidv4().slice(0, 8).toUpperCase()}`,
    });
  });
  return list;
})();

export const processOptions = ['车削', '铣削', '焊接', '铸造', '冲压'];
export const equipmentOptions = [
  'DMG-MORI-NVX5100',
  'FRONIUS-TPS-5000',
  'MAZAK-INTEGREX-i200',
  'DISAMATIC-230B',
  'SCHULER-MSD-2000',
  'HAAS-VF-4SS',
  'LINCOLN-POWERWAVE',
  'OKUMA-LB4000',
];
