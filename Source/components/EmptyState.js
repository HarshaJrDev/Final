import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import {useTheme} from 'react-native-paper';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';
import CustomButton from './CustomButton';

const EmptyState = ({
  animation,
  title,
  message,
  buttonTitle = 'Add New Task',
  onButtonPress,
}) => {
  const theme = useTheme();
  const {colors} = theme;

  return (
    <View style={styles.container}>
      <LottieView source={animation} autoPlay loop style={styles.animation} />

      <Text
        style={[
          styles.title,
          {color: colors.text, fontFamily: typography.bold},
        ]}>
        {title}
      </Text>

      <Text
        style={[
          styles.message,
          {color: colors.textSecondary, fontFamily: typography.regular},
        ]}>
        {message}
      </Text>

      {buttonTitle && onButtonPress && (
        <CustomButton
          title={buttonTitle}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: spacing.l,
  },
  title: {
    fontSize: typography.sizes.h2,
    marginBottom: spacing.s,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.sizes.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    minWidth: 200,
  },
});

export default EmptyState;
