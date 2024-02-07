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
        response.forEach(element => {
            const dataset = {
                "temperature": parseFloat(element.temperature),
                "date": element.date
            };
            tempData.push(dataset);
        });
        
        return tempData;
    }   
    
    return dumpData(limit);
}

export default middleware;