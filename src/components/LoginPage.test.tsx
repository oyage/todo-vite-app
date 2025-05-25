import { TextEncoder } from 'util';
if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage';
import { AuthContext, AuthProvider } from '../contexts/AuthContext'; // Import AuthProvider
import { MemoryRouter } from 'react-router-dom'; // Needed if Link is used indirectly

// Mock the AuthContext
const mockLogin = jest.fn();
const mockUseAuth = {
  currentUser: null,
  isLoading: false,
  error: null,
  login: mockLogin,
  logout: jest.fn(),
  signup: jest.fn(),
};

describe('LoginPage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockLogin.mockClear();
  });

  it('should render email, password inputs and a login button', () => {
    render(
      <MemoryRouter>
        <AuthProvider> {/* LoginPage uses useAuth, so it needs a provider */}
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should call login function with email and password on form submit', async () => {
    render(
      <MemoryRouter>
        {/* Provide the mock value for AuthContext */}
        <AuthContext.Provider value={mockUseAuth}>
          <LoginPage />
        </AuthContext.Provider>
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
    // errorを直接セットした状態でProviderに渡す
    const mockUseAuthWithError = {
      currentUser: null,
      isLoading: false,
      error: "Invalid credentials", // ここでセット
      login: jest.fn(),
      logout: jest.fn(),
      signup: jest.fn(),
    };
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockUseAuthWithError}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

   it('should disable button and show loading text when isLoading is true', () => {
    const loadingMockUseAuth = {
      ...mockUseAuth,
      isLoading: true,
    };

    render(
      <MemoryRouter>
        <AuthContext.Provider value={loadingMockUseAuth}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('button', { name: /logging in.../i });
    expect(loginButton).toBeDisabled();
  });
});
