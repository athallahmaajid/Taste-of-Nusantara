document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();

    const currentPath = window.location.pathname;

    if (!currentPath.includes("katalog.html") && !currentPath.includes("pesanan.html") && !currentPath.endsWith("/katalog") && !currentPath.endsWith("/pesanan")) {
        return; 
    }

    //TOMBOL PESAN DI KATALOG
    if (currentPath.includes("katalog.html") || currentPath.endsWith("/katalog")) {
        const tombolPesanList = document.querySelectorAll(".tombol-pesan");
        
        tombolPesanList.forEach(button => {
            button.addEventListener("click", function () {
                const card = this.closest(".menu-card");
                if (!card) return;

                const menuNameTag = card.querySelector("h2");
                const priceTag = card.querySelector(".harga");
                if (!menuNameTag || !priceTag) return;

                const menuName = menuNameTag.textContent.trim();
                const priceText = priceTag.textContent.trim();
                const price = parseInt(priceText.replace("Rp", "").replace(/\./g, "").trim());

                let cart = JSON.parse(localStorage.getItem("cart")) || {};
                let prices = JSON.parse(localStorage.getItem("cart_prices")) || {};

                cart[menuName] = (cart[menuName] || 0) + 1;
                prices[menuName] = price;

                localStorage.setItem("cart", JSON.stringify(cart));
                localStorage.setItem("cart_prices", JSON.stringify(prices));

                updateCartCount();
                showToast(menuName);
            });
        });
    }

    //HALAMAN PESANAN
    if (currentPath.includes("pesanan.html") || currentPath.endsWith("/pesanan")) {
        renderCart();

        const btnSubmit = document.getElementById("btn-submit-order");
        if (btnSubmit) {
            btnSubmit.addEventListener("click", function () {
                const tableNumberInput = document.getElementById("table-number");
                const tableNumber = tableNumberInput ? tableNumberInput.value.trim() : "";
                const notesInput = document.getElementById("order-notes");
                const notes = notesInput ? notesInput.value.trim() : "";
                let cart = JSON.parse(localStorage.getItem("cart")) || {};

                // Validasi Nomor Meja 
                if (!tableNumber) {
                    showCustomAlert("Mohon masukkan nomor meja Anda terlebih dahulu!", function() {
                        if (tableNumberInput) tableNumberInput.focus();
                    });
                    return;
                }

                // Validasi Keranjang Kosong
                if (Object.keys(cart).length === 0) {
                    showCustomAlert("Keranjang pesanan masih kosong. Silakan pilih menu terlebih dahulu dari Our Menu.");
                    return;
                }

                let prices = JSON.parse(localStorage.getItem("cart_prices")) || {};
                let totalPrice = 0;
                for (let menu in cart) {
                    totalPrice += (prices[menu] || 0) * cart[menu];
                }

                // Tampilkan Modal Pilihan Pembayaran (QRIS / Cash)
                showCheckoutModal(tableNumber, totalPrice, notes, cart, prices);
            });
        }
    }
});


function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    let totalItems = 0;
    
    for (let menu in cart) {
        if (!isNaN(cart[menu])) {
            totalItems += Number(cart[menu]);
        }
    }

    const cartCountElements = document.querySelectorAll("#cart-count");
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// --- notif ---
function showCustomAlert(message, callback) {
    const existingModal = document.getElementById("custom-modal-overlay");
    if (existingModal) existingModal.remove();

    const overlay = document.createElement("div");
    overlay.id = "custom-modal-overlay";
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(44, 26, 14, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: var(--sans), sans-serif;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
        background: #f8efdc;
        color: #2c1a0e;
        padding: 24px 28px;
        border-radius: 12px;
        width: 90%;
        max-width: 380px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        border: 1px solid #e3d5bb;
        text-align: center;
    `;

    box.innerHTML = `
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 12px; color: #2c1a0e;">Perhatian</h3>
        <p style="font-size: 14px; color: #5a4033; margin-bottom: 20px; line-height: 1.5;">${message}</p>
        <button id="modal-ok-btn" style="
            background: #2c1a0e;
            color: #f8efdc;
            border: none;
            padding: 8px 24px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
        ">OK</button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.getElementById("modal-ok-btn").addEventListener("click", function() {
        overlay.remove();
        if (typeof callback === 'function') callback();
    });
}

// --- CHECKOUT & PILIHAN METODE PEMBAYARAN ---
function showCheckoutModal(tableNumber, totalPrice, notes, cart, prices) {
    const existingModal = document.getElementById("custom-modal-overlay");
    if (existingModal) existingModal.remove();

    const overlay = document.createElement("div");
    overlay.id = "custom-modal-overlay";
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(44, 26, 14, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: var(--sans), sans-serif;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
        background: #f8efdc;
        color: #2c1a0e;
        padding: 24px 28px;
        border-radius: 12px;
        width: 90%;
        max-width: 420px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        border: 1px solid #e3d5bb;
    `;

    let itemsListHTML = '<ul style="text-align: left; font-size: 13px; margin: 10px 0; padding-left: 18px; color: #5a4033;">';
    for (let menu in cart) {
        itemsListHTML += `<li>${menu} (${cart[menu]}x)</li>`;
    }
    itemsListHTML += '</ul>';

    box.innerHTML = `
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px; text-align: center; color: #2c1a0e;">Konfirmasi Pembayaran</h3>
        <p style="font-size: 13px; color: #7a5c4c; text-align: center; margin-bottom: 14px;">Silakan periksa detail pesanan Anda di bawah ini.</p>
        
        <div style="background: #faf6ed; padding: 12px; border-radius: 8px; border: 1px solid #e3d5bb; margin-bottom: 16px;">
            <p style="font-size: 13px; margin-bottom: 4px;"><b>Nomor Meja:</b> ${tableNumber}</p>
            <p style="font-size: 13px; margin-bottom: 4px;"><b>Menu Dipesan:</b></p>
            ${itemsListHTML}
            <p style="font-size: 14px; margin-top: 8px; font-weight: bold; color: #2c1a0e;">Total Tagihan: Rp ${totalPrice.toLocaleString('id-ID')}</p>
            <p style="font-size: 12px; color: #7a5c4c; margin-top: 4px;"><b>Catatan:</b> ${notes ? notes : '-'}</p>
        </div>

        <div style="margin-bottom: 16px;">
            <label style="font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px;">Pilih Metode Pembayaran:</label>
            <div style="display: flex; gap: 12px;">
                <label style="flex: 1; display: flex; align-items: center; gap: 8px; background: #fff; padding: 8px 12px; border-radius: 6px; border: 1px solid #e3d5bb; cursor: pointer; font-size: 13px;">
                    <input type="radio" name="payment_method" value="QRIS" checked style="accent-color: #2c1a0e;"> QRIS
                </label>
                <label style="flex: 1; display: flex; align-items: center; gap: 8px; background: #fff; padding: 8px 12px; border-radius: 6px; border: 1px solid #e3d5bb; cursor: pointer; font-size: 13px;">
                    <input type="radio" name="payment_method" value="Cash" style="accent-color: #2c1a0e;"> Cash ke Kasir
                </label>
            </div>
        </div>

        <div style="display: flex; gap: 10px;">
            <button id="modal-cancel-btn" style="
                flex: 1;
                background: transparent;
                color: #2c1a0e;
                border: 1px solid #2c1a0e;
                padding: 8px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
            ">Batal</button>
            <button id="modal-confirm-btn" style="
                flex: 1;
                background: #2c1a0e;
                color: #f8efdc;
                border: none;
                padding: 8px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
            ">Kirim Pesanan</button>
        </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.getElementById("modal-cancel-btn").addEventListener("click", function() {
        overlay.remove();
    });

    document.getElementById("modal-confirm-btn").addEventListener("click", function() {
        const selectedMethod = document.querySelector('input[name="payment_method"]:checked').value;
        overlay.remove();

        if (selectedMethod === "QRIS") {
            showQrisModal(totalPrice);
        } else {
            // Jika Cash ke Kasir
            showCustomAlert("Pesanan berhasil dikirim ke dapur! Silakan lakukan pembayaran ke kasir.", function() {
                localStorage.removeItem("cart");
                localStorage.removeItem("cart_prices");
                updateCartCount();
                window.location.href = "index.html";
            });
        }
    });
}

// --- QRIS ---
function showQrisModal(totalPrice) {
    const existingModal = document.getElementById("custom-modal-overlay");
    if (existingModal) existingModal.remove();

    const overlay = document.createElement("div");
    overlay.id = "custom-modal-overlay";
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(44, 26, 14, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: var(--sans), sans-serif;
    `;

    const box = document.createElement("div");
    box.style.cssText = `
        background: #f8efdc;
        color: #2c1a0e;
        padding: 24px 28px;
        border-radius: 12px;
        width: 90%;
        max-width: 360px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        border: 1px solid #e3d5bb;
        text-align: center;
    `;

    box.innerHTML = `
        <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 6px; color: #2c1a0e;">Scan QRIS Pembayaran</h3>
        <p style="font-size: 13px; color: #7a5c4c; margin-bottom: 14px;">Total: <b>Rp ${totalPrice.toLocaleString('id-ID')}</b></p>
        
        <div style="background: #fff; padding: 12px; border-radius: 8px; border: 1px solid #e3d5bb; margin-bottom: 16px; display: inline-block;">
            <!-- GANTI src="img/qris.jpg" dengan path foto QRIS kamu nanti -->
            <img src="img/qris.jpg" alt="QRIS Taste of Nusantara" style="width: 200px; height: 200px; object-fit: contain; display: block; margin: 0 auto;" onerror="this.onerror=null; this.src='https://via.placeholder.10wu/200x200?text=Foto+QRIS+Belum+Ada';">
        </div>

        <p style="font-size: 12px; color: #5a4033; margin-bottom: 16px;">Silakan scan menggunakan m-Banking atau E-Wallet pilihan Anda.</p>

        <button id="qris-done-btn" style="
            background: #2c1a0e;
            color: #f8efdc;
            border: none;
            padding: 10px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            width: 100%;
        ">Saya Sudah Membayar</button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.getElementById("qris-done-btn").addEventListener("click", function() {
        overlay.remove();
        showCustomAlert("Pembayaran QRIS Berhasil! Pesanan Anda telah dikirim ke dapur Taste of Nusantara. Terima kasih!", function() {
            localStorage.removeItem("cart");
            localStorage.removeItem("cart_prices");
            updateCartCount();
            window.location.href = "index.html";
        });
    });
}


function showToast(menuName) {
    const existingToast = document.getElementById("custom-toast");
    if (existingToast) existingToast.remove();

    const toast = document.createElement("div");
    toast.id = "custom-toast";
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: #f8efdc;
        color: #2c1a0e;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(44, 26, 14, 0.12);
        display: flex;
        align-items: center;
        gap: 16px;
        font-family: var(--sans), sans-serif;
        font-size: 14px;
        z-index: 9999;
        transition: transform 0.3s ease, opacity 0.3s ease;
        opacity: 0;
        border: 1px solid #e3d5bb;
        white-space: nowrap;
    `;

    toast.innerHTML = `
        <span><b>${menuName}</b> ditambahkan ke Pesanan.</span>
        <button id="toast-undo" style="
            background: #2c1a0e;
            color: #f8efdc;
            border: none;
            padding: 5px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
        ">Urungkan</button>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = "translateX(-50%) translateY(0)";
        toast.style.opacity = "1";
    }, 10);

    const undoBtn = document.getElementById("toast-undo");
    if (undoBtn) {
        undoBtn.addEventListener("click", function () {
            let cart = JSON.parse(localStorage.getItem("cart")) || {};
            if (cart[menuName]) {
                if (cart[menuName] > 1) {
                    cart[menuName] -= 1;
                } else {
                    delete cart[menuName];
                }
                localStorage.setItem("cart", JSON.stringify(cart));
                updateCartCount();
            }
            hideToast(toast);
        });
    }

    const autoHideTimer = setTimeout(() => hideToast(toast), 3500);
    toast.dataset.timer = autoHideTimer;
}

function hideToast(toast) {
    if (!toast) return;
    clearTimeout(toast.dataset.timer);
    toast.style.transform = "translateX(-50%) translateY(100px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
}

// --- FUNGSI RENDER HALAMAN PESANAN ---
function renderCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    let prices = JSON.parse(localStorage.getItem("cart_prices")) || {};
    const cartContainer = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');

    if (!cartContainer) return;

    cartContainer.innerHTML = '';
    let totalPrice = 0;
    
    const menuKeys = Object.keys(cart).filter(key => isNaN(key));

    if (menuKeys.length === 0) {
        cartContainer.innerHTML = `
            <div style="padding: 32px; text-align: center; color: var(--muted); font-style: italic; background: #faf6ed; border-radius: 6px; border: 1px dashed var(--sand);">
                Keranjang pesanan masih kosong. Silakan pilih menu dari <a href="katalog.html" style="color: var(--rust); text-decoration: underline;">Our Menu</a>.
            </div>
        `;
        if (totalPriceSpan) totalPriceSpan.innerText = "Rp 0";
        updateCartCount();
        return;
    }

    menuKeys.forEach((menuName) => {
        const qty = cart[menuName];
        const price = prices[menuName] || 0;
        const subtotal = price * qty;
        totalPrice += subtotal;

        const card = document.createElement('div');
        card.style.cssText = "display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid var(--line); border-radius: 6px; background: #faf6ed; flex-wrap: wrap; gap: 12px;";
        
        card.innerHTML = `
            <div>
                <h4 style="font-weight: 600; color: var(--brown); font-size: 16px; margin-bottom: 4px;">${menuName}</h4>
                <p style="font-size: 13px; color: var(--muted);">Harga: Rp ${price.toLocaleString('id-ID')}</p>
            </div>
            
            <div style="display: flex; align-items: center; gap: 16px;">
                <div style="display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--sand); border-radius: 4px; padding: 4px 10px; background: #fff;">
                    <button type="button" onclick="changeQuantity('${menuName.replace(/'/g, "\\'")}', -1)" style="cursor: pointer; font-weight: bold; color: var(--muted); border: none; background: transparent;">-</button>
                    <span style="font-weight: 600; min-width: 20px; text-align: center;">${qty}</span>
                    <button type="button" onclick="changeQuantity('${menuName.replace(/'/g, "\\'")}', 1)" style="cursor: pointer; font-weight: bold; color: var(--muted); border: none; background: transparent;">+</button>
                </div>
                
                <span style="font-weight: 600; color: var(--brown); min-width: 100px; text-align: right;">Rp ${subtotal.toLocaleString('id-ID')}</span>
                
                <button type="button" onclick="removeItem('${menuName.replace(/'/g, "\\'")}')" style="background: #fee2e2; color: #991b1b; border: none; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;">Hapus</button>
            </div>
        `;
        cartContainer.appendChild(card);
    });

    if (totalPriceSpan) {
        totalPriceSpan.innerText = `Rp ${totalPrice.toLocaleString('id-ID')}`;
    }
    
    updateCartCount();
}

function changeQuantity(menuName, delta) {
    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    if (cart[menuName] !== undefined) {
        cart[menuName] += delta;
        if (cart[menuName] <= 0) {
            delete cart[menuName];
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}

function removeItem(menuName) {
    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    if (cart[menuName] !== undefined) {
        delete cart[menuName];
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }
}