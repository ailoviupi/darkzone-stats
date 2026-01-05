# 暗区突围-无限数据统计系统

一个功能完整的暗区突围游戏数据统计系统，提供实时数据分析、排行榜、武器统计等功能。

## 功能特性

- 📊 **实时数据统计**: 大金刷新率、玩家数据、经济系统统计
- 🏆 **排行榜系统**: 多维度排行榜（击杀、撤离、金币、等级）
- 🔫 **武器装备统计**: 详细的武器使用数据和分析
- 💰 **经济系统**: 金币、物资价值统计和趋势分析
- 🔍 **搜索筛选**: 强大的搜索和筛选功能
- 📤 **数据导出**: 支持CSV和JSON格式导出
- 🔄 **实时更新**: WebSocket实时数据推送
- 📈 **数据可视化**: 丰富的图表展示

## 技术栈

- **后端**: Node.js + Express
- **数据库**: SQLite
- **前端**: 原生JavaScript + HTML5 + CSS3
- **实时通信**: Socket.io
- **数据可视化**: Chart.js
- **部署**: GitHub Pages + GitHub Actions

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 初始化数据库

```bash
npm run init-db
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 项目结构

```
暗区无限网页/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions部署配置
├── database/
│   └── init.js                 # 数据库初始化脚本
├── public/
│   ├── index.html              # 主页面
│   ├── style.css               # 样式文件
│   └── script.js               # 前端逻辑
├── server.js                   # 服务器入口
├── package.json                # 项目配置
└── README.md                   # 项目说明
```

## API接口

### 数据统计

- `GET /api/stats` - 获取总体统计数据
- `GET /api/gold-spawn` - 获取大金刷新率
- `GET /api/economy` - 获取经济统计数据

### 武器装备

- `GET /api/weapons` - 获取武器列表
- `GET /api/weapons/:id` - 获取武器详情
- `GET /api/weapons?type=步枪` - 按类型筛选武器

### 排行榜

- `GET /api/leaderboard?category=total_kills&limit=10` - 获取排行榜
- 支持的分类: `total_kills`, `total_extractions`, `total_coins`, `level`

### 搜索

- `GET /api/search?q=关键词` - 搜索武器、地图、玩家

### 数据导出

- `GET /api/export/weapons?format=csv` - 导出武器数据
- `GET /api/export/leaderboard?format=json` - 导出排行榜数据

### WebSocket事件

- `subscribe-updates` - 订阅实时更新
- `gold-update` - 大金刷新更新
- `economy-update` - 经济数据更新

## 部署

### GitHub Pages部署

项目已配置GitHub Actions自动部署到GitHub Pages：

1. Fork本项目到你的GitHub账号
2. 在仓库设置中启用GitHub Pages
3. 推送代码到main分支，自动触发部署
4. 访问 `https://你的用户名.github.io/暗区无限网页/`

### 手动部署

```bash
# 构建项目
npm run build

# 部署到服务器
scp -r public/* user@server:/path/to/website/
```

## 环境变量

创建 `.env` 文件配置环境变量：

```env
PORT=3000
NODE_ENV=production
DATABASE_PATH=./database/data.db
```

## 开发指南

### 添加新功能

1. 在 `server.js` 中添加新的API路由
2. 在 `database/init.js` 中添加数据库表结构
3. 在 `public/index.html` 中添加UI元素
4. 在 `public/script.js` 中添加前端逻辑
5. 在 `public/style.css` 中添加样式

### 数据库操作

使用 `dbQuery` 函数执行数据库查询：

```javascript
const result = await dbQuery('SELECT * FROM players WHERE id = ?', [playerId]);
```

## 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交Issue。

## 更新日志

### v1.0.0 (2026-01-05)
- 初始版本发布
- 实现基础数据统计功能
- 添加排行榜系统
- 支持数据导出
- 集成WebSocket实时更新
- 完成GitHub Actions自动部署配置