const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch greeting message from the backend
// export const fetchGreeting = async () => {
//     try {
//         const response = await fetch(`${BASE_URL}/api/hello`);
//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         const data = await response.json();
//         console.log(data.message); // Handle the response data
//     } catch (error) {
//         console.error('Error fetching greeting:', error);
//     }
// };

// Fetch time of use rates from the backend
export const fetchTimeOfUseRates = async () => {
  try {
      const response = await fetch(`${BASE_URL}/api/time_of_use_rates`);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json(); // Directly return the data for use in components
  } catch (error) {
      console.error('Failed to fetch time of use rates:', error);
      return []; // Return an empty array in case of an error
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

// Post form submission rates for results
export const postRates = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/api/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorResponse.error || 'Unknown error'}`);
    }
    return await response.json(); // Return the data from the server
  } catch (error) {
    console.error('Failed to post data:', error);
    return { error: error.message }; // Return the error message
  }
};