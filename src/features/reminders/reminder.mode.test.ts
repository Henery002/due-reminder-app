import {
  getReminderModeSwitchCopy,
  getReminderSubmitLabels,
} from './reminder.mode';

describe('reminder mode helpers', () => {
  it('returns create-page switch copy for notify and record-only modes', () => {
    expect(getReminderModeSwitchCopy('create', 'notify')).toEqual({
      description: '保存后会按下方计划向系统安排本地通知。',
      title: '安排本地提醒',
    });
    expect(getReminderModeSwitchCopy('create', 'record-only')).toEqual({
      description: '仅保存这条到期记录，不向系统安排新通知。',
      title: '安排本地提醒',
    });
  });

  it('returns edit-page switch copy for notify and record-only modes', () => {
    expect(getReminderModeSwitchCopy('edit', 'notify')).toEqual({
      description: '保存后会取消旧提醒，并按新计划重新安排。',
      title: '安排本地提醒',
    });
    expect(getReminderModeSwitchCopy('edit', 'record-only')).toEqual({
      description: '仅保存这条到期记录；保存时会取消旧通知，不再安排新提醒。',
      title: '安排本地提醒',
    });
  });

  it('returns submit labels for create and edit flows', () => {
    expect(getReminderSubmitLabels('create', 'notify')).toEqual({
      label: '保存并安排提醒',
      loadingLabel: '正在安排提醒...',
    });
    expect(getReminderSubmitLabels('create', 'record-only')).toEqual({
      label: '保存为记录',
      loadingLabel: '正在保存记录...',
    });
    expect(getReminderSubmitLabels('edit', 'notify')).toEqual({
      label: '保存修改并重排提醒',
      loadingLabel: '正在重排提醒...',
    });
    expect(getReminderSubmitLabels('edit', 'record-only')).toEqual({
      label: '保存为仅记录',
      loadingLabel: '正在保存记录...',
    });
  });
});
