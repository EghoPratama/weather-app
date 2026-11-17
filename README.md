# Weather App

Aplikasi cuaca yang dibuat dengan React Native, Expo, dan TypeScript. Cuaca otomatis sesuai lokasi HP, atau cari kota mana pun, lengkap dengan prakiraan 7 hari ke depan. Data diambil dari [Open-Meteo](https://open-meteo.com/) (gratis, tanpa API key).

## Fitur

- Cuaca otomatis sesuai lokasi GPS saat aplikasi dibuka, dan tombol 📍 untuk kembali ke lokasi sekarang
- Fallback ke Jakarta dengan pesan yang jelas jika izin lokasi ditolak atau GPS mati
- Cuaca saat ini: suhu, kondisi, kelembapan, dan kecepatan angin
- Prakiraan 7 hari dengan suhu tertinggi dan terendah
- Cari kota lewat nama (geocoding), dengan daftar kandidat yang menampilkan provinsi dan negara
- Tampilan loading, error, dan tombol "Coba lagi" saat koneksi bermasalah
- Pesan yang jelas saat kota tidak ditemukan

## Teknologi

- [React Native](https://reactnative.dev/) dengan [Expo](https://expo.dev/)
- TypeScript
- [expo-location](https://docs.expo.dev/versions/latest/sdk/location/) untuk izin dan pembacaan lokasi GPS
- [Open-Meteo Forecast API](https://open-meteo.com/en/docs) dan [Geocoding API](https://open-meteo.com/en/docs/geocoding-api)

## Struktur Proyek

```
weather-app/
├── App.tsx                  # State utama (kota, cuaca, loading, error)
├── types.ts                 # Tipe Place, Weather, DayForecast
├── api/
│   ├── location.ts          # getCurrentPlace(): izin, GPS, reverse geocoding
│   └── openMeteo.ts         # fetchWeather() dan searchPlaces()
├── utils/
│   └── weather.ts           # Kode cuaca -> teks/ikon, label hari dan kota
└── components/
    ├── SearchBar.tsx        # Input pencarian dan daftar hasil
    ├── CurrentWeather.tsx   # Suhu, kondisi, kelembapan, angin
    └── ForecastList.tsx     # Daftar prakiraan 7 hari (horizontal)
```

Logika dipisah berdasarkan tanggung jawab: `api/` hanya berurusan dengan jaringan, `utils/` berisi fungsi murni tanpa state, `components/` berisi tampilan, dan `App.tsx` menghubungkan semuanya.

## Cara Menjalankan

Prasyarat: [Node.js](https://nodejs.org/) (versi LTS) dan aplikasi **Expo Go** di HP (Android/iOS).

```bash
# 1. Clone repository
git clone https://github.com/USERNAME/weather-app.git
cd weather-app

# 2. Install dependensi
npm install

# 3. Jalankan
npx expo start
```

Scan QR code yang muncul di terminal dengan Expo Go (Android) atau aplikasi Kamera (iOS). Aplikasi membutuhkan koneksi internet, dan akan meminta izin lokasi saat pertama dibuka (opsional, bisa ditolak dan memakai pencarian kota).

## Yang Saya Pelajari

- Mengambil data dari REST API dengan `fetch` dan `async/await`
- Mengelola tiga keadaan layar: loading, error, dan sukses
- Memeriksa `response.ok` karena `fetch` tidak melempar error untuk status 404/500
- Memakai dua API berantai (geocoding lalu forecast)
- Meminta izin perangkat (lokasi) dan menangani jalur "ditolak" dengan fallback yang jelas
- Merangkai beberapa `useEffect` (lokasi berubah, lalu cuaca otomatis dimuat ulang)
- Mengubah data API (array sejajar) menjadi bentuk yang nyaman dipakai di UI
- Menggunakan `useEffect` dan `useCallback` agar data dimuat ulang saat kota berganti
- Memisahkan lapisan API, fungsi bantu, dan komponen agar kode mudah dirawat

## Rencana Pengembangan

- [x] Cuaca berdasarkan lokasi GPS (`expo-location`)
- [ ] Menyimpan kota terakhir dan daftar kota favorit (AsyncStorage)
- [ ] Prakiraan per jam
- [ ] Pilihan satuan suhu (°C / °F)
- [ ] Tarik layar untuk menyegarkan (pull to refresh)
- [ ] Membatalkan permintaan lama dengan `AbortController`

## Kredit

Data cuaca oleh [Open-Meteo.com](https://open-meteo.com/) (lisensi CC BY 4.0).

## Lisensi

MIT