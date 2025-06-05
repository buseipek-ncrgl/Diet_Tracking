import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity,
  Dimensions, Image, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { insertUserMeal } from '../database';
import BottomNavBar from './BottomNavBar';

const screenWidth = Dimensions.get('window').width;

export default function AddMealScreen({ navigation }) {
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [mealType, setMealType] = useState('Breakfast');

  const handleSave = async () => {
    if (!mealName || !calories) {
      Alert.alert('Error', 'Please enter meal name and calories.');
      return;
    }

    const email = await AsyncStorage.getItem('loggedInUser');
    if (!email) {
      Alert.alert('Error', 'No logged in user found.');
      return;
    }

    try {
      await insertUserMeal(email, mealName, calories, mealType, notes);
      Alert.alert('Success', 'Meal saved successfully!');
      // Temizle
      setMealName('');
      setCalories('');
      setNotes('');
      setMealType('Breakfast');
    } catch (error) {
      console.log('Insert error:', error);
      Alert.alert('Error', 'Failed to save meal.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#F4F5FA' }}>
        <Image
          style={styles.headerImage}
          source={require('../assets/images/mask_group_up.png')}
        />

        <Text style={styles.heading}>Add a New Meal</Text>

        <TextInput
          style={styles.input}
          placeholder="Meal Name"
          value={mealName}
          onChangeText={setMealName}
        />

        <TextInput
          style={styles.input}
          placeholder="Calories"
          keyboardType="numeric"
          value={calories}
          onChangeText={setCalories}
        />

        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ingredients / Notes"
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
        />

        <View style={styles.mealTypeContainer}>
          {['Breakfast', 'Lunch', 'Dinner'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.mealTypeButton,
                mealType === type && styles.selectedMealType,
              ]}
              onPress={() => setMealType(type)}
            >
              <Text
                style={[
                  styles.mealTypeText,
                  mealType === type && styles.selectedMealTypeText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Meal</Text>
        </TouchableOpacity>
      </View>

      <BottomNavBar navigation={navigation} activeTab="Add" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: screenWidth,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#23233C',
    marginVertical: 20,
  },
  input: {
    backgroundColor: 'white',
    width: screenWidth * 0.9,
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 14,
    elevation: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  mealTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: screenWidth * 0.9,
    marginBottom: 20,
  },
  mealTypeButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  selectedMealType: {
    backgroundColor: '#6CC57C',
  },
  mealTypeText: {
    color: '#23233C',
    fontWeight: 'bold',
  },
  selectedMealTypeText: {
    color: 'white',
  },
  saveButton: {
    backgroundColor: '#23233C',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
