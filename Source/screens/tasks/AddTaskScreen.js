import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { TextInput, Button, Text, Chip } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.154.90:2000';

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Design');
  const [loading, setLoading] = useState(false);

  const categories = [
    { name: 'Design', color: '#FF5733' },
    { name: 'Meeting', color: '#3498DB' },
    { name: 'Coding', color: '#2ECC71' },
    { name: 'BDE', color: '#F1C40F' },
    { name: 'Testing', color: '#9B59B6' },
    { name: 'Quick Call', color: '#E74C3C' },
  ];

  const handleCreateTask = async () => {
    if (!title.trim()) {
      alert('Task title is required');
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        alert('Authentication error. Please log in again.');
        return;
      }

      const taskData = {
        title,
        description,
        date: date.toISOString().split('T')[0],
        startTime: startTime.toLocaleTimeString(),
        endTime: endTime.toLocaleTimeString(),
        category: selectedCategory,
      };

      console.log('📝 Task Data to Send:', taskData);

      const response = await axios.post(`${API_URL}/tasks`, taskData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('✅ Task Created Successfully:', response.data);

      navigation.goBack();
    } catch (error) {
      console.error('❌ Error creating task:', error.response?.data || error.message);
      alert('Failed to create task. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Animatable.View animation="fadeInUp" style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Task Name</Text>
            <TextInput label="Enter Task Name" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />

            <Text style={styles.label}>Date</Text>
            <Button mode="outlined" onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
              {date.toDateString()}
            </Button>
            {showDatePicker && (
              <DateTimePicker value={date} mode="date" display="default" onChange={(e, d) => { setDate(d || date); setShowDatePicker(false); }} />
            )}

            <Text style={styles.label}>Time</Text>
            <View style={styles.timeContainer}>
              <Button mode="outlined" onPress={() => setShowStartTimePicker(true)} style={styles.timeButton}>
                Start: {startTime.toLocaleTimeString()}
              </Button>
              <Button mode="outlined" onPress={() => setShowEndTimePicker(true)} style={styles.timeButton}>
                End: {endTime.toLocaleTimeString()}
              </Button>
            </View>
            {showStartTimePicker && (
              <DateTimePicker value={startTime} mode="time" onChange={(e, t) => { setStartTime(t || startTime); setShowStartTimePicker(false); }} />
            )}
            {showEndTimePicker && (
              <DateTimePicker value={endTime} mode="time" onChange={(e, t) => { setEndTime(t || endTime); setShowEndTimePicker(false); }} />
            )}

            <Text style={styles.label}>Description</Text>
            <TextInput
              label="Enter Description"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              style={styles.input}
            />

            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map(({ name, color }) => (
                <Animatable.View key={name} animation="bounceIn" delay={100}>
                  <Chip
                    selected={selectedCategory === name}
                    onPress={() => setSelectedCategory(name)}
                    style={[styles.chip, { backgroundColor: selectedCategory === name ? color : '#f0f0f0' }]}
                    textStyle={{ color: selectedCategory === name ? '#fff' : '#333' }}
                  >
                    {name}
                  </Chip>
                </Animatable.View>
              ))}
            </View>

            <Button mode="contained" onPress={handleCreateTask} loading={loading} style={styles.button}>
              Create Task
            </Button>
          </ScrollView>
        </Animatable.View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA', padding: 16 },
  scrollContainer: { paddingBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginVertical: 8, color: '#333' },
  input: { marginBottom: 16, backgroundColor: '#fff' },
  dateButton: { marginBottom: 16, borderColor: '#623CEA', borderWidth: 1 },
  timeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  timeButton: { flex: 1, marginHorizontal: 5, borderColor: '#3498DB', borderWidth: 1 },
  categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  chip: { padding: 8, marginRight: 8, borderRadius: 16 },
  button: { marginTop: 10, backgroundColor: '#623CEA', borderRadius: 25 },
});

export default AddTaskScreen;
