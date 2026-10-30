import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

it('renders the home view', () => {
  render(<App />);
  expect(screen.getByText('Save Game Tool')).toBeInTheDocument();
});

it('navigates to the about view', async () => {
  render(<App />);
  await userEvent.click(screen.getByText('About'));
  expect(screen.getByText('About the tool')).toBeInTheDocument();
});
