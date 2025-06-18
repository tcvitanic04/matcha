const filas = document.querySelector("#mercado tbody");

async function cargarDatosMatcha() {
  try {
    const respuesta = await fetch("https://raw.githubusercontent.com/tcvitanic04/matcha/main/matcha.json");
    const data = await respuesta.json();
    const mercado = data.Matcha_Market_Data.find(d => d.Métrica === "Tamaño del Mercado");

    filas.innerHTML = "";

    for (const año in mercado) {
      if (año !== "Métrica") {
        const valor = parseFloat(mercado[año]);
        filas.innerHTML += `
          <tr>
            <td>${año}</td>
            <td>${valor.toFixed(2)} B USD</td>
            <td>${barrita(valor)}</td>
            <td>${carita(valor)}</td>
          </tr>
        `;
      }
    }

  } catch (error) {
    console.error("Error al cargar datos:", error);
    filas.innerHTML = `<tr><td colspan="4">No se pudo cargar la información.</td></tr>`;
  }
}

function barrita(valor) {
  const ancho = valor * 10;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 12">
      <rect fill="#deefe9" width="100" height="12" rx="4"/>
      <rect fill="#029a57" width="${Math.min(ancho, 100)}" height="12" rx="4"/>
    </svg>
  `;
}

function carita(valor) {
  if (valor > 6) return "💰💰💰";
  if (valor > 3) return "💰💰";
  return "💰";
}

cargarDatosMatcha();