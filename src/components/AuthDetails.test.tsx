import { render, screen, fireEvent, waitFor } from '@testing-library/react'; // Removed React import
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import { AuthContext, type AuthContextType } from '../contexts/AuthContext'; // type-only for AuthContextType
import AuthDetails from './AuthDetails';
import type { User } from '../services/authService'; // type-only for User

// Default mock AuthContext value
const mockAuthContextValue: AuthContextType = {
  currentUser: null,
  isLoading: false,
  error: null,
  login: jest.fn(),
  logout: jest.fn().mockResolvedValue(undefined),
  signup: jest.fn(),
};

// Updated Helper function to render with a specific AuthContext value and MemoryRouter
const renderAuthDetailsWithRouter = (
  providerProps: Partial<AuthContextType>
) => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ ...mockAuthContextValue, ...providerProps }}>
        <AuthDetails />
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('AuthDetails Component', () => {
  const mockUser: User = { id: '1', email: 'testuser@example.com' };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    // Re-initialize mock functions for AuthContext for each test to ensure isolation
    mockAuthContextValue.login = jest.fn();
    mockAuthContextValue.logout = jest.fn().mockResolvedValue(undefined);
    mockAuthContextValue.signup = jest.fn();
  });

  describe('When a user is logged in', () => {
    // Removed beforeEach that rendered here. Rendering will happen in each test.

    test('displays the user\'s email correctly', () => {
      renderAuthDetailsWithRouter({ currentUser: mockUser });
      // The text "Logged in as:" and the email might be in separate elements or have spaces.
      // A more robust way is to check for the container of this text.
      const container = screen.getByText((content, element) => {
        // Check if the element is a paragraph
        if (element?.tagName.toLowerCase() === 'p') {
          // Check if the text content contains both parts
          const hasLoggedInAs = content.includes('Logged in as:');
          const hasEmail = content.includes(mockUser.email);
          return hasLoggedInAs && hasEmail;
        }
        return false;
      });
      expect(container).toBeInTheDocument();
      // More specific check for the email itself if needed
      expect(screen.getByText(mockUser.email, { exact: false })).toBeInTheDocument();
    });

    test('displays a "Logout" button', () => {
      renderAuthDetailsWithRouter({ currentUser: mockUser });
      expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
    });

    test('does NOT display Login and Sign Up links/buttons', () => {
      renderAuthDetailsWithRouter({ currentUser: mockUser });
      expect(screen.queryByRole('link', { name: /login/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /sign up/i })).not.toBeInTheDocument();
    });

    test('calls the logout function from context when "Logout" button is clicked', async () => {
      const logoutMock = jest.fn().mockResolvedValue(undefined);
      renderAuthDetailsWithRouter({ currentUser: mockUser, logout: logoutMock });

      fireEvent.click(screen.getByRole('button', { name: /logout/i }));

      await waitFor(() => {
        expect(logoutMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('When no user is logged in', () => {
    // Removed beforeEach that rendered here as well.

    test('displays a "You are not logged in." message', () => {
      renderAuthDetailsWithRouter({ currentUser: null });
      expect(screen.getByText(/you are not logged in./i)).toBeInTheDocument();
    });

    test('displays Login and Sign Up links/buttons', () => {
      renderAuthDetailsWithRouter({ currentUser: null });
      expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    });

    test('does NOT display user email', () => {
      renderAuthDetailsWithRouter({ currentUser: null });
      expect(screen.queryByText(mockUser.email, { exact: false })).not.toBeInTheDocument();
      expect(screen.queryByText(/logged in as:/i)).not.toBeInTheDocument();
    });

    test('does NOT display "Logout" button', () => {
      renderAuthDetailsWithRouter({ currentUser: null });
      expect(screen.queryByRole('button', { name: /logout/i })).not.toBeInTheDocument();
    });
  });
});
