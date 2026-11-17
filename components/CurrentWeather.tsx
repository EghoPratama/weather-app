import { StyleSheet, Text, View } from 'react-native';
import { Weather } from '../types';
import { describeWeather } from '../utils/weather';

type Props = {
  cityName: string;
  weather: Weather;
};

export default function CurrentWeather({ cityName, weather }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.city}>{cityName}</Text>
      <Text style={styles.temp}>{Math.round(weather.temperature)}°</Text>
      <Text style={styles.condition}>{describeWeather(weather.code)}</Text>

      <View style={styles.detailRow}>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Kelembapan</Text>
          <Text style={styles.detailValue}>{weather.humidity}%</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Angin</Text>
          <Text style={styles.detailValue}>
            {Math.round(weather.windSpeed)} km/j
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  city: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
  },
  temp: {
    fontSize: 96,
    fontWeight: '200',
    color: '#fff',
    marginTop: 10,
  },
  condition: {
    fontSize: 20,
    color: '#bfdbfe',
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 30,
  },
  detailBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  detailLabel: {
    color: '#bfdbfe',
    fontSize: 14,
  },
  detailValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
});