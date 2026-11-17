import * as Location from 'expo-location';
import { Place } from '../types';

export async function getCurrentPlace(): Promise<Place> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error(
      'Izin lokasi ditolak. Aktifkan di pengaturan HP atau cari kota manual.'
    );
  }

  let latitude: number;
  let longitude: number;

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  } catch (e) {
    console.warn('Gagal membaca posisi', e);
    throw new Error('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
  }

  // Ubah koordinat jadi nama kota. Kalau gagal, pakai nama cadangan.
  let name = 'Lokasi saya';
  let admin1: string | undefined;
  let country: string | undefined;

  try {
    const [address] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });

    if (address) {
      name = address.city ?? address.subregion ?? address.district ?? name;
      admin1 = address.region ?? undefined;
      country = address.country ?? undefined;
    }
  } catch (e) {
    console.warn('Gagal mengubah koordinat jadi nama kota', e);
  }

  return { id: -1, name, admin1, country, latitude, longitude };
}