# 暗区突围-无限数据统计系统

一个功能完整的暗区突围游戏数据统计系统，提供数据分析、排行榜、武器统计等功能。

## 功能特性

- 📊 **数据统计**: 大金刷新率、玩家数据、经济系统统计
- 🏆 **排行榜系统**: 多维度排行榜（击杀、撤离、金币、等级）
- 🔫 **武器装备统计**: 详细的武器使用数据和分析
- 💰 **经济系统**: 金币、物资价值统计和趋势分析
- 🔍 **搜索筛选**: 强大的搜索和筛选功能
- 📤 **数据导出**: 支持CSV和JSON格式导出
-  **数据可视化**: 丰富的图表展示

## 技术栈

- **前端**: 原生JavaScript + HTML5 + CSS3
- **数据可视化**: Chart.js
- **部署**: GitHub Pages + GitHub Actions
- **数据源**: 静态JSON数据

## 快速开始

### 本地预览

直接在浏览器中打开 `public/index.html` 文件即可预览。

或者使用本地服务器：

```bash
# 使用Python启动本地服务器
cd public
python -m http.server 8000

# 或使用Node.js的http-server
npx http-server public -p 8000
```

然后访问 http://localhost:8000

## 项目结构

```
暗区无限网页/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions部署配置
├── public/
│   ├── index.html              # 主页面
│   ├── style.css               # 样式文件
│   ├── script-standalone.js    # 前端逻辑（静态数据版本）
│   └── data.json               # 静态数据文件
└── README.md                   # 项目说明
```

## 功能说明

### 数据统计

- 总体玩家数据统计
- 各游戏模式在线人数
- 大金刷新率统计
- 经济系统数据分析

### 武器装备

- 武器列表展示
- 按类型筛选（步枪、冲锋枪、狙击枪等）
- 多维度排序（使用率、击杀数、胜率等）
- 武器属性雷达图对比

### 排行榜

- 多维度排行榜（击杀、撤离、金币、等级）
- 排行榜数据筛选
- 排行榜数据导出

### 数据导出

- 支持CSV格式导出
- 支持JSON格式导出
- 可导出武器数据、排行榜数据等

## 部署

### GitHub Pages部署

项目已配置GitHub Actions自动部署到GitHub Pages：

1. Fork本项目到你的GitHub账号
2. 在仓库设置中启用GitHub Pages，选择GitHub Actions作为部署源
3. 推送代码到main分支，自动触发部署
4. 访问 `https://你的用户名.github.io/暗区无限网页/`

### 部署流程

```bash
# 添加修改的文件
git add .

# 提交更改
git commit -m "更新描述"

# 推送到GitHub
git push
```

推送后，GitHub Actions会自动触发部署流程，通常需要2-5分钟完成。

## 数据更新

### 更新静态数据

编辑 `public/data.json` 文件，更新需要的数据内容。数据结构说明：

```json
{
  "stats": {
    "total_players": 125847,
    "active_players": 45231,
    "total_matches": 892341,
    "total_kills": 12456789,
    "total_extractions": 6789012
  },
  "game_modes": {
    "classic": {
      "online_players": 28456,
      "average_duration": 18
    }
  },
  "weapons": [
    {
      "name": "AK-47",
      "type": "步枪",
      "usage_rate": 28.5,
      "total_kills": 1256789,
      "win_rate": 45.2,
      "damage": 45,
      "fire_rate": 600,
      "accuracy": 72,
      "mobility": 65
    }
  ]
}
```

## 开发指南

### 添加新功能

1. 在 `public/index.html` 中添加UI元素
2. 在 `public/script-standalone.js` 中添加前端逻辑
3. 在 `public/style.css` 中添加样式
4. 在 `public/data.json` 中添加相应的数据

### 修改数据

直接编辑 `public/data.json` 文件，修改对应的数据内容。

### 自定义样式

修改 `public/style.css` 文件，调整页面样式和布局。

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 性能优化

- 使用静态JSON数据，无需后端请求
- 图表按需加载
- 数据筛选在前端完成，减少网络请求
- 响应式设计，适配各种设备

## 许可证

MIT License

## 更新日志

### v1.0.0 (2026-01-05)
- 初始版本发布
- 实现基础数据统计功能
- 添加排行榜系统
- 支持数据导出
- 完成GitHub Actions自动部署配置
- 迁移到静态数据版本，支持GitHub Pages部署