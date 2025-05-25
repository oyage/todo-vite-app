import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import * as AuthContextModule from '../contexts/AuthContext'; // Import as a module
import { MemoryRouter } from 'react-router-dom';

describe('LoginPage', () => {
  let mockLogin;
  let useAuthSpy;

  beforeEach(() => {
    mockLogin = jest.fn();
    // Default mock implementation for useAuth
    useAuthSpy = jest.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      currentUser: null,
      isLoading: false,
      error: null,
      login: mockLogin,
      logout: jest.fn(),
      signup: jest.fn(),
    });
  });

  afterEach(() => {
    useAuthSpy.mockRestore(); // Clean up spy
  });

  it('should render email, password inputs and a login button', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should call login function with email and password on form submit', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should display an error message if login fails', async () => {
    mockLogin.mockImplementation(async () => {
      // Simulate login failure by updating the mock return value for the next render
      useAuthSpy.mockReturnValue({
        currentUser: null,
        isLoading: false,
        error: 'Invalid email or password', // Error message from AuthContext
        login: mockLogin,
        logout: jest.fn(),
        signup: jest.fn(),
      });
    });

    const { rerender } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    // Act: Click login button. This will call mockLogin.
    fireEvent.click(loginButton);
    
    // Ensure mockLogin (which updates the spy's return value) is processed.
    // This might not be strictly necessary if fireEvent.click is already awaited by waitFor,
    // but it's explicit.
    await mockLogin.mock.results[0].value; // Wait for the mockLogin promise to resolve

    // Rerender the component so it uses the updated mockReturnValue from useAuthSpy
    rerender(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Assert: Check for error message
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
    });
  });

   it('should disable button and show loading text when isLoading is true', () => {
    useAuthSpy.mockReturnValue({ // Override default spy for this test
      currentUser: null,
      isLoading: true, // Set isLoading to true
      error: null,
      login: mockLogin,
      logout: jest.fn(),
      signup: jest.fn(),
    });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('button', { name: /logging in.../i });
    expect(loginButton).toBeDisabled();
  });
});
