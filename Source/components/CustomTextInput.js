import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

const CustomTextInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  returnKeyType,
  onSubmitEditing,
  errorMessage,
  icon,
  inputRef,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const [showPassword, setShowPassword] = useState(!secureTextEntry);

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry ? !showPassword : false}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        mode="outlined"
        outlineColor={colors.border}
        activeOutlineColor={colors.primary}
        style={[styles.input, { backgroundColor: colors.surface }]}
        right={
          secureTextEntry ? (
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
              color={colors.textSecondary}
            />
          ) : (
            icon && <TextInput.Icon icon={icon} color={colors.textSecondary} />
          )
        }
        theme={{
          colors: {
            text: colors.text,
            placeholder: colors.textSecondary,
          },
        }}
      />
      {errorMessage ? <Text style={[styles.errorText, { color: colors.error }]}>{errorMessage}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomTextInput;
