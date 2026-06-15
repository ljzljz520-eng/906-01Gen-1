# 工业图纸检索台 (Industrial Drawing Retrieval)

面向工程师与文档管理员的工业工程图纸检索与受控下发系统。

## 功能一览

- 🔍 **多维度检索**：按零件号、工艺、设备型号、版本号、版本状态组合检索图纸
- 📋 **版本全生命周期**：详情页时间轴清晰标注 **在用 (ACTIVE) / 已替代 (SUPERSEDED) / 过期 (OBSOLETE)**，并可视化版本演进链路
- 💧 **水印受控下载**：下载的 PDF 文件自动嵌入项目名、下载人、部门、下载时间、唯一水印编码（斜向重复水印 + 页眉页脚显式水印）
- 🛡️ **审计追踪**：管理员后台可追溯每一次下载：谁、何时、拿走了哪一版，支持按用户/图纸/日期维度统计与 CSV 导出
- 🔐 **角色权限**：普通工程师仅可见自身下载记录；文档管理员 (ADMIN) 可见全局审计

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite |
| 路由/状态 | React Router 7 + Zustand (persist) |
| 样式 | Tailwind CSS 3 + 工业风设计规范 |
| 后端 | Express 4 + TypeScript + tsx |
| 鉴权 | bcryptjs + JWT (Bearer Token) |
| PDF 水印 | pdf-lib (纯 JS，无原生依赖) |
| 数据 | 内存 Mock 数据层（零原生编译，开箱即用） |

## 快速开始

```bash
# 安装依赖
npm install

# 启动前后端 (Vite @ 5173 + Express @ 3199)
npm run dev
```

浏览器打开 http://localhost:5173 即可体验。

### 演示账号（密码统一为 `123456`）

| 工号 | 角色 | 姓名 |
|---|---|---|
| `ENG001` | 工程师 | 张工程师 |
| `ENG002` | 工程师 | 李工程师 |
| `ADM001` | 文档管理员 | 王管理员 |

## 目录结构

```
.
├── api/                     # 后端 Express 服务
│   ├── controllers/         # 业务控制器 (auth / drawing / audit)
│   ├── db/                  # 内存 Mock 数据
│   ├── middleware/          # JWT 鉴权 + 角色校验
│   ├── routes/              # 路由挂载
│   ├── services/            # PDF 生成与水印服务
│   ├── types/               # 全局类型定义
│   ├── app.ts               # Express 装配
│   └── server.ts            # 启动入口 (端口 3199)
├── src/                     # 前端 React 应用
│   ├── components/          # UI 组件 (StatusBadge / FilterPanel / DrawingCard / VersionTimeline ...)
│   ├── pages/               # 页面 (Login / DrawingSearch / DrawingDetail / AuditTrail)
│   ├── store/               # Zustand 鉴权 Store
│   ├── types/               # 前端类型定义
│   ├── utils/               # API http 封装
│   └── index.css            # Tailwind + 工业风工具类
├── tailwind.config.js       # 工业调色板 / 字体 / 动画
├── vite.config.ts           # Vite 代理 /api → http://localhost:3199
└── package.json
```

## 主要 API

| Method | Path | 说明 | 权限 |
|---|---|---|---|
| POST | `/api/auth/login` | 工号密码登录换 JWT | 公开 |
| GET | `/api/auth/me` | 当前用户信息 | 登录 |
| GET | `/api/drawings/meta` | 工艺 / 设备 / 状态枚举 | 登录 |
| GET | `/api/drawings` | 多条件图纸检索 | 登录 |
| GET | `/api/drawings/:id` | 图纸详情 + 所有版本 | 登录 |
| GET | `/api/drawings/:id/versions/:vid/relation` | 版本演进链路 | 登录 |
| GET | `/api/drawings/:id/versions/:vid/download` | 带水印下载 PDF | 登录 |
| GET | `/api/audit/logs` | 下载审计日志 (分页) | 登录 (ADMIN 看全部) |
| GET | `/api/audit/stats` | 审计统计 (用户 / 图纸 / 按日) | ADMIN |
| POST | `/api/audit/logs/export` | 审计日志 CSV 导出 | ADMIN |

## 设计规范

- **主色**：工业蓝 `#1E3A8A`，辅色钢铁灰系
- **字体**：Oswald (工业感标题) / JetBrains Mono (零件号、版本号等宽) / Noto Sans SC (中文)
- **视觉元素**：斜线 hatch 纹理、硬朗直角、状态色呼吸发光、卡片交错入场动画
