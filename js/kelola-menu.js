(function () {
  'use strict';

  var STORAGE_KEY = 'resto_menus_v1';
  var PAGE_SIZE = 8;

  var KATEGORI = ['Makanan Utama', 'Minuman', 'Makanan Penutup'];

  var SEED = [
    { id: 'MENU-001', nama: 'Rendang Daging', kategori: 'Makanan Utama', harga: 52000, foto: 'img/hero.jpg', status: 'on', deskripsi: 'Daging sapi dimasak santan dan rempah sampai mengering, disajikan dengan nasi hangat.' },
    { id: 'MENU-002', nama: 'Soto Betawi', kategori: 'Makanan Utama', harga: 38000, foto: 'img/soto-betawi.jpg', status: 'on', deskripsi: 'Kuah santan dan susu dengan kentang, tomat, dan daging potong.' },
    { id: 'MENU-003', nama: 'Ayam Goreng Lengkuas', kategori: 'Makanan Utama', harga: 42000, foto: 'img/ayam-goreng-lengkuas.jpg', status: 'on', deskripsi: 'Ayam goreng berbumbu lengkuas dan serai, disambal hijau di samping.' },
    { id: 'MENU-004', nama: 'Gulai Nangka Muda', kategori: 'Makanan Utama', harga: 36000, foto: 'img/gulai-nangka-muda.jpg', status: 'on', deskripsi: 'Nangka muda dimasak gulai kuning dengan daun kunyit.' },
    { id: 'MENU-005', nama: 'Nasi Goreng Kampung', kategori: 'Makanan Utama', harga: 34000, foto: 'img/nasi-goreng-kampung.jpg', status: 'on', deskripsi: 'Nasi goreng kecap dengan telur mata sapi, bawang goreng, dan acar.' },
    { id: 'MENU-006', nama: 'Ikan Bakar Dabu-Dabu', kategori: 'Makanan Utama', harga: 58000, foto: 'img/ikan-bakar-dabu-dabu.jpg', status: 'off', deskripsi: 'Ikan bakar arang disiram dabu-dabu tomat dan cabai segar.' },
    { id: 'MENU-007', nama: 'Es Cendol Dawet', kategori: 'Minuman', harga: 18000, foto: 'img/es-cendol-dawet.jpg', status: 'on', deskripsi: 'Cendol hijau, santan, dan gula aren disajikan es.' },
    { id: 'MENU-008', nama: 'Wedang Jahe', kategori: 'Minuman', harga: 16000, foto: 'img/wedang-jahe.jpg', status: 'on', deskripsi: 'Jahe merekah diseduh hangat dengan gula batu.' },
    { id: 'MENU-009', nama: 'Es Kelapa Muda', kategori: 'Minuman', harga: 15000, foto: 'img/es-kelapa-muda.jpg', status: 'on', deskripsi: 'Air dan daging kelapa muda, disajikan dingin.' },
    { id: 'MENU-010', nama: 'Es Teh', kategori: 'Minuman', harga: 14000, foto: 'img/Es-Teh.jpg', status: 'on', deskripsi: 'Teh Manis, disajikan panas atau dingin.' },
    { id: 'MENU-011', nama: 'Es Teler', kategori: 'Minuman', harga: 22000, foto: 'img/es-teler.jpg', status: 'on', deskripsi: 'Alpukat, kelapa muda, nangka, dan santan dengan es serut.' },
    { id: 'MENU-012', nama: 'Klepon Gula Aren', kategori: 'Makanan Penutup', harga: 15000, foto: 'img/klepon-gula-aren.jpg', status: 'on', deskripsi: 'Bola ketan berisi gula aren, dibalut parutan kelapa.' },
    { id: 'MENU-013', nama: 'Lupis', kategori: 'Makanan Penutup', harga: 16000, foto: 'img/lupis.jpg', status: 'on', deskripsi: 'Ketan pandan dengan gula aren cair dan kelapa parut.' },
    { id: 'MENU-014', nama: 'Bubur Sumsum', kategori: 'Makanan Penutup', harga: 17000, foto: 'img/bubur-sumsum.jpg', status: 'on', deskripsi: 'Bubur santan bertekstur lembut, disiram gula merah.' },
    { id: 'MENU-015', nama: 'Kue Lapis Tepung', kategori: 'Makanan Penutup', harga: 14000, foto: 'img/kue-lapis-tepung.jpg', status: 'on', deskripsi: 'Kue lapis berlapis, dikukus bertahap sampai matang.' }
  ];

  var ICON_PENCIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" class="size-[18px]"><path stroke-linecap="round" stroke-linejoin="round" d="M16.86 4.49l1.65-1.65a1.88 1.88 0 1 1 2.65 2.65L6.83 19.82a4.5 4.5 0 0 1-1.9 1.13l-2.68.8.8-2.68a4.5 4.5 0 0 1 1.13-1.9L16.86 4.49Z"/></svg>';
  var ICON_TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" class="size-[18px]"><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M8 6V4.75A1.75 1.75 0 0 1 9.75 3h4.5A1.75 1.75 0 0 1 16 4.75V6m3 0-.78 12.48A2.25 2.25 0 0 1 15.97 20.5H8.03a2.25 2.25 0 0 1-2.25-2.02L5 6"/></svg>';
  var ICON_PHOTO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" class="size-5 text-muted"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.16-5.16a1.5 1.5 0 0 1 2.12 0l1.41 1.41m0 0L12 12.75m-1.06-1.06 2.12-2.12m0 0 1.42 1.42a1.5 1.5 0 0 0 2.12 0l5.16-5.16M21 15a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9Z"/></svg>';
  var ICON_PHOTO_LG = ICON_PHOTO.replace('size-5 text-muted', 'size-7 text-muted');
  var ICON_CHEV_LEFT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/></svg>';
  var ICON_CHEV_RIGHT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" class="size-4"><path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5"/></svg>';

  var C = {
    tr: 'transition-color odd:bg-white even:bg-[#fdfaf3] hover:bg-[#f7efe0] motion-reduce:transition-none last:[&>th]:border-b-0 last:[&>td]:border-b-0',
    td: 'border-b border-line px-4 py-3 text-left align-middle',
    tdRight: 'border-b border-line px-4 py-3 text-right align-middle',
    thumbWrap: 'grid size-11 place-items-center overflow-hidden rounded-md border border-line bg-sand',
    thumbImg: 'block size-full object-cover',
    name: 'block text-[15px] font-semibold text-brown',
    id: 'mt-0.5 block text-[11.5px] tracking-[.03em] text-muted tabular-nums',
    desc: 'mt-1 line-clamp-1 block text-[13px] leading-normal text-muted',
    meta: 'mt-[7px] hidden flex-wrap gap-x-2 gap-y-1.5 max-[560px]:flex',
    catChip: 'inline-flex items-center rounded-full bg-sky-chip px-2.5 py-1 text-xs font-semibold whitespace-nowrap text-navy',
    price: 'font-semibold whitespace-nowrap tabular-nums text-brown',
    rowHead: 'font-normal',
    status: 'inline-flex items-center gap-[7px] text-[12.5px] font-semibold whitespace-nowrap',
    statusOn: 'inline-flex items-center gap-[7px] text-[12.5px] font-semibold whitespace-nowrap text-ok-text',
    statusOff: 'inline-flex items-center gap-[7px] text-[12.5px] font-semibold whitespace-nowrap text-muted',
    dotOn: 'size-2 flex-none rounded-full bg-ok shadow-[0_0_0_3px_rgba(47,125,58,0.16)]',
    dotOff: 'size-2 flex-none rounded-full bg-off shadow-[0_0_0_3px_rgba(160,142,120,0.18)]',
    actions: 'flex justify-end gap-1.5',
    iconBtn: 'grid size-11 cursor-pointer place-items-center rounded-lg border border-line bg-white text-muted transition-colors hover:border-rust hover:bg-rust-tint hover:text-rust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust motion-reduce:transition-none',
    iconBtnDanger: 'grid size-11 cursor-pointer place-items-center rounded-lg border border-line bg-white text-muted transition-colors hover:border-danger hover:bg-danger-tint hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust motion-reduce:transition-none',
    pageBtn: 'grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-lg border border-line bg-white text-[13px] text-muted transition-colors hover:border-rust hover:text-rust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust motion-reduce:transition-none [aria-disabled=true]:not([aria-current=page]):cursor-not-allowed [aria-disabled=true]:not([aria-current=page]):opacity-45 [aria-current=page]:border-rust [aria-current=page]:bg-rust [aria-current=page]:text-white',
    pageDots: 'inline-grid h-[34px] min-w-[34px] place-items-center text-[13px] text-muted',
    emptyRow: 'hover:bg-transparent',
    emptyCell: 'px-5 py-9 text-center',
    emptyBox: 'grid justify-items-center gap-2 text-center',
    emptyIcon: 'size-[34px] text-[#c4b298]',
    emptyTitle: 'mt-1 text-base font-semibold text-brown',
    emptyDesc: 'm-0 text-sm leading-relaxed text-muted',
    ghostBtn: 'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-white px-[18px] py-2.5 text-[14.5px] font-semibold text-brown transition-colors hover:border-rust hover:bg-rust-tint hover:text-rust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust motion-reduce:transition-none',
    toast: 'mb-4 rounded-lg border px-[15px] py-3 text-sm font-medium leading-relaxed',
    toastOk: 'border-[#a6cfae] bg-ok-tint text-ok-text',
    toastErr: 'border-[#e4b4ae] bg-danger-tint text-[#8a1c12]',
    toastWarn: 'border-[#dfc07a] bg-warn-tint text-warn'
  };


  var els = {
    body: document.getElementById('menu-body'),
    pageInfo: document.getElementById('page-info'),
    pagination: document.getElementById('pagination'),
    cari: document.getElementById('cari'),
    urut: document.getElementById('urut'),
    chips: document.getElementById('filter-chips'),
    toast: document.getElementById('toast'),
    statTotal: document.getElementById('stat-total'),
    statOn: document.getElementById('stat-on'),
    statOff: document.getElementById('stat-off'),
    statKat: document.getElementById('stat-kat'),
    btnTambah: document.getElementById('btn-tambah'),
    btnReset: document.getElementById('btn-reset'),
    dlgMenu: document.getElementById('dlg-menu'),
    dlgKonfirmasi: document.getElementById('dlg-konfirmasi'),
    form: document.getElementById('form-menu'),
    dlgMenuTitle: document.getElementById('dlg-menu-title'),
    formId: document.getElementById('form-id'),
    btnSimpanLabel: document.getElementById('btn-simpan-label'),
    fNama: document.getElementById('f-nama'),
    fKategori: document.getElementById('f-kategori'),
    fHarga: document.getElementById('f-harga'),
    fFoto: document.getElementById('f-foto'),
    fDeskripsi: document.getElementById('f-deskripsi'),
    fotoPreview: document.getElementById('foto-preview'),
    konfirmasiTitle: document.getElementById('dlg-konfirmasi-title'),
    konfirmasiDesc: document.getElementById('dlg-konfirmasi-desc'),
    btnKonfirmasiYa: document.getElementById('btn-konfirmasi-ya')
  };

  var state = {
    menus: [],
    q: '',
    kategori: 'semua',
    urut: 'nama',
    halaman: 1
  };

  var editingId = null;
  var pendingConfirm = null;
  var lastTrigger = null;
  var focusAfterRender = null;

  /* ---------- util ---------- */

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatRupiah(n) {
    return 'Rp ' + Number(n).toLocaleString('id-ID');
  }

  function cloneSeed() {
    return SEED.map(function (m) { return Object.assign({}, m); });
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return cloneSeed();
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return cloneSeed();
      return parsed.filter(function (m) {
        return m && typeof m.id === 'string' && typeof m.nama === 'string';
      }).map(function (m) {
        return {
          id: String(m.id),
          nama: String(m.nama),
          kategori: KATEGORI.indexOf(m.kategori) > -1 ? m.kategori : 'Makanan Utama',
          harga: Number(m.harga) || 0,
          foto: typeof m.foto === 'string' ? m.foto : '',
          status: m.status === 'off' ? 'off' : 'on',
          deskripsi: typeof m.deskripsi === 'string' ? m.deskripsi : ''
        };
      });
    } catch (err) {
      return cloneSeed();
    }
  }

  function save() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.menus));
      return true;
    } catch (err) {
      toast('is-err', 'Perubahan tidak dapat disimpan (localStorage diblokir peramban).');
      return false;
    }
  }

  var TOAST_TONE = {
    'is-ok': C.toastOk,
    'is-err': C.toastErr,
    'is-warn': C.toastWarn
  };

  function toast(kind, message) {
    els.toast.className = C.toast + ' ' + (TOAST_TONE[kind] || C.toastOk);
    els.toast.textContent = message;
    els.toast.hidden = false;
  }

  function nextId() {
    var max = 0;
    state.menus.forEach(function (m) {
      var n = parseInt(String(m.id).replace(/\D/g, ''), 10);
      if (!isNaN(n) && n > max) max = n;
    });
    return 'MENU-' + String(max + 1).padStart(3, '0');
  }

  /* ---------- data pipeline ---------- */

  function visible() {
    var q = state.q.trim().toLowerCase();
    var list = state.menus.filter(function (m) {
      var cocokKat = state.kategori === 'semua' ||
        m.kategori.toLowerCase() === state.kategori;
      var cocokQ = !q ||
        m.nama.toLowerCase().indexOf(q) > -1 ||
        m.kategori.toLowerCase().indexOf(q) > -1 ||
        m.deskripsi.toLowerCase().indexOf(q) > -1;
      return cocokKat && cocokQ;
    });

    list.sort(function (a, b) {
      if (state.urut === 'harga-asc') return a.harga - b.harga;
      if (state.urut === 'harga-desc') return b.harga - a.harga;
      if (state.urut === 'kategori') {
        var d = KATEGORI.indexOf(a.kategori) - KATEGORI.indexOf(b.kategori);
        if (d !== 0) return d;
      }
      return a.nama.localeCompare(b.nama, 'id');
    });

    return list;
  }

  /* ---------- render ---------- */

  function renderStats() {
    var total = state.menus.length;
    var on = state.menus.filter(function (m) { return m.status === 'on'; }).length;
    var kats = {};
    state.menus.forEach(function (m) { kats[m.kategori] = true; });

    els.statTotal.textContent = String(total);
    els.statOn.textContent = String(on);
    els.statOff.textContent = String(total - on);
    els.statKat.textContent = String(Object.keys(kats).length);
  }

  function thumbHtml(foto) {
    if (!foto) return ICON_PHOTO;
    return '<img data-thumb class="' + C.thumbImg + '" src="' + escapeHtml(foto) + '" alt="" width="44" height="44" loading="lazy">';
  }

  function statusHtml(m) {
    return m.status === 'on'
      ? '<span class="' + C.statusOn + '"><span class="' + C.dotOn + '" aria-hidden="true"></span>Tersedia</span>'
      : '<span class="' + C.statusOff + '"><span class="' + C.dotOff + '" aria-hidden="true"></span>Nonaktif</span>';
  }

  function rowHtml(m) {
    return '<tr data-id="' + escapeHtml(m.id) + '" class="' + C.tr + '">' +
      '<td class="max-[760px]:hidden ' + C.td + '"><span class="' + C.thumbWrap + '">' + thumbHtml(m.foto) + '</span></td>' +
      '<th scope="row" class="' + C.td + ' ' + C.rowHead + '">' +
        '<span class="' + C.name + '">' + escapeHtml(m.nama) + '</span>' +
        '<span class="' + C.id + '">' + escapeHtml(m.id) + '</span>' +
        (m.deskripsi ? '<span class="' + C.desc + '">' + escapeHtml(m.deskripsi) + '</span>' : '') +
        '<span class="' + C.meta + '">' +
          '<span class="' + C.catChip + '">' + escapeHtml(m.kategori) + '</span>' +
          statusHtml(m) +
        '</span>' +
      '</th>' +
      '<td class="max-[560px]:hidden ' + C.td + '"><span class="' + C.catChip + '">' + escapeHtml(m.kategori) + '</span></td>' +
      '<td class="' + C.tdRight + '"><span class="' + C.price + '">' + formatRupiah(m.harga) + '</span></td>' +
      '<td class="max-[560px]:hidden ' + C.td + '">' + statusHtml(m) + '</td>' +
      '<td class="' + C.tdRight + '">' +
        '<div class="' + C.actions + '">' +
          '<button type="button" class="' + C.iconBtn + '" data-action="edit" data-id="' + escapeHtml(m.id) + '" ' +
            'aria-label="Ubah ' + escapeHtml(m.nama) + '" title="Ubah">' + ICON_PENCIL + '</button>' +
          '<button type="button" class="' + C.iconBtnDanger + '" data-action="delete" data-id="' + escapeHtml(m.id) + '" ' +
            'aria-label="Hapus ' + escapeHtml(m.nama) + '" title="Hapus">' + ICON_TRASH + '</button>' +
        '</div>' +
      '</td>' +
    '</tr>';
  }

  function emptyHtml() {
    var terfilter = state.q.trim() !== '' || state.kategori !== 'semua';
    return '<tr class="' + C.emptyRow + '"><td colspan="6" class="' + C.emptyCell + '">' +
      '<div class="' + C.emptyBox + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" class="' + C.emptyIcon + '">' +
          '<path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5 12 15.75 3.75 7.5m16.5 0H3.75m16.5 0V18a1.5 1.5 0 0 1-1.5 1.5h-13.5A1.5 1.5 0 0 1 3.75 18V7.5m0 0A1.5 1.5 0 0 1 5.25 6h13.5a1.5 1.5 0 0 1 1.5 1.5Z"/>' +
        '</svg>' +
        (terfilter
          ? '<p class="' + C.emptyTitle + '">Tidak ada menu yang cocok</p>' +
            '<p class="' + C.emptyDesc + '">Coba ubah kata kunci pencarian atau pilih kategori "Semua".</p>' +
            '<button type="button" class="' + C.ghostBtn + '" data-action="reset-filter">Atur ulang filter</button>'
          : '<p class="' + C.emptyTitle + '">Belum ada menu</p>' +
            '<p class="' + C.emptyDesc + '">Daftar masih kosong. Mulai dengan menambahkan menu pertama.</p>' +
            '<button type="button" class="' + C.ghostBtn + '" data-action="focus-tambah">Tambah menu</button>') +
      '</div></td></tr>';
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      els.pagination.innerHTML = '';
      els.pagination.hidden = true;
      return;
    }
    els.pagination.hidden = false;

    var current = state.halaman;
    var pages = [];
    var i;
    if (totalPages <= 6) {
      for (i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push('…');
      for (i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) pages.push(i);
      if (current < totalPages - 2) pages.push('…');
      pages.push(totalPages);
    }

    var html = '<button type="button" class="' + C.pageBtn + '" data-page="prev" aria-label="Halaman sebelumnya" ' +
      'title="Halaman sebelumnya"' + (current === 1 ? ' aria-disabled="true"' : '') + '>' + ICON_CHEV_LEFT + '</button>';

    pages.forEach(function (p) {
      if (p === '…') {
        html += '<span class="' + C.pageDots + '" aria-hidden="true">…</span>';
        return;
      }
      var isCurrent = p === current;
      html += '<button type="button" class="' + C.pageBtn + '" data-page="' + p + '" ' +
        (isCurrent ? 'aria-current="page" aria-disabled="true"' : 'aria-label="Halaman ' + p + '" title="Halaman ' + p + '"') +
        '>' + p + '</button>';
    });

    html += '<button type="button" class="' + C.pageBtn + '" data-page="next" aria-label="Halaman berikutnya" ' +
      'title="Halaman berikutnya"' + (current === totalPages ? ' aria-disabled="true"' : '') + '>' + ICON_CHEV_RIGHT + '</button>';

    els.pagination.innerHTML = html;
  }

  function restoreFocus() {
    if (!focusAfterRender) return;
    var selector = focusAfterRender;
    focusAfterRender = null;
    var target = document.querySelector(selector);
    if (!target) target = els.btnTambah;
    if (target) target.focus();
  }

  function render() {
    var list = visible();
    var totalItems = list.length;
    var totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    if (state.halaman > totalPages) state.halaman = totalPages;
    if (state.halaman < 1) state.halaman = 1;

    var start = (state.halaman - 1) * PAGE_SIZE;
    var pageItems = list.slice(start, start + PAGE_SIZE);

    renderStats();

    if (pageItems.length === 0) {
      els.body.innerHTML = emptyHtml();
    } else {
      els.body.innerHTML = pageItems.map(rowHtml).join('');
    }

    if (totalItems === 0) {
      els.pageInfo.textContent = 'Tidak ada menu untuk ditampilkan';
    } else {
      els.pageInfo.textContent = 'Menampilkan ' + (start + 1) + '–' + (start + pageItems.length) +
        ' dari ' + totalItems + ' menu';
    }

    renderPagination(totalPages);

    Array.prototype.forEach.call(els.body.querySelectorAll('img[data-thumb]'), function (img) {
      img.addEventListener('error', function () {
        var wrap = img.closest('span');
        if (wrap) wrap.innerHTML = ICON_PHOTO;
      }, { once: true });
    });

    restoreFocus();
  }

  /* ---------- form + validation ---------- */

  var fields = {
    nama: { el: els.fNama, err: document.getElementById('f-nama-err') },
    kategori: { el: els.fKategori, err: document.getElementById('f-kategori-err') },
    harga: { el: els.fHarga, err: document.getElementById('f-harga-err') },
    foto: { el: els.fFoto, err: document.getElementById('f-foto-err') },
    deskripsi: { el: els.fDeskripsi, err: document.getElementById('f-deskripsi-err') }
  };

  function setError(name, message) {
    var f = fields[name];
    if (!f) return;
    if (message) {
      f.err.textContent = message;
      f.err.hidden = false;
      f.el.setAttribute('aria-invalid', 'true');
    } else {
      f.err.textContent = '';
      f.err.hidden = true;
      f.el.removeAttribute('aria-invalid');
    }
  }

  function clearAllErrors() {
    Object.keys(fields).forEach(function (name) { setError(name, ''); });
  }

  function validateNama() {
    var value = els.fNama.value.trim();
    if (!value) {
      setError('nama', 'Nama menu wajib diisi.');
      return false;
    }
    if (value.length < 2) {
      setError('nama', 'Nama menu minimal 2 karakter.');
      return false;
    }
    var dup = state.menus.some(function (m) {
      return m.id !== editingId && m.nama.toLowerCase() === value.toLowerCase();
    });
    if (dup) {
      setError('nama', 'Nama menu sudah digunakan.');
      return false;
    }
    setError('nama', '');
    return true;
  }

  function validateKategori() {
    var value = els.fKategori.value;
    if (KATEGORI.indexOf(value) === -1) {
      setError('kategori', 'Pilih salah satu kategori.');
      return false;
    }
    setError('kategori', '');
    return true;
  }

  function validateHarga() {
    var raw = els.fHarga.value.trim();
    if (raw === '') {
      setError('harga', 'Harga wajib diisi.');
      return false;
    }
    var value = Number(raw);
    if (!Number.isFinite(value) || !Number.isInteger(value)) {
      setError('harga', 'Harga harus berupa bilangan bulat.');
      return false;
    }
    if (value < 1) {
      setError('harga', 'Harga harus lebih dari Rp 0.');
      return false;
    }
    if (value > 10000000) {
      setError('harga', 'Harga maksimal Rp 10.000.000.');
      return false;
    }
    setError('harga', '');
    return true;
  }

  function validateFoto() {
    var value = els.fFoto.value.trim();
    if (value && !/\.(jpe?g|png|webp|avif|gif)$/i.test(value) && !/^https?:\/\//i.test(value)) {
      setError('foto', 'Nama berkas harus berakhir dengan .jpg, .png, .webp, .avif, atau .gif.');
      return false;
    }
    setError('foto', '');
    return true;
  }

  function validateDeskripsi() {
    var value = els.fDeskripsi.value.trim();
    if (value.length > 160) {
      setError('deskripsi', 'Deskripsi maksimal 160 karakter.');
      return false;
    }
    setError('deskripsi', '');
    return true;
  }

  function validateAll() {
    var okNama = validateNama();
    var okKat = validateKategori();
    var okHarga = validateHarga();
    var okFoto = validateFoto();
    var okDesc = validateDeskripsi();
    return okNama && okKat && okHarga && okFoto && okDesc;
  }

  function setFotoPreview(path) {
    els.fotoPreview.innerHTML = (path && path.trim())
      ? '<img data-thumb class="' + C.thumbImg + '" src="' + escapeHtml(path.trim()) + '" alt="" width="72" height="72">'
      : ICON_PHOTO_LG;
    var img = els.fotoPreview.querySelector('img');
    if (img) {
      img.addEventListener('error', function () { els.fotoPreview.innerHTML = ICON_PHOTO_LG; }, { once: true });
    }
  }

  function openMenuDialog(id) {
    editingId = id || null;
    lastTrigger = document.activeElement;
    clearAllErrors();

    var menu = id ? state.menus.filter(function (m) { return m.id === id; })[0] : null;

    if (menu) {
      els.dlgMenuTitle.textContent = 'Ubah Menu';
      els.btnSimpanLabel.textContent = 'Simpan perubahan';
      els.formId.hidden = false;
      els.formId.textContent = 'ID ' + menu.id;
      els.fNama.value = menu.nama;
      els.fKategori.value = menu.kategori;
      els.fHarga.value = String(menu.harga);
      els.fFoto.value = menu.foto;
      els.fDeskripsi.value = menu.deskripsi;
      var radio = els.form.querySelector('input[name="status"][value="' + menu.status + '"]');
      if (radio) radio.checked = true;
    } else {
      els.dlgMenuTitle.textContent = 'Tambah Menu';
      els.btnSimpanLabel.textContent = 'Simpan menu';
      els.formId.hidden = true;
      els.formId.textContent = '';
      els.form.reset();
      els.fKategori.value = 'Makanan Utama';
      var onRadio = els.form.querySelector('input[name="status"][value="on"]');
      if (onRadio) onRadio.checked = true;
    }

    setFotoPreview(els.fFoto.value);
    els.dlgMenu.showModal();
    els.fNama.focus();
  }

  function submitForm(event) {
    event.preventDefault();
    if (!validateAll()) {
      var firstInvalid = els.form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var data = {
      nama: els.fNama.value.trim(),
      kategori: els.fKategori.value,
      harga: Number(els.fHarga.value),
      foto: els.fFoto.value.trim(),
      status: (els.form.querySelector('input[name="status"]:checked') || {}).value === 'off' ? 'off' : 'on',
      deskripsi: els.fDeskripsi.value.trim()
    };

    if (editingId) {
      state.menus = state.menus.map(function (m) {
        if (m.id !== editingId) return m;
        return Object.assign({}, m, data);
      });
      save();
      focusAfterRender = 'tr[data-id="' + editingId + '"] [data-action="edit"]';
      els.dlgMenu.close();
      render();
      toast('is-ok', 'Menu "' + data.nama + '" berhasil diubah.');
    } else {
      var newMenu = Object.assign({ id: nextId() }, data);
      state.menus.push(newMenu);
      save();
      var index = visible().map(function (m) { return m.id; }).indexOf(newMenu.id);
      var terlihat = index > -1;
      if (terlihat) state.halaman = Math.floor(index / PAGE_SIZE) + 1;
      focusAfterRender = terlihat
        ? 'tr[data-id="' + newMenu.id + '"] [data-action="edit"]'
        : null;
      els.dlgMenu.close();
      render();
      toast(terlihat ? 'is-ok' : 'is-warn',
        terlihat
          ? 'Menu "' + data.nama + '" ditambahkan sebagai ' + newMenu.id + '.'
          : 'Menu "' + data.nama + '" ditambahkan sebagai ' + newMenu.id +
            ', tetapi tersembunyi oleh filter yang sedang aktif.');
    }

    editingId = null;
  }

  /* ---------- confirm dialog ---------- */

  var BTN_DANGER = 'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-danger bg-danger px-[18px] py-2.5 text-[14.5px] font-semibold text-white transition-colors hover:border-danger-dark hover:bg-danger-dark focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brown motion-reduce:transition-none max-[560px]:flex-1';
  var BTN_NEUTRAL = 'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-line bg-white px-[18px] py-2.5 text-[14.5px] font-semibold text-brown transition-colors hover:border-rust hover:bg-rust-tint hover:text-rust focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-rust motion-reduce:transition-none max-[560px]:flex-1';

  function askConfirm(options) {
    lastTrigger = document.activeElement;
    pendingConfirm = options.onConfirm;
    els.konfirmasiTitle.textContent = options.title;
    els.konfirmasiDesc.innerHTML = options.desc;
    els.btnKonfirmasiYa.textContent = options.confirmLabel;
    els.btnKonfirmasiYa.className = options.danger === false ? BTN_NEUTRAL : BTN_DANGER;
    els.dlgKonfirmasi.showModal();
    els.btnKonfirmasiYa.focus();
  }

  function closeDialog(dialog) {
    if (dialog.open) dialog.close();
  }

  function onDialogClose() {
    if (lastTrigger && document.contains(lastTrigger)) {
      lastTrigger.focus();
    }
    lastTrigger = null;
    pendingConfirm = null;
  }

  /* ---------- events ---------- */

  els.btnTambah.addEventListener('click', function () { openMenuDialog(null); });

  els.btnReset.addEventListener('click', function () {
    askConfirm({
      title: 'Reset data awal?',
      desc: 'Seluruh perubahan Anda akan diganti dengan 15 menu bawaan. ' +
        'Tindakan ini menghapus data di peramban ini.',
      confirmLabel: 'Ya, reset',
      onConfirm: function () {
        state.menus = cloneSeed();
        state.q = '';
        state.kategori = 'semua';
        state.urut = 'nama';
        state.halaman = 1;
        els.cari.value = '';
        els.urut.value = 'nama';
        setChipActive('semua');
        save();
        render();
        toast('is-ok', 'Data dikembalikan ke 15 menu awal.');
      }
    });
  });

  els.cari.addEventListener('input', function () {
    state.q = els.cari.value;
    state.halaman = 1;
    render();
  });

  els.urut.addEventListener('change', function () {
    state.urut = els.urut.value;
    state.halaman = 1;
    render();
  });

  function setChipActive(kategori) {
    Array.prototype.forEach.call(els.chips.querySelectorAll('.chip'), function (chip) {
      var active = chip.getAttribute('data-kategori') === kategori;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  els.chips.addEventListener('click', function (event) {
    var chip = event.target.closest('.chip');
    if (!chip) return;
    state.kategori = chip.getAttribute('data-kategori');
    state.halaman = 1;
    setChipActive(state.kategori);
    render();
  });

  els.body.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-action]');
    if (!btn) return;
    var action = btn.getAttribute('data-action');

    if (action === 'reset-filter') {
      state.q = '';
      state.kategori = 'semua';
      state.halaman = 1;
      els.cari.value = '';
      setChipActive('semua');
      render();
      els.cari.focus();
      return;
    }

    if (action === 'focus-tambah') {
      els.btnTambah.focus();
      return;
    }

    var id = btn.getAttribute('data-id');
    var menu = state.menus.filter(function (m) { return m.id === id; })[0];
    if (!menu) return;

    if (action === 'edit') {
      openMenuDialog(id);
      return;
    }

    if (action === 'delete') {
      var index = visible().indexOf(menu);
      askConfirm({
        title: 'Hapus menu?',
        desc: 'Menu <strong>' + escapeHtml(menu.nama) + '</strong> (' + escapeHtml(menu.id) + ') ' +
          'akan dihapus dari daftar di peramban ini. Tindakan ini tidak dapat dibatalkan.',
        confirmLabel: 'Ya, hapus',
        onConfirm: function () {
          state.menus = state.menus.filter(function (m) { return m.id !== id; });
          save();
          var remaining = Math.max(1, Math.ceil(visible().length / PAGE_SIZE));
          if (state.halaman > remaining) state.halaman = remaining;
          var rows = els.body.querySelectorAll('tr[data-id]');
          var target = rows[Math.min(index, rows.length - 1)];
          focusAfterRender = target
            ? 'tr[data-id="' + target.getAttribute('data-id') + '"] [data-action="edit"]'
            : '[data-action="reset-filter"]';
          render();
          toast('is-ok', 'Menu "' + menu.nama + '" dihapus.');
        }
      });
    }
  });

  els.pagination.addEventListener('click', function (event) {
    var btn = event.target.closest('[data-page]');
    if (!btn || btn.getAttribute('aria-disabled') === 'true') return;
    var totalPages = Math.max(1, Math.ceil(visible().length / PAGE_SIZE));
    var target = btn.getAttribute('data-page');
    if (target === 'prev') state.halaman = Math.max(1, state.halaman - 1);
    else if (target === 'next') state.halaman = Math.min(totalPages, state.halaman + 1);
    else state.halaman = parseInt(target, 10);
    render();
    var currentBtn = els.pagination.querySelector('[data-page][aria-current="page"]');
    if (currentBtn) currentBtn.focus();
  });

  els.form.addEventListener('submit', submitForm);

  fields.nama.el.addEventListener('blur', validateNama);
  fields.kategori.el.addEventListener('blur', validateKategori);
  fields.harga.el.addEventListener('blur', validateHarga);
  fields.foto.el.addEventListener('blur', validateFoto);
  fields.deskripsi.el.addEventListener('blur', validateDeskripsi);

  els.fFoto.addEventListener('input', function () { setFotoPreview(els.fFoto.value); });

  Array.prototype.forEach.call(document.querySelectorAll('[data-close]'), function (btn) {
    btn.addEventListener('click', function () {
      var dialog = btn.closest('dialog');
      if (dialog) closeDialog(dialog);
    });
  });

  [els.dlgMenu, els.dlgKonfirmasi].forEach(function (dialog) {
    dialog.addEventListener('close', onDialogClose);
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) closeDialog(dialog);
    });
  });

  els.btnKonfirmasiYa.addEventListener('click', function () {
    var action = pendingConfirm;
    closeDialog(els.dlgKonfirmasi);
    if (typeof action === 'function') action();
  });

  /* ---------- init ---------- */

  state.menus = load();
  render();
})();
