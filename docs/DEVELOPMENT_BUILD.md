# Development Build 验证说明

> 最后更新：2026-05-03

本文件用于记录 `到期提醒助手` 的 Android development build 验证流程。M3 通知能力不能只依赖 Expo Go 验证，完整的通知权限、触达、取消和重排必须使用 development build 或正式包。

## 为什么需要 development build

1. Expo Go Android 从 SDK 53 起会对远程推送能力显示官方红色警告。
2. `expo-notifications`、`expo-dev-client` 和 config plugin 的原生部分需要重新编译到 App 包中。
3. 本地通知的真实表现依赖 Android 系统权限、通知 channel 和设备后台策略，必须在真实 Android 包里验证。

## 当前本机环境状态

2026-05-03 检查结果：

1. Node 和 npm 可用。
2. 当前 Mac 未检测到 Java Runtime。
3. `ANDROID_HOME` 和 `ANDROID_SDK_ROOT` 未配置。
4. 未检测到 `adb`。
5. 因此当前不能直接运行本地命令 `npm run android:dev`。

## 推荐路径 A：EAS 云构建

适合当前机器还没有 Android Studio / JDK / SDK 的情况。

执行前注意：EAS 云构建会把项目上传到 Expo 构建服务，属于向第三方传输项目源码。后续运行前需要用户再次确认。

准备命令：

```bash
npm run eas:android:dev
```

预期结果：

1. 根据提示登录 Expo 账号。
2. 首次构建可能提示初始化 EAS 项目。
3. 构建成功后下载 APK。
4. 将 APK 安装到小米 14。
5. 运行 `npm run start:dev`，用 development build 连接 Metro。

## 路径 B：本地 Android 构建

适合后续长期开发，优点是调试闭环更快。

需要先安装或配置：

1. Android Studio
2. JDK 17
3. Android SDK Platform Tools
4. `ANDROID_HOME` 或 `ANDROID_SDK_ROOT`
5. 小米 14 开启开发者选项和 USB 调试

环境检查命令：

```bash
java -version
adb devices -l
```

本地构建命令：

```bash
npm run android:dev
```

启动 JS 服务：

```bash
npm run start:dev
```

## M3 通知验证清单

1. 打开 development build 后，通知页不显示 Expo Go 限制提示。
2. 点击“开启通知权限”，Android 系统弹出通知权限申请。
3. 允许通知后，点击“发送 5 秒测试通知”，约 5 秒后收到本地通知。
4. 新建一个未来到期事项，确认提醒规则写入 `notificationId`。
5. 点击“已处理”，确认旧通知被取消，并且本地规则清空 `notificationId`。
6. 点击“延后”，确认旧通知取消，新的 snooze rule 被调度并写入新 `notificationId`。
7. 后台或锁屏状态下重复验证测试通知触达。

## 当前边界

1. Expo Go 仍可用于 UI 和基础数据流验证，但不作为通知完整验证环境。
2. 当前尚未实现事项编辑页和删除入口，因此编辑/删除场景的通知重排还未验证。
3. 小米 / Android 后台策略可能影响长时间通知触达，后续需要单独记录机型策略。
