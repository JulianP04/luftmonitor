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
    
        const dataset = {
            tempData: [],
            humidityData: [],
            gasData: [],
            co2Data: []
        };

        response.forEach(element => {
            dataset.tempData.push({
                value: parseFloat(element.temperature),
                date: element.date
            });
            dataset.humidityData.push({
                value: parseFloat(element.humidity),
                date: element.date
            });
            dataset.gasData.push({
                value: parseFloat(element.gas),
                date: element.date
            });
            dataset.co2Data.push({
                value: parseFloat(element.co2),
                date: element.date
            });
        });
        
        return dataset;
    }   
    
    return dumpData(limit);
}

export {middleware};