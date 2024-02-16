import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CityGraph = () => {
    const [cityData, setCityData] = useState([]);
    const [selectedState, setSelectedState] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch city weather data from OpenWeatherMap API
                const weatherResponse = await axios.get('https://api.openweathermap.org/data/2.5/group', {
                    params: {
                        id: '1261481,1275339,1275339', // IDs of Delhi, Mumbai, Bangalore (You can add more cities)
                        units: 'metric', // Get temperature in Celsius
                        appid: '6922bdc7e4458d0bfdf2fdc6d7570643', // Replace 'YOUR_API_KEY' with your actual API key
                    }
                });

                // Fetch population data from REST Countries API
                const populationResponse = await axios.get('https://restcountries.com/v2/all');

                // Merge weather data and population data
                const mergedData = weatherResponse.data.list.map(city => {
                    const population = populationResponse.data.find(country => country.capital === city.name)?.population || 'Unknown';
                    return {
                        name: city.name,
                        temperature: city.main.temp,
                        population: population,
                        state: city.sys.country // Assume the country code represents the state
                    };
                });

                setCityData(mergedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const CityBox = ({ city }) => {
        const [tooltipVisible, setTooltipVisible] = useState(false);

        const handleMouseEnter = () => {
            setTooltipVisible(true);
        };

        const handleMouseLeave = () => {
            setTooltipVisible(false);
        };

        const handleClick = () => {
            // Set the selected state when a city is clicked
            setSelectedState(city.state);
        };

        const tooltipStyle = {
            display: tooltipVisible ? 'block' : 'none',
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            padding: '5px',
            borderRadius: '5px'
        };

        return (
            <div className="city-box" style={{ width: '100px', height: '100px', border: '1px solid black', position: 'relative' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick}>
                {city.name}
                <div style={tooltipStyle}>
                    Temperature: {city.temperature}°C<br />
                    Population: {city.population}
                </div>
            </div>
        );
    };

    const StateChart = () => {
        // Logic to display chart for selected state
        return (
            <div>
                Chart for {selectedState}
            </div>
        );
    };

    return (
        <div>
            <div id="graph-container" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {cityData.map((city, index) => (
                    <CityBox key={index} city={city} />
                ))}
            </div>
            {selectedState && <StateChart />}
        </div>
    );
};

export default CityGraph;








