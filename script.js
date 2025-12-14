document.addEventListener('DOMContentLoaded', () => {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current) a.classList.add('active');
  });

  document.querySelectorAll('.nav-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = document.querySelector('.main-nav');
      if (!nav) return;
      nav.style.display = (nav.style.display === 'flex') ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '10px';
      nav.style.padding = '12px';
      nav.style.background = 'linear-gradient(180deg, rgba(26,0,31,0.95), rgba(11,11,11,0.95))';
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('inview');
    });
  }, {threshold: 0.12});
  document.querySelectorAll('.card, .playlist-item, .news-card').forEach(el => io.observe(el));

  const chips = document.querySelectorAll('.chip');
  const videos = document.querySelectorAll('.playlist-item');

  if (chips.length && videos.length) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.dataset.category;
        videos.forEach(v => {
          if (cat === 'all' || v.dataset.category === cat) v.style.display = '';
          else v.style.display = 'none';
        });
      });
    });
  }

  const form = document.getElementById('reportForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const resp = document.getElementById('reportResponse');
      resp.textContent = '';

      const fd = new FormData(form);
      const payload = {};
      fd.forEach((v,k) => payload[k]=v);

      payload.reference = 'MC-' + new Date().toISOString().replace(/[-:.TZ]/g,'').slice(0,14);

      if (window.EMAILJS && EMAILJS.PUBLIC_KEY && EMAILJS.SERVICE_ID && EMAILJS.TEMPLATE_ID) {
        try {
          emailjs.init(EMAILJS.PUBLIC_KEY);
          emailjs.send(EMAILJS.SERVICE_ID, EMAILJS.TEMPLATE_ID, payload)
            .then(() => {
              resp.textContent = `✅ Laporan terkirim. Nomor referensi: ${payload.reference}`;
              form.reset();
            }).catch(err => {
              console.error('EmailJS send error', err);
              resp.textContent = '❌ Gagal mengirim via EmailJS. Membuka email client sebagai fallback.';
              fallbackMail(payload);
            });
        } catch (err) {
          console.warn('EmailJS init/send failed', err);
          fallbackMail(payload);
        }
      } else {
        fallbackMail(payload);
      }
    });
  }

  function fallbackMail(data) {
    const to = 'albertsinurat861@gmail.com';
    const subject = encodeURIComponent('Laporan Praktik Keuangan - Mesin Cuan');
    let body = '';
    body += `Referensi: ${data.reference || '-'}%0D%0A`;
    body += `Nama: ${data.nama || '-'}%0D%0AEmail: ${data.email || '-'}%0D%0AAnonym: ${data.anonim ? 'Ya' : 'Tidak'}%0D%0A%0D%0A`;
    body += `Jenis: ${data.jenis || '-'}%0D%0A%0D%0ADeskripsi:%0D%0A${encodeURIComponent(data.deskripsi || '-')}%0D%0A%0D%0A`;
    body += `Link Bukti: ${data.link_bukti || '-'}%0D%0ADetail pihak: ${data.pihak || '-'}%0D%0ALokasi: ${data.lokasi || '-'}%0D%0ATanggal: ${data.tanggal || '-'}%0D%0AKerugian: ${data.kerugian || '-'}`;
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    const resp = document.getElementById('reportResponse');
    if (resp) resp.textContent = 'Membuka email client (fallback mailto)...';
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      alert('Login (simulasi) berhasil — redirect ke Home.');
      window.location.href = 'index.html';
    });
  }
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const pw = registerForm.password.value;
      const pw2 = registerForm.password2.value;
      if (pw !== pw2) return alert('Password & konfirmasi tidak cocok.');
      alert('Registrasi (simulasi) berhasil — silakan login.');
      window.location.href = 'login.html';
    });
  }
});
