import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Swiper from 'react-native-swiper';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Best tips for your diet',
    text: 'Keep track of what you eat and stay healthy with personalized suggestions.',
    image: require('../assets/images/slide_background_image.png'),
  },
  {
    key: '2',
    title: 'Easy meal tracking',
    text: 'Log your meals quickly and see daily nutrition breakdowns.',
    image: require('../assets/images/onboarding2.1.jpg'),
  },
  {
    key: '3',
    title: 'Stay consistent',
    text: 'Build healthy habits with reminders and progress tracking.',
    image: require('../assets/images/onboarding3.jpg'),
  },
];

export default function OnboardingScreen({ navigation }) {

  const swiperRef = useRef(null);

  return (
    <Swiper
  loop={false}
  dotStyle={styles.dot}
  activeDotStyle={styles.activeDot}
  paginationStyle={styles.pagination}
  ref={swiperRef}
>
      {slides.map((slide, index) => (
        <View key={slide.key} style={styles.slide}>
          <Image source={slide.image} style={styles.image} resizeMode="cover" />

          {/* Alt kavisli arka plan */}
          <Image
            source={require('../assets/images/slide_background_white.png')}
            style={styles.backgroundWave}
            resizeMode="stretch"
          />

          <View style={styles.contentContainer}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.text}>{slide.text}</Text>

            {index === slides.length - 1 ? (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => navigation.replace('Login')}
              >
                <Text style={styles.nextButtonText}>Get Started</Text>
              </TouchableOpacity>
            ) : (
                <View style={styles.buttonRow}>
                <TouchableOpacity onPress={() => navigation.replace('Login')}>
                  <Text style={styles.skip}>Skip step</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={() => swiperRef.current.scrollBy(1)}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      ))}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#F4F5FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: width,
    height: height * 0.8,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  backgroundWave: {
    width: width,
    height: height * 0.55, // Eskisinden daha büyük yapıyoruz
    position: 'absolute',
    top: height * 0.45,
    zIndex: 1,
  },
  
  contentContainer: {
    position: 'absolute',
    bottom: 80, // en alta sabitledik
    zIndex: 2,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pagination: {
    position: 'absolute',
    bottom: height * 0.35, // yazıların üstünde değil, altına alıyoruz
  },
    
  
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#23233C',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    color: '#8D8D8D',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
  },
  skip: {
    fontSize: 14,
    color: '#bbb',
  },
  nextButton: {
    backgroundColor: '#63CD77',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 18,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dot: {
    backgroundColor: '#ccc',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#63CD77',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});
