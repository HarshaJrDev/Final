import React, { useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import * as Animatable from 'react-native-animatable';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const { login, loading } = useContext(AuthContext);

  const handleLogin = async () => {
    if (email.trim() === '' || password === '') {
      alert('Email and password are required');
      return;
    }
    
    await login(email, password);
  };

  return (
    <View style={styles.container}>
      <Animatable.View 
        animation="fadeInDown" 
        duration={1000} 
        style={styles.headerContainer}
      >
        <Title style={styles.headerTitle}>Task Master</Title>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </Animatable.View>
      
      <Animatable.View 
        animation="fadeInUp" 
        duration={1000} 
        style={styles.formContainer}
      >
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
        
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          Login
        </Button>
        
        <View style={styles.footer}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.link}> Register</Text>
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
    flex: 2,
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

export default LoginScreen;
