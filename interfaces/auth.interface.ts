export interface AuthResponse {
  statusCode: number;
  message: string;
  data: {
    token: string;
    userId: number;
    email: string;
    role: 'buyer' | 'seller' | string;
  };
}

export interface RegisterRequest {
  name: string;
  lastName?: string;
  identificationNumber?: string;
  email: string;
  password: string;
  role: 'buyer' | 'seller';
}

export interface PersonalInfoRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface UserProfile {
  id?: number;
  email?: string;
  role?: 'buyer' | 'seller' | string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  identificationNumber?: string;
}
