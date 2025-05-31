// src/services/authService.ts

export interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

export interface AuthServiceInterface {
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<User | null>;
}

// Mock implementation
class MockAuthService implements AuthServiceInterface {
  private mockUser: User | null = null;

  async login(email: string, _password: string): Promise<User> { // password -> _password
    console.log(`Attempting login with email: ${email}`); // For debugging
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate a real authentication check
        if (email === 'test@example.com' && _password === 'password') { // password -> _password
          this.mockUser = { id: '1', email: email };
          console.log('Login successful:', this.mockUser); // For debugging
          resolve(this.mockUser);
        } else if (email === 'error@example.com') { // Simulate a server error
          console.error('Login failed: Simulated server error'); // For debugging
          reject(new Error('Simulated server error during login.'));
        }
        // Removed the direct use of _password in the else condition, as it was just for the 'test@example.com' case
        else {
          console.warn('Login failed: Invalid credentials'); // For debugging
          reject(new Error('Invalid email or password'));
        }
      }, 1000); // Simulate network delay
    });
  }

  async signup(email: string, _password: string): Promise<User> { // password -> _password
    console.log(`Attempting signup with email: ${email}`); // For debugging
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate user creation
        if (email.includes('@')) {
          this.mockUser = { id: Date.now().toString(), email: email };
          console.log('Signup successful:', this.mockUser); // For debugging
          resolve(this.mockUser);
        } else {
          console.warn('Signup failed: Invalid email'); // For debugging
          reject(new Error('Invalid email format for signup.'));
        }
      }, 1000); // Simulate network delay
    });
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.mockUser = null;
        console.log('Logout successful'); // For debugging
        resolve();
      }, 500); // Simulate network delay
    });
  }

  async getCurrentUser(): Promise<User | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('getCurrentUser called, returning:', this.mockUser); // For debugging
        resolve(this.mockUser);
      }, 200); // Simulate network delay
    });
  }
}

// Export an instance of the mock service.
// In a real application, you might inject a different implementation
// (e.g., one that talks to a real backend) here based on the environment.
const authService: AuthServiceInterface = new MockAuthService();

export default authService;
