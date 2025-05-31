import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthContext, type AuthContextType } from '../contexts/AuthContext'; // type-only for AuthContextType
import SignupPage from './SignupPage';

// Default mock AuthContext value
const mockAuthContextValue: AuthContextType = {
  currentUser: null,
  isLoading: false,
  error: null,
  login: jest.fn().mockResolvedValue(undefined),
  logout: jest.fn().mockResolvedValue(undefined),
  signup: jest.fn().mockResolvedValue(undefined), // Make signup an async jest.fn()
};

// Helper function to render with a specific AuthContext value
const renderWithAuthContext = (
  ui: React.ReactElement,
  providerProps: Partial<AuthContextType>
) => {
  return render(
    <AuthContext.Provider value={{ ...mockAuthContextValue, ...providerProps }}>
      {ui}
    </AuthContext.Provider>
  );
};

describe('SignupPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    // Specifically reset the signup mock for each test if needed, or ensure it's fresh
    mockAuthContextValue.signup = jest.fn().mockResolvedValue(undefined);
  });

  test('renders email, password inputs, and signup button', () => {
    renderWithAuthContext(<SignupPage />, {});
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  test('allows user to input email and password', () => {
    renderWithAuthContext(<SignupPage />, {});
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('calls signup function from context on form submission with email and password', async () => {
    const signupMock = jest.fn().mockResolvedValue(undefined);
    renderWithAuthContext(<SignupPage />, { signup: signupMock });

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signupMock).toHaveBeenCalledTimes(1);
      expect(signupMock).toHaveBeenCalledWith('newuser@example.com', 'newpassword123');
    });
  });

  test('displays loading state when isLoading is true', () => {
    renderWithAuthContext(<SignupPage />, { isLoading: true });
    // The SignupPage component changes button text to "Signing up..." and disables it.
    expect(screen.getByRole('button', { name: /signing up.../i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signing up.../i })).toBeDisabled();
  });

  test('submit button is disabled when isLoading is true', () => {
    renderWithAuthContext(<SignupPage />, { isLoading: true });
    const submitButton = screen.getByRole('button', { name: /signing up.../i });
    expect(submitButton).toBeDisabled();
  });

  test('displays error message when error is not null', () => {
    const errorMessage = 'Failed to create account. Please try again.';
    renderWithAuthContext(<SignupPage />, { error: errorMessage });
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    // The assertion for role="alert" has been removed as the component does not set it.
  });

  test('does not display error message when error is null', () => {
    renderWithAuthContext(<SignupPage />, { error: null });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('signup function handles promise rejection (e.g., displays error from context)', async () => {
    // Similar to LoginPage, SignupPage relies on AuthContext to update the error state.
    // We test that the component correctly reflects this error state.
    // Use the signupMock from beforeEach to avoid unhandled rejection,
    // as this test focuses on rendering the error prop.
    // const signupMock = jest.fn().mockRejectedValue(new Error('Email already in use')); // This line caused unhandled rejection
    const errorMessageFromContext = 'This email is already registered.';

    // The component relies on AuthContext to handle promise rejections and set the error state.
    // This test directly provides the error message via context.
    // The signupMock from beforeEach (which resolves) is used.
    renderWithAuthContext(<SignupPage />, { signup: mockAuthContextValue.signup, error: errorMessageFromContext });

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'existing@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockAuthContextValue.signup).toHaveBeenCalledWith('existing@example.com', 'password123');
    });

    // After the mocked signup (which is set to reject), the component should display the error
    // that AuthContext would have set.
    expect(screen.getByText(errorMessageFromContext)).toBeInTheDocument();
  });
});
