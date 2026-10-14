// Logika halaman auth (auth.html): tab, validasi inline, toggle sandi, submit.

(function () {
  'use strict';

  // ---------- Tab Masuk / Daftar ----------
  const tabs = Array.from(document.querySelectorAll('.auth-tab'));
  const panels = {
    masuk: document.getElementById('panel-masuk'),
    daftar: document.getElementById('panel-daftar')
  };
  const title = document.querySelector('.auth-title');
  const subtitle = document.getElementById('auth-sub');

  const COPY = {
    masuk: { title: 'Selamat datang kembali', sub: 'Masuk untuk melanjutkan pesanan Anda.' },
    daftar: { title: 'Buat akun Anda', sub: 'Daftar gratis dan simpan menu favorit Anda.' }
  };

  function activateTab(name, focus) {
    tabs.forEach(function (tab) {
      const on = tab.id === 'tab-' + name;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      if (on && focus) tab.focus();
    });

    Object.keys(panels).forEach(function (key) {
      panels[key].hidden = key !== name;
    });

    if (title) title.textContent = COPY[name].title;
    if (subtitle) subtitle.textContent = COPY[name].sub;
    clearStatus('masuk');
    clearStatus('daftar');
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      activateTab(tab.id.replace('tab-', ''), false);
    });

    tab.addEventListener('keydown', function (event) {
      const i = tabs.indexOf(tab);
      let next = null;
      if (event.key === 'ArrowRight') next = (i + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      if (next === null) return;
      event.preventDefault();
      activateTab(tabs[next].id.replace('tab-', ''), true);
    });
  });

  document.querySelectorAll('[data-goto]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      activateTab(btn.dataset.goto, true);
    });
  });

  // Lupa kata sandi: beri jalur pemulihan yang benar-benar bisa diikuti.
  document.querySelectorAll('[data-forgot]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const form = btn.closest('form');
      if (!form) return;
      showStatus(form, 'info',
        'Kami reset kata sandi lewat verifikasi manual. Hubungi kami di ' +
        '<strong>0812-3456-7890</strong> atau <strong>halo@tastenusantara.id</strong> ' +
        'dengan menyertakan email akun Anda (respons 1x24 jam).');
      form.querySelector('.auth-status').scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'center'
      });
    });
  });

  // ---------- Toggle lihat kata sandi ----------
  document.querySelectorAll('[data-pw-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const input = document.getElementById(btn.dataset.pwToggle);
      if (!input) return;
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(show));
      btn.setAttribute('aria-label', show ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi');
      btn.querySelector('.icon-eye').hidden = show;
      btn.querySelector('.icon-eye-off').hidden = !show;
      input.focus();
    });
  });

  // ---------- Validasi ----------
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(input, message) {
    const box = document.getElementById(input.id + '-err');
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      if (box) { box.textContent = message; box.classList.add('is-shown'); }
      return false;
    }
    input.removeAttribute('aria-invalid');
    if (box) { box.textContent = ''; box.classList.remove('is-shown'); }
    return true;
  }

  const RULES = {
    email: function (input) {
      const value = input.value.trim();
      if (!value) return 'Email wajib diisi.';
      return EMAIL_RE.test(value) ? '' : 'Format email belum benar, contoh: nama@email.com.';
    },
    password: function (input) {
      if (!input.value) return 'Kata sandi wajib diisi.';
      if (input.autocomplete === 'new-password' && input.value.length < 8) {
        return 'Kata sandi minimal 8 karakter.';
      }
      return '';
    },
    nama: function (input) {
      if (!input.value.trim()) return 'Nama lengkap wajib diisi.';
      return input.value.trim().length < 2 ? 'Nama terlalu pendek.' : '';
    },
    konfirmasi: function (input) {
      const source = document.getElementById('reg-password');
      if (!input.value) return 'Ulangi kata sandi Anda.';
      return input.value === source.value ? '' : 'Kata sandi tidak sama.';
    },
    setuju: function (input) {
      return input.checked ? '' : 'Anda perlu menyetujui syarat & ketentuan.';
    }
  };

  function validate(input) {
    const rule = RULES[input.name];
    if (!rule) return true;
    return setError(input, rule(input));
  }

  document.querySelectorAll('.auth-input, .auth-check input').forEach(function (input) {
    if (!RULES[input.name]) return;
    // Validasi saat fokus berpindah, bukan hanya saat submit
    input.addEventListener('blur', function () { validate(input); });
    input.addEventListener('change', function () {
      if (input.getAttribute('aria-invalid') === 'true') validate(input);
    });
    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') validate(input);
    });
  });

  // ---------- Kekuatan kata sandi (pendaftaran) ----------
  const regPassword = document.getElementById('reg-password');
  const meter = document.querySelector('.auth-meter');
  const strengthLabel = document.querySelector('[data-strength]');

  function strengthOf(value) {
    if (!value) return 0;
    let score = 0;
    if (value.length >= 8) score++;
    if (value.length >= 12) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^\w\s]/.test(value)) score++;
    if (value.length < 8) return 1;
    return Math.min(4, Math.max(1, score - 1));
  }

  if (regPassword && meter && strengthLabel) {
    const LABELS = ['-', 'lemah', 'cukup', 'baik', 'kuat'];
    regPassword.addEventListener('input', function () {
      const score = strengthOf(regPassword.value);
      meter.dataset.score = String(score);
      strengthLabel.textContent = LABELS[score];
    });
  }

  // ---------- Status submit ----------
  // Nama/email ditulis pengguna, jadi amankan sebelum masuk innerHTML.
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function showStatus(form, kind, html) {
    const box = form.querySelector('.auth-status');
    if (!box) return;
    box.className = 'auth-status is-shown is-' + kind;
    box.innerHTML = html;
  }

  function clearStatus(name) {
    const box = document.getElementById('status-' + name);
    if (box) { box.className = 'auth-status'; box.innerHTML = ''; }
  }

  function setLoading(button, on) {
    if (on) {
      button.disabled = true;
      button.dataset.busy = '1';
      button.innerHTML = '<span class="auth-spinner" aria-hidden="true"></span> Memproses...';
    } else {
      button.disabled = false;
      delete button.dataset.busy;
      button.textContent = button.dataset.label;
    }
  }

  function focusFirstInvalid(form) {
    const invalid = form.querySelector('[aria-invalid="true"]');
    if (invalid) invalid.focus();
  }

  // ---------- Submit ----------
  function handleSubmit(form, kind) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const fields = Array.from(form.querySelectorAll('.auth-input, .auth-check input'))
        .filter(function (input) { return RULES[input.name]; });

      let ok = true;
      fields.forEach(function (input) {
        if (!validate(input)) ok = false;
      });

      clearStatus(kind);

      if (!ok) {
        showStatus(form, 'err',
          'Beberapa isian belum benar. Periksa kembali kolom yang ditandai merah.');
        focusFirstInvalid(form);
        return;
      }

      const button = form.querySelector('.auth-submit');
      setLoading(button, true);

      // Backend belum ada: simulasi proses lalu tampilkan hasil.
      window.setTimeout(function () {
        setLoading(button, false);

        const email = form.querySelector('[name="email"]').value.trim();
        const namaField = form.querySelector('[name="nama"]');
        const nama = namaField ? namaField.value.trim() : '';

        try {
          localStorage.setItem('resto_session', JSON.stringify({
            email: email,
            nama: nama,
            at: Date.now()
          }));
        } catch (e) { /* localStorage tidak tersedia: abaikan */ }

        const sapaan = escapeHtml(nama ? nama.split(' ')[0] : email);
        showStatus(form, 'ok',
          (kind === 'masuk'
            ? 'Berhasil masuk sebagai <strong>' + sapaan + '</strong>. '
            : 'Akun untuk <strong>' + sapaan + '</strong> berhasil dibuat. ') +
          '<a href="katalog.html">Lanjut ke Menu &rarr;</a>');

        if (kind === 'daftar') {
          form.reset();
          if (meter && strengthLabel) {
            meter.dataset.score = '0';
            strengthLabel.textContent = '-';
          }
          form.querySelectorAll('[aria-invalid="true"]').forEach(function (input) {
            input.removeAttribute('aria-invalid');
          });
          form.querySelectorAll('.auth-error.is-shown').forEach(function (box) {
            box.classList.remove('is-shown');
            box.textContent = '';
          });
        }

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        form.querySelector('.auth-status').scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'center'
        });
      }, 900);
    });
  }

  const formMasuk = document.getElementById('form-masuk');
  const formDaftar = document.getElementById('form-daftar');
  if (formMasuk) handleSubmit(formMasuk, 'masuk');
  if (formDaftar) handleSubmit(formDaftar, 'daftar');
})();
