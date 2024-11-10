// src/contexts/locationContext.jsx

// React imports
import { createContext, useContext } from 'react';
import { useLocation } from 'react-router-dom';

const LocationContext = createContext();

/**
 * Provides location-related context to its children.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {ReactNode} props.children - Child components to wrap with location context.
 * @returns {JSX.Element} The provider component that wraps its children with location context.
 */
export const LocationProvider = ({ children }) => {
  const locationFull = useLocation();
  const location = locationFull.pathname.split('/').slice(-1)[0];
  return (
    <LocationContext.Provider value={{ locationFull, location }}>
      {children}
    </LocationContext.Provider>
  );
};

/**
 * Hook to use the location context.
 *
 * @returns {Object} The location context.
 */
export const useLocationContext = () => {
  return useContext(LocationContext);
};
