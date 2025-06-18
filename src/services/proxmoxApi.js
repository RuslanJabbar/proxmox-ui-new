// src/services/proxmoxApi.js
import axios from 'axios';

class ProxmoxAPI {
  constructor() {
    this.baseURL = '/api2/json'; // Using proxy, so relative URL
    this.ticket = null;
    this.CSRFPreventionToken = null;
    this.username = null;
    
    // Create axios instance with credentials
    this.api = axios.create({
      baseURL: this.baseURL,
      withCredentials: true, // Important for cookies
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor to include auth headers
    this.api.interceptors.request.use(
      config => {
        // Proxmox expects the ticket in the Cookie header
        if (this.ticket) {
          config.headers['Cookie'] = `PVEAuthCookie=${this.ticket}`;
        }
        
        // CSRF token is needed for non-GET requests
        if (this.CSRFPreventionToken && config.method !== 'get') {
          config.headers['CSRFPreventionToken'] = this.CSRFPreventionToken;
        }
        
        return config;
      },
      error => Promise.reject(error)
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          // Token expired or invalid
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(username, password, realm = 'pam') {
    try {
      // Create form data for login (Proxmox expects form data, not JSON)
      const formData = new URLSearchParams();
      formData.append('username', `${username}@${realm}`);
      formData.append('password', password);

      const response = await axios.post('/api2/json/access/ticket', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      const { data } = response.data;
      this.ticket = data.ticket;
      this.CSRFPreventionToken = data.CSRFPreventionToken;
      this.username = data.username;

      // Store in localStorage for persistence
      localStorage.setItem('PVEAuthCookie', this.ticket);
      localStorage.setItem('CSRFPreventionToken', this.CSRFPreventionToken);
      localStorage.setItem('username', data.username);

      // Set cookie for subsequent requests
      document.cookie = `PVEAuthCookie=${this.ticket}; path=/`;

      return { success: true, data };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.errors || error.message 
      };
    }
  }

  logout() {
    this.ticket = null;
    this.CSRFPreventionToken = null;
    this.username = null;
    localStorage.removeItem('PVEAuthCookie');
    localStorage.removeItem('CSRFPreventionToken');
    localStorage.removeItem('username');
    // Clear cookie
    document.cookie = 'PVEAuthCookie=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  }

  // Check if user is authenticated
  isAuthenticated() {
    const ticket = localStorage.getItem('PVEAuthCookie');
    if (ticket) {
      this.ticket = ticket;
      this.CSRFPreventionToken = localStorage.getItem('CSRFPreventionToken');
      this.username = localStorage.getItem('username');
      // Restore cookie
      document.cookie = `PVEAuthCookie=${this.ticket}; path=/`;
      return true;
    }
    return false;
  }

  // Get cluster status
  async getClusterStatus() {
    try {
      const response = await this.api.get('/cluster/status');
      return response.data;
    } catch (error) {
      console.error('Failed to get cluster status:', error);
      throw error;
    }
  }

  // Get nodes
  async getNodes() {
    try {
      const response = await this.api.get('/nodes');
      return response.data;
    } catch (error) {
      console.error('Failed to get nodes:', error);
      throw error;
    }
  }

  // Get node status
  async getNodeStatus(node) {
    try {
      const response = await this.api.get(`/nodes/${node}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get node status:', error);
      throw error;
    }
  }

  // Get all VMs across all nodes
  async getAllVMs() {
    try {
      const response = await this.api.get('/cluster/resources', {
        params: { type: 'vm' }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get VMs:', error);
      throw error;
    }
  }

  // Get VMs for a specific node
  async getNodeVMs(node) {
    try {
      const response = await this.api.get(`/nodes/${node}/qemu`);
      return response.data;
    } catch (error) {
      console.error('Failed to get node VMs:', error);
      throw error;
    }
  }

  // Get containers for a node
  async getNodeContainers(node) {
    try {
      const response = await this.api.get(`/nodes/${node}/lxc`);
      return response.data;
    } catch (error) {
      console.error('Failed to get containers:', error);
      throw error;
    }
  }

  // Get storage for all nodes
  async getStorage() {
    try {
      const response = await this.api.get('/cluster/resources', {
        params: { type: 'storage' }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get storage:', error);
      throw error;
    }
  }

  // Get storage for a specific node
  async getNodeStorage(node) {
    try {
      const response = await this.api.get(`/nodes/${node}/storage`);
      return response.data;
    } catch (error) {
      console.error('Failed to get node storage:', error);
      throw error;
    }
  }

  // Get cluster resources summary
  async getClusterResources() {
    try {
      const response = await this.api.get('/cluster/resources');
      return response.data;
    } catch (error) {
      console.error('Failed to get cluster resources:', error);
      throw error;
    }
  }

  // Get tasks/events
  async getTasks(limit = 50) {
    try {
      const response = await this.api.get('/cluster/tasks', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get tasks:', error);
      throw error;
    }
  }
}

export default new ProxmoxAPI();