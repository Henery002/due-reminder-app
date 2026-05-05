import { Stack } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeedbackBanner } from '../src/components/FeedbackBanner';
import { SubmitActionButton } from '../src/components/SubmitActionButton';
import { exportRemindersBackup, parseRemindersBackup } from '../src/features/data/backup';
import { getScreenshotDemoReminders } from '../src/features/launch/demo-data';
import { type ReminderFeedback } from '../src/features/reminders/reminder.feedback';
import { reminderRepository } from '../src/storage/reminder.store';
import { colors } from '../src/theme/colors';

export default function DataBackupScreen() {
  const [backupText, setBackupText] = useState('');
  const [importText, setImportText] = useState('');
  const [feedback, setFeedback] = useState<ReminderFeedback | null>(null);

  const refreshBackupText = useCallback(() => {
    const items = reminderRepository.list();
    setBackupText(exportRemindersBackup(items));
  }, []);

  useFocusEffect(refreshBackupText);

  const handleRefreshExport = () => {
    refreshBackupText();
    setFeedback({
      description: '下面的备份文本已经按当前本机数据重新生成。',
      title: '已刷新备份',
      tone: 'success',
    });
  };

  const handleImport = () => {
    try {
      const parsed = parseRemindersBackup(importText);
      parsed.reminders.forEach((item) => reminderRepository.upsert(item));
      refreshBackupText();
      setFeedback({
        description: `已恢复 ${parsed.reminders.length} 个到期事项。重复 ID 会以备份文本为准。`,
        title: '导入完成',
        tone: 'success',
      });
    } catch (error) {
      setFeedback({
        description: error instanceof Error ? error.message : '请确认备份文本完整可读。',
        title: '导入失败',
        tone: 'warning',
      });
    }
  };

  const handleSeedDemoData = () => {
    const demoReminders = getScreenshotDemoReminders();
    demoReminders.forEach((item) => reminderRepository.upsert(item));
    refreshBackupText();
    setFeedback({
      description: '已写入 5 条安全演示事项，适合后续采集应用市场截图。',
      title: '演示数据已准备',
      tone: 'success',
    });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Stack.Screen options={{ title: '数据备份' }} />
        <View>
          <Text style={styles.title}>数据备份</Text>
          <Text style={styles.subtitle}>
            先用纯文本备份解决换机和误删焦虑，云同步等验证后再接。
          </Text>
        </View>

        <FeedbackBanner feedback={feedback} />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>导出备份文本</Text>
          <Text style={styles.cardText}>
            长按或全选下面的 JSON 文本，保存到你信任的位置。它包含本机所有到期事项。
          </Text>
          <Text selectable style={styles.backupText}>
            {backupText}
          </Text>
          <SubmitActionButton
            label="重新生成备份文本"
            onPress={handleRefreshExport}
            variant="secondary"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>截图演示数据</Text>
          <Text style={styles.cardText}>
            生成一组不含真实隐私的示例事项，用来拍首页、新建、延后和备份页截图。重复点击会覆盖同 ID 演示数据。
          </Text>
          <SubmitActionButton
            label="生成截图演示数据"
            onPress={handleSeedDemoData}
            variant="secondary"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>从备份文本导入</Text>
          <Text style={styles.cardText}>
            把之前导出的完整 JSON 粘贴到这里。导入会按 ID 覆盖同名记录，不会清空其他事项。
          </Text>
          <TextInput
            multiline
            onChangeText={setImportText}
            placeholder="粘贴备份文本"
            placeholderTextColor={colors.textMuted}
            style={[styles.input, styles.importInput]}
            value={importText}
          />
          <SubmitActionButton label="导入备份" onPress={handleImport} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backupText: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 14,
    color: colors.textSecondary,
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 17,
    maxHeight: 260,
    padding: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  cardText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 36,
  },
  importInput: {
    minHeight: 150,
    textAlignVertical: 'top',
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    padding: 14,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
  },
});
