const filas = document.querySelector("#mercado tbody");
const horizontalScrollWrapper = document.querySelector(".horizontal-scroll-wrapper");

async function cargarDatosMatcha() {
  try {
    const respuesta = await fetch("https://raw.githubusercontent.com/tcvitanic04/matcha/main/matcha.json");
    const data = await respuesta.json();
    const mercado = data.Matcha_Market_Data.find(d => d.Métrica === "Tamaño del Mercado");

    filas.innerHTML = "";
    const años = [];
    const valores = [];

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
        años.push(año);
        valores.push(valor);
      }
    }

    crearGraficoLineal(años, valores);
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

function crearGraficoLineal(años, valores) {
  const canvas = document.getElementById('lineChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const computedStyle = getComputedStyle(document.body);
  const textoColor = computedStyle.getPropertyValue('--colorTexto') || '#132615';

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: años,
      datasets: [{
        label: 'Valor de Mercado (B USD)',
        data: valores,
        borderColor: '#029a57',
        backgroundColor: '#deefe9',
        borderWidth: 3,
        tension: 0.3,
        fill: true,
        pointBackgroundColor: '#c0d72f',
        pointBorderColor: '#029a57',
        pointRadius: 5,
        pointHoverRadius: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Año',
            color: textoColor
          },
          ticks: {
            color: textoColor
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Valor (Miles de Millones USD)',
            color: textoColor
          },
          beginAtZero: true,
          ticks: {
            color: textoColor,
            callback: value => value + ' B'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: textoColor
          }
        },
        tooltip: {
          callbacks: {
            label: context => context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' B USD'
          }
        }
      }
    }
  });
}

window.addEventListener("load", async () => {
  const loader = document.getElementById("loader");
  await new Promise(resolve => setTimeout(resolve, 2000));
  loader.classList.add("hidden");
  cargarDatosMatcha();

  const navLinks = document.querySelectorAll('#navegacion a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection && horizontalScrollWrapper) {
        const scrollPosition = targetSection.offsetLeft;
        horizontalScrollWrapper.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});