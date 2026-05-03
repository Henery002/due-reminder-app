# 到期提醒助手原型交接

新会话接手时，先读：

1. `README.md`
2. `STATUS.md`
3. `/Users/henery/code/AI-Practice-Lab/05-topics/02-商业项目专题/50-到期提醒助手-PRD-v0.1.md`
4. `/Users/henery/code/AI-Practice-Lab/05-topics/02-商业项目专题/60-到期提醒助手-UI与用户流-v0.1.md`
5. `/Users/henery/code/AI-Practice-Lab/05-topics/02-商业项目专题/70-到期提醒助手-技术方案与开发任务-v0.1.md`
6. `/Users/henery/code/AI-Practice-Lab/docs/superpowers/plans/2026-05-03-due-reminder-app-implementation.md`

## 当前技术路线

1. `Expo + React Native + TypeScript`
2. `Expo Router`
3. `expo-sqlite`
4. `expo-notifications`
5. `expo-linking`
6. `date-fns`
7. `zod`
8. `zustand`
9. `react-native-reanimated`
10. `react-native-worklets`
11. 首版暂用 `IconGlyph` 文字图标组件，后续 UI 稳定后再替换正式图标库

## 当前实现状态

1. M1 可点击静态原型已完成
2. M2 已接入 SQLite 本地事项仓储
3. 新建事项、首页读取、全部页读取、已处理、延后已形成最小闭环
4. 下一步优先做 M3：`expo-notifications` 权限申请、通知调度、事项更新时取消/重排通知
5. 日期选择器、正式图标库、更年轻化动效和更精致表单交互后续单独迭代
