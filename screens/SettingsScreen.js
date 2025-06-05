import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  Switch,
} from 'react-native';

import BottomNavBar from '../screens/BottomNavBar';

const screenWidth = Dimensions.get('window').width;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function SettingsScreen({ navigation }) {
  const [expanded, setExpanded] = useState({
    Notifications: false,
    Language: false,
    About: false,
    Privacy: false,
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const toggleExpand = (key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F4F5FA' }}>
      <View style={{ flex: 1 }}>
        <Image
          style={styles.headerImage}
          source={require('../assets/images/mask_group_up.png')}
        />

        <Text style={styles.heading}>Settings</Text>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Bildirim Ayarı */}
          <View style={styles.optionWrapper}>
            <TouchableOpacity style={styles.optionCard} onPress={() => toggleExpand('Notifications')}>
              <Text style={styles.optionTitle}>Notifications</Text>
            </TouchableOpacity>
            {expanded.Notifications && (
              <View style={styles.expandedContent}>
                <Text style={styles.expandedText}>Enable or disable push notifications:</Text>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                />
              </View>
            )}
          </View>

          {/* Hakkında */}
          <View style={styles.optionWrapper}>
            <TouchableOpacity style={styles.optionCard} onPress={() => toggleExpand('About')}>
              <Text style={styles.optionTitle}>About</Text>
            </TouchableOpacity>
            {expanded.About && (
              <View style={styles.expandedContent}>
                <Text style={styles.expandedText}>
                  This app helps you manage your tasks and stay organized. Version 1.0.0
                </Text>
              </View>
            )}
          </View>

          {/* Gizlilik Politikası */}
          <View style={styles.optionWrapper}>
            <TouchableOpacity style={styles.optionCard} onPress={() => toggleExpand('Privacy')}>
              <Text style={styles.optionTitle}>Privacy Policy</Text>
            </TouchableOpacity>
            {expanded.Privacy && (
              <View style={styles.expandedContent}>
                <Text style={styles.expandedText}>
                  We respect your privacy. Read our full privacy policy at example.com/privacy
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      <BottomNavBar navigation={navigation} activeTab="Settings" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: screenWidth,
    resizeMode: 'contain',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#23233C',
    textAlign: 'center',
    marginTop: -20,
    marginBottom: 30,
  },
  optionWrapper: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  optionCard: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
  },
  optionTitle: {
    fontSize: 16,
    color: '#23233C',
  },
  expandedContent: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    elevation: 2,
  },
  expandedText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  languageOption: {
    fontSize: 14,
    color: '#555',
    paddingVertical: 5,
  },
  selectedLanguage: {
    fontSize: 14,
    color: '#007AFF',
    paddingVertical: 5,
    fontWeight: 'bold',
  },
});
