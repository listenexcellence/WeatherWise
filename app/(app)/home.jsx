// App.js
import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { getWeatherData } from '../../services/weatherService'; // Adjust the import path as necessary
import { LinearGradient } from 'expo-linear-gradient';

const windowHeight = Dimensions.get('window').height;

export default function HomeScreen() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [humidity, setHumidity] = useState(null);
  const [wind, setWind] = useState(null);
  const [rain, setRain] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  // Fetch location and weather
  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      // Fetch weather data
      const data = await getWeatherData(loc.coords.latitude, loc.coords.longitude);
      setWeather(data);
      // Set extra weather details
      setHumidity(data.main?.humidity);
      setWind(data.wind?.speed);
      setRain(data.rain?.['1h'] || data.rain?.['3h'] || 0);

      // Fetch UV Index
      const uvRes = await fetch(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${process.env.EXPO_PUBLIC_WEATHER_API_KEY || '373be0f70bc79bc778088edddfd2cdce'}`
      );
      if (uvRes.ok) {
        const uvData = await uvRes.json();
        setUvIndex(uvData.value);
      } else {
        setUvIndex('N/A');
      }

      // Fetch Air Quality
      const aqRes = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${process.env.EXPO_PUBLIC_WEATHER_API_KEY || '373be0f70bc79bc778088edddfd2cdce'}`
      );
      if (aqRes.ok) {
        const aqData = await aqRes.json();
        const owmAqi = aqData.list[0]?.main?.aqi;
        let scaledAqi = null;
        if (owmAqi === 1) scaledAqi = 95;
        else if (owmAqi === 2) scaledAqi = 75;
        else if (owmAqi === 3) scaledAqi = 60;
        else if (owmAqi === 4) scaledAqi = 40;
        else if (owmAqi === 5) scaledAqi = 15;
        setAirQuality(scaledAqi);
      } else {
        setAirQuality('N/A');
      }

      // Set current date and time
      setDateTime(new Date());
    } catch (err) {
      setError('Failed to fetch weather or location');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (error) {
    return (
      <LinearGradient
        colors={['#196fe0ff', '#afddfcff', '#FFFFFF']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </LinearGradient>
    );
  }

  function getAirQualityText(aqi) {
    if (aqi >= 90 && aqi <= 100) return "Enjoy usual outdoor activities";
    if (aqi >= 70 && aqi < 90) return "Sensitive individuals should consider limiting outdoor exertion";
    if (aqi >= 50 && aqi < 70) return "People with health issues should reduce outdoor activities";
    if (aqi >= 30 && aqi < 50) return "Limit prolonged outdoor exertion";
    if (aqi >= 0 && aqi < 30) return "Avoid outdoor activities";
    return "";
  }
  function getAirQualityText2(aqi) {
    if (aqi >= 90 && aqi <= 100) return "Good";
    if (aqi >= 70 && aqi < 90) return "Fair";
    if (aqi >= 50 && aqi < 70) return "Moderate";
    if (aqi >= 30 && aqi < 50) return "Poor";
    if (aqi >= 0 && aqi < 30) return "Very Poor";
    return "";
  }

  function getUvIndexText(uv) {
    if (uv === null || uv === undefined || uv === 'N/A') return '';
    if (uv < 3) return "Low";
    if (uv < 6) return "Moderate";
    if (uv < 8) return "High";
    if (uv < 11) return "Very High";
    return "Extreme";
  }

  const hour = new Date().getHours();
  // Set first color based on time
  const firstColor = (hour >= 8 && hour < 18) ? '#2a68b9ff' : 'rgba(25, 41, 81, 1)';
  const secondColor = (hour >= 8 && hour < 18) ? '#6CBAED' : 'rgba(25, 41, 81, 1)';
  const thirdColor = (hour >= 8 && hour < 18) ? '#FFFFFF' : 'rgba(64, 112, 184, 1)';
  const isDay = hour >= 8 && hour < 18;
  const textColor = isDay ? 'rgba(20, 26, 59, 1)' : '#fff';


  return (
    <LinearGradient colors={[firstColor, secondColor, thirdColor]}
      style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchWeather} />}>
        <StatusBar style="light" />
        <View style={styles.container1}>
          <View style={styles.weatherContainer}>
            <Text style={styles.cityText}>
              {weather?.name || '--'}
            </Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.dateText}>
                {`${dateTime.toLocaleDateString('en-US', { weekday: 'long' })} ${dateTime.getDate()}, ${dateTime.getFullYear()}`}
              </Text>
              <Text style={styles.dateText}>
                {dateTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                }).replace(' ', '')} {/* e.g., 04:18AM */}
              </Text>
            </View>
          </View>
          <View style={styles.container2}>
            <View style={styles.weatherContainer}>
              <Text style={[styles.tempText, { color: textColor }]}>
                {weather?.main?.temp ? `${Math.round(weather.main.temp)}°C` : '--'}
              </Text>
              <Text style={[styles.descText, { color: textColor }]} numberOfLines={2} textAlign="center">
                {weather?.weather?.[0]?.description
                  ? weather.weather[0].description.replace(' ', '\n')
                  : ''}
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <View>
                <Text style={[styles.airText, { color: textColor }]}>
                  Air Quality
                </Text>
                <Text style={[styles.qltText, { color: textColor }]}>
                  {airQuality !== null ? airQuality : '--'}
                  {airQuality ? ` ${getAirQualityText2(airQuality)}` : ''}
                </Text>
              </View>

              <Text style={[styles.respText, { color: textColor }]}>
                {airQuality ? `${getAirQualityText(airQuality)}` : ''}
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <View>
                <Text style={[styles.airText, { color: textColor }]}>
                  Humidity
                </Text>
                <Text style={[styles.qltText, { color: textColor }]}>
                  {humidity !== null ? `${humidity}%` : '--'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.airText, { color: textColor }]}>
                  UV Index
                </Text>
                <Text style={[styles.qltText, { color: textColor }]}>
                  {uvIndex !== null ? uvIndex : '--'}
                  {uvIndex ? ` - ${getUvIndexText(uvIndex)}` : ''}
                </Text>
              </View>
            </View>
            <View style={styles.dataContainer}>
              <View>
                <Text style={[styles.airText, { color: textColor }]}>
                  Rain
                </Text>
                <Text style={[styles.qltText, { color: textColor }]}>
                  {rain !== null ? `${rain} mm` : '--'}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.airText, { color: textColor }]}>
                  Wind
                </Text>
                <Text style={[styles.qltText, { color: textColor }]}>
                  Wind: {wind !== null ? `${wind} m/s` : '--'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container1: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    height: windowHeight - 30,
  },
  container2: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  weatherContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
    width: '100%',
  },
  dataContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20,
    width: '100%',
    borderBottomColor: '#C7E2F4',
    borderBottomWidth: 1,
  },
  cityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Lequire',
    marginBottom: 8,
  },
  tempText: {
    fontSize: 85,
    fontWeight: 'bold',
    color: 'rgba(20, 26, 59, 1)',
    marginBottom: 8,
    fontFamily: 'SpaceGroteskBold',
  },
  descText: {
    fontSize: 18,
    color: 'rgba(20, 26, 59, 1)',
    textTransform: 'capitalize',
    fontFamily: 'Lequire',
    textAlign: 'right',
  },
  respText: {
    fontSize: 18,
    color: 'rgba(20, 26, 59, 1)',
    fontFamily: 'SpaceGroteskSemi',
    width: '50%',
    textAlign: 'right',
  },
  qltText: {
    fontSize: 20,
    color: 'rgba(20, 26, 59, 1)',
    fontFamily: 'SpaceGroteskBold',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  airText: {
    fontSize: 15,
    fontFamily: 'Lequire',
    opacity: 0.8,
  },
  dateText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
    textTransform: 'capitalize',
    opacity: 0.6,
    fontFamily: 'Lequire',
  },
  refreshButton: {
    backgroundColor: '#196fe0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  refreshText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
