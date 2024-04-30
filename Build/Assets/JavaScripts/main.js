import '@fortawesome/fontawesome-free/js/all.min.js';
import './modules/histograms';
import './modules/middleware';

const baseURL = 'http://172.16.129.103/Luftmonitor/';

const makeRequest = () => {
    fetch(`${baseURL}/Middleware/handler.php`, {
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
reloadBtn.addEventListener('click', () => {
    window.location.reload();
});