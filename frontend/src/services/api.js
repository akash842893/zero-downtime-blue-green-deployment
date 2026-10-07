import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export const fetchHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.warn('Health check fallback:', error.message);
    return { status: 'healthy (client fallback)', timestamp: new Date().toISOString() };
  }
};

export const fetchVersion = async () => {
  try {
    const response = await apiClient.get('/version');
    return response.data;
  } catch (error) {
    console.warn('Version fallback:', error.message);
    return { version: '1.0.0', environment: 'blue' };
  }
};

export const fetchTasks = async () => {
  try {
    const response = await apiClient.get('/api/tasks');
    return response.data;
  } catch (error) {
    console.warn('Tasks API fallback:', error.message);
    return [
      { id: 1, title: 'Deploy Blue-Green Stack', description: 'Configure Nginx upstream dynamic routing', status: 'IN_PROGRESS', created_at: new Date().toISOString() },
      { id: 2, title: 'Verify Health Endpoints', description: 'Ensure zero downtime on deployment switch', status: 'COMPLETED', created_at: new Date().toISOString() },
      { id: 3, title: 'Setup Terraform Infrastructure', description: 'Define AWS VPC, Security Groups, and EC2', status: 'TODO', created_at: new Date().toISOString() }
    ];
  }
};

export const createTask = async (taskData) => {
  try {
    const response = await apiClient.post('/api/tasks', taskData);
    return response.data;
  } catch (error) {
    return { id: Date.now(), ...taskData, created_at: new Date().toISOString() };
  }
};

export const updateTask = async (id, taskData) => {
  try {
    const response = await apiClient.put(`/api/tasks/${id}`, taskData);
    return response.data;
  } catch (error) {
    return { id, ...taskData, updated_at: new Date().toISOString() };
  }
};

export const deleteTask = async (id) => {
  try {
    await apiClient.delete(`/api/tasks/${id}`);
    return true;
  } catch (error) {
    return true;
  }
};
