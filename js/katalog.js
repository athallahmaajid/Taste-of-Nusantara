function filterMenu(kategori) {
    const semuaCard = document.querySelectorAll(".menu-card");
    const semuaTombol = document.querySelectorAll(".filter-btn");

    semuaCard.forEach(function(card) {
        const label = card.querySelector(".kategori");
        const kategoriMenu = label.textContent.trim().toLowerCase();

        if (kategori === "semua" || kategoriMenu === kategori) {
            card.style.display = "";

            card.classList.remove("fade-up");
            void card.offsetWidth;
            card.classList.add("fade-up");
        } else {
            card.style.display = "none";
            card.classList.remove("fade-up");
        }
    });

    semuaTombol.forEach(function(tombol) {
        tombol.classList.remove("aktif");
    });

    const tombolAktif = document.querySelector(
        `[data-filter="${kategori}"]`
    );

    if (tombolAktif) {
        tombolAktif.classList.add("aktif");
    }
}
