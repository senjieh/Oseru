import React, { createContext, useState } from 'react';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);

  const updateError = (errorMessage) => {
    setError(errorMessage instanceof Error ? errorMessage.message : errorMessage);
  };

  return (
    <ErrorContext.Provider value={{ error, updateError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export default ErrorContext;