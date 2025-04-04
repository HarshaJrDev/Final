import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, FlatList, RefreshControl } from 'react-native';
import { Text, Button, ActivityIndicator, FAB, IconButton } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Spacing from '../../constants/Spacing';
import FontSize from '../../constants/FontSize';
import Colors from '../../constants/Colors';
import Radius from '../../constants/Radius';

const API_URL = 'http://192.168.154.90:2000';

const TaskScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [deletingTaskId, setDeletingTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getFilteredTasks = () => {
    if (filter === 'in-progress') return tasks.filter(task => task.status === 'in-progress');
    if (filter === 'completed') return tasks.filter(task => task.completed);
    return tasks;
  };

  const handleDelete = async (taskId) => {
    setDeletingTaskId(taskId);
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setDeletingTaskId(null);
    }
  };

  const confirmDelete = (taskId) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => handleDelete(taskId) }
    ]);
  };

  const renderItem = ({ item: task }) => (
    <View style={styles.taskBox}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <View style={styles.taskActions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => navigation.navigate('EditTask', { task })}
          />
          {deletingTaskId === task._id ? (
            <ActivityIndicator size={20} color="red" />
          ) : (
            <IconButton
              icon="trash-can"
              size={20}
              onPress={() => confirmDelete(task._id)}
            />
          )}
        </View>
      </View>

      <View style={styles.taskRow}>
        <Icon name="calendar" size={20} color={Colors.muted} style={styles.taskIcon} />
        <Text style={styles.taskText}>{task.date}</Text>
      </View>

      <View style={styles.taskRow}>
        <Icon name="clock-outline" size={20} color={Colors.muted} style={styles.taskIcon} />
        <Text style={styles.taskText}>{task.startTime} - {task.endTime}</Text>
      </View>

      <View style={styles.taskRow}>
        <Icon name="text-box-outline" size={20} color={Colors.muted} style={styles.taskIcon} />
        <Text style={styles.taskText}>{task.description || 'No description'}</Text>
      </View>

      <View style={styles.taskRow}>
        <Icon name="label-outline" size={20} color={Colors.muted} style={styles.taskIcon} />
        <Text style={styles.taskText}>{task.category}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hello</Text>
      <Text style={styles.subHeader}>Have a nice day.</Text>

      <View style={styles.filterContainer}>
        {['all', 'in-progress', 'completed'].map((type) => (
          <Button
            key={type}
            mode={filter === type ? 'contained' : 'outlined'}
            style={styles.filterButton}
            onPress={() => setFilter(type)}
          >
            {type === 'all' ? 'My Tasks' : type.replace('-', ' ')}
          </Button>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={getFilteredTasks()}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchTasks();
              }}
            />
          }
          contentContainerStyle={{ paddingBottom: Spacing.xxl }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Task"
        onPress={() => navigation.navigate('AddTask')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: Colors.text,
  },
  subHeader: {
    fontSize: FontSize.md,
    color: Colors.subtext,
    fontFamily: 'Poppins',
    marginBottom: Spacing.md,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  filterButton: {
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.xs,
  },
  taskBox: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  taskTitle: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: Colors.text,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  taskIcon: {
    marginRight: Spacing.sm,
  },
  taskText: {
    fontSize: FontSize.md,
    fontFamily: 'Poppins',
    color: Colors.subtext,
    flexShrink: 1,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.xl,
    backgroundColor: Colors.primary,
  },
});

export default TaskScreen;
