document.addEventListener("DOMContentLoaded", function () {
    const formReservasi = document.getElementById("formReservasi");

    formReservasi.addEventListener("submit", function (event) {
        // Mencegah form memuat ulang halaman secara otomatis
        event.preventDefault();

        // Mengambil nilai dari setiap input
        const nama = document.getElementById("nama").value.trim();
        const tanggal = document.getElementById("tanggal").value;
        const jam = document.getElementById("jam").value;
        const jumlahOrang = document.getElementById("jumlah_orang").value;

        // Validasi: Pastikan semua kolom diisi
        if (!nama || !tanggal || !jam || !jumlahOrang) {
            alert("Validasi Gagal: Harap isi semua data reservasi terlebih dahulu.");
            return;
        }

        // Validasi: Pastikan jumlah orang sesuai kapasitas (maks 20)
        if (jumlahOrang < 1 || jumlahOrang > 20) {
            alert("Validasi Gagal: Kapasitas reservasi adalah 1 hingga maksimal 20 orang.");
            return;
        }

        // Jika validasi berhasil
        alert(`Validasi Berhasil!\n\nTerima kasih, ${nama}. Reservasi untuk ${jumlahOrang} orang pada tanggal ${tanggal} jam ${jam} siap dikirim.`);
        
        // Uncomment baris di bawah ini jika backend sudah siap untuk memproses data
        // formReservasi.submit();
    });
});