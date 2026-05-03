# 到期提醒助手原型状态

> 最后更新：2026-05-03

## 当前阶段

1. 阶段：M3 本地通知闭环
2. 状态：已完成通知权限页、通知服务抽象、创建事项后的通知调度入口，并接入已处理取消通知、延后重排通知的动作服务

## 当前目标

1. 完成 Android-first 本地到期事项管理
2. 跑通本地通知闭环
3. 保持年轻化、轻盈、现代的界面风格
4. 下一阶段接入 Android 本地通知权限、通知调度与取消

## 当前注意

1. 本原型目录由 `create-expo-app` 初始化，目录内存在独立 `.git`
2. 上级 `AI-Practice-Lab` 当前不是 git 仓库
3. 当前 App 仓库远端为 `git@github.com:Henery002/due-reminder-app.git`
4. Tab 已切换为 `@expo/vector-icons`，事项卡片内仍暂用 `IconGlyph`
5. 日期输入暂用 `YYYY-MM-DD` 文本框，后续需要替换为更现代的日期选择交互
6. `expo-notifications` 已接入服务层和页面入口；Expo Go Android 下不主动加载原生通知模块，完整本地通知触达、取消和重排验证需要 development build
7. 当前尚未接入广告、会员支付和云同步
