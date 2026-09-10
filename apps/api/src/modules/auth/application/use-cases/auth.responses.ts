import { UserData } from '../../domain/interfaces/auth.repository.interface';

export interface RegisterResponse {
  user: UserData;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: UserData;
  accessToken: string;
  refreshToken: string;
}
