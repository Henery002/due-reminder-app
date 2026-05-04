type SubmitActionInput = {
  disabled?: boolean;
  label: string;
  loading?: boolean;
  loadingLabel?: string;
};

export type SubmitActionState = {
  disabled: boolean;
  label: string;
};

export function getSubmitActionState(input: SubmitActionInput): SubmitActionState {
  return {
    disabled: Boolean(input.disabled || input.loading),
    label: input.loading ? input.loadingLabel ?? input.label : input.label,
  };
}
