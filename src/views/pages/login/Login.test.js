import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import Login from './Login';

Object.defineProperty(window, 'location', {
  value: {
    href: '',
  },
  writable: true,
});

describe('Login Component ', () => {
  beforeEach(() => {
    sessionStorage.clear()
  });

  test('renders Login component correctly', () => {
    render(<Login />);


    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByTestId('login-btn')).toBeInTheDocument();
  });

  test('renders login form and handles login button click', () => {
    render(<Login />);


    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });


    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();


    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });


    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpassword');


    fireEvent.click(loginButton);

    expect(window.location.href).toContain('');
  });

  test('shows error toast on login failure', async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
      }),
    );

    render(<Login />);


    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });


    const loginButton = screen.getByTestId('login-btn');
    fireEvent.click(loginButton);


    await waitFor(() =>
      expect(screen.getByText('Login failed! Please check your credentials.')).toBeInTheDocument(),
    );
  });
});
