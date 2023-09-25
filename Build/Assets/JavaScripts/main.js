const baseURL = 'luftmonitor.ddev.site';

const makeRequest = () => {
    fetch(`https://${baseURL}/Middleware/handler.php`, {
        method: 'POST',
        body: JSON.stringify({
            action: 'request',
        })
    })
    .then(response => response.text())
    .then(data => console.log(data));
}

//connect reload btn to request handler
const reloadBtn = document.querySelector("#reloadBtn");
reloadBtn.addEventListener('click', makeRequest);