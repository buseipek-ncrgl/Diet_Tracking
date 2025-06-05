import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000); // 2 saniye sonra geçiş

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/02.png')} 
      style={styles.background}
      resizeMode="cover"
    />
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
