// Keranjang dikosongkan dulu sambil menunggu data dari Katalog Menu (Orang 2)
let cart = [];

// Fungsi untuk merender/menampilkan data ke tabel HTML
function renderCart() {
    const cartTableBody = document.getElementById('cart-items');
    const cartCountSpan = document.getElementById('cart-count');
    
    if (!cartTableBody) return; 

    cartTableBody.innerHTML = ''; 
    let totalPrice = 0;
    let totalItems = 0;

    // Jika keranjang kosong
    if (cart.length === 0) {
        cartTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="padding: 24px; text-align: center; color: var(--muted); font-style: italic;">
                    Keranjang pesanan masih kosong. Silakan pilih menu dari katalog.
                </td>
            </tr>
        `;
    }

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        totalPrice += subtotal;
        totalItems += item.quantity;

        const row = document.createElement('tr');
        row.style.borderBottom = "1px solid var(--line)";
        row.innerHTML = `
            <td style="padding: 12px; font-weight: 500; color: var(--brown);">${item.menu_name}</td>
            <td style="padding: 12px;">Rp ${item.price.toLocaleString('id-ID')}</td>
            <td style="padding: 12px; text-align: center;">
                <div style="display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--sand); border-radius: 4px; padding: 4px 8px; background: #fff;">
                    <button onclick="changeQuantity(${index}, -1)" style="cursor: pointer; font-weight: bold; color: var(--muted);">-</button>
                    <span style="font-weight: 600;">${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)" style="cursor: pointer; font-weight: bold; color: var(--muted);">+</button>
                </div>
            </td>
            <td style="padding: 12px; font-weight: 600;">Rp ${subtotal.toLocaleString('id-ID')}</td>
            <td style="padding: 12px; text-align: center;">
                <button onclick="removeItem(${index})" style="background: #fee2e2; color: #991b1b; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;">Hapus</button>
            </td>
        `;
        cartTableBody.appendChild(row);
    });

    // Update total harga dan badge jumlah di navbar
    document.getElementById('total-price').innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    if (cartCountSpan) cartCountSpan.innerText = totalItems;
}

// Fungsi Tambah/Kurang Porsi
function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    renderCart();
}

// Fungsi Hapus Item
function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
}

// Event tombol Kirim Pesanan
document.getElementById('btn-submit-order')?.addEventListener('click', function() {
    const tableNumber = document.getElementById('table-number').value;
    const notes = document.getElementById('order-notes').value;

    if (!tableNumber) {
        alert("Mohon masukkan nomor meja terlebih dahulu!");
        return;
    }
    if (cart.length === 0) {
        alert("Keranjang pesanan masih kosong!");
        return;
    }

    alert(`Pesanan berhasil dikirim untuk Meja No. ${tableNumber}!\nCatatan: ${notes ? notes : 'Tidak ada catatan'}`);
});

// Jalankan saat halaman dimuat
renderCart();