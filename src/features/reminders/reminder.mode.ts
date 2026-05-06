import type { ReminderMode } from './reminder.types';

export type ReminderFormVariant = 'create' | 'edit';

export type ReminderModeSwitchCopy = {
  description: string;
  title: string;
};

export type ReminderSubmitLabels = {
  label: string;
  loadingLabel: string;
};

export function getReminderModeSwitchCopy(
  variant: ReminderFormVariant,
  mode: ReminderMode,
): ReminderModeSwitchCopy {
  if (variant === 'edit') {
    return {
      description:
        mode === 'notify'
          ? '保存后会取消旧提醒，并按新计划重新安排。'
          : '仅保存这条到期记录；保存时会取消旧通知，不再安排新提醒。',
      title: '安排本地提醒',
    };
  }

  return {
    description:
      mode === 'notify'
        ? '保存后会按下方计划向系统安排本地通知。'
        : '仅保存这条到期记录，不向系统安排新通知。',
    title: '安排本地提醒',
  };
}

export function getReminderSubmitLabels(
  variant: ReminderFormVariant,
  mode: ReminderMode,
): ReminderSubmitLabels {
  if (variant === 'edit') {
    return mode === 'notify'
      ? {
          label: '保存修改并重排提醒',
          loadingLabel: '正在重排提醒...',
        }
      : {
          label: '保存为仅记录',
          loadingLabel: '正在保存记录...',
        };
  }

  return mode === 'notify'
    ? {
        label: '保存并安排提醒',
        loadingLabel: '正在安排提醒...',
      }
    : {
        label: '保存为记录',
        loadingLabel: '正在保存记录...',
      };
}
