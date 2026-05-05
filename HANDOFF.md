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
14. 旧临时包 `com.anonymous.duereminderapp` 已清理，手机上仅保留正式包 `com.henery.duereminderapp`
15. M3 收尾已完成本地功能实现：新增编辑页、卡片点击进入编辑、编辑保存时取消旧通知并重排、删除时取消旧通知并移除事项
16. 已完成本地完整验证：`npm test` 通过 6 个测试套件 / 28 个测试，`npx tsc --noEmit` 通过，`npx expo export --platform android` 通过，`npx expo install --check` 通过
17. 真机可见 UI 进度：小米互联中已成功打开业务首页，点击 `视频会员` 卡片可进入 `编辑到期事项` 页面
18. 真机深度验证边界：ADB 长时间无法识别小米 14，因此尚未读取 SQLite 确认编辑保存后的 `dueDate` 与 `notificationId` 变化，也尚未做删除后的 SQLite 复核
19. 用户已明确要求先不继续手机操控，后续不要再用 Computer Use 慢速操作手机；如需补真机深度验证，应优先恢复 ADB 后用命令验证
20. 新建/编辑页已接入 `ReminderDatePicker`：支持今天、明天、7 天后、30 天后、本月底快捷项，并支持按年/月/日加减
21. 事项卡片已按类型区分视觉：订阅、账单、证件拥有不同 glyph、颜色和类型文案
22. 新建/编辑页已接入 `SubmitActionButton`：保存/删除时显示 loading 文案并禁用重复点击
23. 首页已接入 `FirstRunGuide`：0 事项时展示推荐场景和添加第一个到期日入口
24. 会员页已展示免费版边界和 Pro 预留权益，不接真实支付、不展示虚假价格
25. 更年轻化动效、更完整日历弹层和数据导出/备份能力后续单独迭代

## 近期功能变更文件

1. `app/(tabs)/index.tsx`
2. `app/(tabs)/items.tsx`
3. `app/_layout.tsx`
4. `app/item/[id].tsx`
5. `src/components/DueItemCard.tsx`
6. `src/components/ReminderDatePicker.tsx`
7. `src/features/reminders/reminder.actions.ts`
8. `src/features/reminders/reminder.actions.test.ts`
9. `src/features/reminders/reminder.date.ts`
10. `src/features/reminders/reminder.date.test.ts`
11. `src/features/reminders/reminder.view.ts`
12. `src/features/reminders/reminder.view.test.ts`
13. `src/features/reminders/reminder.submit.ts`
14. `src/features/reminders/reminder.submit.test.ts`
15. `src/features/reminders/reminder.onboarding.ts`
16. `src/features/reminders/reminder.onboarding.test.ts`
17. `src/components/FirstRunGuide.tsx`
18. `src/features/membership/membership.plan.ts`
19. `src/features/membership/membership.plan.test.ts`
20. `src/storage/reminder.repository.test.ts`

## 后续补测清单

1. 不再优先使用 Computer Use 手动操作手机；它适合观察，不适合长流程验证
2. ADB 恢复后，优先使用 `adb devices -l`、SQLite 和命令行做复核
3. 编辑验证目标：确认测试事项编辑保存后 `dueDate` 已变更，旧 `notificationId` 被替换
4. 删除验证目标：编辑页点击删除并确认后，本地 SQLite 不再存在对应事项
5. 补测完成后再更新 `docs/DEVELOPMENT_BUILD.md` 的真机验证记录

## 提交约定

1. 提交格式：`type: 中文提交说明`
2. 可用类型：`feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`
3. 示例：`docs: 补充代码提交规范`
