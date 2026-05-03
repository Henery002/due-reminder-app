# 到期提醒助手原型变更记录

## 2026-05-03

1. 建立原型目录
2. 初始化 `Expo + React Native + TypeScript` 项目
3. 安装路由、本地存储、本地通知、日期、校验、状态和图标依赖
4. 补齐原型级 `README / STATUS / CHANGELOG / HANDOFF`
5. 新增主题 token：
   - `src/theme/colors.ts`
   - `src/theme/spacing.ts`
   - `src/theme/typography.ts`
6. 新增 Reminder 领域类型、默认提醒规则、服务和首页分组 selector
7. 通过 TDD 补充 `reminder.test.ts`
8. 新增静态路由和页面：
   - 首页
   - 全部
   - 我的
   - 新建事项
   - 会员权益
   - 通知权限
9. 新增核心 UI 组件：
   - `OverviewCard`
   - `CategoryPill`
   - `DueItemCard`
   - `StatusBadge`
   - `EmptyState`
   - `MembershipCard`
   - `PermissionBanner`
   - `TemplateCard`
   - `ReminderRuleSelector`
   - `BottomActionSheet`
   - `IconGlyph`
10. 因 `lucide-react-native` 类型解析与当前 Expo 配置不匹配，首版改用 `IconGlyph` 作为文字图标组件
11. 补充 `react-native-worklets` 以满足 `react-native-reanimated` 的 Android 导出依赖
12. 补充 `expo-linking` 以满足 `expo-router` Android 导出依赖
13. 将 `jest` / `@types/jest` 调整到 Expo SDK 54 推荐范围
14. 完成验证：
   - `npx tsc --noEmit`
   - `npm test -- reminder.test.ts`
   - `npx expo export --platform android`
15. M2 接入 SQLite 本地事项闭环：
   - 新增 `src/storage/database.ts`
   - 新增 `src/storage/migrations.ts`
   - 新增 `src/storage/reminder.repository.ts`
   - 新增 `src/storage/reminder.store.ts`
16. M2 补充 Reminder 行为：
   - `markReminderDone`
   - `snoozeReminder`
   - 仓储序列化/反序列化测试
   - 新建事项 schema 测试
17. M2 接入真实页面数据：
   - 首页读取 SQLite 并显示近期事项
   - 全部页读取 SQLite
   - 新建页可选择类型/模板，填写日期、金额、备注并保存
   - 事项卡片支持已处理和延后
18. M2 当前边界：
   - 日期输入仍是文本框
   - 通知调度未接入
   - 支付/广告/会员权益仍是静态入口
