import React, { useState } from 'react';
import {
  Text, View, SafeAreaView, TextInput, TouchableOpacity,
  StyleSheet, Dimensions, Image, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser, findUserByEmail } from '../database';

const imageWidth = Dimensions.get('window').width;

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        Alert.alert("Error", "This email is already registered.");
        return;
      }

      await registerUser(name, email, password);
      await AsyncStorage.setItem('loggedInUser', email); // ✅ AsyncStorage'a yaz
      Alert.alert("Success", "Registration successful. Welcome!");
      navigation.replace('Home');

    } catch (err) {
      Alert.alert("Error", "An error occurred while recording.");
      console.log("Registration error:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/images/mask_group_up.png')} />
      <Text style={styles.heading}>Register</Text>

      <View style={styles.form}>
        <TextInput placeholder="Name" style={styles.input} onChangeText={setName} value={name} />
        <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} value={email} />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={setPassword} value={password} />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={styles.signInText}>Login</Text>
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
    marginTop: 15,
    textAlign: 'center',
  },
  signInText: { fontWeight: 'bold', color: '#23233C' },
  button: {
    backgroundColor: '#23233C',
    width: 336,
    height: 54,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  bottom: { flex: 1, justifyContent: 'flex-end' },
  imageBottom: { width: imageWidth, position: 'absolute', bottom: 0 },
});
