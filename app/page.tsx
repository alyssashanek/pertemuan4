import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────────────────
   Saldoo Landing Page
   Design System : Red Broadcast (red-broadcast-DESIGN.md)
   Audited by    : /antislop (Mode 1: During)
   Design Read   : Landing page produk keuangan mahasiswa, gaya Red Broadcast,
                   Dial: ENERGY 2 / RHYTHM 2 / MOTION 1
───────────────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#0F0F0F]">

      {/* ═══════════════════════════════════════════════════════════════════════
          NAVBAR
          Tinggi 56px, latar putih, border-b tipis #E5E5E5 sesuai Red Broadcast
      ═══════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#E5E5E5] shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <nav
          aria-label="Navigasi Utama"
          className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between"
        >
          {/* Logo Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0000] rounded-lg p-1"
          >
            <span className="w-7 h-7 rounded-lg bg-[#FF0000] flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-[#CC0000] transition-colors">
              S
            </span>
            <span className="text-[#0F0F0F] font-bold text-lg tracking-tight">
              Saldoo
            </span>
          </Link>

          {/* Navigasi & Aksi Masuk */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="#fitur"
              className="hidden md:inline-flex text-[14px] font-medium text-[#606060] hover:text-[#0F0F0F] transition-colors px-2 py-1"
            >
              Fitur Utama
            </Link>
            <Link
              href="#demo"
              className="hidden md:inline-flex text-[14px] font-medium text-[#606060] hover:text-[#0F0F0F] transition-colors px-2 py-1"
            >
              Simulasi Saldo
            </Link>
            <Link
              href="/login"
              className="min-h-[40px] px-4 flex items-center text-[14px] font-medium text-[#0F0F0F] border border-[#E5E5E5] rounded-full hover:bg-[#F2F2F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F0F0F]"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="min-h-[40px] px-4 flex items-center text-[14px] font-medium text-white bg-[#0F0F0F] hover:bg-[#272727] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F0F0F]"
            >
              Daftar Akun
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">

        {/* ═════════════════════════════════════════════════════════════════════
            HERO SECTION
            Copy spesifik untuk mahasiswa, tanpa statistik palsu (R-17), tanpa em dash (R-02)
        ═════════════════════════════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-16 text-center">

          {/* Badge Konteks Produk */}
          <div className="inline-flex items-center gap-2 bg-[#F2F2F2] border border-[#E5E5E5] rounded-full px-3.5 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#2BA640]" aria-hidden="true" />
            <span className="text-[12px] font-medium text-[#0F0F0F] tracking-wide">
              Aplikasi Pencatat Keuangan Mahasiswa
            </span>
          </div>

          {/* Headline Utama */}
          <h1 className="text-[32px] sm:text-[46px] leading-[40px] sm:leading-[54px] font-bold text-[#0F0F0F] max-w-3xl mx-auto mb-5">
            Ketahui ke mana uang saku pergi,{" "}
            <span className="text-[#CC0000]">sebelum akhir bulan tiba</span>
          </h1>

          {/* Sub-headline Deskriptif */}
          <p className="text-[15px] sm:text-[17px] leading-relaxed text-[#606060] max-w-2xl mx-auto mb-8">
            Catat pemasukan dari orang tua atau beasiswa, pantau belanja harian dan kebutuhan kuliah, serta pastikan saldo tetap aman dalam satu dashboard ringkas.
          </p>

          {/* Action CTAs: Kontras tinggi WCAG AA (R-25), target sentuh >= 44px (R-03) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto min-h-[44px] px-6 flex items-center justify-center text-[14px] font-medium text-white bg-[#CC0000] hover:bg-[#990000] rounded-full transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CC0000]"
            >
              Daftar Akun Saldoo
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto min-h-[44px] px-6 flex items-center justify-center text-[14px] font-medium text-[#0F0F0F] border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#F2F2F2] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F0F0F]"
            >
              Lihat Simulasi Saldo
            </Link>
          </div>

          <p className="mt-4 text-[12px] text-[#606060]">
            Akses gratis untuk mahasiswa. Tanpa biaya langganan tersembunyi.
          </p>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            SIMULASI DASHBOARD MAHASISWA (#demo)
            Menghilangkan layout 3 kolom kaku di mobile (R-03).
            Data mencerminkan skema tabel transactions (income & expense).
        ═════════════════════════════════════════════════════════════════════ */}
        <section id="demo" className="bg-[#F2F2F2] border-y border-[#E5E5E5] py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">

            <div className="text-center mb-6">
              <h2 className="text-[20px] sm:text-[24px] font-bold text-[#0F0F0F]">
                Tampilan Dashboard Saldoo
              </h2>
              <p className="text-[14px] text-[#606060] mt-1">
                Gambaran langsung bagaimana transaksi Anda terhitung otomatis.
              </p>
            </div>

            {/* Kartu Mockup Dashboard Sesuai Desain Red Broadcast */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5E5] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)]">

              {/* Baris Status Pengguna */}
              <div className="px-5 py-4 border-b border-[#E5E5E5] flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF]">
                <div>
                  <p className="text-[12px] text-[#606060]">Sesi Aktif Mahasiswa</p>
                  <p className="text-[15px] font-semibold text-[#0F0F0F]">Ahmad Fauzi (Semester 4)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F2F2F2] rounded-full text-[12px] font-medium text-[#0F0F0F]">
                    <span className="w-2 h-2 rounded-full bg-[#2BA640]" />
                    Tersinkronisasi
                  </span>
                </div>
              </div>

              {/* Baris Ringkasan Saldo: Responsive stack di mobile (R-03) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E5E5] bg-[#FFFFFF]">
                <div className="p-5">
                  <p className="text-[12px] font-medium text-[#606060] mb-1">Saldo Saat Ini</p>
                  <p className="text-[22px] font-bold text-[#0F0F0F]">Rp 1.450.000</p>
                  <p className="text-[12px] text-[#2BA640] font-medium mt-1">Sisa aman hingga akhir bulan</p>
                </div>
                <div className="p-5">
                  <p className="text-[12px] font-medium text-[#606060] mb-1">Total Pemasukan</p>
                  <p className="text-[22px] font-bold text-[#2BA640]">Rp 2.500.000</p>
                  <p className="text-[12px] text-[#606060] mt-1">Kiriman bulanan dan freelance</p>
                </div>
                <div className="p-5">
                  <p className="text-[12px] font-medium text-[#606060] mb-1">Total Pengeluaran</p>
                  <p className="text-[22px] font-bold text-[#CC0000]">Rp 1.050.000</p>
                  <p className="text-[12px] text-[#606060] mt-1">Kos, makan harian, fotokopi</p>
                </div>
              </div>

              {/* Daftar Transaksi Nyata Mahasiswa */}
              <div className="p-5 border-t border-[#E5E5E5] bg-[#FFFFFF]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-semibold text-[#0F0F0F]">
                    Riwayat Transaksi Terakhir
                  </h3>
                  <span className="text-[12px] text-[#606060]">
                    Filter: Semua Jenis
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      title: "Uang saku bulanan dari orang tua",
                      date: "22 Sep 2026",
                      note: "Transfer via Bank Mandiri",
                      amount: "+ Rp 2.000.000",
                      isIncome: true,
                    },
                    {
                      title: "Bayar sewa kamar kos",
                      date: "23 Sep 2026",
                      note: "Pembayaran bulan September",
                      amount: "- Rp 800.000",
                      isIncome: false,
                    },
                    {
                      title: "Beli modul praktikum & fotokopi",
                      date: "24 Sep 2026",
                      note: "Kebutuhan tugas kuliah",
                      amount: "- Rp 65.000",
                      isIncome: false,
                    },
                    {
                      title: "Honor asisten laboratorium",
                      date: "24 Sep 2026",
                      note: "Tambahan pemasukan kampus",
                      amount: "+ Rp 500.000",
                      isIncome: true,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-[#E5E5E5] hover:bg-[#F2F2F2] transition-colors gap-2"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 mt-0.5 sm:mt-0 ${
                            item.isIncome
                              ? "bg-[#E8F5E9] text-[#2BA640]"
                              : "bg-[#FFF0F0] text-[#CC0000]"
                          }`}
                        >
                          {item.isIncome ? "↓" : "↑"}
                        </span>
                        <div>
                          <p className="text-[14px] font-medium text-[#0F0F0F]">
                            {item.title}
                          </p>
                          <p className="text-[12px] text-[#606060]">
                            {item.date} • {item.note}
                          </p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right pl-10 sm:pl-0">
                        <span
                          className={`text-[14px] font-semibold ${
                            item.isIncome ? "text-[#2BA640]" : "text-[#CC0000]"
                          }`}
                        >
                          {item.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[#E5E5E5] flex justify-between items-center text-[13px]">
                  <span className="text-[#606060]">
                    Data terisolasi aman dengan otorisasi akun.
                  </span>
                  <Link
                    href="/dashboard"
                    className="text-[#065FD4] font-medium hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#065FD4]"
                  >
                    Buka Dashboard Lengkap →
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            FITUR UTAMA (#fitur)
            Asymmetric layout (R-14), variasi ritme (RHYTHM 2), tanpa buzzword (R-16)
        ═════════════════════════════════════════════════════════════════════ */}
        <section id="fitur" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="mb-12">
            <p className="text-[12px] font-bold uppercase tracking-wider text-[#CC0000] mb-2">
              Fokus Kebutuhan Finansial Kampus
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold text-[#0F0F0F]">
              Dibuat sederhana agar Anda konsisten mencatat
            </h2>
            <p className="text-[15px] text-[#606060] mt-2 max-w-2xl">
              Tidak ada grafik rumit yang membingungkan. Setiap fitur berorientasi pada pencatatan cepat di sela jadwal kuliah.
            </p>
          </div>

          {/* Grid Asimetris: 1 Kartu Unggulan Lebar + 2 Kartu Pendukung */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Kartu Unggulan: Kalkulasi Saldo Otomatis */}
            <div className="md:col-span-2 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#0F0F0F]/30 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#F2F2F2] flex items-center justify-center font-bold text-[#CC0000] mb-4">
                  Rp
                </div>
                <h3 className="text-[18px] sm:text-[20px] font-bold text-[#0F0F0F] mb-3">
                  Perhitungan Saldo Otomatis &amp; Real-time
                </h3>
                <p className="text-[14px] leading-relaxed text-[#606060] mb-6">
                  Setiap kali menambahkan pemasukan atau pengeluaran, total saldo langsung diperbarui seketika. Anda bisa segera tahu apakah pengeluaran hari ini masih dalam batas wajar atau mulai mendekati defisit.
                </p>
              </div>

              <div className="bg-[#F2F2F2] rounded-lg p-4 text-[13px] text-[#0F0F0F] border border-[#E5E5E5]">
                <p className="font-medium text-[#0F0F0F]">Rumus Transparan:</p>
                <p className="text-[#606060] mt-1">
                  Saldo Bersih = Total Pemasukan Valid - Total Pengeluaran Valid
                </p>
              </div>
            </div>

            {/* Kartu Pendukung 1: Input Detail Lengkap */}
            <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-6 flex flex-col justify-between hover:border-[#0F0F0F]/30 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#FFF0F0] flex items-center justify-center font-bold text-[#CC0000] mb-4">
                  ✎
                </div>
                <h3 className="text-[16px] font-bold text-[#0F0F0F] mb-2">
                  Input Form Rapi &amp; Cepat
                </h3>
                <p className="text-[14px] leading-relaxed text-[#606060]">
                  Lengkapi transaksi dengan nama pengeluaran, nominal pasti, tanggal transaksi, serta catatan pengingat seperti nama warung atau peruntukan tugas.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-[12px] text-[#606060]">
                Validasi input angka nominal harus lebih dari nol.
              </div>
            </div>

            {/* Kartu Pendukung 2: Privasi & Isolasi Data Akun */}
            <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-6 flex flex-col justify-between hover:border-[#0F0F0F]/30 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center font-bold text-[#2BA640] mb-4">
                  🔒
                </div>
                <h3 className="text-[16px] font-bold text-[#0F0F0F] mb-2">
                  Privasi Catatan Terjamin
                </h3>
                <p className="text-[14px] leading-relaxed text-[#606060]">
                  Setiap akun mahasiswa hanya dapat melihat, menambah, mengubah, dan menghapus transaksinya sendiri. Data Anda tidak dapat diintip oleh pengguna lain.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E5E5E5] text-[12px] text-[#606060]">
                Perlindungan ganda di server action dan database RLS.
              </div>
            </div>

            {/* Kartu Pendukung 3: Filter & Riwayat Fleksibel */}
            <div className="md:col-span-2 bg-[#FFFFFF] border border-[#E5E5E5] rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#0F0F0F]/30 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#F2F2F2] flex items-center justify-center font-bold text-[#0F0F0F] mb-4">
                  ☰
                </div>
                <h3 className="text-[18px] font-bold text-[#0F0F0F] mb-2">
                  Penyortiran Transaksi Terbaru &amp; Filter Jenis
                </h3>
                <p className="text-[14px] leading-relaxed text-[#606060]">
                  Tampilkan riwayat transaksi terurut rapi dari tanggal terbaru. Anda dapat memfilter tampilan untuk mengecek hanya pos pengeluaran tertentu saat mengevaluasi belanja bulanan.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E5E5E5] flex items-center gap-3 text-[13px] text-[#606060]">
                <span className="px-2.5 py-1 bg-[#F2F2F2] rounded-full text-[#0F0F0F] font-medium text-[12px]">
                  Semua
                </span>
                <span className="px-2.5 py-1 bg-[#F2F2F2] rounded-full text-[#0F0F0F] font-medium text-[12px]">
                  Pemasukan
                </span>
                <span className="px-2.5 py-1 bg-[#F2F2F2] rounded-full text-[#0F0F0F] font-medium text-[12px]">
                  Pengeluaran
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            SKENARIO NYATA KEUANGAN MAHASISWA
            Mengganti pola klise AI "How it works: 01, 02, 03" dengan alur riil (R-05)
        ═════════════════════════════════════════════════════════════════════ */}
        <section className="bg-[#F2F2F2] border-t border-[#E5E5E5] py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-[22px] sm:text-[26px] font-bold text-[#0F0F0F]">
                Alur Praktis Mengatur Saldo Kuliah
              </h2>
              <p className="text-[14px] text-[#606060] mt-1">
                Tiga fase penting dalam siklus keuangan bulanan mahasiswa.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="max-w-md">
                  <span className="text-[12px] font-bold text-[#2BA640] uppercase tracking-wider">
                    Fase Awal Bulan
                  </span>
                  <h3 className="text-[16px] font-semibold text-[#0F0F0F] mt-1">
                    Catat Kiriman &amp; Alokasi Tetap
                  </h3>
                  <p className="text-[13px] text-[#606060] mt-1">
                    Masukkan kiriman dari orang tua atau gaji magang, lalu langsung bayar sewa kos dan iuran wajib agar tidak terpakai untuk jajan.
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-[#E8F5E9] text-[#2BA640] font-medium text-[12px] rounded-md shrink-0">
                  Pos Pengeluaran Terencana
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="max-w-md">
                  <span className="text-[12px] font-bold text-[#CC0000] uppercase tracking-wider">
                    Fase Pertengahan Bulan
                  </span>
                  <h3 className="text-[16px] font-semibold text-[#0F0F0F] mt-1">
                    Disiplin Catat Belanja Harian
                  </h3>
                  <p className="text-[13px] text-[#606060] mt-1">
                    Beli makan di kantin, isi bensin, atau bayar cetak tugas kampus dicatat langsung lewat ponsel sebelum lupa.
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-[#FFF0F0] text-[#CC0000] font-medium text-[12px] rounded-md shrink-0">
                  Pencatatan Cepat &lt; 30 Detik
                </div>
              </div>

              <div className="bg-[#FFFFFF] p-5 rounded-xl border border-[#E5E5E5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="max-w-md">
                  <span className="text-[12px] font-bold text-[#065FD4] uppercase tracking-wider">
                    Fase Akhir Bulan
                  </span>
                  <h3 className="text-[16px] font-semibold text-[#0F0F0F] mt-1">
                    Evaluasi Sisa Saldo Tabungan
                  </h3>
                  <p className="text-[13px] text-[#606060] mt-1">
                    Buka ringkasan dashboard untuk memastikan ada sisa saldo cadangan sebelum kiriman bulan berikutnya masuk.
                  </p>
                </div>
                <div className="px-3 py-1.5 bg-[#F2F2F2] text-[#0F0F0F] font-medium text-[12px] rounded-md shrink-0">
                  Saldo Akurat Tanpa Selisih
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            CTA PENUTUP
            Spesifik dan lugas, kontras tinggi WCAG AA
        ═════════════════════════════════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h2 className="text-[26px] sm:text-[30px] font-bold text-[#0F0F0F] mb-3">
            Mulai kelola uang saku Anda hari ini
          </h2>
          <p className="text-[15px] text-[#606060] mb-8 max-w-lg mx-auto">
            Daftar dalam waktu kurang dari satu menit dan mulai catat transaksi pertama Anda di Saldoo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto min-h-[44px] px-8 flex items-center justify-center text-[14px] font-medium text-white bg-[#0F0F0F] hover:bg-[#272727] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F0F0F]"
            >
              Daftar Akun Baru
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto min-h-[44px] px-8 flex items-center justify-center text-[14px] font-medium text-[#0F0F0F] border border-[#E5E5E5] bg-[#FFFFFF] hover:bg-[#F2F2F2] rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F0F0F]"
            >
              Masuk ke Akun
            </Link>
          </div>
        </section>
      </main>

      {/* ═════════════════════════════════════════════════════════════════════
          FOOTER
          Sederhana, bersih, semua link valid (R-24)
      ═════════════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#E5E5E5] bg-[#FFFFFF] py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-[#FF0000] flex items-center justify-center text-white text-xs font-bold">
              S
            </span>
            <span className="text-[14px] font-semibold text-[#0F0F0F]">Saldoo</span>
          </div>

          <p className="text-[12px] text-[#606060] text-center sm:text-left">
            © 2026 Saldoo. Aplikasi Pengelola Keuangan Mahasiswa.
          </p>

          <div className="flex items-center gap-4 text-[13px]">
            <Link
              href="/login"
              className="text-[#606060] hover:text-[#0F0F0F] transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="text-[#606060] hover:text-[#0F0F0F] transition-colors"
            >
              Daftar
            </Link>
            <Link
              href="/dashboard"
              className="text-[#606060] hover:text-[#0F0F0F] transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}