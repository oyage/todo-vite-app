import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext, AuthProvider } from '../contexts/AuthContext'; // Use actual AuthProvider for wrapping

// Mock child component
const MockChildComponent: React.FC = () => <div data-testid="child-component">Protected Content</div>;
const MockLoginComponent: React.FC = () => <div data-testid="login-page">Login Page</div>;


describe('ProtectedRoute', () => {
  it('should redirect to /login if user is not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AuthProvider> {/* Use actual AuthProvider, initial state is unauthenticated */}
          <Routes>
            <Route path="/login" element={<MockLoginComponent />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <MockChildComponent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // Check if redirected to login page
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('child-component')).not.toBeInTheDocument();
  });

  it('should render child component if user is authenticated', () => {
    // Custom provider that simulates a logged-in user
    const mockAuthValue = {
      currentUser: { email: 'test@example.com' },
      isLoading: false,
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      signup: jest.fn(),
    };

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AuthContext.Provider value={mockAuthValue}>
          <Routes>
            <Route path="/login" element={<MockLoginComponent />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <MockChildComponent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Check if child component is rendered
    expect(screen.getByTestId('child-component')).toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });

  it('should show nothing (or a loader) if isLoading is true', () => {
     const mockAuthValueLoading = {
      currentUser: null,
      isLoading: true, // Simulate loading state
      error: null,
      login: jest.fn(),
      logout: jest.fn(),
      signup: jest.fn(),
    };
    const { container } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <AuthContext.Provider value={mockAuthValueLoading}>
           <Routes>
            <Route path="/login" element={<MockLoginComponent />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <MockChildComponent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </MemoryRouter>
    );
    // Expect the component to render nothing, or a specific loading indicator if implemented
    expect(container.firstChild).toBeNull(); // Or check for loading spinner's test ID
    expect(screen.queryByTestId('child-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
  });
});
