import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.154.90:2000';

// Utility to safely parse any date input
const safeParseDate = (value, fallback = new Date()) => {
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? fallback : parsed;
};

const EditTaskScreen = ({ route, navigation }) => {
  const { task } = route.params;

  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');

  const [date, setDate] = useState(safeParseDate(task.date));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [startTime, setStartTime] = useState(safeParseDate(task.startTime));
  const [showStartPicker, setShowStartPicker] = useState(false);

  const [endTime, setEndTime] = useState(safeParseDate(task.endTime));
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      await axios.put(
        `${API_URL}/tasks/${task._id}`,
        {
          title,
          description,
          date: date.toISOString(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert('Success', 'Task updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating task:', error);
      Alert.alert('Error', 'Failed to update task.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateObj) =>
    dateObj.toLocaleDateString();

  const formatTime = (dateObj) =>
    dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={styles.heading}>Edit Task</Text>

      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        mode="outlined"
        multiline
        numberOfLines={4}
        style={styles.input}
      />

      {/* Date Picker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          label="Date"
          value={formatDate(date)}
          mode="outlined"
          editable={false}
          style={styles.input}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* Start Time Picker */}
      <TouchableOpacity onPress={() => setShowStartPicker(true)}>
        <TextInput
          label="Start Time"
          value={formatTime(startTime)}
          mode="outlined"
          editable={false}
          style={styles.input}
        />
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="default"
          onChange={(_, selectedTime) => {
            setShowStartPicker(false);
            if (selectedTime) setStartTime(selectedTime);
          }}
        />
      )}

      {/* End Time Picker */}
      <TouchableOpacity onPress={() => setShowEndPicker(true)}>
        <TextInput
          label="End Time"
          value={formatTime(endTime)}
          mode="outlined"
          editable={false}
          style={styles.input}
        />
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="default"
          onChange={(_, selectedTime) => {
            setShowEndPicker(false);
            if (selectedTime) setEndTime(selectedTime);
          }}
        />
      )}

      <Button
        mode="contained"
        onPress={handleUpdate}
        loading={loading}
        style={styles.button}
        contentStyle={{ paddingVertical: 6 }}
      >
        Update Task
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#F8F9FD',
    flexGrow: 1,
  },
  heading: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
  },
});

export default EditTaskScreen;
