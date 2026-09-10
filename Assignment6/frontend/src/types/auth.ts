import { User } from './user';

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthResponseData {
  token: string;
  tokenType: string;
  user: User;
  message: string;
}
