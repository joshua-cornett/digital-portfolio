const ContextWrapper = ({ providers, children }) => {
  return providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, children);
};

export default ContextWrapper;
