import API from './api';

export const login = async (email: string, password: string) => {
  const response = await API.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await API.post('/users/register', data);
  return response.data;
};

export const uploadUserPhoto = async (userId: number, file: File) => {
  const formData = new FormData();
  formData.append('photo', file);

  return await fetch(`http://localhost:3000/users/${userId}/photo`, {
    method: 'POST',
    body: formData,
  });
};
