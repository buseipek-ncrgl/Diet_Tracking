import React, { useState, useEffect, useRef } from 'react';
import {
  Text, Image, View, SafeAreaView, ScrollView,
  Dimensions, TouchableOpacity, Modal, StyleSheet, Alert
} from 'react-native';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { findUserByEmail, getUserMeals } from '../database';
import BottomNavBar from '../screens/BottomNavBar';

const screenWidth = Dimensions.get('window').width;

const mealsData = {
  Breakfast: [
    { id: 1, title: 'Raisin & Banana', image: require('../assets/images/raisins_and_banana.png') },
    { id: 2, title: 'Yogurt with Fruits', image: require('../assets/images/yogurt_with_fruits_small.png') },
    { id: 3, title: 'Apple Pie', image: require('../assets/images/pie.png') },
  ],
  Lunch: [
    { id: 4, title: 'Grilled Chicken', image: require('../assets/images/grilledchicken.png') },
    { id: 5, title: 'Veggie Bowl', image: require('../assets/images/veggiebowlsmall.png') },
    { id: 6, title: 'Beef Wrap', image: require('../assets/images/beefwrapsmall.png') },
  ],
  Dinner: [
    { id: 7, title: 'Salmon Rice', image: require('../assets/images/salmonricesmall.png') },
    { id: 8, title: 'Mushroom Pasta', image: require('../assets/images/mushroompastasmall.png') },
    { id: 9, title: 'Chicken Soup', image: require('../assets/images/chickensoupsmall.png') },
  ]
};

export default function HomeScreen({ navigation }) {
  const [currentDate, setCurrentDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Breakfast');
  const scrollViewRef = useRef();

  const [weeklyCalories, setWeeklyCalories] = useState(null);
  const [estimatedLoss, setEstimatedLoss] = useState(null);
  const [calorieLimit, setCalorieLimit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [userEmail, setUserEmail] = useState(''); // ✅ Email state'i eklendi

  useEffect(() => {
    const loadUserData = async () => {
      const email = await AsyncStorage.getItem('loggedInUser');
      if (!email) return;

      setUserEmail(email); // ✅ Email state'e atanıyor

      const user = await findUserByEmail(email);
      const meals = await getUserMeals(email);

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const weeklyMeals = meals.filter(meal => {
        const mealDate = new Date(meal.created_at || Date.now());
        return mealDate >= oneWeekAgo;
      });

      const totalCalories = weeklyMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
      const limit = user.calorieLimit || 0;
      const deficit = (limit * 7) - totalCalories;
      const weightLoss = deficit > 0 ? deficit / 7700 : 0;

      setWeeklyCalories(totalCalories);
      setEstimatedLoss(weightLoss.toFixed(1));
      setCalorieLimit(limit);
    };

    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    setCurrentDate(`Today, ${day} ${month} ${year}`);

    loadUserData();
  }, []);

  const handleCardPress = () => {
    if (
      typeof calorieLimit === 'number' && calorieLimit > 0 &&
      typeof weeklyCalories === 'number' && weeklyCalories >= 0
    ) {
      setShowModal(true);
    } else {
      Alert.alert('Please wait', 'Data is still loading...');
    }
  };

  const maxCalories = Math.max((calorieLimit || 0) * 7, 1);
  const progressValue = Math.min(weeklyCalories / maxCalories, 1);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("../assets/images/mask_group_up.png")} />
      <View style={styles.headerview}>
        <View style={styles.view1}>
          <Text style={styles.activity}>Activity</Text>
          <Image style={styles.expandarrow} source={require("../assets/icons/expand_arrow_120px.png")} />
        </View>
        <View style={styles.view2}>
          <Text style={styles.datetext}>{currentDate}</Text>
          <Text style={styles.emailText}>{userEmail}</Text> {/* ✅ Email UI'ya eklendi */}
        </View>
      </View>

      <View style={styles.cardlayout}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity onPress={handleCardPress}>
            <View style={styles.card1}>
              <Text style={styles.cardheading}>Results of the week</Text>
              <View style={styles.dynamicActivity}>
                <View style={styles.circle}>
                  <Text style={styles.circleLabel}>You lost</Text>
                  <Text style={styles.circleValue}>
                    {estimatedLoss !== null ? `${estimatedLoss} kg` : '...'}
                  </Text>
                </View>
                <View style={styles.circle}>
                  {weeklyCalories !== null && calorieLimit !== null ? (
                    <Progress.Circle
                      progress={progressValue}
                      size={70}
                      thickness={6}
                      color={'#6CC57C'}
                      unfilledColor={'#E0E0E0'}
                      borderWidth={0}
                      showsText
                      formatText={() => `${weeklyCalories} kcal`}
                      textStyle={{ fontSize: 14, fontWeight: 'bold', color: '#23233C' }}
                    />
                  ) : (
                    <Text>Loading...</Text>
                  )}
                </View>
              </View>
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text style={{ fontSize: 10 }}>Never give up, <Text style={{ color: '#6CC57C' }}>know more</Text></Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.buttonview}>
        {['Breakfast', 'Lunch', 'Dinner'].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={selectedCategory === cat ? styles.breakfastbtn : styles.defaultbtn}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={selectedCategory === cat ? styles.breakfasttext : styles.defaulttext}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollTo({ x: 140, y: 0, animated: true })
        }
      >
        {mealsData[selectedCategory].map((meal, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('Details', { mealId: meal.id })}>
            <View style={styles.imageviews}>
              <View style={styles.shadowview}>
                <Image source={meal.image} />
              </View>
              <Text style={styles.selectedtext}>{meal.title}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNavBar navigation={navigation} activeTab="Home" />

      <Modal visible={showModal} transparent animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: '#00000099',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white',
            width: Math.min(screenWidth * 0.9, 350),
            padding: 20,
            borderRadius: 10,
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Weekly Summary</Text>
            <Text>Total Weekly Calories: {weeklyCalories} kcal</Text>
            <Text>Estimated Weight Loss: {estimatedLoss} kg</Text>
            <Text>Calorie Goal (7 days): {maxCalories} kcal</Text>
            <Text>Completion: {(progressValue * 100).toFixed(0)}%</Text>

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={{
                marginTop: 20,
                backgroundColor: '#6CC57C',
                padding: 12,
                borderRadius: 10,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5FA' },
  headerview: { flexDirection: 'row' },
  view1: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 30 },
  activity: { fontSize: 25, color: '#23233C', fontWeight: 'bold' },
  expandarrow: { marginLeft: 10, width: 40, height: 40 },
  view2: { marginHorizontal: 80, justifyContent: 'center' },
  datetext: { fontSize: 12, color: '#23233C' },
  emailText: { fontSize: 12, color: '#6CC57C', marginTop: 2 }, // ✅ Stil tanımı eklendi
  cardlayout: { flexDirection: 'row', marginTop: 10 },
  card1: {
    width: 320, height: 160, backgroundColor: 'white',
    borderRadius: 10, marginLeft: 30, padding: 10
  },
  cardheading: { fontSize: 16, color: '#23233C', fontWeight: 'bold' },
  buttonview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginLeft: -4,
  },
  breakfastbtn: {
    width: 133, height: 37, backgroundColor: '#6CC57C',
    alignItems: 'center', justifyContent: 'center', borderRadius: 18,
  },
  breakfasttext: { fontSize: 15, color: 'white' },
  defaultbtn: {
    width: 133, height: 37,
    alignItems: 'center', justifyContent: 'center',
  },
  defaulttext: { fontSize: 15, color: '#23233C' },
  contentContainer: { height: 420, alignItems: 'center', justifyContent: 'center' },
  imageviews: { alignItems: 'center', marginHorizontal: 15 },
  shadowview: {
    shadowOffset: { width: 10, height: 10 },
    shadowColor: '#0C256C',
    shadowOpacity: .13,
    elevation: 10,
  },
  selectedtext: {
    color: '#312D2D',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  dynamicActivity: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  circle: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  circleLabel: {
    fontSize: 10,
    color: '#8D8D8D',
  },
  circleValue: {
    fontSize: 16,
    color: '#23233C',
    fontWeight: 'bold',
  },
});
