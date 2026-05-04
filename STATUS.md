# 到期提醒助手原型状态

> 最后更新：2026-05-04

## 当前阶段

1. 阶段：M3 本地通知闭环真机验证后段
2. 状态：已完成通知权限页、通知服务抽象、创建事项后的通知调度入口、本地 Android development build、小米 14 本地测试通知验证、已处理取消验证和延后重排验证

## 当前目标

1. 完成 Android-first 本地到期事项管理
2. 跑通本地通知闭环
3. 保持年轻化、轻盈、现代的界面风格
4. 下一阶段补齐事项编辑、删除时的通知取消和重排

## 当前注意

1. 本原型目录由 `create-expo-app` 初始化，目录内存在独立 `.git`
2. 上级 `AI-Practice-Lab` 当前不是 git 仓库
3. 当前 App 仓库远端为 `git@github.com:Henery002/due-reminder-app.git`
4. Tab 已切换为 `@expo/vector-icons`，事项卡片内仍暂用 `IconGlyph`
5. 日期输入暂用 `YYYY-MM-DD` 文本框，后续需要替换为更现代的日期选择交互
6. `expo-notifications` 已接入服务层和页面入口；Expo Go Android 下不主动加载原生通知模块，完整通知能力以 development build 为准
7. 本机已安装 JDK 17、Android Studio、Android SDK / Platform Tools，并已通过小米 14 真机安装 debug APK
8. 2026-05-04 已在小米 14 development build 中验证 5 秒本地测试通知触达、创建事项写回 `notificationId`、已处理清空 `notificationId`、延后重排新 `notificationId`
9. Android 正式维护包名已固定为 `com.henery.duereminderapp`，并已完成 clean prebuild、安装和正式包名下 5 秒测试通知触达验证
10. 旧临时包 `com.anonymous.duereminderapp` 仍安装在手机上，确认不再需要后可清理
11. 当前尚未接入广告、会员支付和云同步
