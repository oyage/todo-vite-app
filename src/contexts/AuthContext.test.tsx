import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Helper component to use the hook
const TestConsumerComponent: React.FC = () => {
  const { currentUser, login, logout, signup, error, isLoading } = useAuth();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p data-testid="error-message">{error}</p>}
      {currentUser && <p data-testid="user-email">{currentUser.email}</p>}
      <button onClick={async () => await login('test@example.com', 'password')}>Login Valid</button>
      <button onClick={async () => await login('wrong@example.com', 'wrongpassword')}>Login Invalid</button>
      <button onClick={logout}>Logout</button>
      <button onClick={async () => await signup('newuser@example.com')}>Signup</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('should set currentUser on successful login', async () => {
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login Valid').click();
    });
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
    expect(screen.queryByTestId('error-message')).toBeNull();
  });

  it('should set error on failed login and currentUser should be null', async () => {
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );
    // Ensure currentUser is initially null
    expect(screen.queryByTestId('user-email')).toBeNull();

    await act(async () => {
      screen.getByText('Login Invalid').click();
    });
    expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid email or password');
    expect(screen.queryByTestId('user-email')).toBeNull();
  });

  it('should clear currentUser on logout', async () => {
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    // Login first
    await act(async () => {
      screen.getByText('Login Valid').click();
    });
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');

    // Then logout
    await act(async () => {
      screen.getByText('Logout').click();
    });
    expect(screen.queryByTestId('user-email')).toBeNull();
  });

  it('should set currentUser on successful signup', async () => {
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Signup').click();
    });
    expect(screen.getByTestId('user-email')).toHaveTextContent('newuser@example.com');
    expect(screen.queryByTestId('error-message')).toBeNull();
  });

  it('useAuth outside of AuthProvider should throw an error', () => {
    // Suppress console.error for this specific test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => render(<TestConsumerComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    // Restore console.error
    console.error = originalError;
  });
});
