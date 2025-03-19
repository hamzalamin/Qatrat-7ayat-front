import { createContext, useContext, useState } from 'react';

// Create context
const ErrorContext = createContext();

// Custom hook to use the context
export const useError = () => useContext(ErrorContext);

// Provider component
export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const showError = (message) => {
    setError(message);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};
