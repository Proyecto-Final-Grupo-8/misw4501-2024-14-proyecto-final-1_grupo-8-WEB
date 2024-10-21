import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/';
import Register from './Register';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { id: '1', name: 'Company One' },
      { id: '2', name: 'Company Two' }
    ]),
  })
);

describe('Register Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders Register component correctly', async () => {
    await act(async () => {
      render(<Register />);
    });

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  test('shows an error if required fields are not filled', async () => {
    await act(async () => {
      render(<Register />);
    });

    const createAccountButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.click(createAccountButton);

    await waitFor(() => {
      expect(screen.getByText(/Please fill out all fields!/i)).toBeInTheDocument();
    });
  });

  test('loads company options in select', async () => {
    await act(async () => {
      render(<Register />);
    });

    await waitFor(() => {
      expect(screen.getByText('Company One')).toBeInTheDocument();
      expect(screen.getByText('Company Two')).toBeInTheDocument();
    });
  });

  test('shows an error if passwords do not match', async () => {
    await act(async () => {
      render(<Register />);
    });

    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const createAccountButton = screen.getByRole('button', { name: /Create Account/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password2' } });

    fireEvent.click(createAccountButton);

  });
});
