import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getCurrentPlace } from './api/location';
import { fetchWeather } from './api/openMeteo';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import { loadSnapshot, saveSnapshot } from './storage/lastWeather';
import { Place, WeatherSnapshot } from './types';
import { formatTime } from './utils/weather';

const DEFAULT_PLACE: Place = {
  id: 0,
  name: 'Jakarta',
  country: 'Indonesia',
  latitude: -6.2,
  longitude: 106.8,
};

type LoadMode = 'full' | 'silent';

export default function App() {
  const [city, setCity] = useState<Place | null>(null);
  const [snapshot, setSnapshot] = useState<WeatherSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locating, setLocating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Mengembalikan lokasi HP, atau null (dengan pesan di notice) kalau gagal
  const detectLocation = useCallback(async (): Promise<Place | null> => {
    setNotice(null);
    try {
      return await getCurrentPlace();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : 'Gagal mendapatkan lokasi.');
      return null;
    }
  }, []);

  // 'full'   : tampilkan layar loading, error tampil sebagai layar error
  // 'silent' : data lama tetap tampil, error tampil sebagai pesan kecil
  const loadWeather = useCallback(async (place: Place, mode: LoadMode) => {
    if (mode === 'full') {
      setLoading(true);
      setError(null);
    }

    try {
      const weather = await fetchWeather(place);
      const fresh: WeatherSnapshot = { place, weather, updatedAt: Date.now() };
      setSnapshot(fresh);
      setError(null);
      saveSnapshot(fresh);
    } catch (e) {
      console.warn('Gagal memuat cuaca', e);
      if (mode === 'full') {
        setError('Gagal memuat cuaca. Periksa koneksi internetmu lalu coba lagi.');
      } else {
        setNotice('Gagal memperbarui cuaca. Menampilkan data terakhir.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Saat aplikasi dibuka
  useEffect(() => {
    const init = async () => {
      // 1. Tampilkan data terakhir secepat mungkin
      const cached = await loadSnapshot();
      if (cached !== null) {
        setSnapshot(cached);
        setLoading(false);
      }

      // 2. Tentukan kota: kota hasil pencarian terakhir dipertahankan,
      //    lokasi GPS (id -1) atau belum ada data dideteksi ulang
      let place = cached?.place ?? null;
      if (place === null || place.id === -1) {
        place = (await detectLocation()) ?? place ?? DEFAULT_PLACE;
      }
      setLocating(false);
      setCity(place);

      // 3. Ambil cuaca terbaru
      await loadWeather(place, cached !== null ? 'silent' : 'full');
    };

    init();
  }, [detectLocation, loadWeather]);

  const handleSelectCity = (place: Place) => {
    setNotice(null);
    setCity(place);
    loadWeather(place, 'full');
  };

  const handleUseLocation = async () => {
    setLocating(true);
    const place = await detectLocation();
    setLocating(false);

    if (place !== null) {
      setCity(place);
      await loadWeather(place, 'full');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setNotice(null);

    let place = city ?? DEFAULT_PLACE;

    // Kalau sedang memakai lokasi GPS, cek lagi posisinya (siapa tahu pindah)
    if (place.id === -1) {
      const fresh = await detectLocation();
      if (fresh !== null) {
        place = fresh;
        setCity(fresh);
      }
    }

    await loadWeather(place, 'silent');
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        onSelect={handleSelectCity}
        onUseLocation={handleUseLocation}
        locating={locating}
      />

      {notice !== null && <Text style={styles.notice}>{notice}</Text>}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.message}>
            {locating ? 'Mencari lokasimu...' : 'Memuat cuaca...'}
          </Text>
        </View>
      ) : error !== null || snapshot === null ? (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>Oops!</Text>
          <Text style={styles.message}>{error ?? 'Data tidak tersedia.'}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => loadWeather(city ?? DEFAULT_PLACE, 'full')}
          >
            <Text style={styles.retryText}>Coba lagi</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#fff"
              colors={['#1e3a8a']}
            />
          }
        >
          <CurrentWeather
            cityName={snapshot.place.name}
            weather={snapshot.weather}
          />
          <ForecastList daily={snapshot.weather.daily} />
          <Text style={styles.updated}>
            Diperbarui {formatTime(snapshot.updatedAt)}
          </Text>
        </ScrollView>
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
  notice: {
    color: '#fde68a',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 30,
    paddingBottom: 40,
  },
  updated: {
    color: '#93c5fd',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
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