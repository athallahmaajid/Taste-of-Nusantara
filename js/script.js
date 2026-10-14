// Menampilkan jumlah pesanan di tombol "Pesanan Anda".
// Datanya dibaca dari localStorage dengan key "cart".
// Format: { "Rendang Daging": 2, "Es Cendol Durian": 1 }

function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (!el) return;

  let total = 0;
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    total = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  } catch (e) {
    total = 0;
  }
  el.textContent = total;
}

updateCartCount();

// Ikut update kalau keranjang berubah di tab lain
window.addEventListener('storage', updateCartCount);


// Menangani submit form reservasi.
// Guard dipakai karena script.js dimuat di semua halaman, sedangkan
// #formReservasi hanya ada di index.html.
const formReservasi = document.getElementById('formReservasi');

if (formReservasi) {
  formReservasi.addEventListener('submit', function (event) {
    // Mencegah form memuat ulang halaman secara otomatis
    event.preventDefault();

    // Mengambil nilai dari setiap input
    const nama = document.getElementById('nama').value.trim();
    const tanggal = document.getElementById('tanggal').value;
    const jam = document.getElementById('jam').value;
    const jumlahOrang = document.getElementById('jumlah_orang').value;

    // Validasi: Pastikan semua kolom diisi
    if (!nama || !tanggal || !jam || !jumlahOrang) {
      alert('Validasi Gagal: Harap isi semua data reservasi terlebih dahulu.');
      return;
    }

    // Validasi: Pastikan jumlah orang sesuai kapasitas (maks 20)
    if (jumlahOrang < 1 || jumlahOrang > 20) {
      alert('Validasi Gagal: Kapasitas reservasi adalah 1 hingga maksimal 20 orang.');
      return;
    }

    // Jika validasi berhasil
    alert(`Validasi Berhasil!\n\nTerima kasih, ${nama}. Reservasi untuk ${jumlahOrang} orang pada tanggal ${tanggal} jam ${jam} siap dikirim.`);

    // Uncomment baris di bawah ini jika backend sudah siap untuk memproses data
    // formReservasi.submit();
  });
}


// Lightbox galeri: klik kartu untuk memperbesar foto.
// Guard dipakai karena script.js dimuat di semua halaman, sedangkan
// lightbox dan kartu galeri hanya ada di index.html.
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCap = document.getElementById('lightbox-cap');
const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
let lastFocusedCard = null;

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  // Kembalikan fokus ke kartu yang tadi diklik, supaya keyboard tidak nyasar
  if (lastFocusedCard) lastFocusedCard.focus();
}

if (lightbox) {
  document.querySelectorAll('.gal-card').forEach(function (card) {
    card.addEventListener('click', function () {
      const img = card.querySelector('img');
      if (!img) return;

      lastFocusedCard = card;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCap.textContent = img.alt;
      lightbox.classList.add('is-open');
      lightboxClose.focus();
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);

  // Klik area gelap di luar gambar ikut menutup
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeLightbox();
  });
}