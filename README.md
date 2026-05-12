# AI Code Reviewer

基于AI的自动化代码审查工具，支持代码质量分析、安全性检查和性能优化建议。

## 功能特点

- 🧠 **AI 代码审查** - 基于 GPT-4 的智能代码分析
- ✅ **静态分析** - 集成 ESLint 进行代码规范检查
- 🎨 **代码格式化** - 自动格式化代码风格
- 📁 **批量审查** - 支持单文件和目录级审查
- 🖥️ **CLI 工具** - 命令行快速审查
- 🌐 **Web 服务** - RESTful API 接口

## 技术栈

- **后端框架**: Express.js
- **大模型**: OpenAI GPT-4
- **静态分析**: ESLint
- **代码格式化**: Prettier

## 快速开始

### 环境要求

- Node.js >= 18.x
- OpenAI API Key

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
cp .env.example .env
```

```env
OPENAI_API_KEY=your_openai_api_key
PORT=3001
```

### 启动服务

```bash
npm run dev
```

### CLI 使用

```bash
# 审查单个文件
node cli.js app.js

# 审查目录
node cli.js --dir ./src

# 显示帮助
node cli.js --help
```

## API 接口

### 健康检查

```
GET /api/health
```

### 代码审查

```
POST /api/review
Content-Type: application/json

{
  "code": "function hello() { console.log('Hello'); }",
  "language": "javascript",
  "filename": "app.js"
}
```

### 文件审查

```
POST /api/review-file
Content-Type: application/json

{
  "filePath": "/path/to/code.js"
}
```

### 目录审查

```
POST /api/review-directory
Content-Type: application/json

{
  "dirPath": "/path/to/src"
}
```

### 代码格式化

```
POST /api/format
Content-Type: application/json

{
  "code": "function hello() {}",
  "language": "javascript"
}
```

## 使用示例

```javascript
import axios from 'axios';

// 审查代码
const result = await axios.post('http://localhost:3001/api/review', {
  code: `function getUser(id) {
    return db.query('SELECT * FROM users WHERE id=' + id);
  }`,
  language: 'javascript'
});

console.log(result.data.aiReview);
```

## 项目结构

```
.
├── server.js          # 主服务文件
├── cli.js             # 命令行工具
├── package.json       # 依赖配置
├── .env.example       # 环境变量示例
├── README.md          # 项目说明
└── public/            # 静态资源目录
```

## 审查维度

1. **代码质量** - 代码结构、可读性、命名规范、注释质量
2. **安全性** - 潜在安全漏洞、SQL注入、XSS攻击、敏感数据泄露
3. **性能** - 性能瓶颈、优化建议、算法复杂度分析
4. **最佳实践** - 设计模式应用、代码复用、错误处理
5. **可维护性** - 可测试性、模块化程度、技术债务评估

## 许可证

MIT License
