import React, { useState, useEffect, useContext } from 'react';
import ErrorContext from '../context/errorContext';

const ErrorDisplay = () => {
  const [visible, setVisible] = useState(false);
  const { error, updateError } = useContext(ErrorContext);

  useEffect(() => {
    if (error) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
        updateError(null); // Clear the error after it's hidden
      }, 10000);
    }
  }, [error, updateError]);

  return (
    <>
      {visible && (
        <div className="error-display">
          <p>{error}</p>
        </div>
      )}
    </>
  );
};

export default ErrorDisplay;