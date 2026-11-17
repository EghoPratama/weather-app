import { Place } from '../types';

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export function describeWeather(code: number): string {
  if (code === 0) return 'Cerah';
  if (code <= 2) return 'Cerah berawan';
  if (code === 3) return 'Berawan';
  if (code === 45 || code === 48) return 'Berkabut';
  if (code >= 51 && code <= 57) return 'Gerimis';
  if (code >= 61 && code <= 67) return 'Hujan';
  if (code >= 71 && code <= 77) return 'Salju';
  if (code >= 80 && code <= 82) return 'Hujan lebat';
  if (code >= 95) return 'Badai petir';
  return 'Tidak diketahui';
}

export function weatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌧️';
  if (code >= 95) return '⛈️';
  return '❓';
}

export function dayLabel(date: string, index: number): string {
  if (index === 0) return 'Hari ini';
  // getUTCDay() supaya hari tidak bergeser karena zona waktu
  return DAY_NAMES[new Date(date).getUTCDay()];
}

export function placeLabel(place: Place): string {
  return [place.name, place.admin1, place.country].filter(Boolean).join(', ');
}