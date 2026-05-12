import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { ESLint } from 'eslint';
import prettier from 'prettier';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const REVIEW_PROMPT = `
你是一位资深的高级软件工程师，擅长代码审查和质量分析。
请对以下代码进行全面审查，并从以下几个维度给出专业的反馈：

1. **代码质量**: 代码结构、可读性、命名规范、注释质量
2. **安全性**: 潜在的安全漏洞、SQL注入、XSS攻击、敏感数据泄露
3. **性能**: 性能瓶颈、优化建议、算法复杂度分析
4. **最佳实践**: 设计模式应用、代码复用、错误处理
5. **可维护性**: 可测试性、模块化程度、技术债务评估

请按照以下格式输出审查结果：

## 📊 代码审查报告

### 1. 总体评价
- 代码质量等级: [A/B/C/D/E]
- 建议修改项数量: [X]

### 2. 详细问题

#### [问题类型] - [严重程度: 高/中/低]
**位置**: [文件路径:行号]
**问题描述**: [详细描述问题]
**优化建议**: [具体的优化代码或方案]

### 3. 优化后代码
[提供优化后的完整代码片段]

### 4. 总结建议
[对整体代码的改进建议]
`;

async function analyzeCodeWithESLint(code, language = 'javascript') {
  const eslint = new ESLint({
    overrideConfig: {
      env: { node: true, es2020: true },
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
      rules: {
        'no-unused-vars': 'warn',
        'no-undef': 'error',
        'semi': ['error', 'always'],
        'quotes': ['error', 'single'],
        'no-console': 'warn',
        'prefer-const': 'warn',
        'no-var': 'error',
        'eqeqeq': ['error', 'always'],
      }
    }
  });

  const results = await eslint.lintText(code, { filePath: `code.${language}` });
  return results[0]?.messages || [];
}

async function analyzeCodeWithAI(code, language = 'javascript', filename = 'code.js') {
  const prompt = `${REVIEW_PROMPT}\n\n## 需要审查的代码\n\n\`\`\`${language}\n${code}\n\`\`\``;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: '你是一位资深的高级软件工程师，擅长代码审查和质量分析。' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
    max_tokens: 4000
  });

  return response.choices[0].message.content;
}

function formatCode(code, language = 'javascript') {
  try {
    return prettier.format(code, {
      parser: language === 'typescript' ? 'typescript' : 'babel',
      semi: true,
      singleQuote: true,
      trailingComma: 'es5'
    });
  } catch {
    return code;
  }
}

app.post('/api/review', async (req, res) => {
  try {
    const { code, language = 'javascript', filename = 'code.js' } = req.body;
    
    if (!code || code.trim().length === 0) {
      return res.status(400).json({ error: '代码内容不能为空' });
    }

    const [eslintResults, aiReview] = await Promise.all([
      analyzeCodeWithESLint(code, language),
      analyzeCodeWithAI(code, language, filename)
    ]);

    const formattedCode = formatCode(code, language);

    res.json({
      success: true,
      aiReview,
      eslintResults,
      formattedCode,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/review-file', async (req, res) => {
  try {
    const { filePath } = req.body;
    
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ error: '文件不存在' });
    }

    const code = fs.readFileSync(filePath, 'utf-8');
    const ext = path.extname(filePath).slice(1) || 'javascript';
    
    const [eslintResults, aiReview] = await Promise.all([
      analyzeCodeWithESLint(code, ext),
      analyzeCodeWithAI(code, ext, path.basename(filePath))
    ]);

    res.json({
      success: true,
      filename: path.basename(filePath),
      aiReview,
      eslintResults,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('File review error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/review-directory', async (req, res) => {
  try {
    const { dirPath } = req.body;
    
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      return res.status(400).json({ error: '目录不存在' });
    }

    const results = [];
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      if (!fs.statSync(filePath).isFile()) continue;
      
      const ext = path.extname(file).slice(1);
      if (!['js', 'jsx', 'ts', 'tsx', 'json'].includes(ext)) continue;

      const code = fs.readFileSync(filePath, 'utf-8');
      
      try {
        const aiReview = await analyzeCodeWithAI(code, ext, file);
        results.push({
          filename: file,
          aiReview,
          status: 'success'
        });
      } catch (e) {
        results.push({
          filename: file,
          error: e.message,
          status: 'error'
        });
      }
    }

    res.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Directory review error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/format', async (req, res) => {
  try {
    const { code, language = 'javascript' } = req.body;
    const formattedCode = formatCode(code, language);
    
    res.json({
      success: true,
      formattedCode
    });
  } catch (error) {
    console.error('Format error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Code Review Server running on http://localhost:${PORT}`);
});

export default app;