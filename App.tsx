import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchWeather } from './api/openMeteo';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import { Place, Weather } from './types';

const DEFAULT_PLACE: Place = {
  id: 0,
  name: 'Jakarta',
  country: 'Indonesia',
  latitude: -6.2,
  longitude: 106.8,
};

export default function App() {
  const [city, setCity] = useState<Place>(DEFAULT_PLACE);
  const [weather, setWeather] = useState<Weather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setWeather(await fetchWeather(city));
    } catch (e) {
      console.warn('Gagal memuat cuaca', e);
      setError('Gagal memuat cuaca. Periksa koneksi internetmu lalu coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return (
    <View style={styles.container}>
      <SearchBar onSelect={setCity} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.message}>Memuat cuaca...</Text>
        </View>
      ) : error !== null || weather === null ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.message}>{error ?? 'Data tidak tersedia.'}</Text>
          <Pressable style={styles.retryButton} onPress={loadWeather}>
            <Text style={styles.retryText}>Coba lagi</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.weatherBody}>
          <CurrentWeather cityName={city.name} weather={weather} />
          <ForecastList daily={weather.daily} />
        </View>
      )}

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a',
    paddingTop: 70,
    paddingHorizontal: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  weatherBody: {
    flex: 1,
    paddingTop: 30,
  },
  message: {
    color: '#bfdbfe',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  errorTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
  },
  retryButton: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginTop: 24,
  },
  retryText: {
    color: '#1e3a8a',
    fontWeight: '600',
    fontSize: 16,
  },
});