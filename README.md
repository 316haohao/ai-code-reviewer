<div align="center">

# 🔍 AI Code Reviewer

> 基于AI的自动化代码审查工具，支持代码质量分析、安全性检查和性能优化建议

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js >= 18](https://img.shields.io/badge/Node.js-18.x+-green.svg)](https://nodejs.org/)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/ai-code-reviewer.svg?style=social)](https://github.com/yourusername/ai-code-reviewer)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/ai-code-reviewer.svg?style=social)](https://github.com/yourusername/ai-code-reviewer)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/ai-code-reviewer.svg)](https://github.com/yourusername/ai-code-reviewer/issues)
[![npm version](https://img.shields.io/npm/v/ai-code-reviewer.svg)](https://www.npmjs.com/package/ai-code-reviewer)

</div>

---

## 🌟 功能特点

| 功能 | 描述 | 状态 |
|------|------|------|
| 🧠 **AI代码审查** | 基于 GPT-4 的智能代码分析 | ✅ |
| ✅ **静态分析** | 集成 ESLint 进行代码规范检查 | ✅ |
| 🎨 **代码格式化** | 自动格式化代码风格 | ✅ |
| 📁 **批量审查** | 支持单文件和目录级审查 | ✅ |
| 🖥️ **CLI 工具** | 命令行快速审查 | ✅ |
| 🌐 **Web 服务** | RESTful API 接口 | ✅ |
| 🔒 **安全检查** | 检测潜在安全漏洞 | ✅ |
| 📊 **性能分析** | 性能瓶颈识别与优化建议 | ✅ |

---

## 📷 项目预览

<div align="center">
  <img src="https://neeko-copilot.bytedance.net/api/text2image?prompt=modern%20code%20review%20dashboard%20with%20AI%20analysis%20charts%20and%20code%20editor%20dark%20theme%20professional%20UI&image_size=landscape_16_9" alt="AI Code Reviewer Dashboard" width="600"/>
</div>

---

## 🛠️ 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| ⚙️ **后端框架** | Express.js | ^4.18.x |
| 🧠 **大模型** | OpenAI GPT-4 | - |
| ✅ **静态分析** | ESLint | ^8.57.x |
| 🎨 **代码格式化** | Prettier | ^3.2.x |
| 🔧 **CLI** | Commander | ^12.0.x |

---

## 🚀 快速开始

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

---

## 💻 CLI 使用

```bash
# 审查单个文件
node cli.js app.js

# 审查目录
node cli.js --dir ./src

# 显示帮助
node cli.js --help

# 格式化代码
node cli.js --format app.js
```

---

## 🌐 API 接口

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

---

## 📊 审查维度

| 维度 | 描述 |
|------|------|
| 📝 **代码质量** | 代码结构、可读性、命名规范、注释质量 |
| 🔒 **安全性** | 潜在安全漏洞、SQL注入、XSS攻击、敏感数据泄露 |
| ⚡ **性能** | 性能瓶颈、优化建议、算法复杂度分析 |
| 🏗️ **最佳实践** | 设计模式应用、代码复用、错误处理 |
| 🛠️ **可维护性** | 可测试性、模块化程度、技术债务评估 |

---

## 📁 项目结构

```
ai-code-reviewer/
├── server.js          # 主服务文件
├── cli.js             # 命令行工具
├── package.json       # 依赖配置
├── .env.example       # 环境变量示例
├── README.md          # 项目说明
└── public/            # 静态资源目录
```

---

## 📈 使用示例

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

---

## ❓ 常见问题

### Q: API 调用失败？
A: 检查 OpenAI API Key 是否正确配置

### Q: 审查速度慢？
A: 这是正常的，AI模型需要时间分析代码

### Q: 支持哪些语言？
A: 主要支持 JavaScript/TypeScript，其他语言有限支持

---

## 📄 许可证

本项目采用 [MIT License](LICENSE) 开源

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献者

<a href="https://github.com/yourusername/ai-code-reviewer/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=yourusername/ai-code-reviewer" />
</a>

---

<div align="center">

🔍 **AI Code Reviewer** - 让代码更优秀！

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/ai-code-reviewer&type=Date)](https://star-history.com/#yourusername/ai-code-reviewer&Date)

</div>
