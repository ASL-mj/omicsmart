# Mock 服务器使用说明

## 概述

本项目集成了 mock 服务器，用于在开发环境中模拟后端 API 接口。

## 启动方式

### 1. 启动项目（默认开启 Mock）

```bash
npm run dev
```

此命令会同时启动：
- Vite 开发服务器（端口：15000）
- Mock 服务器（端口：15001）

### 2. 启动项目（不使用 Mock）

```bash
npm run dev:no-mock
```

此命令只启动 Vite 开发服务器，不启动 Mock 服务器。

### 3. 单独启动 Mock 服务器

```bash
npm run mock
```

## 环境变量配置

在 `.env` 文件中配置：

```env
MOCK=true          # 是否启用 Mock（true/false）
MOCK_PORT=15001    # Mock 服务器端口
```

## Mock 接口说明

### 已实现的接口

#### 1. 获取项目信息
- **接口**: `GET /api/HomePage/getProjectInfo`
- **返回**: 项目基本信息（样本数、分组数、物种等）

#### 2. 获取文章列表
- **接口**: `GET /api/HomePage/getArticleList`
- **返回**: 轮播图和文章列表

#### 3. 获取更多文章
- **接口**: `GET /api/HomePage/getMoreArticle`
- **参数**:
  - `page`: 页码（默认：1）
  - `size`: 每页数量（默认：10）
  - `searchField`: 搜索字段（默认：title）
  - `keyword`: 搜索关键词
- **返回**: 分页文章列表

## 添加新的 Mock 接口

在 `mock/server.js` 中添加新的路由：

```javascript
// 示例：添加新接口
server.get('/api/your-endpoint', (req, res) => {
  res.jsonp({
    status: 1,
    result: {
      // 你的数据
    }
  });
});
```

## 技术栈

- **json-server**: Mock 服务器基础框架
- **nodemon**: 自动重启服务器（文件变化时）
- **concurrently**: 同时运行多个命令
- **cross-env**: 跨平台环境变量设置

## 注意事项

1. Mock 服务器会自动监听 `mock` 目录下的文件变化并重启
2. 修改 `.env` 文件后需要重启项目
3. 生产环境构建时不会包含 Mock 相关代码
4. 所有 API 请求会通过 Vite 代理转发到 Mock 服务器