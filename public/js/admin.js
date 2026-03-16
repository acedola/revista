 
document.addEventListener("DOMContentLoaded", () => {

  const btnExport = document.getElementById("btnExport");
  const btnLogout = document.getElementById("btnLogout");
  const tableBody = document.querySelector("#dataTable tbody");

  if (!btnExport || !btnLogout) return;

  // Cargar datos
  loadData();

  btnExport.addEventListener("click", exportCSV);
  btnLogout.addEventListener("click", logout);

  async function loadData() {
    const res = await fetch("/admin/data");
    if (!res.ok) {
      window.location.href = "/login.html";
      return;
    }

    const data = await res.json();

    tableBody.innerHTML = "";

    data.forEach(item => {
      const row = `
        <tr>
          <td>${item.fecha}</td>
          <td>${item.nombre}</td>
          <td>${item.correo}</td>
          <td>${item.titulo}</td>
          <td>
            <a href="/uploads/${item.archivo}" target="_blank">
              Descargar
            </a>
          </td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    });
  }

  function exportCSV() {
    window.location.href = "/admin/export";
  }

  // async function logout() {
  //   await fetch("/admin/logout");
  //   window.location.href = "/login.html";
  // }
async function logout() {
  await fetch("/admin/logout", { method: "POST" });
  window.location.href = "/login.html";
}
});