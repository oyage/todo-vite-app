import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth, type AuthContextType } from './AuthContext'; // type-only for AuthContextType
import authService from '../services/authService'; // Import the actual service to be mocked
import type { User } from '../services/authService'; // type-only for User type

// Mock the authService
jest.mock('../services/authService', () => ({
  __esModule: true,
  default: {
    getCurrentUser: jest.fn(),
    login: jest.fn(),
    signup: jest.fn(),
    logout: jest.fn(),
  },
}));

const mockAuthService = authService as jest.Mocked<typeof authService>; // Typecast for mock functions

const TestConsumerComponent: React.FC = () => {
  const auth = useAuth();
  if (!auth) return null;
  return (
    <div>
      <div data-testid="currentUser">{JSON.stringify(auth.currentUser)}</div>
      <div data-testid="isLoading">{auth.isLoading.toString()}</div>
      <div data-testid="error">{auth.error}</div>
      <button onClick={() => auth.login('test@example.com', 'password')}>Login</button>
      <button onClick={() => auth.signup('new@example.com', 'newpassword')}>Signup</button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  const mockUser: User = { id: '1', email: 'test@example.com' };

  beforeEach(() => {
    // Reset mocks before each test
    mockAuthService.getCurrentUser.mockReset();
    mockAuthService.login.mockReset();
    mockAuthService.signup.mockReset();
    mockAuthService.logout.mockReset();
  });

  describe('Initial State and getCurrentUser', () => {
    it('should be loading initially and then call getCurrentUser, setting user if found', async () => {
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
      let getByTestId: (text: string) => HTMLElement;
      await act(async () => {
        const { getByTestId: getByTestIdRender } = render(
          <AuthProvider>
            <TestConsumerComponent />
          </AuthProvider>
        );
        getByTestId = getByTestIdRender;
      });

      expect(getByTestId!('isLoading').textContent).toBe('false'); // Should be false after check
      expect(getByTestId!('currentUser').textContent).toBe(JSON.stringify(mockUser));
      expect(mockAuthService.getCurrentUser).toHaveBeenCalledTimes(1);
      expect(getByTestId!('error').textContent).toBe('');
    });

    it('should be loading initially and then call getCurrentUser, setting user to null if not found', async () => {
      mockAuthService.getCurrentUser.mockResolvedValue(null);
      let getByTestId: (text: string) => HTMLElement;
      await act(async () => {
        const { getByTestId: getByTestIdRender } = render(
          <AuthProvider>
            <TestConsumerComponent />
          </AuthProvider>
        );
        getByTestId = getByTestIdRender;
      });
      expect(getByTestId!('isLoading').textContent).toBe('false');
      expect(getByTestId!('currentUser').textContent).toBe('null');
      expect(mockAuthService.getCurrentUser).toHaveBeenCalledTimes(1);
    });
     it('should handle errors from getCurrentUser', async () => {
      mockAuthService.getCurrentUser.mockRejectedValue(new Error('Failed to fetch user'));
      let getByTestId: (text: string) => HTMLElement;
      await act(async () => {
        const { getByTestId: getByTestIdRender } = render(
          <AuthProvider>
            <TestConsumerComponent />
          </AuthProvider>
        );
        getByTestId = getByTestIdRender;
      });
      expect(getByTestId!('isLoading').textContent).toBe('false');
      expect(getByTestId!('currentUser').textContent).toBe('null');
      // Note: The current AuthContext doesn't explicitly set an error for getCurrentUser failure,
      // it just resolves to user being null. If it were to set an error, we'd test that here.
    });
  });

  describe('Login Function', () => {
    it('should call authService.login and update currentUser on success', async () => {
      mockAuthService.getCurrentUser.mockResolvedValue(null); // Start with no user
      mockAuthService.login.mockResolvedValue(mockUser);

      let contextValue: AuthContextType | undefined;
      const TestComponent = () => {
        contextValue = useAuth();
        return null;
      };

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(contextValue?.isLoading).toBe(true); // Initial loading from getCurrentUser
      await act(async () => {
        // Wait for initial getCurrentUser to finish
      });
      expect(contextValue?.isLoading).toBe(false);


      await act(async () => {
        await contextValue?.login('test@example.com', 'password');
      });

      expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', 'password');
      expect(contextValue?.currentUser).toEqual(mockUser);
      expect(contextValue?.error).toBeNull();
      expect(contextValue?.isLoading).toBe(false);
    });

    it('should call authService.login and set error on failure', async () => {
      mockAuthService.getCurrentUser.mockResolvedValue(null);
      const loginError = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(loginError);

      let contextValue: AuthContextType | undefined;
      const TestComponent = () => {
        contextValue = useAuth();
        return null;
      };
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      await act(async () => { /* wait for initial load */ });


      await act(async () => {
        await contextValue?.login('wrong@example.com', 'wrongpassword');
      });

      expect(mockAuthService.login).toHaveBeenCalledWith('wrong@example.com', 'wrongpassword');
      expect(contextValue?.currentUser).toBeNull();
      expect(contextValue?.error).toBe(loginError.message);
      expect(contextValue?.isLoading).toBe(false);
    });
  });

  describe('Signup Function', () => {
    it('should call authService.signup and update currentUser on success', async () => {
      mockAuthService.getCurrentUser.mockResolvedValue(null);
      const newUser = { id: '2', email: 'new@example.com' };
      mockAuthService.signup.mockResolvedValue(newUser);

      let contextValue: AuthContextType | undefined;
      const TestComponent = () => {
        contextValue = useAuth();
        return null;
      };
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      await act(async () => { /* wait for initial load */ });

      await act(async () => {
        await contextValue?.signup('new@example.com', 'newpassword');
      });

      expect(mockAuthService.signup).toHaveBeenCalledWith('new@example.com', 'newpassword');
      expect(contextValue?.currentUser).toEqual(newUser);
      expect(contextValue?.error).toBeNull();
      expect(contextValue?.isLoading).toBe(false);
    });

    it('should call authService.signup and set error on failure', async () => {
      mockAuthService.getCurrentUser.mockResolvedValue(null);
      const signupError = new Error('Email already exists');
      mockAuthService.signup.mockRejectedValue(signupError);

      let contextValue: AuthContextType | undefined;
      const TestComponent = () => {
        contextValue = useAuth();
        return null;
      };
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      await act(async () => { /* wait for initial load */ });

      await act(async () => {
        await contextValue?.signup('exists@example.com', 'password');
      });

      expect(mockAuthService.signup).toHaveBeenCalledWith('exists@example.com', 'password');
      expect(contextValue?.currentUser).toBeNull();
      expect(contextValue?.error).toBe(signupError.message);
      expect(contextValue?.isLoading).toBe(false);
    });
  });

  describe('Logout Function', () => {
    it('should call authService.logout and clear currentUser', async () => {
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser); // Start with a logged-in user
      mockAuthService.logout.mockResolvedValue(undefined); // logout resolves to void/undefined

      let contextValue: AuthContextType | undefined;
      const TestComponent = () => {
        contextValue = useAuth();
        return null;
      };
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Wait for initial getCurrentUser to resolve and set user
      await act(async () => {});
      expect(contextValue?.currentUser).toEqual(mockUser);


      await act(async () => {
        await contextValue?.logout();
      });

      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
      expect(contextValue?.currentUser).toBeNull();
      expect(contextValue?.error).toBeNull(); // Error should be cleared on logout
      expect(contextValue?.isLoading).toBe(false);
    });

    it('should handle errors from authService.logout', async () => {
      mockAuthService.getCurrentUser.mockResolvedValue(mockUser);
      const logoutError = new Error('Logout failed');
      mockAuthService.logout.mockRejectedValue(logoutError);

      let contextValue: AuthContextType | undefined;
      const TestComponent = () => {
        contextValue = useAuth();
        return null;
      };
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
      await act(async () => {}); // initial load

      await act(async () => {
        await contextValue?.logout();
      });

      expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
      expect(contextValue?.currentUser).toEqual(mockUser); // User should ideally remain if logout fails
      expect(contextValue?.error).toBe(logoutError.message);
      expect(contextValue?.isLoading).toBe(false);
    });
  });
});
