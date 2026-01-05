# GitHub部署详细指南

## 前置准备

### 1. 安装Git
- 下载并安装Git: https://git-scm.com/downloads
- 安装完成后，打开终端验证：
  ```bash
  git --version
  ```

### 2. 配置Git用户信息
```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱@example.com"
```

### 3. 生成SSH密钥（推荐）
```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "你的邮箱@example.com"

# 启动SSH代理
eval "$(ssh-agent -s)"

# 添加SSH私钥
ssh-add ~/.ssh/id_ed25519

# 复制公钥内容
cat ~/.ssh/id_ed25519.pub
```

然后将公钥添加到GitHub：
1. 访问 https://github.com/settings/keys
2. 点击 "New SSH key"
3. 粘贴公钥内容
4. 点击 "Add SSH key"

## 部署步骤

### 第一步：创建GitHub仓库

1. **登录GitHub**：访问 https://github.com

2. **创建新仓库**：
   - 点击右上角的 "+" 按钮
   - 选择 "New repository"
   - 填写仓库信息：
     - **Repository name**: `暗区无限网页`（或您喜欢的英文名，如 `darkzone-stats`）
     - **Description**: 暗区突围游戏数据统计系统
     - **Public/Private**: 选择 **Public**（GitHub Pages需要公开仓库）
     - **不要勾选** "Add a README file"
   - 点击 "Create repository"

3. **记录仓库地址**：
   - SSH地址：`git@github.com:你的用户名/暗区无限网页.git`
   - HTTPS地址：`https://github.com/你的用户名/暗区无限网页.git`

### 第二步：本地Git操作

#### 1. 初始化Git仓库（已完成）
```bash
git init
```

#### 2. 添加所有文件到暂存区
```bash
git add .
```

#### 3. 创建首次提交
```bash
git commit -m "Initial commit: 暗区突围数据统计系统"
```

#### 4. 添加远程仓库
```bash
# 使用SSH（推荐）
git remote add origin git@github.com:你的用户名/暗区无限网页.git

# 或使用HTTPS
git remote add origin https://github.com/你的用户名/暗区无限网页.git
```

#### 5. 推送到GitHub
```bash
# 推送到main分支
git branch -M main
git push -u origin main
```

### 第三步：配置GitHub Pages

#### 1. 启用GitHub Pages
1. 进入您的GitHub仓库
2. 点击 "Settings" 标签
3. 在左侧菜单中找到 "Pages"
4. 在 "Build and deployment" 部分：
   - **Source**: 选择 "GitHub Actions"
   - （因为我们已经配置了GitHub Actions工作流）

#### 2. 配置GitHub Actions权限
1. 进入仓库的 "Settings"
2. 点击 "Actions" → "General"
3. 在 "Workflow permissions" 部分：
   - 选择 "Read and write permissions"
   - 勾选 "Allow GitHub Actions to create and approve pull requests"
4. 点击 "Save"

### 第四步：验证部署

#### 1. 查看部署状态
1. 进入仓库的 "Actions" 标签
2. 查看最新的工作流运行状态
3. 等待工作流完成（通常需要2-5分钟）

#### 2. 访问部署的网站
部署成功后，访问：
```
https://你的用户名.github.io/暗区无限网页/
```

如果仓库名是英文，如 `darkzone-stats`，则访问：
```
https://你的用户名.github.io/darkzone-stats/
```

## 常见问题解决

### 问题1：推送时提示身份验证失败

**解决方案**：
```bash
# 使用SSH方式
git remote set-url origin git@github.com:你的用户名/暗区无限网页.git

# 测试SSH连接
ssh -T git@github.com
```

### 问题2：GitHub Actions部署失败

**解决方案**：
1. 检查Actions权限设置（见第三步第2点）
2. 查看Actions日志，找到具体错误信息
3. 常见错误：
   - Node.js版本不匹配：修改 `.github/workflows/deploy.yml` 中的 `node-version`
   - 依赖安装失败：检查 `package.json` 是否正确

### 问题3：页面无法访问

**解决方案**：
1. 检查仓库是否为Public
2. 确认GitHub Pages已启用
3. 查看Actions部署是否成功
4. 清除浏览器缓存后重试

### 问题4：数据库文件被提交到仓库

**解决方案**：
```bash
# 从Git中删除数据库文件
git rm --cached database/*.db
git rm --cached database/*.sqlite

# 提交更改
git commit -m "Remove database files from git"
git push
```

## 持续更新部署

### 更新代码后部署
```bash
# 1. 添加修改的文件
git add .

# 2. 提交更改
git commit -m "更新功能描述"

# 3. 推送到GitHub
git push
```

推送后，GitHub Actions会自动触发部署流程。

### 查看部署历史
1. 访问仓库的 "Actions" 标签
2. 可以查看每次部署的详细日志
3. 点击具体的工作流可以查看部署状态和日志

## 本地开发与生产环境

### 本地开发
```bash
# 安装依赖
npm install

# 初始化数据库
npm run init-db

# 启动开发服务器
npm run dev
```

访问：http://localhost:3000

### 生产环境部署
GitHub Actions会自动部署到GitHub Pages，无需手动操作。

## 高级配置

### 自定义域名

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容为您的域名，如：
   ```
   www.yourdomain.com
   ```
3. 在域名DNS设置中添加：
   - 类型：CNAME
   - 名称：www
   - 值：`你的用户名.github.io`

### 环境变量配置

在GitHub仓库中设置：
1. 进入 "Settings" → "Secrets and variables" → "Actions"
2. 点击 "New repository secret"
3. 添加需要的环境变量

### 自动化测试

在 `.github/workflows/deploy.yml` 中添加测试步骤：
```yaml
- name: Run tests
  run: npm test
```

## 维护建议

1. **定期更新依赖**：
   ```bash
   npm update
   ```

2. **监控部署状态**：定期查看Actions运行状态

3. **备份数据**：定期备份数据库文件

4. **性能优化**：监控网站加载速度，优化资源

## 联系支持

如遇到问题：
1. 查看GitHub Actions日志
2. 搜索GitHub官方文档
3. 提交Issue到项目仓库

## 部署检查清单

- [ ] Git已安装并配置
- [ ] SSH密钥已添加到GitHub
- [ ] GitHub仓库已创建（Public）
- [ ] 代码已推送到main分支
- [ ] GitHub Pages已启用
- [ ] GitHub Actions权限已配置
- [ ] Actions工作流运行成功
- [ ] 网站可以正常访问

完成以上所有步骤后，您的暗区突围数据统计系统就成功部署到GitHub Pages了！
