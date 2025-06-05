import React, { useState } from 'react';
import {
  Text, View, StyleSheet, SafeAreaView, Image,
  Dimensions, TouchableOpacity, ScrollView
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const meals = [
  {
    id: 1,
    title: 'Raisin & Banana',
    image: require('../assets/images/raisins_and_banana.png'),
    description: 'Sweet and nutritious energy booster with natural sugars and fiber-rich fruits.',
    calories: 195,
    fat: '0.5g',
    carbs: '51g',
    protein: '1.6g',
    ingredients: [
      { name: 'Banana', icon: require('../assets/icons/banana.png') },
      { name: 'Raisins', icon: require('../assets/icons/raisin.png') },
      { name: 'Oats', icon: require('../assets/icons/oats.png') },
      { name: 'Honey', icon: require('../assets/icons/honey.png') },
    ]
  },
  {
    id: 2,
    title: 'Yogurt with Fruits',
    image: require('../assets/images/yogurt_with_fruits_large.png'),
    description: 'Refreshing mix of yogurt and seasonal fruits, perfect for breakfast or snack.',
    calories: 243,
    fat: '2.8g',
    carbs: '45.7g',
    protein: '9.8g',
    ingredients: [
      { name: 'Kiwi', icon: require('../assets/icons/kiwi.png') },
      { name: 'Yogurt', icon: require('../assets/icons/yogurt.png') },
      { name: 'Cherry', icon: require('../assets/icons/cherry.png') },
      { name: 'Blueberry', icon: require('../assets/icons/blueberry.png') },
    ]
  },

  {
    id: 3,
    title: 'Apple Pie',
    image: require('../assets/images/pie.png'),
    description: 'Classic homemade dessert made with sweet apples and warm spices in a flaky crust.',
    calories: 320,
    fat: '15g',
    carbs: '42g',
    protein: '2g',
    ingredients: [
      { name: 'Apple', icon: require('../assets/icons/apple.png') },
      { name: 'Flour', icon: require('../assets/icons/flour.png') },
      { name: 'Butter', icon: require('../assets/icons/butter.png') },
      { name: 'Cinnamon', icon: require('../assets/icons/cinnamon.png') },
    ]
  },

  {
    id: 4,
    title: 'Grilled Chicken',
    image: require('../assets/images/grilledchickenlarge.png'),
    description: 'Juicy grilled chicken breast seasoned with herbs, served with veggies or rice.',
    calories: 280,
    fat: '6g',
    carbs: '0g',
    protein: '53g',
    ingredients: [
      { name: 'Chicken', icon: require('../assets/icons/chicken.png') },
      { name: 'Olive Oil', icon: require('../assets/icons/oliveoil.png') },
      { name: 'Garlic', icon: require('../assets/icons/garlic.png') },
      { name: 'Pepper', icon: require('../assets/icons/pepper.png') },
    ]
  },

  {
    id: 5,
    title: 'Veggie Bowl',
    image: require('../assets/images/veggiebowllarge.png'),
    description: 'A colorful bowl of fresh vegetables, legumes, and grains — packed with nutrients.',
    calories: 350,
    fat: '10g',
    carbs: '48g',
    protein: '12g',
    ingredients: [
      { name: 'Broccoli', icon: require('../assets/icons/broccoli.png') },
      { name: 'Carrot', icon: require('../assets/icons/carrot.png') },
      { name: 'Quinoa', icon: require('../assets/icons/quiona.png') },
      { name: 'Chickpeas', icon: require('../assets/icons/chickpeas.png') },
    ]
  },
  
  {
    id: 6,
    title: 'Beef Wrap',
    image: require('../assets/images/beefwraplarge.png'),
    description: 'Sliced beef and fresh vegetables wrapped in a soft tortilla for a quick meal.',
    calories: 410,
    fat: '18g',
    carbs: '35g',
    protein: '30g',
    ingredients: [
      { name: 'Beef', icon: require('../assets/icons/beaf.png') },
      { name: 'Lettuce', icon: require('../assets/icons/lettuce.png') },
      { name: 'Tomato', icon: require('../assets/icons/tomato.png') },
      { name: 'Tortilla', icon: require('../assets/icons/tortilla.png') },
    ]
  },
  
  {
    id: 7,
    title: 'Salmon Rice',
    image: require('../assets/images/salmonricelarge.png'),
    description: 'Grilled salmon served over seasoned rice, rich in protein and omega-3.',
    calories: 390,
    fat: '16g',
    carbs: '36g',
    protein: '32g',
    ingredients: [
      { name: 'Salmon', icon: require('../assets/icons/salmon.png') },
      { name: 'Rice', icon: require('../assets/icons/rice.png') },
      { name: 'Lemon', icon: require('../assets/icons/lemon.png') },
      { name: 'Parsley', icon: require('../assets/icons/parsley.png') },
    ]
  },

  {
    id: 8,
    title: 'Mushroom Pasta',
    image: require('../assets/images/mushroompastalarge.png'),
    description: 'Creamy pasta with sautéed mushrooms and parmesan cheese.',
    calories: 430,
    fat: '14g',
    carbs: '60g',
    protein: '12g',
    ingredients: [
      { name: 'Mushroom', icon: require('../assets/icons/mushroom.png') },
      { name: 'Pasta', icon: require('../assets/icons/pasta.png') },
      { name: 'Cream', icon: require('../assets/icons/cream.png') },
      { name: 'Parmesan', icon: require('../assets/icons/parmesan.png') },
    ]
  },
  
  {
    id: 9,
    title: 'Chicken Soup',
    image: require('../assets/images/chickensouplarge.png'),
    description: 'Comforting soup made with chicken, noodles, and vegetables.',
    calories: 220,
    fat: '5g',
    carbs: '22g',
    protein: '20g',
    ingredients: [
      { name: 'Chicken', icon: require('../assets/icons/chicken.png') },
      { name: 'Noodles', icon: require('../assets/icons/noodle.png') },
      { name: 'Carrot', icon: require('../assets/icons/carrot.png') },
      { name: 'Celery', icon: require('../assets/icons/celery.png') },
    ]
  },  
];

export default function DetailsScreen({ route, navigation }) {
  const { mealId } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);
  const selectedMeal = meals.find(meal => meal.id === mealId);

  if (!selectedMeal) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ marginTop: 100, textAlign: 'center' }}>Meal not found.</Text>
      </SafeAreaView>
    );
  }

  const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    <SafeAreaView style={styles.container}>
      <Image style={styles.selectedimage} source={selectedMeal.image} />
      <Image style={styles.topimage} source={require("../assets/images/mask_group_up.png")} />

      <View style={styles.arrowwrapper}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/icons/arrow_backward.png")} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFavorite}>
          <Image source={
            isFavorite
              ? require("../assets/icons/heart-filled.png")
              : require("../assets/icons/heart.png")
          } />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.allelements}>
          <View style={styles.headingtext}>
            <Text style={styles.heading}>{selectedMeal.title}</Text>
            <Text style={styles.fooddescription}>{selectedMeal.description}</Text>
          </View>

          <View style={styles.nutriinfocard}>
            <Text style={styles.nutriinfortext}>Nutritional information</Text>
            <View style={styles.nutriinfolayout}>
              <View style={styles.nutriinfo}>
                <Text style={styles.cal}>{selectedMeal.calories}</Text>
                <Text style={styles.defaultnutri}>calories</Text>
              </View>
              <View style={styles.nutriinfo}>
                <Text style={styles.defaultvalue}>{selectedMeal.fat}</Text>
                <Text style={styles.defaultnutri}>fat</Text>
              </View>
              <View style={styles.nutriinfo}>
                <Text style={styles.defaultvalue}>{selectedMeal.carbs}</Text>
                <Text style={styles.defaultnutri}>carbohyd</Text>
              </View>
              <View style={styles.nutriinfo}>
                <Text style={styles.defaultvalue}>{selectedMeal.protein}</Text>
                <Text style={styles.defaultnutri}>proteins</Text>
              </View>
            </View>
          </View>

          <View style={styles.ingredientscard}>
            <Text style={styles.cardheading}>Ingredients</Text>
            <View style={styles.ingredientswrapper}>
              {selectedMeal.ingredients.map((item, index) => (
                <View key={index} style={styles.fooditems}>
                  <Image source={item.icon} />
                  <Text style={styles.ingredientText}>{item.name}</Text>
                </View>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F5FA' },
  topimage: { resizeMode: 'contain', position: 'absolute' },
  arrowwrapper: {
    justifyContent: 'space-between',
    width: 400,
    alignItems: 'center',
    paddingTop: 102,
    position: 'absolute',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  selectedimage: { marginTop: -50, width: screenWidth, height: 456 },
  allelements: { alignItems: 'center', justifyContent: 'center' },
  headingtext: { alignItems: 'center' },
  heading: { fontSize: 25, color: '#23233C', fontWeight: 'bold', paddingTop: 14 },
  fooddescription: {
    fontSize: 10, color: '#23233C', flexWrap: 'wrap',
    paddingLeft: 43, paddingRight: 43, paddingTop: 16,
  },
  nutriinfocard: {
    width: 375, height: 120, backgroundColor: 'white',
    borderRadius: 10, shadowColor: '#0D4E81', elevation: 5,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 5,
    alignItems: 'center', paddingTop: 17, marginTop: 20,
  },
  nutriinfortext: { fontSize: 16, color: '#23233C' },
  nutriinfolayout: {
    flexDirection: 'row', paddingTop: 18,
    width: 250, alignItems: 'center', justifyContent: 'space-between',
  },
  nutriinfo: { flexDirection: 'column', alignItems: 'center' },
  cal: { fontSize: 22, color: '#EE6A6E', fontWeight: 'bold' },
  defaultvalue: { fontSize: 22, color: '#23233C', fontWeight: 'bold' },
  defaultnutri: { fontSize: 10, color: '#9E9E9E' },
  ingredientscard: {
    width: 375, height: 145, backgroundColor: 'white',
    borderRadius: 10, shadowColor: '#0D4E81', elevation: 5,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 5,
    alignItems: 'center', marginTop: 20, paddingTop: 12,
  },
  cardheading: { fontSize: 18, color: '#303030', fontWeight: 'bold' },
  ingredientswrapper: {
    flexDirection: 'row', paddingTop: 18,
    alignItems: 'center', width: 230, justifyContent: 'space-between',
  },
  fooditems: { flexDirection: 'column', alignItems: 'center' },
  ingredientText: { fontSize: 12, color: '#23233C', paddingTop: 7 },
});
