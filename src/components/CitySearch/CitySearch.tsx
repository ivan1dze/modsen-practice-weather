import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import axios from 'axios';
import { CityOption, City } from '../../types/CitySearch';
import './СitySearch.css';

const API_KEY = 'a704542036280897ad1a6a2bc5869897';

const CitySearch: React.FC<{ onCitySelect: (city: string) => void }> = ({
  onCitySelect,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<CityOption[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (inputValue.length > 2) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(
            `http://api.openweathermap.org/data/2.5/find?q=${inputValue}&type=like&sort=population&cnt=5&appid=${API_KEY}`,
          );
          const cities = response.data.list.map((city: City) => ({
            value: city.name,
            label: `${city.name}, ${city.sys.country}`,
          }));
          setOptions(cities);
          setError(null);
        } catch (error) {
          console.error('Error fetching cities:', error);
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            setError('Unauthorized: Please check your API key.');
          } else {
            setError('Error fetching cities');
          }
        }
      };

      fetchCities();
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleChange = (selectedOption: SingleValue<CityOption>) => {
    setSelectedCity(selectedOption);
    if (selectedOption) {
      onCitySelect(selectedOption.value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && selectedCity) {
      onCitySelect(selectedCity.value);
    }
  };

  return (
    <div className="city-search-container">
      <Select
        value={selectedCity}
        onInputChange={handleInputChange}
        onChange={handleChange}
        options={options}
        placeholder="Search for a city..."
        onKeyDown={handleKeyDown}
        noOptionsMessage={() => 'No cities found'}
        className="city-search-select"
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CitySearch;
