import './СitySearch.css';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

import { City, CityOption } from '../../types/CitySearch';

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

  return (
    <div className="city-search-container">
      <Select
        value={selectedCity}
        onInputChange={handleInputChange}
        onChange={handleChange}
        options={options}
        placeholder="Search for a city..."
        noOptionsMessage={() => 'No cities found'}
        className="city-search-select"
        styles={{
          control: (provided) => ({
            ...provided,
            border: '1px solid black',
            boxShadow: 'none',
            width: 200,
            marginBottom: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            color: 'black',
          }),
          menu: (provided) => ({
            ...provided,
            width: 200,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          }),
          singleValue: (provided) => ({
            ...provided,
            color: 'black',
          }),
        }}
      />
      <button className="city-search-button">Search</button>
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CitySearch;
