# 到期提醒助手原型

本目录用于开发 `到期提醒助手` Android-first MVP。

关联文档：

1. `/Users/henery/code/AI-Practice-Lab/05-topics/02-商业项目专题/50-到期提醒助手-PRD-v0.1.md`
2. `/Users/henery/code/AI-Practice-Lab/05-topics/02-商业项目专题/60-到期提醒助手-UI与用户流-v0.1.md`
3. `/Users/henery/code/AI-Practice-Lab/05-topics/02-商业项目专题/70-到期提醒助手-技术方案与开发任务-v0.1.md`
4. `/Users/henery/code/AI-Practice-Lab/docs/superpowers/plans/2026-05-03-due-reminder-app-implementation.md`

维护规范：

1. `MAINTENANCE.md`

## 当前命令

```bash
npm start
npm run start:dev
npm run android
npm run android:dev
npm test
npx tsc --noEmit
npx expo export --platform android
```

## 通知验证说明

Expo Go Android 从 SDK 53 起会对远程推送能力弹出官方红色警告。当前代码会在 Expo Go Android 下跳过原生通知模块加载，避免启动体验被干扰；本地通知权限、调度和 5 秒测试通知的完整验证应使用 development build。

Development build 流程见：

1. `docs/DEVELOPMENT_BUILD.md`

## 目录原则

1. `app/` 只放页面和路由
2. `src/features/` 放业务领域逻辑
3. `src/components/` 放页面无关组件
4. `src/storage/` 放本地存储
5. `src/theme/` 放设计 token

## 视觉系统

后续 UI 迭代先阅读：

1. `docs/design/VISUAL_SYSTEM_GUIDE.md`

当前原则：

1. 不再采用“大字全粗”模式
2. 优先使用 `useTheme()` 和主题 token
3. 同时维护浅色、深色和主题色切换体验
