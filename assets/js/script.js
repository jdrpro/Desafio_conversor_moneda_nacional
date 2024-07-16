const valor_recibido = document.querySelector("#ingresado");
const valor_resultado = document.querySelector("#resultado");
let resultado_final = 0;
let data;
let myChart;


/*traer datos API */ 
async function valores_monedas() {
    try{
        const res = await fetch("https://mindicador.cl/api");
        data = await res.json();
    } catch (error){
        document.querySelector("#error").innerHTML = "¡Upa, algo no funcionó! Error:Failed to fetch"
    }
    return data
}


/* Activar al dar clic */
async function activadora_al_clic(){
    calcular_moneda();
    renderGrafica();
}

/* Calcular Moneda */
async function calcular_moneda(){
    const monedas = await valores_monedas();
    let moneda = document.querySelector("#moneda").value;
    if (moneda === "dolar"){
        resultado_final = valor_recibido.value / data.dolar.valor;
    } else if (moneda === "euro"){
        resultado_final = valor_recibido.value / data.euro.valor;
    } else if (moneda === "uf"){
        resultado_final = valor_recibido.value / data.uf.valor;
    } else{
        resultado_final = 0;
    }
    
    valor_resultado.innerHTML = resultado_final.toFixed(2);
}

/* Grafico Moneda */
async function traer_y_crear_grafico() {
    let moneda = document.querySelector("#moneda").value;
    let api_url = " ";

    if (moneda === "dolar"){
        api_url = "https://mindicador.cl/api/dolar/2024";
    } else if (moneda === "euro"){
        api_url = "https://mindicador.cl/api/euro/2024";
    } else if (moneda === "uf"){
        api_url = "https://mindicador.cl/api/uf/2024";
    } 
    
    const res = await fetch(api_url);
    const cambios = await res.json();
    let info = []
    for(let i = 0; i < 10; i++){
        info.unshift(cambios.serie[i]);
    }

    const labels = info.map((cambio) => {
        return cambio.fecha.split("T")[0].split('-').reverse().join('-');
    });
    const data = info.map((cambio) => {
        return cambio.valor;
    });
    const datasets = [
        {
        label: "Tasa de Cambio de los Últimos 10 días",
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 255, 255, 1)",
        data,
        },
    ];
    return { labels, datasets };
}

async function renderGrafica() {
    const data = await traer_y_crear_grafico();

    if (myChart) {
        myChart.destroy();
    }

    const config = {
        type: "line",
        data,
    };

    const ctx = document.getElementById("myChart").getContext("2d");
    ctx.canvas.style.backgroundColor = "white";
    myChart = new Chart(ctx, config);
}
