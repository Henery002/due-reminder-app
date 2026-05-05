import { forwardRef, useRef, type ReactNode } from 'react';
import {
  Animated,
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type View,
  type ViewStyle,
} from 'react-native';

type PressableScaleProps = PressableProps & {
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  scaleTo?: number;
};

export const PressableScale = forwardRef<View, PressableScaleProps>(function PressableScale(
  { children, containerStyle, disabled, onPressIn, onPressOut, scaleTo = 0.97, style, ...rest },
  ref,
) {
  const pressScale = useRef(new Animated.Value(1)).current;

  const animateTo = (toValue: number) => {
    Animated.spring(pressScale, {
      damping: 16,
      mass: 0.55,
      stiffness: 260,
      toValue,
      useNativeDriver: true,
    }).start();
  };

  const resolveStyle = (state: PressableStateCallbackType) =>
    typeof style === 'function' ? style(state) : style;

  return (
    <Animated.View style={[containerStyle, { transform: [{ scale: pressScale }] }]}>
      <Pressable
        {...rest}
        ref={ref}
        disabled={disabled}
        onPressIn={(event) => {
          if (!disabled) {
            animateTo(scaleTo);
          }
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          if (!disabled) {
            animateTo(1);
          }
          onPressOut?.(event);
        }}
        style={(state) => resolveStyle(state)}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
});
