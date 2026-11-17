import { FlatList, StyleSheet, Text, View } from 'react-native';
import { DayForecast } from '../types';
import { dayLabel, weatherIcon } from '../utils/weather';

type Props = {
  daily: DayForecast[];
};

export default function ForecastList({ daily }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prakiraan 7 hari</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={daily}
        keyExtractor={(item) => item.date}
        style={styles.list}
        contentContainerStyle={styles.content}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.dayName}>{dayLabel(item.date, index)}</Text>
            <Text style={styles.icon}>{weatherIcon(item.code)}</Text>
            <Text style={styles.max}>{Math.round(item.max)}°</Text>
            <Text style={styles.min}>{Math.round(item.min)}°</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginTop: 36,
  },
  title: {
    color: '#bfdbfe',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    flexGrow: 0,
    marginTop: 12,
  },
  content: {
    gap: 10,
  },
  card: {
    width: 72,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dayName: {
    color: '#bfdbfe',
    fontSize: 13,
    fontWeight: '600',
  },
  icon: {
    fontSize: 28,
    marginVertical: 8,
  },
  max: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  min: {
    color: '#93c5fd',
    fontSize: 15,
    marginTop: 2,
  },
});