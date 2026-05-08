import {
  FLOATING_TAB_BAR_METRICS,
  getFloatingTabIconSize,
} from './floating-tab-bar.layout';

describe('floating tab bar layout', () => {
  it('uses a taller bottom-aligned container for clearer primary navigation', () => {
    expect(FLOATING_TAB_BAR_METRICS.containerHeight).toBe(56);
    expect(FLOATING_TAB_BAR_METRICS.bottomOffset).toBe(0);
    expect(FLOATING_TAB_BAR_METRICS.selectedButtonHeight).toBe(48);
  });

  it('keeps focused icons visibly larger than inactive icons', () => {
    expect(getFloatingTabIconSize(true)).toBe(27);
    expect(getFloatingTabIconSize(false)).toBe(25);
  });
});
