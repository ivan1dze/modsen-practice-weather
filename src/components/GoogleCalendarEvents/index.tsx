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

  return (
    <div className="google-calendar-events">
      <h2>Google Calendar Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.summary} - {event.start.dateTime || event.start.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleCalendarEvents;
