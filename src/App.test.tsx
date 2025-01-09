/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders app without crashing', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
});
