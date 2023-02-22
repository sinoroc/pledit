//


import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app', () => {
  render(<App />);
  const element = screen.getByText(/app/i);
  expect(element).toBeInTheDocument();
});


// EOF
