# 🌌 ORION
## Dark Sky & Astrotourism Intelligence Platform

ORION (Observation & Regional Intelligence for Optimized Night-tourism) merupakan platform WebGIS berbasis **Spatial Decision Support System (SDSS)** yang dikembangkan untuk mengidentifikasi kawasan **dark sky** potensial serta memberikan rekomendasi lokasi dan periode terbaik untuk observasi langit malam dan pengembangan astrowisata di Provinsi Jawa Barat.

---

# 📌 Latar Belakang

Tren pariwisata saat ini telah bergeser dari **mass tourism** menuju **experience tourism**, yaitu wisata yang menawarkan pengalaman unik dan berbasis lingkungan. Salah satu bentuk experience tourism yang mulai berkembang adalah **astrowisata**, yaitu kegiatan wisata yang berfokus pada observasi langit malam.

Meskipun telah tersedia platform seperti **Light Pollution Map**, informasi yang disajikan masih berfokus pada tingkat polusi cahaya dan belum mengintegrasikan faktor lingkungan maupun aksesibilitas wilayah sebagai dasar pengambilan keputusan.

Melalui ORION, berbagai data spasial diintegrasikan menjadi sebuah sistem rekomendasi yang dapat membantu wisatawan, pengelola wisata, maupun pemerintah daerah dalam mengidentifikasi kawasan yang berpotensi dikembangkan sebagai destinasi astrowisata.

---

# 🎯 Tujuan Project

Project ini bertujuan untuk:

- Mengidentifikasi kawasan dark sky potensial di Jawa Barat.
- Menghasilkan skor ORION sebagai indikator potensi astrowisata.
- Memberikan rekomendasi lokasi observasi langit malam.
- Menentukan periode observasi terbaik berdasarkan data historis tutupan awan.
- Mendukung pengembangan kawasan astrowisata berbasis data spasial.

---

# 👥 Target Pengguna

- Wisatawan
- Astrophotographer
- Komunitas astronomi
- Pengelola wisata alam
- Pemerintah daerah
- Peneliti dan akademisi

---

# 🗺️ Data yang Digunakan

## Data Spasial

- Batas administrasi Provinsi Jawa Barat
- Batas kecamatan
- Batas desa/kelurahan
- Jaringan jalan
- Destinasi wisata
- Data elevasi (DEM)
- VIIRS Day/Night Band (Night Light)
- Tutupan awan historis

## Data Non Spasial

- Night Sky Brightness (NSB)
- Visibility Score
- Accessibility Score
- ORION Score

---

# ⚙️ Metodologi

Tahapan analisis pada ORION meliputi:

1. Pengolahan data VIIRS menjadi nilai **Night Sky Brightness (NSB)**.
2. Analisis elevasi wilayah.
3. Analisis rata-rata historis tutupan awan.
4. Analisis aksesibilitas berdasarkan jaringan jalan dan destinasi wisata.
5. Perhitungan Visibility Score.
6. Perhitungan Accessibility Score.
7. Penggabungan seluruh parameter menggunakan metode **Multi Criteria Decision Analysis (MCDA)**.
8. Menghasilkan **ORION Score**.
9. Melakukan **Zonal Statistics** untuk memperoleh skor rata-rata pada tingkat kecamatan dan desa.
10. Menampilkan hasil analisis dalam bentuk WebGIS.

---

# ✨ Fitur WebGIS

- Landing Page
- Dashboard
- Explore Map
- Layer ORION Score
- Layer Night Sky Brightness
- Layer Tutupan Awan
- Layer Elevasi
- Layer Destinasi Wisata
- Popup Informasi Kecamatan
- Grafik Tren Visibility Historis
- Rekomendasi Periode Observasi Terbaik
- Desa/Kelurahan Prioritas Pengembangan Astrowisata
- Ranking Kecamatan Potensial

---

# 💻 Teknologi yang Digunakan

## Front-End

- HTML
- CSS
- JavaScript

## WebGIS

- Leaflet.js
- GeoJSON

## Pengolahan Data

- QGIS
- ArcGIS Pro
- Google Earth Engine

---

# 🛣️ Roadmap Pengembangan

### Tahap 1
- Penyusunan konsep project
- Desain UI/UX
- Persiapan data

### Tahap 2
- Pengolahan data spasial
- Perhitungan ORION Score
- Analisis spasial

### Tahap 3
- Pengembangan WebGIS
- Implementasi peta interaktif
- Popup dan Dashboard

### Tahap 4
- Penyempurnaan fitur
- Responsif website
- Deployment

---

# 📦 Output yang Diharapkan

- Prototype WebGIS
- Spatial Decision Support System (SDSS)
- Portofolio Pengembangan WebGIS
- Competition Project


# 🚀 Status Project

🟡 **Sedang dalam tahap pengembangan** sebagai Final Project WebGIS Development Bootcamp Batch 3.

---

# 👨‍💻 Developer

**Nawal Syafiq Fraihan**

WebGIS Development Bootcamp Batch 3