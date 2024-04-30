const middleware = async (limit = 5) => {
    const fetchConfig = {
        method: 'GET'
    };
    
    const fetchMiddleware = async (limit) => {
        const fetchData = fetch(`Middleware/handler.php?limit=${limit}`, fetchConfig)
            .then(data => {
                return data.json();
            });
        return fetchData;
    }
    
    const dumpData = async (limit) => {
        const response = await fetchMiddleware(limit);
    
        let tempData = [];
        let humidityData = [];
        let gasData = [];
        response.forEach(element => {
            const tempDataset = {
                temperature: parseFloat(element.temperature),
                date: element.date
            };
            const humidityDataset = {
                humidity: parseFloat(element.humidity),
                date: element.date
            };
            const gasDataset = {
                gas: parseFloat(element.gas),
                date: element.date
            };
            tempData.push(tempDataset);
            humidityData.push(humidityDataset);
            humidityData.push(humidityDataset);
            gasData.push(gasDataset);
        });
        
        return tempData;
    }   
    
    return dumpData(limit);
}

export default middleware;