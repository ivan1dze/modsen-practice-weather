import { useEffect, useState } from 'react';

import { Coordinates } from '../types/Geolocation';

const getGeolocationErrorMessage = (
  error: GeolocationPositionError,
): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Geolocation permission denied. Please enable location access.';
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable.';
    case error.TIMEOUT:
      return 'Location request timed out. Please try again.';
    default:
      return 'An unknown error occurred while retrieving your location.';
  }
};

export const useGeolocation = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      // Initialize error state on mount - this is acceptable
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(
        'Geolocation is not supported by your browser or permission not given',
      );

      setIsLoading(false);
      return;
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
        setIsLoading(false);
      },
      (error) => {
        setError(getGeolocationErrorMessage(error));
        setCoordinates(null);
        setIsLoading(false);
      },
      geoOptions,
    );
  }, []);

  return { coordinates, error, isLoading };
};
