import { Instrument, QuizQuestion } from '../types.ts';

const BASE_URL = '/api';

export const api = {
  async getAllInstruments(params?: {
    search?: string;
    state?: string;
    family?: string;
    region?: string;
    sort?: string;
  }): Promise<Instrument[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.state && params.state !== 'All') query.append('state', params.state);
    if (params?.family && params.family !== 'All') query.append('family', params.family);
    if (params?.region && params.region !== 'All') query.append('region', params.region);
    if (params?.sort) query.append('sort', params.sort);

    const res = await fetch(`${BASE_URL}/instruments?${query.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch instruments: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
  },

  async getFeaturedInstruments(): Promise<Instrument[]> {
    const res = await fetch(`${BASE_URL}/instruments/featured`);
    if (!res.ok) {
      throw new Error(`Failed to fetch featured instruments: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data || [];
  },

  async getInstrumentById(id: string): Promise<Instrument> {
    const res = await fetch(`${BASE_URL}/instruments/${encodeURIComponent(id)}`);
    if (!res.ok) {
      throw new Error(`Instrument not found: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data;
  },

  async getRandomInstrument(): Promise<Instrument> {
    const res = await fetch(`${BASE_URL}/instruments/random`);
    if (!res.ok) {
      throw new Error(`Failed to fetch random instrument`);
    }
    const json = await res.json();
    return json.data;
  },

  async getInstrumentsByState(state: string): Promise<Instrument[]> {
    const res = await fetch(`${BASE_URL}/instruments/state/${encodeURIComponent(state)}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch instruments for state ${state}`);
    }
    const json = await res.json();
    return json.data || [];
  },

  async search(query: string): Promise<Instrument[]> {
    const res = await fetch(`${BASE_URL}/instruments/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      throw new Error(`Search failed`);
    }
    const json = await res.json();
    return json.data || [];
  },

  async getQuiz(): Promise<QuizQuestion[]> {
    const res = await fetch(`${BASE_URL}/quiz`);
    if (!res.ok) {
      throw new Error(`Failed to load quiz`);
    }
    const json = await res.json();
    return json.data || [];
  },
};
