# 到期提醒助手原型交接

新会话接手时，先读：

1. `README.md`
2. `STATUS.md`
3. `MAINTENANCE.md`
4. `/Users/henery/code/AI-Practice-Lab/05-topics/02-商业项目专题/50-到期提醒助手-PRD-v0.1.md`
5. `/Users/henery/code/AI-Practice-Lab/05-topics/02-商业项目专题/60-到期提醒助手-UI与用户流-v0.1.md`
6. `/Users/henery/code/AI-Practice-Lab/05-topics/02-商业项目专题/70-到期提醒助手-技术方案与开发任务-v0.1.md`
7. `/Users/henery/code/AI-Practice-Lab/docs/superpowers/plans/2026-05-03-due-reminder-app-implementation.md`

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
3. M2.5 已修复真机首屏安全区、Tab 图标、首页分类筛选、状态文案和通知入口
4. M3 已接入通知权限说明页、通知服务抽象、Android channel 配置、测试通知方法和新建事项后的通知调度入口
5. 新建事项、首页读取、全部页读取、已处理、延后已形成最小闭环
6. Expo Go Android 从 SDK 53 起会对远程推送能力弹出官方红色警告；当前实现会在 Expo Go Android 下跳过原生通知模块加载，完整本地通知验证需使用 development build
7. 已处理会尝试取消旧通知并清空本地 `notificationId`；延后会取消旧通知、追加 snooze rule 并重排未来通知
8. 已安装 `expo-dev-client`，并新增 `eas.json` 与 development build 说明文档
9. 本机已完成 JDK 17、Android Studio、Android SDK / Platform Tools 安装，小米 14 已通过 ADB 识别并成功安装 debug APK
10. 2026-05-04 已在小米 14 development build 中验证 5 秒本地测试通知触达，通知权限为 `POST_NOTIFICATION: allow`
11. 2026-05-04 已通过真机 SQLite 数据验证：创建事项写回 `notificationId`，已处理会清空 `notificationId`，延后会重排并写入新 `notificationId`
12. 当前 `android/` 目录仍按 managed Expo 路线忽略，不提交生成的 native 工程；如 Maven 拉取失败，优先用本机 Gradle 镜像方案处理
13. Android 包名已固定为 `com.henery.duereminderapp`，已完成 clean prebuild、安装和正式包名下 5 秒测试通知触达验证；首次验证包 `com.anonymous.duereminderapp` 可视为历史临时包
14. 旧临时包 `com.anonymous.duereminderapp` 仍安装在手机上，清理前需要用户确认
15. 下一步继续做 M3 收尾：补事项编辑页、删除/编辑时通知重排，并补后台/锁屏长时间定时提醒验证
16. 日期选择器、事项卡片图标、更年轻化动效和更精致表单交互后续单独迭代

## 提交约定

1. 提交格式：`type: 中文提交说明`
2. 可用类型：`feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`
3. 示例：`docs: 补充代码提交规范`
