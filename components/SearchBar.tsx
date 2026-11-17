import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { searchPlaces } from '../api/openMeteo';
import { Place } from '../types';
import { placeLabel } from '../utils/weather';

type Props = {
  onSelect: (place: Place) => void;
  onUseLocation: () => void;
  locating: boolean;
};

export default function SearchBar({ onSelect, onUseLocation, locating }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSearch = async () => {
    const name = query.trim();
    if (name === '') return;

    setSearching(true);
    setMessage(null);
    setResults([]);

    try {
      const found = await searchPlaces(name);

      if (found.length === 0) {
        setMessage('Kota tidak ditemukan.');
      } else {
        setResults(found);
      }
    } catch (e) {
      console.warn('Gagal mencari kota', e);
      setMessage('Gagal mencari kota. Coba lagi.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = (place: Place) => {
    setQuery('');
    setResults([]);
    setMessage(null);
    Keyboard.dismiss();
    onSelect(place);
  };

  return (
    <View>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Cari kota..."
          placeholderTextColor="#93c5fd"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <Pressable style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Cari</Text>
        </Pressable>
        <Pressable
          style={[styles.locationButton, locating && styles.locationButtonDisabled]}
          onPress={onUseLocation}
          disabled={locating}
        >
          <Text style={styles.locationIcon}>📍</Text>
        </Pressable>
      </View>

      {searching && <ActivityIndicator color="#fff" style={styles.spinner} />}

      {message !== null && <Text style={styles.message}>{message}</Text>}

      {results.map((place) => (
        <Pressable
          key={place.id}
          style={styles.resultItem}
          onPress={() => handleSelect(place)}
        >
          <Text style={styles.resultText}>{placeLabel(place)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  spinner: {
    marginTop: 12,
  },
  message: {
    color: '#bfdbfe',
    marginTop: 12,
    textAlign: 'center',
  },
  resultItem: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  resultText: {
    color: '#fff',
    fontSize: 15,
  },
  locationButton: {
    width: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationButtonDisabled: {
    opacity: 0.4,
  },
  locationIcon: {
    fontSize: 18,
  },
});