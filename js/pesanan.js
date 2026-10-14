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

        // Membuat elemen Card baru per item
        const card = document.createElement('div');
        card.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid var(--line); border-radius: 6px; background: #faf6ed; flex-wrap: wrap; gap: 12px;";
    
    card.innerHTML = `
        <div>
            <h4 style="font-weight: 600; color: var(--brown); font-size: 16px; margin-bottom: 4px;">${item.menu_name}</h4>
            <p style="font-size: 13px; color: var(--muted);">Harga: Rp ${item.price.toLocaleString('id-ID')}</p>
        </div>
        
        <div style="display: flex; align-items: center; gap: 16px;">
            <div style="display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--sand); border-radius: 4px; padding: 4px 10px; background: #fff;">
                <button onclick="changeQuantity(${index}, -1)" style="cursor: pointer; font-weight: bold; color: var(--muted);">-</button>
                <span style="font-weight: 600; min-width: 20px; text-align: center;">${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)" style="cursor: pointer; font-weight: bold; color: var(--muted);">+</button>
            </div>
            
            <span style="font-weight: 600; color: var(--brown); min-width: 100px; text-align: right;">Rp ${subtotal.toLocaleString('id-ID')}</span>
            
            <button onclick="removeItem(${index})" style="background: #fee2e2; color: #991b1b; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;">Hapus</button>
        </div>
    `;
    cartContainer.appendChild(card);
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