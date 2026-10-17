# Course: Buat Game Pertamamu — Petualangan GDevelop (SD Kelas 4–6)

Course satu halaman (`course.html`), hands-on, **gabungan gambar + video klip pendek lokal** (tanpa
streaming/iframe). Semua penjelasan berasal dari transcript video **"Make Your FIRST GAME In GDevelop
(SUPER EASY) - No Coding Required!"** (Proxlight, 13:45) — utama `https://www.youtube.com/watch?v=bMkMLtvsGtA`.

## Untuk apa course ini
Mengajak anak SD (kelas 4–6) membuat game platformer **endless runner** pertama mereka memakai
**GDevelop** (bebas kode) dengan bantuan guru/orang tua. Enam modul pendek, penuh gambar demo.

## Struktur
```
courses/gdevelop-endless-runner/ihfazhwork/
├── original_gdev_assets/      # GAMBAR + KLIP demo — 28 poster .jpg + 28 klip .mp4 (klik ▶ putar)
│   └── clips/                 #   setiap poster punya klip 9s tanpa suara (dari momen yang sama)
├── course/
│   ├── index.html             # Home: hero, cara pakai, peta modul, mulai
│   ├── course.html            # SATU course berisi #module-1..6 (nav-dots antar module)
│   ├── shared.css             # token cerah + komponen gallery/compare/heavy-images
│   └── shared.js              # tabs, quiz, hands-on, lightbox, copy
├── solutions/                 # acuan langkah untuk guru/orang tua (bukan dibuka siswa dulu)
└── README.md
```

## Pola tiap module (mengikuti SPESIFIKASI.md, dipersonalisasi untuk SD)
- **Pembuka "Mengapa…?"** dengan analogi keseharian (flipbook, remote TV, mata pemain…).
- **Tutorial step 1–5** imperatif + **gambar demo `original_gdev_assets/*.jpg`** di setiap step.
- **1 translation-block** inline di step inti (kolom kiri = "blok GDevelop", kanan = penjelasan).
- **Diataxis tabs**: Tutorial / How-to / Explanation / Reference.
- **Ujian akhir** (quiz MCQ + Misi mini callout), pola cisokan — selalu di screen terakhir.

## Data & aset
- Gambar demo diekstrak dari video (`ffmpeg -ss <timestamp>`, diresize 1280px) sesuai timeline transcript.
- **Setiap gambar punya klip video pasangan** (`clips/<nama>.mp4`, H.264 960×540, 9 dtk, tanpa suara):
  klik tombol ▶ pada gambar memutar klip (video dimuat hanya saat diklik → hemat bandwidth).
  Poster & klip diambil dari momen yang sama sehingga **gambar dan video align**.
- Anak menjalankan GDevelop versi desktop/browser (gratis). Tidak ada data foto khusus; children
  membuat proyek sendiri di GDevelop (bukan menjalankan OpenCV).

## Riwayat asal
- Video & transcript: `/home/ihf/Dev/gdevelop-tutorial-explore/` (`video.mp4`, `transcript_id.txt` dll).
- Frame asli: `original_gdev_keyframes/` (27 file) di folder itu.