document.addEventListener("DOMContentLoaded", function () {
  emailjs.init("DZMFq9s9L-xEkJFr2"); // Public Key kamu

  const form = document.getElementById("reportForm");
  const responseMsg = document.getElementById("reportResponse");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    responseMsg.textContent = "⏳ Mengirim laporan...";
    responseMsg.style.color = "#b0a8ff";

    emailjs.sendForm("service_1bq8jtn", "template_titgbol", this)
      .then(() => {
        responseMsg.innerHTML = "✅ Laporan berhasil dikirim! Terima kasih atas partisipasimu.";
        responseMsg.style.color = "#00ff90";
        form.reset();
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        responseMsg.innerHTML = "❌ Gagal mengirim laporan. Coba lagi atau periksa koneksi.";
        responseMsg.style.color = "#ff4b4b";
      });
  });
});
