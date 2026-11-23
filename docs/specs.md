# Spesifikasi Sistem & Blueprint Desain (Specs)
**Branch Acquisition & Monitoring Portal — Bank Mandiri**

---

## 1. Latar Belakang & Masalah
Di lapangan, tim sales dan akuisisi perbankan—mencakup unit payroll, individu/retail, serta 3PI (*Third Party Intermediary*)—menghadapi kendala operasional yang signifikan:
- **Fragmentasi Link Input**: Terlalu banyak link Google Forms terpisah untuk masing-masing produk (individu, giro, payroll, prioritas, merchant), menyebabkan kebingungan dan beban administratif tinggi bagi sales di lapangan.
- **Tingginya Tingkat Kegagalan Tarik Data ORFS**: Kesalahan pengetikan NIP (Nomor Induk Pegawai), ketidaksesuaian format tanggal/nominal, atau kode produk mengakibatkan data akuisisi gugur saat ditarik oleh tim ORFS (*Offices Retail Funding Solution*).
- **Ketidakjelasan Status GMM & New CIF**: Tidak adanya pengecekan instan terhadap status *New CIF* di NBDS membuat sales tidak mengetahui apakah perolehan tersebut memenuhi syarat diakui sebagai GMM (*Gross Margin/Growth Metrics*).
- **Monitoring Cabang yang Terpisah-pisah**: Pelacakan pipeline kunjungan nasabah, pembagian PIC, dan monitoring performa cabang (data EDA/Senator, EDC, Livin' Merchant) tersebar di berbagai spreadsheet manual tanpa integrasi visual pemetaan spasial (*GIS*).

---

## 2. Visi & Tujuan Sistem
Membangun sebuah *all-in-one web portal* modern berbasis **Next.js** yang di-deploy di **Vercel** dengan arsitektur dashboard terpadu (*single unified dashboard*). Sistem ini menyediakan:
1. **Satu Pintu Input Dinamis**: Formulir tunggal cerdas (*Dynamic Conditional Intake Form*) untuk semua segmen perolehan.
2. **Validasi Instan & Otomasi NIP**: Validasi langsung saat mengetik NIP beserta auto-fill profil pegawai, serta simulasi NBDS untuk verifikasi *New CIF*.
3. **Manajemen Pipeline & Batch Closing Cabang**: Pelacakan checklist harian per nasabah dengan fitur penutupan malam hari kolektif (*Supervisor Central Batch Closing*).
4. **Monitoring EDA & GIS Clustering**: Visualisasi performa cabang, pemetaan merchant LVM/EDC, deteksi anomali EDC aktif ber-volume rendah, dan optimasi rute kunjungan sales.
5. **Katalog Produk Interaktif & Pitch Kit**: Alat bantu sosialisasi produk di hadapan nasabah yang dilengkapi kalkulator simulasi.
6. **Laporan Otomatis & Executive One-Pager**: Ekspor PDF khusus 1 halaman A4 pas cetak untuk pimpinan serta ekspor Excel multi-sheet.

---

## 3. Keputusan Desain Terpilih (*Grilling Results*)

| No | Dimensi Arsitektur | Keputusan Final | Rasional & Cara Kerja |
|---|---|---|---|
| **1** | **Deployment & Lingkungan** | **UI/UX Prototype (Vercel)** | Next.js dideploy di Vercel publik dengan arsitektur cloud/local database & mock data realistis agar dapat diakses instan oleh penguji tanpa hambatan firewall intranet. |
| **2** | **Arsitektur Form Intake** | **Dynamic Conditional Form (Single URL)** | Form tunggal di mana sales memilih jenis perolehan (Individu, Pebisnis, Payroll, Prioritas, Merchant OTBR), lalu field form otomatis menyesuaikan secara dinamis. |
| **3** | **Validasi NIP & NBDS** | **Instant Pre-Validation & Auto-fill** | Input NIP langsung mencocokkan ke master NIP, mengunci auto-fill nama & cabang, dan memblokir submit jika NIP tidak valid. Simulasi NBDS mendeteksi status *New CIF*. |
| **4** | **Operasional Harian Cabang** | **Supervisor Central Batch Closing** | Tim sales cukup mengabarkan laporan via chat; Supervisor / Branch Manager menutup dan mencentang status *Done* harian secara kolektif di dashboard. |
| **5** | **Monitoring EDA & GIS Map** | **Full GIS Clustering & Route Optimization** | Peta interaktif (Leaflet) dengan clustering merchant, penanda merah untuk EDC aktif dengan sales volume kecil, dan rute kunjungan harian yang dioptimasi. |
| **6** | **Katalog Produk & Sales Kit** | **Interactive Pitch Kit + Simulators** | Katalog interaktif dengan kalkulator simulasi bunga & MDR EDC, serta tombol *'Ajukan Produk Ini'* yang membuka form intake dengan kode terisi otomatis. |
| **7** | **Pelaporan & Ekspor** | **1-Page A4 PDF & Multi-Tab Excel** | Template PDF dirancang pas 1 halaman A4 untuk pimpinan, serta ekspor Excel (.xlsx) 3 sheet via SheetJS (Rekap Cabang, Pipeline, Merchant/EDC). |
| **8** | **Navigasi & Akses Pengguna** | **Single Unified Dashboard with Open Tabs** | Semua modul dapat diakses langsung melalui tab navigasi terbuka tanpa sekat login/logout yang rumit saat sesi demonstrasi. |

---

## 4. Rincian Modul & Fitur Aplikasi

### Modul 1: Form Intake Perolehan Terpusat (`/intake`)
- **Tipe Perolehan**:
  1. *Individu* (Tabungan Now, Tabungan Reguler, Deposito Ritel)
  2. *Pebisnis* (Tabungan Bisnis, Giro Rupiah/Valas)
  3. *Payroll (Pipeline)* (Akuisisi institusi/perusahaan, estimasi jumlah pegawai, potensi saldo)
  4. *Prioritas (Pipeline)* (Calon nasabah affluent, estimasi AUM min. Rp 1 Miliar/Rp 500 Juta)
  5. *Merchant OTBR* (Pengajuan EDC baru, Livin' Merchant QRIS, foto toko, estimasi sales volume)
- **Validasi Cerdas**:
  - Validasi NIP real-time terhadap Master Pegawai (menampilkan nama sales dan unit cabang asal).
  - Masking otomatis format mata uang Rupiah (`Rp xxx.xxx.xxx`).
  - Dropdown kode produk baku Bank Mandiri.
  - Tanggal akuisisi/kunjungan dengan batasan kalender valid.

### Modul 2: Monitoring & Approval Perolehan (`/approval`)
- **Alur Status Perolehan**:
  - `Menunggu Approval`: Data baru masuk setelah NIP tervalidasi.
  - `Diterima (GMM)`: Disetujui oleh Branch Manager/Admin, CIF terkonfirmasi *New CIF* di simulasi NBDS.
  - `Ditolak (NIP/CIF Salah)`: Ditolak dengan catatan perbaikan yang jelas.
  - `Selesai`: Tahap implementasi/pembukuan tuntas.
- **Log Simulasi NBDS**: Indikator apakah CIF terdeteksi sebagai nasabah baru (*New CIF*) atau nasabah lama (*Existing CIF*), sebagai penentu lolos perhitungan GMM.

### Modul 3: Manajemen Pipeline & Operasional Cabang (`/pipeline`)
- **Matriks Pipeline Cabang**:
  - Filter per Cabang (e.g. KC Jakarta Thamrin, KC Surabaya Pemuda, dsb.) dan PIC yang ditugaskan.
  - Detail tahapan pipeline: *Prospecting* → *Pitching* → *Dokumen/Berkas* → *PKS/MoU* → *Live/Akuisisi*.
  - Riwayat kunjungan dan checklist pekerjaan per nasabah.
- **Panel Batch Closing Malam Hari**:
  - Ringkasan kunjungan terjadwal hari ini.
  - Tombol seleksi kolektif dan konfirmasi satu klik: *"Tandai Kunjungan Selesai (Done)"* untuk Branch Manager / Supervisor di malam hari.

### Modul 4: Monitoring EDA, Pemetaan GIS & Rute Kunjungan (`/monitoring-gis`)
- **Indikator Kinerja EDA (Senator)**:
  - Metrik KPI: Unit Wholesale (CB), Portofolio Tabungan, Pertumbuhan Merchant, Aktivitas Livin' Merchant (LVM), dan Penetrasi EDC.
- **Peta Spasial GIS (Leaflet + Marker Clustering)**:
  - Pemetaan titik merchant di sekitar area kantor cabang.
  - Penanda Khusus: Marker Merah berkedip (*Alert*) untuk merchant ber-EDC aktif namun *sales volume* di bawah batas minimum (< Rp 5 Juta/bulan atau < 10 transaksi).
  - Drawer detail merchant: data CIF, volume penjualan bulanan, skema MDR saat ini, dan tombol *"Jadwalkan Kunjungan/Intervensi Kasir"*.
- **Optimasi Rute Kunjungan**:
  - Kalkulasi jalur kunjungan terpendek dari titik kantor cabang menuju merchant-merchant bermasalah untuk efisiensi bahan bakar dan waktu PIC.

### Modul 5: Katalog Produk Bank Mandiri & Pitch Kit (`/catalog`)
- **Direktori Produk Multi-Segmen**:
  - Retail, Bisnis/Giro, Payroll Corporate, Mandiri Prioritas & Wealth Management, Livin' Merchant & EDC.
- **Kalkulator Simulasi Interaktif**:
  - *Simulasi Tabungan & Deposito*: Perhitungan estimasi imbal hasil/bunga berdasarkan tenor dan nominal.
  - *Simulasi Penghematan MDR EDC*: Perbandingan skema fee transaksi untuk meyakinkan calon merchant.
- **Direct Apply Action**: Tombol di setiap kartu produk yang langsung mengarahkan pengguna ke Form Intake dengan jenis dan kode produk yang telah terisi (*pre-filled*).

### Modul 6: Laporan Harian & Executive Summary (`/reports`)
- **Executive One-Pager (PDF A4)**:
  - Tata letak kompak 1 halaman A4 bebas scroll potong: Ringkasan KPI cabang, rasio pencapaian target perolehan, highlight cabang unggul & cabang dengan EDC bermasalah.
  - Generator PDF sisi klien (*client-side render/print layout*).
- **Multi-Tab Excel Export (.xlsx)**:
  - Menggunakan SheetJS:
    - *Sheet 1*: Rekap Performa Cabang & Metrik EDA.
    - *Sheet 2*: Log Seluruh Pipeline & Status Kunjungan.
    - *Sheet 3*: Master Data Merchant & Status EDC/LVM.

---

## 5. Struktur Data & Entitas Utama

```typescript
// Entitas Master Pegawai & Sales
export interface SalesOfficer {
  nip: string;              // e.g. "198701012015011001"
  nama: string;             // e.g. "Budi Santoso"
  role: "Sales Individu" | "Sales Payroll" | "Sales Prioritas" | "Merchant Officer";
  cabangId: string;         // e.g. "KC-JKT-THAMRIN"
  cabangNama: string;       // e.g. "KC Jakarta Thamrin"
}

// Entitas Perolehan (Submission)
export interface AcquisitionSubmission {
  id: string;
  timestamp: string;
  nip: string;
  namaSales: string;
  cabangId: string;
  jenisPerolehan: "INDIVIDU" | "PEBISNIS" | "PAYROLL" | "PRIORITAS" | "MERCHANT_OTBR";
  namaNasabah: string;
  cif?: string;
  kodeProduk: string;
  namaProduk: string;
  nominal?: number;
  estimasiKaryawan?: number; // Khusus payroll
  estimasiAum?: number;      // Khusus prioritas
  tipeEdc?: string;          // Khusus merchant
  statusApproval: "MENUNGGU" | "DITERIMA_GMM" | "DITOLAK_NIP" | "SELESAI";
  statusNbds: "NEW_CIF" | "EXISTING_CIF" | "UNVERIFIED";
  catatan?: string;
}

// Entitas Pipeline Cabang & Kunjungan
export interface BranchPipeline {
  id: string;
  cabangId: string;
  namaNasabah: string;
  kategori: "PAYROLL" | "PRIORITAS" | "PEBISNIS" | "MERCHANT";
  tahap: "PROSPECTING" | "PITCHING" | "DOKUMEN" | "MOU" | "AKUISISI";
  picNip: string;
  picNama: string;
  tanggalKunjungan: string;
  statusKunjungan: "SCHEDULED" | "DONE" | "RESCHEDULED";
  checklist: {
    id: string;
    deskripsi: string;
    selesai: boolean;
  }[];
  riwayatKunjungan: {
    tanggal: string;
    catatan: string;
    pic: string;
  }[];
}

// Entitas Merchant & Status EDC
export interface MerchantGeoData {
  id: string;
  namaToko: string;
  pemilik: string;
  cif: string;
  area: string;
  cabangId: string;
  lat: number;
  lng: number;
  statusEdc: "AKTIF" | "TIDAK_AKTIF" | "QRIS_ONLY";
  salesVolumeBulanan: number;
  jumlahTransaksi: number;
  mdrPersen: number;
  isBermasalah: boolean; // Flagged jika statusEdc == "AKTIF" && salesVolumeBulanan < 5_000_000
}
```

---

## 6. Rencana Implementasi & Tech Stack
- **Framework**: Next.js 14+ (App Router), React, TypeScript.
- **Styling & UI Components**: Tailwind CSS, Lucide React (Icons), Radix UI / Shadcn-style components.
- **Peta & GIS**: Leaflet, React-Leaflet, Leaflet MarkerCluster.
- **Export Engine**: SheetJS (`xlsx`) untuk multi-tab spreadsheet, Tailwind Print / CSS `@media print` untuk PDF A4 One-Pager.
- **State & Data Store**: In-Memory + LocalStorage Engine dengan Realistic Preloaded Seed Data (memungkinkan demo langsung tanpa setup database eksternal).
- **Deployment**: Vercel Serverless Platform.
