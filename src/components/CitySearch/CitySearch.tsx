import './CitySearch.css';

import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

import { API_CONFIG } from '../../config/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCityHistory } from '../../hooks/useCityHistory';
import { useDebounce } from '../../hooks/useDebounce';
import { City, CityOption } from '../../types/CitySearch';

const MIN_SEARCH_LENGTH = 2;
const DEBOUNCE_DELAY = 400;
const MAX_CITIES_RESULTS = 5;

const CitySearch: React.FC<{ onCitySelect: (city: string) => void }> = ({
  onCitySelect,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<CityOption[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { history, addToHistory } = useCityHistory();

  const debouncedInputValue = useDebounce(inputValue, DEBOUNCE_DELAY);

  useEffect(() => {
    if (!API_CONFIG.OPENWEATHER_API_KEY) {
      setError('API key is not configured');
      return;
    }

    if (debouncedInputValue.length < MIN_SEARCH_LENGTH) {
      setOptions([]);
      setError(null);
      return;
    }

    const abortController = new AbortController();

    const fetchCities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_CONFIG.OPENWEATHER_BASE_URL}/find?q=${encodeURIComponent(debouncedInputValue)}&type=like&sort=population&cnt=${MAX_CITIES_RESULTS}&appid=${API_CONFIG.OPENWEATHER_API_KEY}`,
          {
            signal: abortController.signal,
          },
        );

        if (response.data?.list && Array.isArray(response.data.list)) {
          const cities = response.data.list.map((city: City) => ({
            value: city.name,
            label: `${city.name}, ${city.sys.country}`,
          }));
          setOptions(cities);
        } else {
          setOptions([]);
        }
      } catch (err) {
        if (
          axios.isCancel(err) ||
          (err as Error)?.name === 'CanceledError' ||
          (err as Error)?.name === 'AbortError'
        ) {
          return;
        }

        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
          setError('Unauthorized: Please check your API key.');
        } else if (axiosError.response?.status === 404) {
          setOptions([]);
        } else {
          setError('Error fetching cities. Please try again.');
        }
        console.error('Error fetching cities:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();

    return () => {
      abortController.abort();
    };
  }, [debouncedInputValue]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (!value) {
      setSelectedCity(null);
      setOptions([]);
    }
  };

  const handleChange = (selectedOption: SingleValue<CityOption>) => {
    setSelectedCity(selectedOption);
    if (selectedOption) {
      onCitySelect(selectedOption.value);
      addToHistory(selectedOption.value);
      setInputValue('');
    } else {
      setInputValue('');
      setOptions([]);
    }
  };

  const historyOptions: CityOption[] = history.map((item) => ({
    value: item.name,
    label: item.name,
  }));

  const allOptions =
    inputValue.length < MIN_SEARCH_LENGTH && history.length > 0
      ? historyOptions
      : options;

  return (
    <div className="city-search-container">
      <Select
        value={selectedCity}
        onInputChange={handleInputChange}
        onChange={handleChange}
        options={allOptions}
        placeholder={t('searchPlaceholder')}
        noOptionsMessage={() => (isLoading ? t('loading') : t('noCitiesFound'))}
        isClearable
        isSearchable
        isLoading={isLoading}
        className="city-search-select"
        styles={{
          control: (provided, state) => ({
            ...provided,
            border: state.isFocused
              ? '1px solid rgba(255, 255, 255, 0.5)'
              : '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: state.isFocused
              ? '0 4px 12px rgba(0, 0, 0, 0.2)'
              : '0 2px 8px rgba(0, 0, 0, 0.1)',
            width: '100%',
            minWidth: 200,
            marginBottom: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: 'white',
            transition: 'all 0.3s ease',
            borderRadius: '12px',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.4)',
            },
          }),
          input: (provided) => ({
            ...provided,
            color: 'white',
          }),
          placeholder: (provided) => ({
            ...provided,
            color: 'rgba(255, 255, 255, 0.7)',
          }),
          menu: (provided) => ({
            ...provided,
            width: '100%',
            minWidth: 200,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            marginTop: '4px',
            overflow: 'hidden',
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? 'rgba(66, 133, 244, 0.2)'
              : state.isFocused
                ? 'rgba(66, 133, 244, 0.1)'
                : 'transparent',
            color: '#333',
            cursor: 'pointer',
            padding: '12px 16px',
            transition: 'all 0.2s ease',
            '&:active': {
              backgroundColor: 'rgba(66, 133, 244, 0.2)',
            },
          }),
          singleValue: (provided) => ({
            ...provided,
            color: 'white',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
          }),
          indicatorSeparator: () => ({
            display: 'none',
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            color: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              color: 'white',
            },
          }),
          clearIndicator: (provided) => ({
            ...provided,
            color: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              color: 'white',
            },
          }),
        }}
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default CitySearch;
