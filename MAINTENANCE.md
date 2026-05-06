# 到期提醒助手维护规范

本文件用于记录 `due-reminder-app` 仓库的长期维护约定。后续 Codex 或其他 AI 接手开发时，应先阅读本文件，再执行代码修改、提交和推送。

## 代码提交规范

统一使用以下提交格式：

```bash
git commit -m "type: 中文提交说明"
```

`type` 只使用以下类别：

1. `feat`：新功能
2. `fix`：修补 bug
3. `docs`：文档
4. `style`：格式，不影响代码运行的变动
5. `refactor`：重构，既不是新功能，也不是修补 bug 的代码变动
6. `test`：增加测试
7. `chore`：构建过程或辅助工具的变动

## 提交要求

1. commit message 使用中文说明。
2. `type` 后使用英文冒号和一个空格。
3. 示例：`feat: 初始化到期提醒助手M2本地事项闭环`
4. 示例：`docs: 补充代码提交规范`
5. 避免使用 `update`、`修改`、`临时提交` 等不可回溯描述。
6. 单次提交尽量保持主题聚焦，不混入无关变更。
7. 提交前优先运行与变更相关的验证命令。
8. 推送前确认当前分支和远端，避免推错仓库。

## 当前远端

```bash
origin git@github.com:Henery002/due-reminder-app.git
```

默认开发分支：`main`

## Android 构建维护约定

1. 当前优先保持 Expo managed workflow，`android/` 和 `ios/` 生成目录默认不提交。
2. Android 正式维护包名：`com.henery.duereminderapp`。
3. App 展示名称：`到期提醒助手`。
4. 本地 development build 详见 `docs/DEVELOPMENT_BUILD.md`。
5. 如果 native 构建因 Maven 访问失败，优先使用本机 Gradle 镜像配置或重新生成 native 工程，不要为了临时镜像改动提交整个 `android/` 目录。

## 视觉系统维护约定

1. 后续 UI 修改必须先阅读 `docs/design/VISUAL_SYSTEM_GUIDE.md`。
2. 默认使用 `src/theme/ThemeProvider.tsx` 提供的 `useTheme()` 和主题 token，不新增散落的硬编码主题色。
3. 不再把 `fontWeight: '900'` 用作普通标题、按钮和列表项默认字重。
4. 页面标题默认使用 24 号、700 字重；不要随意新增 28/30 号大标题。
5. 普通按钮默认高度约 44，筛选 chip 约 32-34，普通卡片内边距约 14。
6. 新页面应同时考虑浅色、深色和主题色切换，不允许只在默认青绿色浅色模式下看起来正常。
7. 若需要特殊大字、重色块或厚卡片，必须能解释其信息层级目的。

## 本机环境清理约定

1. 安装 JDK、Android Studio、Android SDK 后，不主动删除 SDK、Gradle、npm 缓存；这些缓存会显著加速后续构建。
2. 允许检查可清理项，例如 `brew cleanup -n`，但执行实际清理前应确认不会删除仍在使用的开发工具或缓存。
3. 不删除用户目录下不确定来源的文件。
4. 不使用破坏性清理命令，例如 `rm -rf` 删除系统级目录、Android SDK 目录或 Gradle 缓存，除非用户明确指定。
