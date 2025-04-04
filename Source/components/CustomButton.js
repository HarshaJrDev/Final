import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';

const CustomButton = ({
  title,
  onPress,
  variant = 'filled', // 'filled', 'outlined', 'text'
  size = 'medium', // 'small', 'medium', 'large'
  loading = false,
  disabled = false,
  style = {},
}) => {
  const theme = useTheme();
  const {colors} = theme;

  const buttonStyles = [
    styles.button,
    styles[size],
    variant === 'filled' && {
      backgroundColor: colors.primary,
    },
    variant === 'outlined' && {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    disabled && {
      opacity: 0.6,
    },
    style,
  ];

  const textStyles = [
    styles.text,
    {fontFamily: typography.medium},
    variant === 'filled' && {
      color:
        variant === 'filled'
          ? theme.dark
            ? '#000000'
            : '#FFFFFF'
          : colors.primary,
    },
    variant === 'outlined' && {
      color: colors.primary,
    },
    variant === 'text' && {
      color: colors.primary,
    },
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'filled'
              ? theme.dark
                ? '#000000'
                : '#FFFFFF'
              : colors.primary
          }
          size="small"
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.m,
    height: 36,
  },
  medium: {
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.l,
    height: 48,
  },
  large: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.xl,
    height: 56,
  },
  text: {
    fontSize: typography.sizes.body,
    textAlign: 'center',
  },
});

export default CustomButton;
