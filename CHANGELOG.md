# 到期提醒助手原型变更记录

## 2026-05-04

1. 完成本机 Android development build 环境安装和验证：
   - JDK 17
   - Android Studio
   - Android SDK / Platform Tools
   - `ANDROID_HOME` / `ANDROID_SDK_ROOT`
2. 小米 14 真机已通过 ADB 识别：
   - 设备序列号：`b69bc498`
   - 设备型号：`23127PN0CC`
3. 本地 debug APK 已构建并安装到小米 14：
   - `android/app/build/outputs/apk/debug/app-debug.apk`
4. development build 已连接本机 Metro。
5. Android 通知权限已授予，`POST_NOTIFICATION` 状态为 `allow`。
6. 5 秒测试通知已在小米 14 通知中心触达：
   - 标题：`到期提醒测试`
   - 正文：`如果你看到这条通知，说明本地提醒已经可以工作。`
7. 通过真机 SQLite 数据继续验证通知动作闭环：
   - 创建事项后 `reminderRulesJson` 写回 `notificationId`
   - 点击「已处理」后状态变为 `done`，原 `notificationId` 清空
   - 点击「延后」后状态变为 `snoozed`，旧通知 ID 替换为新 ID，并新增 snooze rule
8. 新增真机通知验证截图：
   - `docs/assets/android-notification-test-2026-05-04.png`
9. `docs/DEVELOPMENT_BUILD.md` 更新为本地构建优先路径，并记录环境、命令、验证结果和边界。
10. Android 正式维护包名固定为 `com.henery.duereminderapp`。
11. App 展示名称从 `due-reminder-app` 调整为 `到期提醒助手`。
12. clean prebuild 后重新生成本地 native 工程，并确认 `applicationId` / `namespace` 为 `com.henery.duereminderapp`。
13. 新包 `com.henery.duereminderapp` 已成功安装到小米 14，并在正式包名下验证 5 秒测试通知触达。
14. 新增正式包名通知验证截图：
   - `docs/assets/android-notification-test-new-package-2026-05-04.png`
15. 已清理旧临时包 `com.anonymous.duereminderapp`，手机上仅保留正式包 `com.henery.duereminderapp`。
16. 当前继续保持 managed Expo 路线，不提交生成的 `android/` native 工程目录。

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
19. 补充项目维护规范：
   - 新增 `MAINTENANCE.md`
   - 明确 git commit message 使用 `type: 中文提交说明`
   - 明确可用类型：`feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`
20. M2.5 真机体验修复：
   - 首页、全部页、我的页接入 `SafeAreaView`，避免顶部内容侵入系统状态栏
   - 底部 Tab 从 `H/L/M` 文字占位切换为 `@expo/vector-icons`
   - 首页分类接入真实筛选逻辑
   - 状态文案支持 `今日到期`、`即将到期`、`已处理`、`已逾期`、`已延后`
   - 通知横幅改为可点击入口，跳转通知权限页
   - 新增 `reminder.view.test.ts` 覆盖筛选和状态展示规则
21. M3 通知权限与本地提醒基础闭环：
   - 新增 `src/features/notifications/notification.service.ts`，保持通知调度逻辑可测试
   - 新增 `src/features/notifications/expo-notification.gateway.ts`，通过动态 import 适配 `expo-notifications`
   - 新增通知权限页状态展示、授权按钮和 5 秒测试通知入口
   - 新建事项后尝试申请权限并调度未来提醒，写回 `notificationId`
   - `app.json` 补充 `scheme` 和 `expo-notifications` 插件配置
   - Expo Go Android 下跳过原生通知模块加载，避免 SDK 53+ 的远程推送红色警告影响启动体验
   - 真机验证：小米 14 Expo Go 首页和通知页未再出现启动期红色警告；完整本地通知触达需 development build 验证
22. M3 通知取消与延后重排：
   - 新增 `src/features/reminders/reminder.actions.ts`，集中处理事项动作与通知副作用
   - 已处理事项时尝试取消旧通知，并清空本地提醒规则中的 `notificationId`
   - 延后事项时追加 snooze rule，取消旧通知后重新调度未来提醒
   - Expo Go Android 通知不可用时，事项状态仍会正常保存，通知副作用降级为 no-op
   - 首页和全部页已接入动作服务，避免页面直接操作通知副作用
23. M3 development build 准备：
   - 安装 `expo-dev-client`
   - 新增 `eas.json`，预留 Android development / preview / production 构建配置
   - 新增 `docs/DEVELOPMENT_BUILD.md`，记录 EAS 云构建、本地 Android 构建和通知验证清单
   - 新增 `start:dev`、`android:dev`、`eas:android:dev` 脚本
   - 记录当前本机缺少 Java Runtime、Android SDK 和 `adb`，暂不能直接本地构建
