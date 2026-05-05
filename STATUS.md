# 到期提醒助手原型状态

> 最后更新：2026-05-05

## 当前阶段

1. 阶段：M3 本地通知闭环收尾
2. 状态：已完成通知权限页、通知服务抽象、创建事项后的通知调度入口、本地 Android development build、小米 14 本地测试通知验证、已处理取消验证、延后重排验证；事项编辑/删除与通知重排已完成本地功能实现，SQLite/notificationId 级真机复核后置

## 当前目标

1. 完成 Android-first 本地到期事项管理
2. 跑通本地通知闭环
3. 保持年轻化、轻盈、现代的界面风格
4. 下一阶段补后台/锁屏长时间提醒验证，并继续打磨表单动效和视觉层次

## 当前注意

1. 本原型目录由 `create-expo-app` 初始化，目录内存在独立 `.git`
2. 上级 `AI-Practice-Lab` 当前不是 git 仓库
3. 当前 App 仓库远端为 `git@github.com:Henery002/due-reminder-app.git`
4. Tab 已切换为 `@expo/vector-icons`，事项卡片内暂用 `IconGlyph`，但已按事项类型区分 glyph、色彩和类型文案
5. 新建/编辑页已使用自定义日期选择卡片替代 `YYYY-MM-DD` 文本框，支持快捷日期和年月日步进调整
6. `expo-notifications` 已接入服务层和页面入口；Expo Go Android 下不主动加载原生通知模块，完整通知能力以 development build 为准
7. 本机已安装 JDK 17、Android Studio、Android SDK / Platform Tools，并已通过小米 14 真机安装 debug APK
8. 2026-05-04 已在小米 14 development build 中验证 5 秒本地测试通知触达、创建事项写回 `notificationId`、已处理清空 `notificationId`、延后重排新 `notificationId`
9. Android 正式维护包名已固定为 `com.henery.duereminderapp`，并已完成 clean prebuild、安装和正式包名下 5 秒测试通知触达验证
10. 旧临时包 `com.anonymous.duereminderapp` 已清理，手机上仅保留正式包 `com.henery.duereminderapp`
11. 当前尚未接入广告、会员支付和云同步
12. 2026-05-04 已补齐事项编辑页、卡片点击进入编辑、编辑保存重排通知、删除取消通知和相关单元测试
13. 当前已通过本地完整验证：`npm test`、`npx tsc --noEmit`、`npx expo export --platform android`、`npx expo install --check`
14. 因 ADB 长时间无法识别小米 14，当前不再继续 Computer Use 手机操控；编辑页可见 UI 已通过小米互联观察到，SQLite/notificationId 级编辑删除复核留待后续 ADB 恢复后补测
15. 当前新增 `ReminderDatePicker` 和日期 helper，下一步可继续做表单微动效、日期选择弹层或更完整的日历视图
16. 2026-05-05 已新增事项类型视觉元数据，首页/全部页卡片可区分订阅、账单、证件类型
17. 2026-05-05 已新增提交动作按钮，保存/删除时会显示 loading 文案并禁用重复点击
18. 2026-05-05 已新增首页首次使用引导，0 事项时展示推荐场景和“添加第一个到期日”入口
19. 2026-05-05 已升级会员权益页，明确免费版边界和 Pro 预留权益，不展示虚假价格或假支付入口
