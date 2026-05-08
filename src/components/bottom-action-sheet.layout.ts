const BASE_BOTTOM_PADDING = 24;

export function getBottomActionSheetBottomPadding(bottomInset: number) {
  return BASE_BOTTOM_PADDING + Math.max(0, bottomInset);
}
