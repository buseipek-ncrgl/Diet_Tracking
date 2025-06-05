import React, { useState } from 'react';
import {
  Text, View, SafeAreaView, TextInput, TouchableOpacity,
  StyleSheet, Dimensions, Image, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../database';

const imageWidth = Dimensions.get('window').width;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password fields cannot be empty.");
      return;
    }

    try {
      const user = await loginUser(email, password);
      if (user) {
        await AsyncStorage.setItem('loggedInUser', email); // ✅ Kaydet
        Alert.alert("Login Successful", `Welcome, ${user.name}`);
        navigation.replace('Home');
      } else {
        Alert.alert("Error", "Email or password is incorrect.");
      }
    } catch (err) {
      Alert.alert("Error", "Login error occurred.");
      console.log("Login error:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/images/mask_group_up.png')} />
      <Text style={styles.heading}>Welcome</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
          value={password}
        />

        <Text style={styles.linkText}>Forgot your password?</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={styles.signUpText}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottom}>
        <Image style={styles.imageBottom} source={require('../assets/images/mask_group_down.png')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5FA' },
  heading: {
    marginTop: 80,
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#23233C',
  },
  form: { alignItems: 'center', marginTop: 30 },
  input: {
    width: 336,
    height: 54,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 20,
    fontSize: 14,
    color: '#23233C',
    marginBottom: 20,
    elevation: 5,
  },
  linkText: {
    fontSize: 13,
    color: '#8D8D8D',
    marginBottom: 10,
    textAlign: 'center',
  },
  signUpText: { fontWeight: 'bold', color: '#23233C' },
  button: {
    backgroundColor: '#23233C',
    width: 336,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  bottom: { flex: 1, justifyContent: 'flex-end' },
  imageBottom: { width: imageWidth, position: 'absolute', bottom: 0 },
});
