// api.js
const fetchData = async () => {
    try {
        const response = await fetch('/api/hello'); // Adjust the endpoint as needed
        const data = await response.json();
        console.log(data.message); // Handle the response data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

fetchData();