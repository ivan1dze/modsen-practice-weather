import './style.css';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

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
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setEvents(response.data.items);
      } catch (error) {
        console.error('Error fetching calendar events:', error);
      }
    };

    fetchEvents();
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

  return (
    <div className="google-calendar-events">
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <div className="event-time">
              {formatDate(event.start.dateTime, event.start.date)}
            </div>
            <div className="event-summary">{event.summary}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleCalendarEvents;
