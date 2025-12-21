import './DateTime.css';

import React, { useEffect, useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';

const DateTime: React.FC = () => {
  const { language, t } = useLanguage();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeFormatter = new Intl.DateTimeFormat(t('timeLocale'), {
    hour: 'numeric',
    minute: 'numeric',
    hour12: language === 'en',
  });

  const dateFormatter = new Intl.DateTimeFormat(t('dateLocale'), {
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
