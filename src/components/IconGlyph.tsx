import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type IconGlyphProps = {
  label: string;
  color?: string;
  tone?: 'primary' | 'done' | 'dueSoon';
  size?: number;
};

const toneColor = {
  primary: colors.primary,
  done: colors.done,
  dueSoon: colors.dueSoon,
} as const;

export function IconGlyph({ label, color, tone = 'primary', size = 18 }: IconGlyphProps) {
  return (
    <View style={[styles.wrap, { height: size + 16, width: size + 16 }]}>
      <Text style={[styles.text, { color: color ?? toneColor[tone], fontSize: Math.max(12, size - 4) }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '900',
  },
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
