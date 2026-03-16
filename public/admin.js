async function loadData() {
  const res = await fetch("/admin/data");
  if (!res.ok) {
    window.location.href = "/login.html";
    return;
  }

  const data = await res.json();
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";

  data.reverse().forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${new Date(item.fecha).toLocaleString()}</td>
      <td>${item.nombre} ${item.apellido}</td>
      <td>${item.correo}</td>
      <td>${item.titulo || ""}</td>
      <td>
        <a href="/uploads/${item.archivo}" target="_blank">
          <button class="admin-btn btn-download">Descargar</button>
        </a>
      </td>
    `;

    tbody.appendChild(row);
  });
}

function exportCSV() {
  window.location.href = "/admin/export";
}

async function logout() {
  await fetch("/admin/logout");
  window.location.href = "/login.html";
}

loadData();