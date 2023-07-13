async function getExchangeRates() {
    try {
      const response = await fetch("https://mindicador.cl/api");
      const data = await response.json();
      return data;
    } catch (error) {
      console.log("Error al obtener los tipos de cambio:", error);
      return null;
    }
  }
  
  async function crearSelect() {
    const selectTo = document.getElementById("to");
    const exchangeRates = await getExchangeRates();
  
    if (exchangeRates) {
      const monedas = Object.keys(exchangeRates);
      var indice = 0
      monedas.forEach((moneda) => {
  
        if (moneda !== "CLP" && indice > 2) {
          const optionTo = document.createElement("option");
          optionTo.value = moneda;
          optionTo.textContent = exchangeRates[moneda].nombre;
          selectTo.appendChild(optionTo);
        }
        indice++
      });
    }
  }
  
  async function convertir() {
    const amountInput = document.getElementById("amount");
    const toSelect = document.getElementById("to");
    const resultDiv = document.getElementById("result");
  
    const amount = parseFloat(amountInput.value);
    const to = toSelect.value;
  
    if (!isNaN(amount) && to) {
      const exchangeRates = await getExchangeRates();
  
      if (exchangeRates && exchangeRates[to]) {
        const rateTo = exchangeRates[to].valor;
  
        const convertedAmount = amount / rateTo;
        const nombreMO = exchangeRates[to].nombre
  
        resultDiv.textContent = `${amount} CLP equivale a ${convertedAmount.toFixed(2)} ${nombreMO}`;
      } else {
        resultDiv.textContent = "No se encontraron tasas de cambio para la moneda seleccionada.";
      }
    } else {
      resultDiv.textContent = "Por favor, ingresa una cantidad y selecciona una moneda.";
    }
  }
  
  
  
  async function getSelccionMoneda(tipoMoneda) {
    const indicador = await fetch(`https://mindicador.cl/api/${tipoMoneda}`);
    const data = await indicador.json();
    const diasGrafica = data.serie.slice(0, 10);
    return diasGrafica;
  }
  
  async function renderGrafica() {
    const toSelect = document.getElementById("to");
    const canvas = document.getElementById("myChart");
    const to = toSelect.value;
  
    if (to && canvas) {
      const indicador = await getSelccionMoneda(to);
  
      const nombresDeLasMonedas = indicador.map((d) => d.fecha);
      const valores = indicador.map((d) => Number(d.valor));
  
      const config = {
        type: "line",
        data: {
          labels: nombresDeLasMonedas,
          datasets: [
            {
              label: "Valores de la moneda",
              data: valores,
              borderColor: "red",
              fill: false,
            },
          ],
        },
      };
  
      if (canvas.chart) {
        canvas.chart.data = config.data;
        canvas.chart.update();
      } else {
        const ctx = canvas.getContext("2d");
        canvas.chart = new Chart(ctx, config);
      }
    }
  }
  
  crearSelect()