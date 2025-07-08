import { StatusBar } from "expo-status-bar";
import { ImageBackground, StyleSheet, TouchableOpacity, View, Text, } from 'react-native';
import { router } from "expo-router";

export default function WelcomeScreen() {
  return (
    <ImageBackground source={require('../../assets/images/back.png')} style={{ flex: 1, justifyContent: 'space-around', }}>
      <View style={styles.titleContainer}>
        <Text style={{ color: 'white', fontSize: 18,  }}>Welcome to </Text>
        <Text style={styles.mainTitleText}>Weather Wise</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', fontFamily: 'SpaceMono' }}>Your one-stop solution for weather updates. We are here to keep you updated on the weather, so you can plan your day without surprises</Text>
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0)',
            paddingVertical: 20,
            borderWidth: 1,
            borderColor: 'white',
            width: '100%',
            alignItems: 'center',
            marginTop: 5
          }}
          onPress={() => router.replace('/home')}>
          <Text style={{ color: 'white', fontSize: 18, textTransform: 'uppercase', fontFamily: 'SpaceGroteskBold' }}>Get Started</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 20,
  },
  mainTitleText:{
    color: 'white',
    fontSize: 60,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: 'SpaceMono',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
