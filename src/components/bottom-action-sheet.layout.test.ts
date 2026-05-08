import { getBottomActionSheetBottomPadding } from './bottom-action-sheet.layout';

describe('getBottomActionSheetBottomPadding', () => {
  it('keeps actions above the device safe area and floating tab bar', () => {
    expect(getBottomActionSheetBottomPadding(34)).toBe(58);
  });

  it('uses a compact minimum padding when there is no bottom inset', () => {
    expect(getBottomActionSheetBottomPadding(0)).toBe(24);
  });
});
