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