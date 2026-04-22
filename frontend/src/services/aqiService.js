import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/aqi';

export const getAllStations = async () => {
  const response = await axios.get(`${BASE_URL}/all`);
  return response.data.data;
};

export const getStationById = async (id) => {
  const response = await axios.get(`${BASE_URL}/station/${id}`);
  return response.data.data;
};

export const getStationHistory = async (id, hours = 168) => {
  const response = await axios.get(`${BASE_URL}/history/${id}?hours=${hours}`);
  return response.data.data;
};

export const searchCity = async (city) => {
  const response = await axios.get(`${BASE_URL}/search?city=${city}`);
  return response.data;
};

export const getStationForecast = async (id) => {
  const response = await axios.get(`${BASE_URL}/forecast/${id}`);
  return response.data.data;
};