import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    console.log('Agregando token a la solicitud:', token);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  console.error('Error en la solicitud:', error);
  return Promise.reject(error);
});

export const getProtectedResource = () => API.get('/protected');
export const loginUser = (data) => API.post('/users/login', data);
export const registerUser = (data) => API.post('/users/register', data);
export const getTeams = () => API.get('/teams');
export const getPlayers = () => API.get('/players');
export const getMatches = () => API.get('/matches');
export const getMatchById = (id) => API.get(`/matches/${id}`);
export const createMatch = (data) => API.post('/matches', data);
