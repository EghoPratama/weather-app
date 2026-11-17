import { DayForecast, Place, Weather } from '../types';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

export async function fetchWeather(place: Place): Promise<Weather> {
  const url =
    FORECAST_URL +
    `?latitude=${place.latitude}&longitude=${place.longitude}` +
    '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
    '&forecast_days=7' +
    '&timezone=auto';

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Server membalas dengan status ${response.status}`);
  }

  const json = await response.json();

  const daily: DayForecast[] = json.daily.time.map(
    (date: string, i: number) => ({
      date,
      code: json.daily.weather_code[i],
      max: json.daily.temperature_2m_max[i],
      min: json.daily.temperature_2m_min[i],
    })
  );

  return {
    temperature: json.current.temperature_2m,
    humidity: json.current.relative_humidity_2m,
    windSpeed: json.current.wind_speed_10m,
    code: json.current.weather_code,
    daily,
  };
}

export async function searchPlaces(name: string): Promise<Place[]> {
  const url =
    GEOCODING_URL +
    `?name=${encodeURIComponent(name)}&count=5&language=id&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Server membalas dengan status ${response.status}`);
  }

  const json = await response.json();
  return json.results ?? [];
}