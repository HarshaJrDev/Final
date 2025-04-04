import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import TasksScreen from '../screens/tasks/TasksScreen';
import AddTaskScreen from '../screens/tasks/AddTaskScreen';
import EditTaskScreen from '../screens/tasks/EditTaskScreen';
import ProfileScreen from '../screens/tasks/ProfileScreen';

const Tab = createBottomTabNavigator();
const TasksStack = createStackNavigator();

const TasksStackNavigator = () => (
  <TasksStack.Navigator>
    <TasksStack.Screen 
      name="Tasks" 
      component={TasksScreen} 
      options={{ headerShown: false }}
    />
    <TasksStack.Screen 
      name="AddTask" 
      component={AddTaskScreen} 
      options={{ title: 'Add New Task' }}
    />
    <TasksStack.Screen 
      name="EditTask" 
      component={EditTaskScreen} 
      options={{ title: 'Edit Task' }}
    />
  </TasksStack.Navigator>
);

const MainNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="TasksTab"
      activeColor={theme.colors.primary}
      screenOptions={{headerShown:false}}
      barStyle={{ backgroundColor: 'white' }}
    >
      <Tab.Screen
        name="TasksTab"
        component={TasksStackNavigator}
        options={{
          tabBarLabel: 'Tasks',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="format-list-checks" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
