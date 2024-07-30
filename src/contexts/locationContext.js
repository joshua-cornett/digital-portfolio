// locationContext.js
import { createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const locationFull = useLocation();
  const location = locationFull.pathname.split('/').slice(-1)[0];
  return (
    <LocationContext.Provider value={{ locationFull, location }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  return useContext(LocationContext);
};
