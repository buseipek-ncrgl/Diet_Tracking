import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity,
  Dimensions, Alert, Modal, FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { findUserByEmail, updateUserProfile } from '../database';
import BottomNavBar from './BottomNavBar'; // path senin projenle uyumluysa

const screenWidth = Dimensions.get('window').width;

const goalOptions = Array.from({ length: 30 }, (_, i) => ({
  label: `Lose ${i + 1}kg`, value: `Lose ${i + 1}kg`
})).concat(
  Array.from({ length: 30 }, (_, i) => ({
    label: `Gain ${i + 1}kg`, value: `Gain ${i + 1}kg`
  }))
);

const calorieOptions = [1000, 1200, 1500, 1600, 1700, 1800, 2000, 2200, 2500, 2800, 3000];

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [tempGoal, setTempGoal] = useState('');
  const [tempCalorie, setTempCalorie] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showCalorieModal, setShowCalorieModal] = useState(false);

  const loadUser = async () => {
    const email = await AsyncStorage.getItem('loggedInUser');
    if (!email) return;

    const result = await findUserByEmail(email);
    if (result) {
      setUser(result);
      setTempGoal(result.goal || '');
      setTempCalorie(result.calorieLimit !== null ? String(result.calorieLimit) : '');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadUser);
    return unsubscribe;
  }, [navigation]);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Allow access to gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedUri = result.assets[0].uri;
      await updateUserProfile(user.email, { avatarUri: selectedUri });
      loadUser();
    }
  };

  const handleSave = async () => {
    if (!user?.email) return;

    try {
      await updateUserProfile(user.email, {
        goal: tempGoal,
        calorieLimit: parseInt(tempCalorie)
      });

      setTimeout(() => {
        Alert.alert("Saved", "Your profile has been updated.");
      }, 200);

      loadUser();
    } catch (err) {
      console.error("Update failed:", err);
      Alert.alert("Error", "Failed to save your changes.");
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F5FA' }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Image style={styles.headerImage} source={require('../assets/images/mask_group_up.png')} />

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handlePickImage}>
            <View style={styles.avatarContainer}>
              {user.avatarUri ? (
                <Image style={styles.avatar} source={{ uri: user.avatarUri }} />
              ) : (
                <View style={styles.avatarPlaceholder} />
              )}
              <Image source={require('../assets/icons/edit.png')} style={styles.editIcon} />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.label}>Goal</Text>
              <Text style={styles.value}>{tempGoal || 'Not set'}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowGoalModal(true)}>
              <Image source={require('../assets/icons/edit.png')} style={styles.inlineIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardContent}>
            <View>
              <Text style={styles.label}>Daily Calorie Limit</Text>
              <Text style={styles.value}>{tempCalorie ? `${tempCalorie} kcal` : 'Not set'}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowCalorieModal(true)}>
              <Image source={require('../assets/icons/edit.png')} style={styles.inlineIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={async () => {
          await AsyncStorage.removeItem('loggedInUser');
          navigation.replace('Login');
        }}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      <BottomNavBar navigation={navigation} activeTab="Profile" />

      {/* Goal Modal */}
      <Modal visible={showGoalModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={goalOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => {
                  setTempGoal(item.value);
                  setShowGoalModal(false);
                }}>
                  <Text style={styles.modalItem}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

{/* Calorie Modal */}
<Modal visible={showCalorieModal} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <FlatList
        data={calorieOptions}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {
            setTempCalorie(String(item));
            setShowCalorieModal(false);
          }}>
            <Text style={styles.modalItem}>{item} kcal</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerImage: { width: screenWidth, resizeMode: 'contain' },
  profileSection: { alignItems: 'center', marginTop: -10 },
  avatarContainer: { position: 'relative', width: 80, height: 80, marginBottom: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ccc' },
  editIcon: { width: 20, height: 20, position: 'absolute', bottom: 0, right: 0 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#23233C' },
  email: { fontSize: 14, color: '#8D8D8D', marginBottom: 20 },
  card: {
    backgroundColor: 'white', width: screenWidth * 0.9, padding: 15,
    borderRadius: 10, marginVertical: 8, elevation: 4,
  },
  cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 13, color: '#8D8D8D' },
  value: { fontSize: 16, fontWeight: 'bold', color: '#23233C' },
  inlineIcon: { width: 20, height: 20 },
  saveButton: {
    marginTop: 20, backgroundColor: '#6CC57C',
    paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20,
  },
  saveText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  logoutButton: {
    marginTop: 15, backgroundColor: '#EE6A6E',
    paddingVertical: 12, paddingHorizontal: 40, borderRadius: 20,
  },
  logoutText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  modalContainer: {
    flex: 1, backgroundColor: '#00000099',
    justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white', width: screenWidth * 0.8,
    maxHeight: 400, borderRadius: 10, padding: 20,
  },
  modalItem: {
    fontSize: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#eee',
  },
});
