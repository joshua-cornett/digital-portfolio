// src/contexts/ContextWrapper.jsx

/**
 * Wraps multiple context providers around child components.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {Array} props.providers - List of context providers to apply.
 * @param {ReactNode} props.children - The child components to wrap with context providers.
 * @returns {JSX.Element} The rendered component with nested context providers.
 */
const ContextWrapper = ({ providers, children }) => {
  return providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);
};

export default ContextWrapper;
