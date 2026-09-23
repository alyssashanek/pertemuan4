# **Web Expense Tracker Mahasiswa**

## **Deskripsi Sistem**

Expense Tracker Mahasiswa adalah aplikasi web yang digunakan untuk membantu mahasiswa mengelola keuangan pribadi secara sederhana. Pengguna dapat membuat akun, login, mencatat transaksi pemasukan dan pengeluaran, melihat riwayat transaksi, serta mengetahui kondisi keuangan melalui saldo, total pemasukan, dan total pengeluaran. Setiap transaksi terhubung dengan pengguna yang sedang login sehingga pengguna hanya dapat melihat dan mengelola transaksi miliknya sendiri.

## **Teknologi**

**Framework:** Next.js

**Database:** PostgreSQL

**Database Platform:** Supabase

**Authentication:** Supabase Auth

## **Software Requirements Specification**

| SRS Kode   | Fitur                         | User Story                                                                                                                                     | Deskripsi / Kriteria                                                                                     |
| ---------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **SRS-01** | Register                      | Sebagai pengguna, saya ingin membuat akun dengan nama, email, dan password agar dapat menggunakan aplikasi.                                    | Pengguna dapat melakukan registrasi dengan nama, email, dan password yang valid.                         |
| **SRS-02** | Login                         | Sebagai pengguna, saya ingin login menggunakan email dan password agar dapat masuk ke akun saya.                                               | Sistem melakukan autentikasi berdasarkan email dan password.                                             |
| **SRS-03** | Session                       | Sebagai pengguna, saya ingin session login saya dipertahankan selama session masih berlaku agar tidak perlu login berulang kali.               | Sistem mempertahankan informasi pengguna selama session masih valid.                                     |
| **SRS-04** | Protected Page                | Sebagai pengguna, saya ingin halaman tertentu terlindungi agar hanya pengguna yang sudah login yang dapat mengaksesnya.                        | Halaman dashboard dan transaksi hanya dapat diakses pengguna terautentikasi.                             |
| **SRS-05** | Nama Pengguna                 | Sebagai pengguna, saya ingin melihat nama saya pada dashboard agar mengetahui akun yang sedang aktif.                                          | Dashboard menampilkan nama pengguna yang sedang login.                                                   |
| **SRS-06** | Logout                        | Sebagai pengguna, saya ingin melakukan logout agar session akun saya dapat diakhiri.                                                           | Sistem mengakhiri session dan mengarahkan pengguna ke halaman login.                                     |
| **SRS-07** | Saldo                         | Sebagai pengguna, saya ingin melihat saldo total agar mengetahui kondisi keuangan saya.                                                        | Saldo dihitung dari total pemasukan dikurangi total pengeluaran.                                         |
| **SRS-08** | Total Pemasukan               | Sebagai pengguna, saya ingin melihat total pemasukan agar mengetahui jumlah uang yang saya terima.                                             | Sistem menampilkan jumlah seluruh transaksi dengan jenis pemasukan milik pengguna.                       |
| **SRS-09** | Total Pengeluaran             | Sebagai pengguna, saya ingin melihat total pengeluaran agar mengetahui jumlah uang yang saya gunakan.                                          | Sistem menampilkan jumlah seluruh transaksi dengan jenis pengeluaran milik pengguna.                     |
| **SRS-10** | Transaksi Terbaru             | Sebagai pengguna, saya ingin melihat transaksi terbaru pada dashboard agar mengetahui aktivitas keuangan terakhir saya.                        | Dashboard menampilkan transaksi terbaru milik pengguna berdasarkan tanggal transaksi.                    |
| **SRS-11** | Riwayat Transaksi             | Sebagai pengguna, saya ingin melihat seluruh riwayat transaksi agar dapat memantau catatan keuangan saya.                                      | Pengguna dapat melihat daftar seluruh transaksi miliknya.                                                |
| **SRS-12** | Filter Transaksi              | Sebagai pengguna, saya ingin memfilter transaksi berdasarkan pemasukan atau pengeluaran agar lebih mudah mencari transaksi tertentu.           | Pengguna dapat memilih filter semua, pemasukan, atau pengeluaran.                                        |
| **SRS-13** | Cookie Preference             | Sebagai pengguna, saya ingin preferensi filter transaksi disimpan dalam cookie agar pilihan terakhir saya tetap tersimpan.                     | Sistem menyimpan minimal satu preferensi pengguna menggunakan cookie, seperti filter transaksi terakhir. |
| **SRS-14** | Tambah Transaksi              | Sebagai pengguna, saya ingin menambahkan transaksi pemasukan atau pengeluaran agar dapat mencatat aktivitas keuangan saya.                     | Pengguna dapat menambahkan transaksi dengan data yang valid.                                             |
| **SRS-15** | Ubah Transaksi                | Sebagai pengguna, saya ingin mengubah transaksi yang sudah ada agar dapat memperbaiki data transaksi saya.                                     | Pengguna dapat mengubah transaksi miliknya sendiri.                                                      |
| **SRS-16** | Hapus Transaksi               | Sebagai pengguna, saya ingin menghapus transaksi agar dapat menghilangkan catatan transaksi yang tidak diperlukan.                             | Pengguna dapat menghapus transaksi miliknya sendiri setelah konfirmasi.                                  |
| **SRS-17** | Detail Transaksi              | Sebagai pengguna, saya ingin memasukkan nama transaksi, jenis, nominal, tanggal, dan catatan agar data keuangan saya tersimpan dengan lengkap. | Data transaksi terdiri dari nama, jenis, nominal, tanggal, dan catatan opsional.                         |
| **SRS-18** | Kepemilikan Transaksi         | Sebagai pengguna, saya ingin setiap transaksi terhubung dengan akun saya agar setiap transaksi memiliki pemilik yang jelas.                    | Setiap transaksi memiliki `user_id` yang terhubung dengan akun pengguna.                                 |
| **SRS-19** | Authorization - Read          | Sebagai pengguna, saya ingin hanya dapat melihat transaksi milik saya agar data pengguna lain tidak dapat saya akses.                          | Pengguna hanya dapat membaca transaksi yang memiliki `user_id` sesuai dengan user yang login.            |
| **SRS-20** | Authorization - Update/Delete | Sebagai pengguna, saya ingin hanya dapat mengubah dan menghapus transaksi milik saya agar data saya tetap aman.                                | Pengguna hanya dapat mengubah dan menghapus transaksi miliknya sendiri menggunakan authorization/RLS.    |

## Database Schema

### `auth.users`

| Field   | Tipe  | Keterangan                          |
| ------- | ----- | ----------------------------------- |
| `id`    | UUID  | ID unik pengguna dari Supabase Auth |
| `email` | Email | Email pengguna                      |

### `profiles`

| Field        | Tipe         | Keterangan                                    |
| ------------ | ------------ | --------------------------------------------- |
| `id`         | UUID         | ID pengguna, terhubung dengan `auth.users.id` |
| `name`       | VARCHAR(100) | Nama pengguna                                 |
| `created_at` | TIMESTAMPTZ  | Waktu profile dibuat                          |
| `updated_at` | TIMESTAMPTZ  | Waktu profile diperbarui                      |

### `transactions`

| Field              | Tipe          | Keterangan                 |
| ------------------ | ------------- | -------------------------- |
| `id`               | UUID          | ID unik transaksi          |
| `user_id`          | UUID          | ID pemilik transaksi       |
| `type`             | VARCHAR(20)   | `income` atau `expense`    |
| `title`            | VARCHAR(150)  | Nama transaksi             |
| `amount`           | NUMERIC(15,2) | Nominal transaksi          |
| `transaction_date` | DATE          | Tanggal transaksi          |
| `note`             | TEXT          | Catatan tambahan           |
| `created_at`       | TIMESTAMPTZ   | Waktu transaksi dibuat     |
| `updated_at`       | TIMESTAMPTZ   | Waktu transaksi diperbarui |

## Authorization

Setiap transaksi hanya dapat diakses oleh pemiliknya.

```text
auth.uid() = transactions.user_id
```

Aturan tersebut diterapkan menggunakan **Row Level Security (RLS)** untuk operasi:

* SELECT
* INSERT
* UPDATE
* DELETE

## Perhitungan Keuangan

```text
Saldo = Total Pemasukan - Total Pengeluaran
```

```text
Total Pemasukan = SUM(amount) WHERE type = 'income'
```

```text
Total Pengeluaran = SUM(amount) WHERE type = 'expense'
```

Semua perhitungan hanya menggunakan transaksi milik pengguna yang sedang login.
