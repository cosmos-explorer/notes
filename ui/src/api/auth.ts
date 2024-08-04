import apiClient from './client';

interface LoginResponse {
  access_token: string;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export const signin = async (credentials: { username: string; password: string }): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/users/signin', credentials);
  return response.data;
};

export const signup = async (userData: { username: string; password: string }): Promise<LoginResponse> => {
  const response = await apiClient.post('/users/signup', userData);
  return response.data;
};

export const getProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/users/profile');
  return response.data;
};
