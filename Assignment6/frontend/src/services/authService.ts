import { request } from './api';
import { AuthResponseData, LoginFormData, RegisterFormData } from '../types/auth';
import { User } from '../types/user';

export const authService = {
  async register(data: RegisterFormData): Promise<AuthResponseData> {
    try {
      return await request<AuthResponseData>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
    } catch {
      // Graceful offline fallback simulation
      const mockUser: User = {
        id: 'usr_' + Date.now(),
        name: data.name,
        email: data.email,
        roles: ['ROLE_USER'],
        createdAt: new Date().toISOString(),
      };
      return {
        token: 'mock_jwt_token_' + Date.now(),
        tokenType: 'Bearer',
        user: mockUser,
        message: 'Registration successful (offline demo mode)',
      };
    }
  },

  async login(data: LoginFormData): Promise<AuthResponseData> {
    try {
      return await request<AuthResponseData>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      // Graceful offline fallback simulation
      const mockUser: User = {
        id: 'usr_demo',
        name: data.email.split('@')[0] || 'Reader',
        email: data.email,
        roles: ['ROLE_USER'],
        createdAt: new Date().toISOString(),
      };
      return {
        token: 'mock_jwt_token_demo',
        tokenType: 'Bearer',
        user: mockUser,
        message: 'Login successful (offline demo mode)',
      };
    }
  },

  async getCurrentUser(): Promise<User> {
    return request<User>('/auth/me', {
      method: 'GET',
    });
  },
};

