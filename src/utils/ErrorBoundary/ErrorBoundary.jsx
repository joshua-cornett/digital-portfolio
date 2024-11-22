import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import PropTypes from 'prop-types';

/**
 * A reusable Error Boundary component using `react-error-boundary`.
 * Provides a customizable fallback UI for child components.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to wrap with the error boundary.
 * @param {React.ReactNode|string} props.fallback - Custom fallback UI or message.
 * @param {Function} props.onError - Callback for logging errors.
 * @param {Function} props.onReset - Callback for resetting the error boundary.
 * @returns {JSX.Element} Error Boundary wrapper.
 */
const ErrorBoundary = ({ children, fallback, onError, onReset }) => {
  return (
    <ReactErrorBoundary
      onError={onError}
      onReset={onReset}
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div>
          <p>{fallback || 'Something went wrong!'}</p>
          {error && <details style={{ whiteSpace: 'pre-wrap' }}>{error.toString()}</details>}
          <button onClick={resetErrorBoundary}>Retry</button>
        </div>
      )}
    >
      {children}
    </ReactErrorBoundary>
  );
};

ErrorBoundary.propTypes = {
  /**
   * Children components to be wrapped by the Error Boundary.
   */
  children: PropTypes.node.isRequired,
  /**
   * Custom fallback UI or fallback message.
   */
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  /**
   * Callback function for error logging.
   */
  onError: PropTypes.func,
  /**
   * Callback function for resetting the error boundary.
   */
  onReset: PropTypes.func
};

ErrorBoundary.defaultProps = {
  fallback: 'Something went wrong!',
  onError: null,
  onReset: null
};

export default ErrorBoundary;
