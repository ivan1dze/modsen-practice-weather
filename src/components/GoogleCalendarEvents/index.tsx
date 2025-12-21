import './style.css';

import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';

import { useLanguage } from '../../contexts/LanguageContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface Event {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
}

interface GoogleCalendarEventsProps {
  token: string;
}

const GoogleCalendarEvents: React.FC<GoogleCalendarEventsProps> = ({
  token,
}) => {
  const { t } = useLanguage();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('No authentication token provided');
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();
    let isMounted = true;

    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: abortController.signal,
          },
        );

        if (!isMounted) return;

        if (response.data?.items && Array.isArray(response.data.items)) {
          setEvents(response.data.items);
        } else {
          setEvents([]);
        }
      } catch (err) {
        if (
          axios.isCancel(err) ||
          (err as Error)?.name === 'CanceledError' ||
          (err as Error)?.name === 'AbortError'
        ) {
          return;
        }

        if (!isMounted) return;

        const axiosError = err as AxiosError;
        if (axiosError.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (axiosError.response?.status === 403) {
          setError('Access denied. Please check your permissions.');
        } else {
          setError('Failed to fetch calendar events. Please try again.');
        }
        console.error('Error fetching calendar events:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [token]);

  const formatDate = (dateTime?: string, date?: string): string => {
    if (dateTime) {
      const dateObj = new Date(dateTime);
      return `${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date) {
      return new Date(date).toLocaleDateString();
    }
    return '';
  };

  if (isLoading) {
    return (
      <div className="google-calendar-events">
        <h3>{t('calendarEvents')}</h3>
        <div className="loading-state">
          <LoadingSpinner size="medium" text={t('loading')} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="google-calendar-events">
        <h3>{t('calendarEvents')}</h3>
        <div className="error">
          {t('error')}: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="google-calendar-events">
      <h3>{t('calendarEvents')}</h3>
      {events.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p>{t('noEvents')}</p>
        </div>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <div className="event-time">
                {formatDate(event.start.dateTime, event.start.date)}
              </div>
              <div className="event-summary">{event.summary || 'No title'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoogleCalendarEvents;
