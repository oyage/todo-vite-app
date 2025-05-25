import { TextEncoder } from 'util';
if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Required because AuthDetails uses Link
import AuthDetails from './AuthDetails';
import { AuthContext } from '../contexts/AuthContext'; // Import the context itself

// Mock the AuthContext values
const mockLogout = jest.fn();

const mockAuthContextValueNotAuthenticated = {
  currentUser: null,
  isLoading: false,
  error: null,
  login: jest.fn(),
  logout: mockLogout,
  signup: jest.fn(),
};

const mockAuthContextValueAuthenticated = {
  currentUser: { email: 'test@example.com' },
  isLoading: false,
  error: null,
  login: jest.fn(),
  logout: mockLogout,
  signup: jest.fn(),
};

describe('AuthDetails', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockLogout.mockClear();
  });

  it('should display login and signup links when user is not authenticated', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextValueNotAuthenticated}>
          <AuthDetails />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('You are not logged in.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.queryByText(/logged in as/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
  });

  it('should display user email and logout button when user is authenticated', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextValueAuthenticated}>
          <AuthDetails />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText('Logged in as: test@example.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    expect(screen.queryByText('You are not logged in.')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /sign up/i })).not.toBeInTheDocument();
  });

  it('should call logout function when logout button is clicked', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContextValueAuthenticated}>
          <AuthDetails />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
