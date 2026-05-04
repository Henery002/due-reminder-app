import { getSubmitActionState } from './reminder.submit';

describe('reminder submit helpers', () => {
  it('keeps the idle action enabled with the default label', () => {
    expect(getSubmitActionState({ label: '保存并安排提醒' })).toEqual({
      disabled: false,
      label: '保存并安排提醒',
    });
  });

  it('uses the loading label and disables the action while submitting', () => {
    expect(
      getSubmitActionState({
        label: '保存并安排提醒',
        loading: true,
        loadingLabel: '正在安排提醒...',
      }),
    ).toEqual({
      disabled: true,
      label: '正在安排提醒...',
    });
  });

  it('keeps externally disabled actions disabled even when not loading', () => {
    expect(getSubmitActionState({ disabled: true, label: '删除事项' })).toEqual({
      disabled: true,
      label: '删除事项',
    });
  });
});
