
let datos
let totalI
let tablaI
let tablas
let table1 = ''
let table2 = ''

fetch('http://localhost:4005/datos')
  .then(response => response.json())
  .then(data => {
    datos = data
    init()
  })
  .catch(error => console.log(error))

function valores(valor) {
  let sumaI = 0
  let sumaE = 0
  let porcentajeE = 0
  let presupuesto = 0
  console.log(valor)
  valor.forEach(valorr => {
    if (valorr.masomenos == "+") {
      sumaI += valorr.valor
    } else if (valorr.masomenos == "-") {
      sumaE += valorr.valor
    }
  });
  if (sumaI != 0) {
    porcentajeE = (sumaE * 100) / sumaI
  }
  presupuesto = sumaI - sumaE
  return { sumaI: sumaI, sumaE: sumaE, pocentajeE: porcentajeE, presupuesto: presupuesto }
}

function tablasP(valor) {
  let SumaporcentajeE = 0
  let porcentajeE = 0
  valor.forEach(valorr => {
    SumaporcentajeE += valorr.valor
    porcentajeE.porcentajeE = (valorr.valor * 100) / SumaporcentajeE;
  })
  return porcentajeE
}

function init() {
  const config = {
    headers: new Headers({
      "Content-Type": "application/json"
    }),
  }

  const postUser = async (data) => {
    config.method = "POST"
    config.body = JSON.stringify(data)
    let res = await (await fetch("http://localhost:4005/datos", config)).json();
  };
  
  const deleteUser = async(id)=>{
    config.method = "DELETE"
    let res = await ( await fetch(`http://localhost:4005/datos/${id}`,config)).json()
    console.log(res)
}
  
  let valorTotalI = document.getElementById("valorTotalI")
  let valorTotalE = document.getElementById("valorTotalE")
  let porcentajeE = document.getElementById("porcentajeE")
  let presupuesto = document.getElementById("presupuesto")
  let ta1 = document.getElementById("tabla1")
  let ta2 = document.getElementById("tabla2")

  datos.forEach(data => {
    if (data.masomenos == "+") {
      table1 += `
        <tr data-id="${data.id}">
            <td>${data.descripcion}</td>
            <td class="dinero"><p>+$${data.valor}</p><p class="porc1">%</p></td>
            <td class="td"><button class="botoncerra"><i class="fa-solid fa-xmark-large">x</i></button></td>
        </tr>`
    } else if (data.masomenos == "-") {
      table2 += `
      <tr data-id="${data.id}">
                <td>${data.descripcion}</td>
                <td class="dinero-"><p>-$${data.valor}</p><p class="porc2">%</p></td>
                <td class="td"><button class="botoncerra"><i class="fa-solid fa-xmark-large">x</i></button></td>
      </tr>`
    }
  })
  ta1.insertAdjacentHTML("afterend", table1)
  ta2.insertAdjacentHTML("afterend", table2)

  totalI = valores(datos);
  valorTotalI.textContent = `$${totalI.sumaI}`
  valorTotalE.textContent = `$${totalI.sumaE}`
  porcentajeE.textContent = `${totalI.pocentajeE.toFixed(2)}%`
  presupuesto.textContent = `$${totalI.presupuesto}`

  let myForm = document.querySelector("#myForm")
  myForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let data = Object.fromEntries(new FormData(e.target))
    data.valor = parseFloat(data.valor)
    postUser(data)
    
  })
  
  document.querySelectorAll('.botoncerra').forEach(boton => {
    boton.addEventListener('click', async (e) => {
      e.target.parentElement.parentElement.parentElement.remove()
      const id = e.target.parentElement.parentElement.parentElement.dataset.id
      await deleteUser(id)
    })
  })
}

