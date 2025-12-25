# CLAUDE.md

## 提交信息规范

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范，Release Notes 会根据前缀自动分类。

### 格式

```
<类型>[可选作用域]: <描述>
```

### 类型

| 类型 | 说明 | Release Notes 分类 |
|------|------|-------------------|
| `feat` | 新功能 | ✨ 新功能 |
| `fix` | 问题修复 | 🐛 问题修复 |
| `ci` | CI/CD 配置 | 🔨 CI/CD |
| `build` | 构建相关 | 🔨 CI/CD |
| `docs` | 文档更新 | - |
| `style` | 代码风格（不影响逻辑） | - |
| `refactor` | 重构（无功能变化） | - |
| `perf` | 性能优化 | - |
| `test` | 测试相关 | - |
| `chore` | 杂项维护 | - |

### 示例

```bash
feat: 添加暗色主题支持
feat(terminal): 支持自定义字体大小
fix: 修复窗口关闭时崩溃问题
fix(editor): 解决中文输入法兼容问题
ci: 优化 GitHub Actions 构建流程
chore: 版本更新至 0.1.8
```

### 注意事项

- 描述使用中文
- 作用域可选，用于标注影响范围（如 `terminal`、`editor`、`main` 等）
- 仅 `feat`、`fix`、`ci`、`build` 前缀的提交会出现在自动生成的 Release Notes 中
