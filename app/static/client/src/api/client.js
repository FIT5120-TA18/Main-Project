import axios from 'axios';

const API_BASE_URL = 'http://localhost:3333/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitProfile = (profileData) =>
  client.post('/profile', profileData);

export const submitPathways = (pathwaysData) =>
  client.post('/pathways', pathwaysData);

export const getResults = (resultParams) =>
  client.post('/results', resultParams);

export default client;
