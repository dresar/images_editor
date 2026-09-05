---
name: images-editor
description: >
  Sistem panduan & alur kerja otomatisasi AI Image Editor & Enhancer.
  Mengakomodasi inspeksi visual template/frame placeholder logo presisi, pembersihan metadata AI & C2PA (FFmpeg pixel rebuild + raw reconstruction),
  efek & filter visual sekelas Photoshop, pemrosesan High-Definition (HD/4K sharpening & color grading),
  penyimpanan terpisah di folder `outputs/` dengan penamaan 3-digit (`001.png` - `N.png`),
  serta pemrosesan tunggal/batch performa tinggi dengan Master Script `image_editor.py`.
---

# 🖼️ AI Image Editor & Enhancer — Master Skill Guide

Skill ini dirancang untuk menjadikan agen AI sebagai **Image Processing Specialist & Photoshop-Grade Editor** yang mampu menangani pemrosesan gambar massal, penambahan watermark presisi, serta **sterilisasi total metadata AI & C2PA Content Credentials**.

---

## 🚀 1. STRUKTUR MASTER SCRIPT UTAMA

Seluruh fungsionalitas pemrosesan gambar disatukan dalam **SATU (1) Master Script Utama**:

📍 **File Master**: [`image_editor.py`](file:///C:/Users/NCN0C/Music/images_editor/image_editor.py)

### ⛔ Clean Workspace Policy:
- **DILARANG KERAS membuat file Python duplikat/tambahan** (seperti `test.py`, `script2.py`).
- Seluruh perbaikan, penambahan fitur, dan logika pemrosesan **WAJIB dimasukkan langsung ke dalam [`image_editor.py`](file:///C:/Users/NCN0C/Music/images_editor/image_editor.py)**.
- Dilarang menempatkan file scratch di folder luar yang tidak teratur.

---

## 🛡️ 2. FFMPEG & PIXEL REBUILD METADATA STRIPPER (C2PA / EXIF PURGE)

Sistem menggunakan **Dual-Pass Metadata Stripping Engine** untuk menjamin gambar 100% bersih dari jejak AI:

```
[ INPUT IMAGE ]
      │
      ▼
1. Pillow Raw Pixel Buffer Reconstruction
   (Memory copy raw pixel array tanpa menyalin info dictionary, EXIF, IPTC, XMP, atau chunk C2PA)
      │
      ▼
2. FFmpeg Bitexact Stream Re-encode
   (ffmpeg -i input -map_metadata -1 -map_chapters -1 -fflags +bitexact -flags:v +bitexact ...)
      │
      ▼
[ CLEAN OUTPUT IMAGE (0-Byte Metadata) ]
```

### 🎬 Perintah FFmpeg Rebuild Engine:
```bash
ffmpeg -y -i input.png -map_metadata -1 -map_chapters -1 -fflags +bitexact -flags:v +bitexact -vcodec png output_clean.png
```

---

## 📁 3. STANDARD OUTPUT & 3-DIGIT RENAMING RULES (STRICT)

1. **Wajib Folder Output Terpisah**: Seluruh gambar hasil pengolahan **WAJIB disimpan di dalam folder khusus `outputs/`** (contoh: `modul 1/1/outputs/`), dan **DILARANG KERAS** menyatu atau mencampuri folder gambar mentah asli.
2. **Wajib Penamaan 3-Digit Berurutan (`001.png` - `N.png`)**: Seluruh file hasil olahan wajib diberi nama 3-digit berurutan: `001.png`, `002.png`, `003.png`, ..., `010.png`.
3. **Pembersihan File Sampah**: Dilarang menyisakan file suffix acak seperti `_processed.png` atau file preview sementara di folder asal.

---

## 🛠️ 4. FITUR & KAPABILITAS UTAMA

1. **Visual Container & Placeholder Detection**:
   - Sebelum memasang logo, sistem melakukan **Inspeksi Visual** pada template/gambar.
   - **9:16 Story Template**: Presisi Golden Circle (`Center: 830, 126`, `Size: 292px`).
   - **4:5 Vertical Feed Template**: Presisi Padded Top-Right (`Center: 960, 140`, `Size: 240px` atau `Center: 920, 140`).
   - **Per-Folder Custom Target**: Presisi kustom sesuai instruksi & persetujuan visual user.

2. **Photoshop-Grade Filters & HD Enhancer**:
   - **HD Sharpening**: Memperjelas detail gambar dengan *Unsharp Masking*.
   - **Filter Presets**:
     - `vibrant`: Peningkatan kontras +10% dan saturasi warna +20%.
     - `cinematic`: Kontras dramatis +25% dengan saturasi -12% dan tone agak gelap.
     - `bright`: Peningkatan kecerahan +10% dan kontras +5%.
     - `hdr_boost`: Detail enhancement + kontras +20%.

3. **Batch Processing Engine**:
   - `process_batch_folder()`: Pemrosesan massal 1 folder penuh yang secara otomatis membuat folder `outputs/` dan memberikan penamaan `001.png` - `N.png`.

---

## 🐍 5. CARA PENGGUNAAN SCRIPT `image_editor.py`

### Pemrosesan Massal Batch (Folder `outputs/` + 3-Digit + C2PA Strip):
```python
from image_editor import process_batch_folder

process_batch_folder(
    input_dir=r"C:\path\to\input_folder",
    output_dir=r"C:\path\to\input_folder\outputs",
    logo_path=r"C:\path\to\logo.png",
    position=(890, 110),
    apply_hd=True,
    filter_preset="vibrant",
    strip_metadata=True,
    use_ffmpeg_rebuild=True
)
```

---

## ⛔ 6. ATURAN KETAT (STRICT RULES)
1. **Wajib Rebuild FFmpeg & Pillow**: Seluruh metadata C2PA, EXIF, dan chunk AI wajib dibersihkan total.
2. **Wajib Folder Output `outputs/`**: Hasil rendering tidak boleh dicampur di folder mentah.
3. **Wajib Format 3-Digit (`001.png`)**: Urutan file output harus 3-digit rapi.
4. **Dilarang Membuat File Python Baru/Duplikat**: Semua penambahan fitur gambar wajib langsung dimasukkan ke dalam [`image_editor.py`](file:///C:/Users/NCN0C/Music/images_editor/image_editor.py).
5. **Standard Execution**: Gunakan perintah `py image_editor.py` untuk menjalankan script di Windows CLI.
