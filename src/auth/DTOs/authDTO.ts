export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  message?: string;
}
