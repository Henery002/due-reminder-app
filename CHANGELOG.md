# 到期提醒助手原型变更记录

## 2026-05-05

1. 升级事项卡片类型视觉：
   - 新增 `getReminderTypeMeta`
   - 订阅、账单、证件使用不同 glyph、颜色和类型文案
   - 首页和全部页事项卡片不再显示统一 `D` 占位
2. 补充 `reminder.view.test.ts`，覆盖类型视觉元数据映射。
3. 升级新建/编辑页提交反馈：
   - 新增 `SubmitActionButton`
   - 新增 `getSubmitActionState`
   - 保存时显示 `正在安排提醒...` / `正在重排提醒...`
   - 删除时显示 `正在删除...`
   - loading 期间禁用按钮，避免重复提交
4. 补充 `reminder.submit.test.ts`，覆盖提交按钮文案和禁用态。
5. 升级首页首次使用体验：
   - 新增 `FirstRunGuide`
   - 新增 `getHomeEmptyMode`
   - 0 事项时展示订阅续费、账单缴费、证件到期三个推荐场景
   - 有事项但筛选为空时继续使用轻量空状态
6. 补充 `reminder.onboarding.test.ts`，覆盖首次引导展示条件和推荐场景文案。
7. 升级会员/商业化预留入口：
   - 新增 `getMembershipPlans`
   - 会员页展示免费版和 Pro 会员预留方案
   - 免费版明确最多 20 个到期事项、推荐提醒规则、基础模板和本地存储
   - Pro 明确后续开放，不展示虚假价格或假支付入口
8. 补充 `membership.plan.test.ts`，覆盖免费版边界和 Pro 预留状态。
9. 补齐免费版 20 个事项限制：
   - 新增 `getReminderCreationGate`
   - 新建页达到免费上限时禁用保存，并提供 Pro 预留权益入口
   - 补充 `membership.entitlement.test.ts`
10. 抽出事项生命周期刷新：
   - 新增 `refreshReminderList`
   - 首页和全部页统一刷新已逾期事项，避免页面重复实现
   - 补充 `reminder.lifecycle.test.ts`
11. 增强新建/编辑表单校验：
   - 新增 `parseOptionalReminderAmount`
   - 金额非数字时使用页内轻反馈
   - 日期 schema 拒绝不存在的日历日期
   - 补充 `reminder.form.test.ts`
12. 新增页内轻反馈组件：
   - 新增 `FeedbackBanner`
   - 新建、编辑、删除成功后显示轻量反馈再返回
   - 表单错误不再使用老式弹窗打断
   - 补充 `reminder.feedback.test.ts`
13. 新增提速脚本：
   - `npm run typecheck`
   - `npm run verify`
14. 新增本地数据备份能力：
   - 新增 `app/data-backup.tsx`
   - 新增 `exportRemindersBackup` / `parseRemindersBackup`
   - 支持导出可选中文本 JSON，并通过粘贴备份文本恢复事项
   - 首版不引入原生文件选择或云同步依赖
15. 升级延后提醒交互：
   - 新增 `getSnoozeOptions`
   - 首页和全部页点击延后后展示底部操作面板
   - 支持明天、3 天后、下周提醒
16. 补齐我的页辅助入口：
   - 新增 `app/feedback.tsx`
   - 新增 `app/about.tsx`
   - 我的页新增数据备份、反馈建议、关于应用入口
   - 补充 `settings.content.test.ts`
17. 补齐合规说明草稿：
   - 新增 `docs/legal/PRIVACY_POLICY_DRAFT.md`
   - 新增 `docs/legal/TERMS_OF_USE_DRAFT.md`
   - 新增 `docs/legal/PERMISSION_GUIDE.md`
   - 新增 `src/features/legal/legal.content.ts`
   - 新增隐私政策、用户协议、权限说明三个 App 页面
   - 我的页和关于页均可进入合规说明
   - 当前草稿按 local-first、无账号、无云同步、无广告、无真实支付口径编写
18. 补充 `legal.content.test.ts`，覆盖合规入口、隐私边界、通知权限和原型阶段服务边界。
19. 补齐应用市场上线材料草稿：
   - 新增 `docs/launch/APP_STORE_LISTING_DRAFT.md`
   - 新增 `docs/launch/SCREENSHOT_PLAN.md`
   - 新增 `docs/launch/VISUAL_ASSETS_DIRECTION.md`
   - 新增 `src/features/launch/launch.content.ts`
   - 文案避免承诺当前未上线的云同步、真实支付、OCR 或 AI 能力
20. 补充 `launch.content.test.ts`，覆盖应用市场文案、截图叙事顺序和图标/启动页视觉方向。
21. 升级日期选择体验：
   - 新增 `buildReminderMonthCalendar`
   - `ReminderDatePicker` 新增月历网格
   - 支持直接点选当月日期
   - 过去日期弱化显示但仍可选择，方便补录逾期事项
22. 新增截图演示数据：
   - 新增 `getScreenshotDemoReminders`
   - 数据备份页新增“生成截图演示数据”入口
   - 生成视频会员、信用卡年费、驾驶证换证、云服务器续费、水电燃气缴费等安全示例数据
23. 补充 `demo-data.test.ts`，覆盖截图演示数据结构。
24. 增强空状态与卡片轻交互：
   - 新增 `getReminderEmptyStateContent`
   - 首页筛选空态展示场景化标题、行动 chips 和轻量视觉装饰
   - 全部页空态新增“添加第一件事”入口
   - 事项卡片新增按压缩放、柔和阴影和圆角行动按钮
25. 补充 `reminder.empty-state.test.ts`，覆盖空状态文案和行动提示。

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
17. M3 收尾进入事项编辑/删除实现中：
   - 新增编辑页 `app/item/[id].tsx`
   - 事项卡片支持点击进入编辑页
   - 编辑保存时取消旧通知并按新信息重排未来通知
   - 删除事项时取消旧通知并移除本地记录
   - 补充编辑/删除通知副作用测试和仓储删除测试
18. 事项编辑/删除本地功能验证完成：
   - `npm test`：6 个测试套件、28 个测试通过
   - `npx tsc --noEmit`：通过
   - `npx expo export --platform android`：通过
   - `npx expo install --check`：依赖匹配
19. 小米互联可见 UI 验证：业务首页可打开，点击 `视频会员` 卡片可进入 `编辑到期事项` 页面。
20. 因 ADB 长时间无法识别小米 14，编辑保存后的 SQLite / `notificationId` 复核和删除后的 SQLite 复核后置；用户已要求先停止手机操控，改走功能开发。
21. 将新建/编辑页的 `YYYY-MM-DD` 文本输入升级为自定义日期选择交互：
   - 新增 `src/features/reminders/reminder.date.ts`
   - 新增 `src/components/ReminderDatePicker.tsx`
   - 支持今天、明天、7 天后、30 天后、本月底快捷项
   - 支持按年/月/日步进调整
   - 补充 `reminder.date.test.ts` 覆盖快捷项、日期加减和到期描述

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
