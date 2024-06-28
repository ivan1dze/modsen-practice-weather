import './CurrentCity.css';

import React from 'react';

interface CurrentCityProps {
  city: string;
}

const CurrentCity: React.FC<CurrentCityProps> = ({ city }) => {
  return (
    <div className="current-city">
      <h2>
        <span className="material-symbols-outlined">near_me</span>
        {city}
      </h2>
    </div>
  );
};

export default CurrentCity;
