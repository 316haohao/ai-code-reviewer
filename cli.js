#!/usr/bin/env node
import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const REVIEW_PROMPT = `
你是一位资深的高级软件工程师，擅长代码审查和质量分析。
请对以下代码进行全面审查，并从以下几个维度给出专业的反馈：

1. **代码质量**: 代码结构、可读性、命名规范、注释质量
2. **安全性**: 潜在的安全漏洞、SQL注入、XSS攻击、敏感数据泄露
3. **性能**: 性能瓶颈、优化建议、算法复杂度分析
4. **最佳实践**: 设计模式应用、代码复用、错误处理
5. **可维护性**: 可测试性、模块化程度、技术债务评估

请输出详细的审查报告，包含问题描述和优化建议。
`;

async function reviewCode(code, language = 'javascript', filename = 'code.js') {
  console.log(`\n🔍 正在审查文件: ${filename}`);
  console.log('='.repeat(60));

  const prompt = `${REVIEW_PROMPT}\n\n## 需要审查的代码 (${filename})\n\n\`\`\`${language}\n${code}\n\`\`\``;

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

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
AI Code Reviewer - CLI 工具

用法:
  node cli.js <file_path>          # 审查单个文件
  node cli.js --dir <dir_path>     # 审查目录下所有代码文件
  node cli.js --help               # 显示帮助信息

示例:
  node cli.js app.js
  node cli.js --dir ./src

支持的文件类型: .js, .jsx, .ts, .tsx, .json
    `);
    process.exit(0);
  }

  if (args[0] === '--dir') {
    const dirPath = args[1];
    
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      console.error('❌ 目录不存在:', dirPath);
      process.exit(1);
    }

    console.log(`📁 正在审查目录: ${dirPath}`);
    console.log('='.repeat(60));

    const files = fs.readdirSync(dirPath);
    let totalFiles = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      if (!fs.statSync(filePath).isFile()) continue;
      
      const ext = path.extname(file).slice(1);
      if (!['js', 'jsx', 'ts', 'tsx', 'json'].includes(ext)) continue;

      totalFiles++;
      
      try {
        const code = fs.readFileSync(filePath, 'utf-8');
        const review = await reviewCode(code, ext, file);
        
        console.log(`\n✅ ${file}`);
        console.log(review);
        console.log('\n' + '='.repeat(60));
        
        successCount++;
      } catch (e) {
        console.log(`\n❌ ${file} - 错误: ${e.message}`);
        errorCount++;
      }
    }

    console.log(`\n📊 审查完成: 总计 ${totalFiles} 个文件, 成功 ${successCount} 个, 失败 ${errorCount} 个`);
  } else {
    const filePath = args[0];
    
    if (!fs.existsSync(filePath)) {
      console.error('❌ 文件不存在:', filePath);
      process.exit(1);
    }

    const code = fs.readFileSync(filePath, 'utf-8');
    const ext = path.extname(filePath).slice(1) || 'javascript';
    
    const review = await reviewCode(code, ext, path.basename(filePath));
    console.log(review);
  }
}

main().catch(console.error);