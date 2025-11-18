import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 'default-tenant-id';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add tenant ID to all requests
api.interceptors.request.use((config) => {
  if (!config.params) {
    config.params = {};
  }
  if (!config.params.tenantId) {
    config.params.tenantId = TENANT_ID;
  }
  return config;
});

// Tickets API
export const ticketsApi = {
  getAll: (filters?: any) => api.get('/tickets', { params: filters }),
  getOne: (id: string) => api.get(`/tickets/${id}`),
  create: (data: any) => api.post('/tickets', { ...data, tenantId: TENANT_ID }),
  update: (id: string, data: any) => api.patch(`/tickets/${id}`, data),
  delete: (id: string) => api.delete(`/tickets/${id}`),
  getStats: () => api.get('/tickets/stats'),
};

// Messages API
export const messagesApi = {
  create: (data: any) => api.post('/messages', data),
  getByTicket: (ticketId: string) => api.get(`/messages/ticket/${ticketId}`),
};

// Suggestions API
export const suggestionsApi = {
  generate: (ticketId: string, model?: string) =>
    api.post('/suggestions/generate', { ticketId, model }),
  getByTicket: (ticketId: string) => api.get(`/suggestions/ticket/${ticketId}`),
  delete: (id: string) => api.delete(`/suggestions/${id}`),
};

// Agents API
export const agentsApi = {
  getAll: () => api.get('/agents'),
  getOne: (id: string) => api.get(`/agents/${id}`),
  create: (data: any) => api.post('/agents', { ...data, tenantId: TENANT_ID }),
  update: (id: string, data: any) => api.patch(`/agents/${id}`, data),
  delete: (id: string) => api.delete(`/agents/${id}`),
};

// Channels API
export const channelsApi = {
  getAll: () => api.get('/channels'),
  getOne: (id: string) => api.get(`/channels/${id}`),
  create: (data: any) => api.post('/channels', { ...data, tenantId: TENANT_ID }),
  update: (id: string, data: any) => api.patch(`/channels/${id}`, data),
  delete: (id: string) => api.delete(`/channels/${id}`),
};
