export type ReminderFeedbackType = 'created' | 'deleted' | 'free-limit' | 'updated';

export type ReminderFeedback = {
  description: string;
  title: string;
  tone: 'success' | 'warning';
};

const feedbackCopy: Record<ReminderFeedbackType, ReminderFeedback> = {
  created: {
    description: '这件事已经放进你的到期清单，快到期时会提醒你。',
    title: '已安排好提醒',
    tone: 'success',
  },
  deleted: {
    description: '本地记录已移除，相关提醒也会一起取消。',
    title: '已删除事项',
    tone: 'success',
  },
  'free-limit': {
    description: '先删除不再需要的事项，或查看后续开放的 Pro 权益。',
    title: '免费版空间已满',
    tone: 'warning',
  },
  updated: {
    description: '新的到期日和提醒策略已经保存。',
    title: '已更新提醒',
    tone: 'success',
  },
};

export function getReminderFeedback(type: ReminderFeedbackType): ReminderFeedback {
  return feedbackCopy[type];
}
