//


import { render, screen } from '@testing-library/react';
import App from './App';

import crypto from 'crypto';

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => crypto.randomUUID()
  }
});

test('renders app', () => {
  render(<App />);
  const element = screen.getByText(/app/i);
  expect(element).toBeInTheDocument();
});


// EOF
