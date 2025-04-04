import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Title, Card, Text, Button, Divider } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import * as Animatable from 'react-native-animatable';

const ProfileScreen = () => {
  const { user, logout, loading } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Animatable.View 
        animation="fadeIn" 
        duration={1000} 
        style={styles.header}
      >
        <Avatar.Text 
          size={80} 
          label={user?.username?.substring(0, 2).toUpperCase() || 'U'} 
        />
        <Title style={styles.username}>{user?.username}</Title>
        <Text style={styles.email}>{user?.email}</Text>
      </Animatable.View>
      
      <Animatable.View 
        animation="fadeInUp" 
        duration={1000} 
        delay={300} 
        style={styles.content}
      >
        <Card style={styles.card}>
          <Card.Title title="Account Information" />
          <Divider />
          <Card.Content style={styles.cardContent}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Username</Text>
              <Text style={styles.infoValue}>{user?.username}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </Card.Content>
        </Card>
        
       
        <Button 
          mode="contained" 
          onPress={logout}
          loading={loading}
          style={styles.logoutButton}
        >
          Logout
        </Button>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  username: {
    marginTop: 10,
    fontSize: 22,
  },
  email: {
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardContent: {
    paddingVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    color: '#666',
  },
  infoValue: {
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 'auto',
  },
});

export default ProfileScreen;