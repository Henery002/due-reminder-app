import { TextInput, type TextInputProps } from 'react-native';
import { normalizeNumericInput } from './NumericTextInput.helpers';

type NumericTextInputProps = Omit<TextInputProps, 'keyboardType' | 'onChangeText' | 'value'> & {
  decimal?: boolean;
  onChangeText(value: string): void;
  value: string;
};

export function NumericTextInput({
  decimal = false,
  onChangeText,
  ...props
}: NumericTextInputProps) {
  return (
    <TextInput
      {...props}
      keyboardType={decimal ? 'decimal-pad' : 'number-pad'}
      onChangeText={(nextValue) => {
        onChangeText(normalizeNumericInput(nextValue, { decimal }));
      }}
    />
  );
}

export { normalizeNumericInput };
