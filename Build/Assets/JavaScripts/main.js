import '@fortawesome/fontawesome-free/js/all.min.js';
import { Histogram } from './modules/histograms';
import { middleware } from "./modules/middleware";

const histograms = [];

const limitSelect = document.querySelector(".limit__selector");

//connect reload btn to request handler
const reloadBtn = document.querySelector("#reloadBtn");
reloadBtn.addEventListener('click', () => {
    window.location.reload();
});

const initOverview = (data) => {
    const co2 = document.querySelector(".circles.co2-circle span");
    const pme = document.querySelector(".circles.pme-circle span");
    const gas = document.querySelector(".circles.gas-circle span");
    const date = document.querySelector("#measurement-time");
    const temperature = document.querySelector("#measurement-temp");
    const humidity = document.querySelector("#measurement-humidity");

    gas.innerText = data.gasData[0].value;
    co2.innerText = data.co2Data[0].value;

    const formattedDate = new Date(data.co2Data[0].date).toLocaleDateString('de-DE', {
        hour: 'numeric',
        minute: 'numeric',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    date.innerText = `${formattedDate}`;

    temperature.innerText = `${data.tempData[0].value}° C`;
    humidity.innerText = `${data.humidityData[0].value}%`;
}

const initCanvas = (data) => {
    const canvasObjs = document.querySelectorAll(".histogram-canvas");
    canvasObjs.forEach(canvas => {
        const dataType = canvas.getAttribute("data-type");
        const canvasData = eval(`data.${dataType ? dataType : 'temp'}Data`);
    
        let cur_obj = new Histogram(canvas, canvasData);
        histograms.push(cur_obj);
        canvas.addEventListener("mousemove", cur_obj.mouseHandler);
    });

    limitSelect.addEventListener("change", async () => {
        const updatedData = await middleware(limitSelect.value);
        histograms[0].compileCanvasData(updatedData);
    });
}

const middlewareData = await middleware();

initCanvas(middlewareData);
initOverview(middlewareData);