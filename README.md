# Construere Client

一个基于 Vue 3 + TypeScript + Vite 构建的现代化前端应用。

## 🚀 技术栈

- **前端框架**: Vue 3.5.17
- **构建工具**: Vite 7.0.4
- **开发语言**: TypeScript 5.8.3
- **样式框架**: Tailwind CSS 4.1.11
- **路由管理**: Vue Router 4.5.1
- **UI组件**: Headless UI Vue 1.7.23
- **3D图形**: Three.js 0.178.0
- **动画库**: Anime.js 4.0.2
- **样式预处理**: Sass 1.89.2

## 📁 项目结构

```
construere-client/
├── src/                    # 源代码目录
│   ├── assets/            # 静态资源
│   ├── components/        # 公共组件
│   ├── install/           # 安装配置
│   ├── router/            # 路由配置
│   ├── types/             # 类型定义
│   ├── utils/             # 工具函数
│   ├── views/             # 页面视图
│   │   ├── home/          # 首页
│   │   ├── chat/          # 聊天页面
│   │   └── start/         # 开始页面
│   ├── App.vue            # 根组件
│   ├── main.ts            # 应用入口
│   └── style.css          # 全局样式
├── public/                # 公共资源
├── dist/                  # 构建输出
├── index.html             # HTML模板
├── vite.config.ts         # Vite配置
├── tailwind.config.js     # Tailwind配置
├── tsconfig.json          # TypeScript配置
└── package.json           # 项目依赖
```

## 🛠️ 开发环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

## 📦 安装依赖

```bash
npm install
# 或
yarn install
```

## 🚀 开发命令

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览构建结果
```bash
npm run preview
# 或
yarn preview
```

## 🌐 开发服务器配置

项目配置了以下代理：

- **阿里云语音服务**: `/stream/v1` → `https://nls-gateway-cn-shanghai.aliyuncs.com`
- **Thrift服务**: `/thrift` → `http://10.31.13.177:52002`

## 🎨 主要功能

### 首页 (Home)
- 支持多种布局模式：基础模式、无图片模式、专业模式
- 3D模型展示 (支持.fbx格式)
- 响应式设计

### 聊天功能 (Chat)
- 实时聊天界面
- 页面过渡动画

### 开始页面 (Start)
- 应用启动引导

## 🔧 开发特性

- **TypeScript支持**: 完整的类型检查
- **热重载**: 开发时实时更新
- **路由管理**: 基于Vue Router的SPA路由
- **组件化**: 模块化的Vue组件架构
- **样式系统**: Tailwind CSS + Sass
- **3D支持**: Three.js集成
- **动画效果**: 页面过渡和交互动画

## 📱 移动端支持

- 响应式设计
- 触摸友好的交互
- 移动端调试工具 (Eruda)

## 🚀 部署

项目配置为相对路径部署 (`base: './'`)，可以部署到任何静态文件服务器。

构建后的文件位于 `dist/` 目录。

## 🤝 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目为私有项目。

## 📞 联系方式

如有问题或建议，请联系项目维护者。
