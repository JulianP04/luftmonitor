import '@fortawesome/fontawesome-free/js/all.min.js';
import './modules/histograms';

const baseURL = 'luftmonitor.ddev.site';

const makeRequest = () => {
    fetch(`https://${baseURL}/Middleware/handler.php`, {
        method: 'POST',
        body: JSON.stringify({
            action: 'request',
        })
    })
    .then(response => response.text())
    .then(data => {
        if(data.includes("Connection failed")) { //database connection couldn't be established
            alert("Zur Zeit kann keine Verbindung zum Webserver hergestellt werden.");
        } else {
            console.log(data);
        }
    });
}

//connect reload btn to request handler
const reloadBtn = document.querySelector("#reloadBtn");
reloadBtn.addEventListener('click', makeRequest);