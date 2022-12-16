import axios from 'axios';

// const BASE_URL = 'https://server.sodam.me';
const BASE_URL = 'https://images-api.nasa.gov';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// https://images-api.nasa.gov/search?q=earth
export const getNasaData = async (keyword: string, page: number) => {
  const data = await client.get(`/search?q=${keyword}&page=${page}`);
  return data?.data;
};
