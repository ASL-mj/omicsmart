# Omicsmart 项目

基迪奥生物信息分析平台前端项目

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境启动

#### 启动项目（默认开启 Mock）

```bash
npm run dev
```

此命令会同时启动：
- Vite 开发服务器（端口：15000）
- Mock 服务器（端口：15001）

#### 启动项目（不使用 Mock）

```bash
npm run dev:no-mock
```

此命令只启动 Vite 开发服务器，不启动 Mock 服务器。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## Mock 服务器

项目集成了 Mock 服务器，用于在开发环境中模拟后端 API 接口。

### 环境变量配置

在 `.env` 文件中配置：

```env
MOCK=true          # 是否启用 Mock（true/false）
MOCK_PORT=15001    # Mock 服务器端口
```

### 详细说明

查看 [Mock 服务器使用说明](./mock/README.md) 了解更多信息。

## 技术栈

- **React 19** - UI 框架
- **Vite** - 构建工具
- **React Router** - 路由管理
- **Ant Design** - UI 组件库
- **ECharts** - 数据可视化
- **Axios** - HTTP 客户端
- **Express** - Mock 服务器框架

## 项目结构

```
.
├── mock/                  # Mock 服务器相关文件
│   ├── server.js         # Mock 服务器主文件
│   ├── db.json           # Mock 数据库
│   └── README.md         # Mock 使用说明
├── public/               # 静态资源
├── src/                  # 源代码
│   ├── assets/          # 资源文件
│   ├── components/      # 公共组件
│   ├── layouts/         # 布局组件
│   ├── pages/           # 页面组件
│   ├── router/          # 路由配置
│   ├── services/        # API 服务
│   └── utils/           # 工具函数
├── .env                  # 环境变量配置
├── vite.config.js       # Vite 配置
└── package.json         # 项目依赖

```

## 开发指南

### 添加新的 Mock 接口

在 `mock/server.js` 中添加新的路由：

```javascript
server.get('/api/your-endpoint', (req, res) => {
  res.json({
    status: 1,
    result: {
      // 你的数据
    }
  });
});
```

### 环境变量说明

- `MOCK`: 是否启用 Mock 服务器（true/false）
- `MOCK_PORT`: Mock 服务器端口号（默认：15001）

## 许可证

MIT