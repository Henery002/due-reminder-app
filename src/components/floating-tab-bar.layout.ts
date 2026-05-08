export const FLOATING_TAB_BAR_METRICS = {
  bottomOffset: 0,
  containerHeight: 56,
  horizontalInset: 20,
  iconActive: 27,
  iconInactive: 25,
  selectedButtonHeight: 48,
  selectedButtonWidth: 58,
} as const;

export function getFloatingTabIconSize(focused: boolean) {
  return focused
    ? FLOATING_TAB_BAR_METRICS.iconActive
    : FLOATING_TAB_BAR_METRICS.iconInactive;
}
