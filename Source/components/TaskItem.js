import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Surface, Text, Checkbox, IconButton} from 'react-native-paper';
import {useTheme} from 'react-native-paper';
import {typography} from '../theme/typography';
import {spacing} from '../theme/spacing';
import Animated, {FadeInRight, FadeOutLeft} from 'react-native-reanimated';

const TaskItem = ({task, onPress, onToggleComplete, onDelete}) => {
  const theme = useTheme();
  const {colors} = theme;

  const statusColors = {
    pending: theme.dark ? '#FFD700' : '#FFC107',
    'in-progress': theme.dark ? '#4FC3F7' : '#2196F3',
    completed: theme.dark ? '#69F0AE' : '#4CAF50',
  };

  return (
    <Animated.View
      entering={FadeInRight.duration(300)}
      exiting={FadeOutLeft.duration(300)}>
      <TouchableOpacity onPress={() => onPress(task)}>
        <Surface
          style={[styles.container, {backgroundColor: theme.colors.surface}]}>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={task.completed ? 'checked' : 'unchecked'}
              onPress={() => onToggleComplete(task.id)}
              color={colors.primary}
            />
          </View>

          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                  fontFamily: typography.medium,
                  textDecorationLine: task.completed ? 'line-through' : 'none',
                  opacity: task.completed ? 0.7 : 1,
                },
              ]}
              numberOfLines={1}>
              {task.title}
            </Text>

            {task.description ? (
              <Text
                style={[
                  styles.description,
                  {
                    color: colors.textSecondary,
                    fontFamily: typography.regular,
                    opacity: task.completed ? 0.7 : 1,
                  },
                ]}
                numberOfLines={1}>
                {task.description}
              </Text>
            ) : null}

            <View style={styles.footer}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      statusColors[task.status] || colors.primary,
                  },
                ]}>
                <Text
                  style={[
                    styles.statusText,
                    {color: '#000000', fontFamily: typography.medium},
                  ]}>
                  {task.status}
                </Text>
              </View>

              {task.dueDate && (
                <Text
                  style={[
                    styles.dueDate,
                    {
                      color: colors.textSecondary,
                      fontFamily: typography.regular,
                    },
                  ]}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>

          <IconButton
            icon="delete-outline"
            size={20}
            onPress={() => onDelete(task.id)}
            iconColor={theme.dark ? colors.error : '#757575'}
          />
        </Surface>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
    marginHorizontal: spacing.m,
    padding: spacing.m,
    borderRadius: 12,
    elevation: 1,
  },
  checkboxContainer: {
    marginRight: spacing.s,
  },
  content: {
    flex: 1,
    marginLeft: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.body,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.sizes.caption,
    marginBottom: spacing.s,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs / 2,
    borderRadius: 4,
    marginRight: spacing.m,
  },
  statusText: {
    fontSize: typography.sizes.small,
  },
  dueDate: {
    fontSize: typography.sizes.small,
  },
});

export default TaskItem;
