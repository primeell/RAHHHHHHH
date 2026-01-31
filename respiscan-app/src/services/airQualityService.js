const API_KEY = import.meta.env.VITE_IQAIR_API_KEY;
const BASE_URL = 'https://api.airvisual.com/v2';

export const getAirQualityByLocation = async (lat, lon) => {
    try {
        if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
            console.warn('MQAir API Key missing, using mock data for Surabaya');
            return getMackData();
        }

        const response = await fetch(`${BASE_URL}/nearest_city?lat=${lat}&lon=${lon}&key=${API_KEY}`);
        const data = await response.json();

        if (data.status === 'success') {
            return {
                city: data.data.city,
                state: data.data.state,
                country: data.data.country,
                aqi: data.data.current.pollution.aqius,
                temp: data.data.current.weather.tp,
                humidity: data.data.current.weather.hu,
                ws: data.data.current.weather.ws,
            };
        }
        throw new Error(data.data.message);
    } catch (error) {
        console.error('Error fetching air quality:', error);
        return getMackData();
    }
};

const getMackData = () => ({
    city: 'Surabaya',
    state: 'East Java',
    country: 'Indonesia',
    aqi: 62,
    temp: 31,
    humidity: 74,
    ws: 22.2
});
