# VideoCap CLI

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/CLI-4D4D4D?style=for-the-badge&logo=windows-terminal&logoColor=white" alt="CLI">
  <img src="https://img.shields.io/badge/Whisper-FF6B6B?style=for-the-badge&logo=openai&logoColor=white" alt="Whisper">
</p>

<p align="center">
  <strong>一个强大的视频字幕自动生成命令行工具</strong>
</p>

<p align="center">
  使用 OpenAI Whisper 模型从视频音频中自动生成高质量字幕文件
</p>

---

## 🚧 开发状态

> **注意：此项目目前处于早期开发阶段**
>
> 当前已完成基础架构搭建，正在开发核心视频处理功能。

### 当前进度

- ✅ **项目架构** - TypeScript + ESNext 模块系统
- ✅ **构建工具** - Rolldown 打包配置
- ✅ **代码质量** - ESLint + Prettier 配置
- ✅ **CLI 框架** - 基于 CAC 的命令行界面
- ✅ **依赖集成** - nodejs-whisper 语音识别集成
- 🚧 **核心功能** - 视频处理和字幕生成 (开发中)
- 🚧 **测试框架** - 单元测试和集成测试 (计划中)
- 🚧 **文档完善** - 详细使用文档 (计划中)

## ✨ 规划特性

- 🎯 **高精度转录** - 基于 OpenAI Whisper 模型
- 🚀 **本地处理** - 无需上传文件，保护隐私
- 📁 **多格式支持** - 支持 MP4, AVI, MOV, MKV 等视频格式
- 💾 **多种输出** - 支持 SRT, VTT, JSON, LRC 等字幕格式
- 🌐 **多语言识别** - 支持中文、英文等多种语言
- ⚡ **性能优化** - 支持不同模型大小选择
- 🛠️ **易于使用** - 简单直观的命令行界面

## 🚀 快速开始

### 环境要求

- Node.js 18+
- pnpm (推荐) 或 npm
- TypeScript 5+

### 本地开发

```bash
# 克隆项目
git clone https://github.com/your-username/videocap-cli.git
cd videocap-cli

# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 构建项目
pnpm run build

# 代码格式化
pnpm run format

# 代码检查
pnpm run lint

# 类型检查
pnpm run typecheck
```

### 当前可用命令

```bash
# 查看帮助
node dist/cli.js --help

# 查看版本
node dist/cli.js --version

# 基本命令结构 (开发中)
node dist/cli.js [input] --output [output]
```

## 📁 项目结构

```
videocap-cli/
├── src/
│   ├── cli.ts              # CLI 入口点
│   ├── index.ts            # 主入口文件
│   └── (开发中...)
├── dist/                   # 构建输出
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
├── rolldown.config.ts      # 构建配置
├── eslint.config.js        # ESLint 配置
├── .prettierrc.yaml        # Prettier 配置
└── README.md
```

## 🛠️ 技术栈

### 核心技术

- **TypeScript** - 类型安全的 JavaScript
- **Node.js** - 运行时环境
- **ESNext** - 现代 JavaScript 模块系统

### 构建工具

- **Rolldown** - 高性能 JavaScript 打包器
- **TSC** - TypeScript 编译器

### 代码质量

- **ESLint** - 代码检查工具
- **Prettier** - 代码格式化工具
- **TypeScript ESLint** - TypeScript 专用规则

### 核心依赖

- **cac** - 轻量级 CLI 框架
- **nodejs-whisper** - Node.js Whisper 绑定

## 📋 开发计划

### Phase 1: 核心功能 (当前)

- [ ] 视频文件输入处理
- [ ] 音频提取功能
- [ ] Whisper 模型集成
- [ ] 基本字幕生成

### Phase 2: 功能增强

- [ ] 多种输出格式支持
- [ ] 语言检测和选择
- [ ] 模型大小选择
- [ ] 批处理支持

### Phase 3: 用户体验

- [ ] 进度显示
- [ ] 错误处理优化
- [ ] 配置文件支持
- [ ] 详细文档

### Phase 4: 高级功能

- [ ] GPU 加速支持
- [ ] 字幕后处理
- [ ] 多线程处理
- [ ] 插件系统

## 🤝 贡献

欢迎贡献代码！项目目前处于早期开发阶段，非常欢迎各种形式的贡献。

### 贡献方式

1. **报告问题** - 在 Issues 中报告 bug 或建议
2. **功能建议** - 提出新功能的想法
3. **代码贡献** - 提交 Pull Request
4. **文档改进** - 完善项目文档

### 开发流程

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 代码规范

- 使用 TypeScript 编写代码
- 遵循 ESLint 和 Prettier 规范
- 编写清晰的提交信息
- 添加适当的类型注解

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [OpenAI Whisper](https://github.com/openai/whisper) - 强大的语音识别模型
- [nodejs-whisper](https://github.com/ChetanXpro/nodejs-whisper) - Node.js Whisper 绑定
- [CAC](https://github.com/cacjs/cac) - 轻量级 CLI 框架
- [Rolldown](https://github.com/rolldown/rolldown) - 高性能打包工具

## 📞 联系

如有问题或建议，请：

- 创建 [Issue](https://github.com/your-username/videocap-cli/issues)
- 发起 [Discussion](https://github.com/your-username/videocap-cli/discussions)
- 联系维护者

---

<p align="center">
  <strong>⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！</strong>
</p>

<p align="center">
  Made with ❤️ by developers, for developers
</p>
