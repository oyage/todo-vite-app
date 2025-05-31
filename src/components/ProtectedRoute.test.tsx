import React from 'react'; // React might be needed if TestChildComponent uses JSX directly in this file
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthContext, type AuthContextType } from '../contexts/AuthContext'; // type-only for AuthContextType
import ProtectedRoute from './ProtectedRoute'; // The component to test
import type { User } from '../services/authService'; // type-only for User

// Mock react-router-dom's Navigate component
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  Navigate: jest.fn(({ to, replace }) => (
    <div data-testid="mock-navigate" data-to={to} data-replace={replace?.toString()}>
      MockNavigate
    </div>
  )),
}));
const MockNavigate = require('react-router-dom').Navigate as jest.Mock;


// Default mock AuthContext value
const mockAuthContextValue: AuthContextType = {
  currentUser: null,
  isLoading: false,
  error: null,
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn(),
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

// A simple child component to test rendering
const TestChildComponent: React.FC = () => <div data-testid="test-child">Child Content</div>;

describe('ProtectedRoute Component', () => {
  const mockUser: User = { id: '1', email: 'testuser@example.com' };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    MockNavigate.mockClear(); // Clear mock calls for Navigate
  });

  describe('When isLoading is true', () => {
    test('renders null and does not render children', () => {
      const { container } = renderWithAuthContext(
        <ProtectedRoute>
          <TestChildComponent />
        </ProtectedRoute>,
        { isLoading: true, currentUser: null } // currentUser can be anything if isLoading is true
      );

      // ProtectedRoute renders null when loading
      expect(container.firstChild).toBeNull();
      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
      expect(MockNavigate).not.toHaveBeenCalled();
    });

    test('renders null even if there is a current user', () => {
       const { container } = renderWithAuthContext(
        <ProtectedRoute>
          <TestChildComponent />
        </ProtectedRoute>,
        { isLoading: true, currentUser: mockUser }
      );
      expect(container.firstChild).toBeNull();
      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
      expect(MockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('When isLoading is false and currentUser is null (no authenticated user)', () => {
    beforeEach(() => {
      renderWithAuthContext(
        <ProtectedRoute>
          <TestChildComponent />
        </ProtectedRoute>,
        { isLoading: false, currentUser: null }
      );
    });

    test('renders <Navigate to="/login" replace />', () => {
      expect(MockNavigate).toHaveBeenCalledTimes(1);

      // Check props of the mocked Navigate component
      const navigateMockElement = screen.getByTestId('mock-navigate');
      expect(navigateMockElement).toBeInTheDocument();
      expect(navigateMockElement).toHaveAttribute('data-to', '/login');
      expect(navigateMockElement).toHaveAttribute('data-replace', 'true');
    });

    test('does not render children', () => {
      expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
    });
  });

  describe('When isLoading is false and currentUser is not null (authenticated user)', () => {
    beforeEach(() => {
      renderWithAuthContext(
        <ProtectedRoute>
          <TestChildComponent />
        </ProtectedRoute>,
        { isLoading: false, currentUser: mockUser }
      );
    });

    test('renders its children', () => {
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    test('does not render Navigate component', () => {
      expect(MockNavigate).not.toHaveBeenCalled();
      expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
    });
  });
});
