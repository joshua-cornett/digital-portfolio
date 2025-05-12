import { render, screen } from '@testing-library/react';

const TestComponent = () => {
  return <div>Hello, test!</div>;
};

test('renders basic component', () => {
  render(<TestComponent />);
  expect(screen.getByText('Hello, test!')).toBeInTheDocument();
});
