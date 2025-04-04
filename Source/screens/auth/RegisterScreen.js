import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import * as Animatable from 'react-native-animatable';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { register, loading } = useContext(AuthContext);

  const handleRegister = async () => {
    if (username.trim() === '' || email.trim() === '' || password === '') {
      alert('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    const success = await register(username, email, password);
    if (success) {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Animatable.View 
        animation="fadeInDown" 
        duration={1000} 
        style={styles.headerContainer}
      >
        <Title style={styles.headerTitle}>Create Account</Title>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </Animatable.View>
      
      <Animatable.View 
        animation="fadeInUp" 
        duration={1000} 
        style={styles.formContainer}
      >
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
        />
        
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          mode="outlined"
          style={styles.input}
          right={
            <TextInput.Icon
              name={secureTextEntry ? "eye" : "eye-off"}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
        />
        
        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={secureTextEntry}
          mode="outlined"
          style={styles.input}
        />
        
        <Button
          mode="contained"
          onPress={handleRegister}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Register
        </Button>
        
        <View style={styles.footer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}> Login</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    flex: 2.5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    elevation: 10,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  link: {
    color: '#6200ee',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
