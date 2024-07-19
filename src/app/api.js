const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch greeting message from the backend
export const fetchGreeting = async () => {
    try {
        const response = await fetch(`${BASE_URL}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.message); // Handle the response data
    } catch (error) {
        console.error('Error fetching greeting:', error);
    }
};

// Fetch charger types from the backend
export const fetchChargerTypes = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/charger_types`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); // Directly return the data for use in components
    } catch (error) {
        console.error('Failed to fetch charger types:', error);
        return []; // Return an empty array in case of an error
    }
};

// Post form submission for results
export const postResults = async (payload) => {
    try {
      const response = await fetch(`${BASE_URL}/api/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json(); // Return the data from the server
    } catch (error) {
      console.error('Failed to post data:', error);
      return null; // Return null or handle the error as needed
    }
  };