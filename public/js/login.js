document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const msg = document.getElementById("loginMessage");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        msg.textContent = result.error;
        msg.className = "form-message error";
        return;
      }

      //window.location.href = "/admin.html";
      window.location.href = "/admin";

    } catch (err) {
      msg.textContent = "Error de conexión";
      msg.className = "form-message error";
    }
  });
});