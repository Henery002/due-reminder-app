import type { ReminderTemplate } from '../types/app';

export const reminderTemplates: ReminderTemplate[] = [
  { id: 'video-member', type: 'subscription', name: '视频会员', icon: 'play-circle' },
  { id: 'cloud-drive', type: 'subscription', name: '网盘会员', icon: 'cloud' },
  { id: 'credit-card', type: 'bill', name: '信用卡', icon: 'credit-card' },
  { id: 'rent', type: 'bill', name: '房租', icon: 'home' },
  { id: 'driver-license', type: 'document', name: '驾驶证', icon: 'badge' },
  { id: 'passport', type: 'document', name: '护照', icon: 'book-open' },
];
