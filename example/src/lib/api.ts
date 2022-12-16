import axios from 'axios';
import wrapPromise from '../utils/wrapPromise';

const BASE_URL = 'https://images-api.nasa.gov';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export const getNasaData = async (keyword: string, page: number) => {
  const data = await client.get(`/search?q=${keyword}&page=${page}`);
  return data?.data;
};

export function fetchNasaData(keyword: string, page: number) {
  return wrapPromise(getNasaData(keyword, page));
}
