# 到期提醒助手原型变更记录

## 2026-05-08

1. 修复本地开发 Web 入口：
   - 补齐 Expo Web 运行所需的 `react-native-web` 依赖
   - 将 `react-dom` 锁定为 `19.1.0`，避免 npm 安装时解析到与 `react@19.1.0` 不兼容的新版本
   - Web 开发环境改用内存存储适配层，避免 `expo-sqlite` 同步 Web 实现因缺少 `SharedArrayBuffer` 导致页面崩溃
   - Android/iOS 端仍继续使用本地 SQLite 和原有迁移逻辑
2. 启动小米 14 USB 真机调试：
   - 通过 ADB 确认设备、安装并启动 Android development build
   - 真机确认首页可渲染，底部 Tab 与首页内容可通过 UIAutomator 读取
   - 修复首页/我的页通知权限提示未跟随系统授权状态隐藏的问题
   - 新增通知权限提示可见性判定测试，授权后不再展示“打开通知”横幅
3. 优化底部延后操作面板：
   - 真机验证时发现列表底部触发“延后”后，底部操作面板可能被浮动 Tab 栏遮挡
   - `BottomActionSheet` 改为透明 Modal 底部面板，避免继续被 ScrollView 内容位置和底栏层级影响
   - 面板底部 padding 接入安全区计算，确保小米 14 等全面屏设备上操作项不贴底、不被遮挡
   - 新增底部安全区 padding 单元测试，锁住浮动底栏场景下的最小留白

## 2026-05-07

1. 启动 M3.9 UI 细节精修：
   - 首页去掉头部重复统计，保留下方总览卡，并放大“今天待处理 X 件”主标题
   - 事项卡“已处理”“延后”按钮去掉大面积背景色，改为轻边框和语义色文字
   - 新建/编辑页返回按钮减重，删除“返回上一页”冗余文案
   - 新建/编辑页顶部“当前类型 / 本地提醒”摘要由大胶囊卡片改为轻量信息条
   - 日历组件改为按周渲染的稳定 7 列布局，避免周日缺数字和高亮错乱
   - 金额和自定义提醒天数改为 `NumericTextInput`，输入阶段过滤非数字内容
   - 全部事项页筛选区改为“类型 / 状态 / 方式”分组横向筛选，减少 chip 堆叠感
   - 我的页顶部功能卡改为纵向排列，外观模式选项改为纵向，避免内容挤压和溢出
2. 补充视觉系统规范：
   - `VISUAL_SYSTEM_GUIDE.md` 新增“2026-05-07 细节审美校准”
   - 明确后续增量开发遵循“重点更醒目、次级更安静、控件更语义化”的细节原则
3. 优化底部导航栏：
   - 底部 Tab 去掉文字标签，改为图标优先的轻量导航
   - 导航容器高度从 58 收紧到 48，底部偏移从 10 收紧到 4
   - 首页、全部、我的三页内容 `paddingBottom` 从 104 收紧到 76，减少底部空白
   - 视觉系统文档补充底部导航规范

## 2026-05-06

1. 补充中国大陆市场 UI 审美适配规范：
   - `VISUAL_SYSTEM_GUIDE.md` 新增“中国大陆市场 UI 审美适配”章节
   - 明确减少欧美独立应用、欧美 SaaS landing page、霓虹玻璃、强撞色、大面积 hero 等视觉表达
   - 后续主题色、按钮、卡片、我的页和动效需优先贴近国内生活工具类 App 的清爽、轻量、入口明确和信息密度适中
2. 同步维护规范和视觉资产方向：
   - `MAINTENANCE.md` 增加中国大陆市场视觉审查约束
   - `VISUAL_ASSETS_DIRECTION.md` 增加面向中国大陆年轻用户的图标、启动页和生成提示词要求
3. 支持自定义提醒点：
   - `ReminderSchedulePreview` 新增自定义天数输入和“自定义”提醒点展示
   - 新建/编辑页可添加 0-365 天内的自定义提前提醒
   - `buildReminderRules` 支持默认提醒点与自定义提醒点共同生成、去重和按提前天数排序
   - 保持至少一个提醒点保护，保存后继续走现有本地通知安排和重排逻辑
4. 完成第二轮视觉收敛：
   - `ScreenHeader` 返回按钮缩小并减轻阴影，弱化厚重浮层感
   - `我的` 页头部、快速入口、提醒偏好文案收敛为更轻的设置中心结构
   - `ReminderDatePicker`、`MembershipCard`、`PermissionBanner`、`LegalDocumentView`、`About`、`Membership` 页面压低 hero 感
   - 底部 Tab 减小高度、圆角和阴影，更接近国内工具类 App 的轻浮层导航
5. 完成第三轮视觉收敛：
   - 首页标题区改为更轻的状态摘要样式，减少首屏大标题压力
   - 首页分组卡、首用引导卡、空状态卡和主行动按钮缩小圆角与内边距，收紧工具感
   - 全部事项页新增更轻的 eyebrow 头部，筛选面板和搜索区进一步压缩
   - `CategoryPill` 与 `EmptyState` 收紧尺寸，提升列表页信息密度
6. 完成第四轮视觉收敛：
   - `DueItemCard` 改为“类型/状态在上、标题信息在下”的更清晰结构
   - `StatusBadge`、`SubmitActionButton`、`TemplateCard`、`FeedbackBanner` 尺寸与圆角进一步统一
   - `BottomActionSheet` 收紧圆角和内边距，减轻厚重弹层感
   - 高频操作按钮与模板入口的按压反馈更一致
7. 增强首页与列表页反馈密度：
   - 首页新增“已逾期 / 7 天内 / 本月到期”紧凑摘要条
   - 全部事项页新增“总数 / 未处理 / 已处理”摘要条
   - 全部事项页会显式展示当前生效的筛选与搜索标签
8. 增强表单页反馈一致性：
   - 新建/编辑页新增“当前类型 / 提醒点数量”摘要条
   - 新建/编辑页标题层级和 section 标题进一步统一
   - `BottomActionSheet` 改为与其他高频操作一致的按压反馈
9. 补充提醒计划防骚扰边界：
   - 新增单个事项最多 5 个提醒点的限制
   - 达到上限后，自定义提醒输入会禁用，并提示先关闭一个提醒点
   - 新建/编辑页在继续添加时会给出明确 warning 反馈
10. 优化自定义提醒点输入反馈：
   - 空输入时提示先输入提前天数
   - 非整数、负数和超过 365 天时提示合法范围
   - 重复输入已有提醒点时留在提醒计划卡内提示，避免清空输入后才看见页面反馈
   - 达到 5 个提醒点上限时提示先关闭一个提醒点
   - 校验逻辑收敛到 `getCustomReminderOffsetInputError`，并补充单元测试
11. 增强提醒计划状态表达：
   - `buildReminderSchedulePreview` 新增 `scheduled` / `record-only` / `invalid-date` 状态
   - 提醒计划卡右上角不再只显示次数，也会显示“待选择”或“仅记录”
   - 用户选择已过期日期时，可以更清楚地区分“保存为记录”和“会安排通知”
12. 启动 M3.5 提醒策略显式化：
   - 事项数据新增 `notify` / `record-only` 提醒模式
   - SQLite 增加 `reminderMode` 字段，旧数据库默认迁移为 `notify`
   - 新建/编辑页新增“安排本地提醒”轻量开关
   - 关闭后保存为仅记录，不安排本地通知；编辑旧事项关闭后会取消旧通知
   - record-only 事项不展示延后动作，也不会通过延后重新调度通知
   - 备份导出/导入保留提醒模式，旧备份缺失该字段时默认兼容为 `notify`
13. 启动 M3.6 表单体验与提醒策略收口：
   - 首页和全部页事项卡新增“仅记录”模式标签，同时保留原有状态 badge
   - 新建/编辑页保存按钮前新增提醒安排摘要，明确“安排 N 次提醒”或“仅保存记录”
   - “安排本地提醒”开关补充 switch 语义、选中态卡片底色和边框反馈
   - 新增 `getReminderModeLabel` 和 `getReminderSaveSummary` 测试覆盖
14. 启动 M3.7 表单体验继续精修：
   - 新增 `ReminderModeSwitch`，统一新建/编辑页的提醒模式开关结构、视觉与 switch 语义
   - 新增 `ReminderSaveSummary`，统一保存前提醒摘要展示，避免页面重复维护文案样式
   - 新增 `getReminderModeSwitchCopy` 与 `getReminderSubmitLabels`，收敛提醒模式说明和提交按钮文案
   - 补充 `reminder.mode.test.ts`，锁住新建/编辑两种场景下的文案映射与提交状态文案
15. 增强全部事项页提醒方式筛选：
   - 新增 `ReminderModeFilter` 和 `filterRemindersByMode`
   - `getVisibleAllReminders` 支持类型、状态、提醒方式和搜索组合筛选
   - 全部事项页新增“全部方式 / 本地提醒 / 仅记录”筛选行
   - 当前生效筛选标签会展示“本地提醒”或“仅记录”，帮助用户区分提醒模式和事项状态
16. 升级我的页提醒偏好说明：
   - 新增 `getReminderPreferenceNotes`，集中维护提醒偏好说明文案
   - 我的页“提醒偏好”分区新增默认本地提醒、仅记录适用场景和提醒点上限说明
   - 文案明确仅记录适合补录、留档或暂不想收到系统通知的事项
   - 补充 `settings.content.test.ts`，避免说明文案误导用户以为已有账号、支付或云端能力
17. 补齐提醒策略产品规则文档：
   - 新增 `docs/product/REMINDER_STRATEGY_RULES.md`
   - 沉淀 `notify` / `record-only`、默认提醒点、自定义提醒点、5 个提醒点上限和保存编辑规则
   - 明确 `record-only` 不展示延后、不通过延后重新调度通知
   - 明确备份导出保留提醒模式，旧备份缺失 `reminderMode` 时默认兼容为 `notify`
   - README 增加本地提醒策略规则文档入口
18. 启动 M3.8 上架前素材与口径一致性复核：
   - 应用市场短描述更新为“能提醒，也能仅记录”
   - 长描述补充仅记录适合补录、留档或暂时不想收到通知的事项
   - 截图计划第 3 张从“本地通知提前提醒”调整为“提醒方式自己决定”
   - `launch.content.ts` 与 `launch.content.test.ts` 同步提醒方式截图叙事
   - 不建议宣传点补充不要承诺系统级保活或后台常驻

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
26. 增强全部事项页筛选与排序：
   - 新增 `filterRemindersByStatus`
   - 新增 `getVisibleAllReminders`
   - 全部事项页支持类型筛选和状态筛选组合
   - 未处理事项优先，并按到期日从近到远展示
   - 筛选无结果时展示轻量空状态和新增入口
27. 扩展 `reminder.view.test.ts`，覆盖状态筛选、组合筛选和排序规则。
28. 增强全部事项页搜索：
   - 新增 `filterRemindersByQuery`
   - `getVisibleAllReminders` 支持 `query`
   - 搜索范围覆盖事项名称和备注
   - 搜索可与类型/状态筛选组合使用
   - 搜索无结果时展示专属空状态，并支持一键清空搜索
29. 扩展 `reminder.view.test.ts`，覆盖名称搜索、备注搜索和空白关键词行为。
30. 增强首页近期事项分组展示：
   - 新增 `getHomeReminderSections`
   - 首页按已逾期、今天到期、未来 3 天、未来 7 天展示事项
   - 每个分组展示说明文案和数量标签
   - 保持原有已处理、延后、进入编辑页操作闭环
31. 扩展 `reminder.test.ts`，覆盖首页分组展示顺序和空分组隐藏规则。
32. 新增提醒计划预览：
   - 新增 `buildReminderSchedulePreview`
   - 新增 `ReminderSchedulePreview`
   - 新建页和编辑页展示未来实际可安排的本地提醒日期与时间
   - 已错过的提醒不会展示成可安排提醒，过期补录时会展示记录模式说明
   - 清理已被替代的 `ReminderRuleSelector`
33. 补充 `reminder.schedule-preview.test.ts`，覆盖未来提醒、已错过提醒和无未来提醒场景。
34. 修复从全部页点击事项进入详情时报错：
   - 根因是编辑页首次渲染时本地事项尚未加载完成，`dueDate` 为空但已渲染日期选择器
   - 编辑页新增加载态，加载完成前不渲染表单
   - `ReminderDatePicker` 依赖的日期 helper 对空日期和无效日期提供安全兜底
35. 扩展 `reminder.date.test.ts`，覆盖日期未加载时的说明、月历和日期步进兜底行为。
36. 启动第一批 UI 与动效系统化优化：
   - 新增 `PressableScale`
   - 底部 Tab 改为浮动胶囊，支持激活态线性/填充图标切换和弹性缩放
   - 事项卡片「已处理」「延后」改为语义色行动胶囊，优化尺寸、内边距、色彩和图标承托
   - 通用提交按钮、筛选胶囊、通知入口和反馈入口加入统一按压缩放
37. 重构我的页信息架构：
   - 我的页改为 Hub 式聚合结构
   - 按会员通知、常用工具、提醒偏好、合规说明分区
   - 默认提醒计划说明集中到提醒偏好卡片，自定义规则后续预留
38. 补充二级页面返回入口：
   - 新增 `ScreenHeader`
   - 添加/编辑事项、会员权益、数据备份、反馈建议、通知权限、关于应用和合规说明页提供显式返回按钮
39. 扩展视觉资源文档：
   - 补充应用内图标、顶部图标、背景资源、会员视觉的设计原则
   - 补充动效设计原则
   - 补充提醒计划可编辑性的后续产品原则
40. 支持默认提醒点开关：
   - 新增默认提醒点规范化 helper，保存时会忽略不属于当前类型默认规则的自定义 offset
   - 新建页和编辑页的提醒计划预览卡片支持点击开启/关闭默认提醒点
   - 编辑保存会取消旧通知，并只按开启的默认提醒点重排未来本地通知
   - 当前仍不开放自定义提前天数，不调整数据库 schema，UI 至少保留一个默认提醒点
41. 启动全局视觉系统整改：
   - 新增 `docs/design/VISUAL_SYSTEM_GUIDE.md`
   - 明确当前“大字版”感受的原因：字号、字重、内边距、圆角和按钮尺寸过重
   - 首页、全部页、我的页、新建/编辑页和核心组件切入更克制的字号、字重、边距与按钮尺寸
   - `fontWeight: '900'` 不再作为普通标题和按钮默认字重
42. 新增外观主题能力：
   - 新增 `src/features/appearance/appearance.theme.ts`
   - 新增 `src/features/appearance/appearance.types.ts`
   - 新增 `src/theme/ThemeProvider.tsx`
   - 新增 SQLite `app_preferences` 偏好表和 preference repository
   - 我的页支持跟随系统、浅色、深色，以及青绿、蓝色、柔黄、浅绿主题色配置

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
