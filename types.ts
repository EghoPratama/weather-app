export type Place = {
  id: number;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

export type DayForecast = {
  date: string; // format "2026-11-17"
  code: number;
  max: number;
  min: number;
};

export type Weather = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  code: number;
  daily: DayForecast[];
};