import { useState } from 'react';

const FIRST_VISIT_KEY = 'isFirstVisit';

export const useFirstVisit = () => {
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
    const saved = localStorage.getItem(FIRST_VISIT_KEY);
    return saved === null;
  });

  const markAsVisited = () => {
    setIsFirstVisit(false);
    localStorage.setItem(FIRST_VISIT_KEY, 'false');
  };

  return { isFirstVisit, markAsVisited };
};
