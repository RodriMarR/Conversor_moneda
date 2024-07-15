
const selectIndicators = document.getElementById("indicators")
const btnSearch = document.querySelector("button")
const txtCLP = document.querySelector("input")
const lblResult = document.querySelector("#result")
const indicatorChart = document.getElementById("indicatorChart")
const indicatorsJson = [];
const apiURL = "https://mindicador.cl/api/"
const nf = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2, roundingIncrement: 5 })
let myChart = ""

async function getData(api){
  try{
    const res = await fetch(api)
    if (!res.ok){
      throw new Error(res.statusText)
    }
    return await res.json()
  }catch (error){
    lblResult.textContent = error
    return null
  }
}

async function getIndicators(){
    const results = await getData(apiURL)
    if(results) {
      for (let i in results) {
        if(typeof results[i] === "object"){
          let option = document.createElement("option")
          option.value = results[i].codigo
          option.text = results[i].nombre
          selectIndicators.add(option)
          indicatorsJson.push({code: results[i].codigo, date: results[i].fecha, value: results[i].valor})
        }
      }
    }
}

async function renderChart() {
  const data = await getData(apiURL + selectIndicators.value);
  const size = 10;
  const labels = data.serie.slice(0, size).map(i => {
    const formatDate = i.fecha.slice(0, 10).split("-");
    return formatDate[2] + "-" + formatDate[1] + "-" + formatDate[0];
  });
  const values = data.serie.slice(0, size).map(i => {
    return i.valor;
  });
  if (myChart) {
    myChart.destroy();
  }
  indicatorChart.style.backgroundColor = "transparent";
  myChart = new Chart(indicatorChart, {
    type: 'line',
    data: {
      labels: labels.reverse(),
      datasets: [{
        label: selectIndicators.options[selectIndicators.selectedIndex].text,
        data: values.reverse(),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Color del relleno debajo de la línea
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 3
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: 'white'  // Cambia el color del texto de la leyenda según el fondo
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: 'white'  // Cambia el color del texto de las etiquetas del eje x
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'  // Cambia el color de la cuadrícula del eje x
          }
        },
        y: {
          ticks: {
            color: 'white'  // Cambia el color del texto de las etiquetas del eje y
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'  // Cambia el color de la cuadrícula del eje y
          }
        }
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        }
      },
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

btnSearch.addEventListener("click", () => {
  if(txtCLP.value === ""){
    lblResult.textContent = "Debes ingresar el mondo en CLP"
    txtCLP.focus()
  }else if(selectIndicators.value === ""){
    lblResult.textContent ="Debes seleccionar una moneda a convertir"
    selectIndicators.focus()
  }else{
    const indexIndicators = indicatorsJson.findIndex( searchIndex => searchIndex.code === selectIndicators.value)
	  lblResult.textContent = "Resultado: " + nf.format(txtCLP.value / indicatorsJson[indexIndicators].value)
    renderChart()
  }
})

getIndicators()