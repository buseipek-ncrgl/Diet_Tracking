import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function BottomNavBar({ navigation, activeTab }) {
  return (
    <View style={styles.bottom}>
      <View style={styles.navbar}>
        {/* Home */}
        <TouchableOpacity
        style={activeTab === 'Home' ? styles.selectedbtn : styles.defaultnavbtn}
        onPress={() => navigation.navigate('Home')}
        >
             <Image source={require('../assets/icons/home.png')} style={{ width: 25, height: 25 }} />
             {activeTab === 'Home' && (
                 <Text style={styles.selectedText}>Home</Text>
                 )}
                 </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          style={activeTab === 'Profile' ? styles.selectedbtn : styles.defaultnavbtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <Image
            source={require('../assets/icons/profile_50px.png')}
            style={{ width: 25, height: 25 }}
          />
          {activeTab === 'Profile' && <Text style={styles.selectedText}>Profile</Text>}
        </TouchableOpacity>

        {/* Add Meal */}
        <TouchableOpacity
          style={activeTab === 'Add' ? styles.selectedbtn : styles.defaultnavbtn}
          onPress={() => navigation.navigate('AddMeal')}
        >
          <Image
            source={require('../assets/icons/diet.png')}
            style={{ width: 25, height: 25 }}
          />
          {activeTab === 'Add' && <Text style={styles.selectedText}>Add</Text>}
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity
          style={activeTab === 'Settings' ? styles.selectedbtn : styles.defaultnavbtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Image
            source={require('../assets/icons/settings_50px.png')}
            style={{ width: 25, height: 25 }}
          />
          {activeTab === 'Settings' && <Text style={styles.selectedText}>Settings</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottom: {
    backgroundColor: 'white',
    width: screenWidth,
    height: 65,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
  },
  navbar: {
    flexDirection: 'row',
    marginStart: 20,
    alignItems: 'center',
  },
  selectedbtn: {
    flexDirection: 'row',
    width: 101,
    height: 33,
    backgroundColor: '#6CC57C',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginStart: 40,
  },
  defaultnavbtn: {
    marginStart: 40,
  },
  selectedText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
});
