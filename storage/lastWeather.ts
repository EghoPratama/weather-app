import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherSnapshot } from '../types';

// Naikkan angka versi kalau bentuk data berubah, supaya data lama tidak dibaca
const STORAGE_KEY = 'last-weather-v1';

export async function saveSnapshot(snapshot: WeatherSnapshot): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (e) {
    console.warn('Gagal menyimpan data cuaca', e);
  }
}

export async function loadSnapshot(): Promise<WeatherSnapshot | null> {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved !== null ? JSON.parse(saved) : null;
  } catch (e) {
    console.warn('Gagal membaca data cuaca', e);
    return null;
  }
}