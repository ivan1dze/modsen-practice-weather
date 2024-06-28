import './DateTime.css';

import React, { useEffect, useState } from 'react';
const DateTime: React.FC = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="date-time">
      <h1>{timeFormatter.format(date)}</h1>
      <p>{dateFormatter.format(date)}</p>
    </div>
  );
};

export default DateTime;
