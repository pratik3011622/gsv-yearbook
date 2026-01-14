const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    console.log('API Request URL:', url);
    console.log('API Base URL:', this.baseURL);
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (token && !options.skipAuth) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('Fetch config:', { method: config.method || 'GET', headers: config.headers });

    try {
      const response = await fetch(url, config);
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      let data;
      try {
        data = await response.json();
        console.log('Response data:', data);
      } catch (jsonError) {
        // If response is not JSON, try to get text
        const text = await response.text();
        console.log('Response text:', text);
        throw new Error(text || 'Invalid response from server');
      }
      return { response, data };
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Error details:', { message: error.message, stack: error.stack });
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    const result = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (result.response.ok && result.data.token) {
      localStorage.setItem('token', result.data.token);
    }
    return result.data;
  }

  async login(credentials) {
    const result = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (result.response.ok && result.data.token) {
      localStorage.setItem('token', result.data.token);
    }
    return result.data;
  }

  async googleLogin(idToken) {
    const result = await this.request('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token: idToken }),
    });
    if (result.response.ok && result.data.token) {
      localStorage.setItem('token', result.data.token);
    }
    return result.data;
  }

  async getCurrentUser() {
    const result = await this.request('/auth/me');
    return result.data;
  }

  // Profile endpoints
  async getProfiles() {
    const result = await this.request('/profiles');
    return result.data;
  }

  async getProfile(id) {
    const result = await this.request(`/profiles/${id}`);
    return result.data;
  }

  async updateProfile(updates) {
    const result = await this.request('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return result.data;
  }


  // Memories endpoints
  async getMemories() {
    const result = await this.request('/memories');
    return result.data;
  }

  async createMemory(memoryData, imageFile) {
    const formData = new FormData();
    Object.keys(memoryData).forEach(key => {
      formData.append(key, memoryData[key]);
    });
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const result = await this.request('/memories', {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData,
    });
    return result.data;
  }

  async uploadPhoto(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const result = await this.request('/memories/upload', {
      method: 'POST',
      headers: {}, // Let browser set content-type for FormData
      body: formData,
    });
    return result.data;
  }

  async deleteMemory(memoryId) {
    const result = await this.request(`/memories/${memoryId}`, {
      method: 'DELETE',
    });
    return result.data;
  }

  // Events endpoints
  async getEvents() {
    const result = await this.request('/events');
    return result.data;
  }

  async createEvent(eventData) {
    const result = await this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    return result.data;
  }

  async updateEvent(eventId, updates) {
    const result = await this.request(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return result.data;
  }

  async deleteEvent(eventId) {
    const result = await this.request(`/events/${eventId}`, {
      method: 'DELETE',
    });
    return result.data;
  }

  async rsvpToEvent(eventId, status) {
    const result = await this.request(`/events/${eventId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
    return result.data;
  }

  // Jobs endpoints
  async getJobs() {
    const result = await this.request('/jobs');
    return result.data;
  }

  async createJob(jobData) {
    const result = await this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
    return result.data;
  }

  async updateJob(jobId, updates) {
    const result = await this.request(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return result.data;
  }

  async deleteJob(jobId) {
    const result = await this.request(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
    return result.data;
  }

  // Stories endpoints
  async getStories() {
    const result = await this.request('/stories');
    return result.data;
  }

  async getFeaturedStories() {
    const result = await this.request('/stories/featured');
    return result.data;
  }

  async getStory(storyId) {
    const result = await this.request(`/stories/${storyId}`);
    return result.data;
  }

  async createStory(storyData) {
    const result = await this.request('/stories', {
      method: 'POST',
      body: JSON.stringify(storyData),
    });
    return result.data;
  }

  async updateStory(storyId, updates) {
    const result = await this.request(`/stories/${storyId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return result.data;
  }

  async deleteStory(storyId) {
    const result = await this.request(`/stories/${storyId}`, {
      method: 'DELETE',
    });
    return result.data;
  }

  // Mentorship endpoints
  async getMySessions() {
    const result = await this.request('/mentorship/my-sessions');
    return result.data;
  }

  async requestMentorship(requestData) {
    const result = await this.request('/mentorship/request', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
    return result.data;
  }

  async getAvailableMentors() {
    const result = await this.request('/mentorship/mentors/available');
    return result.data;
  }


  // Stats endpoints
  async getPlatformStats() {
    const result = await this.request('/stats');
    return result.data;
  }

  async updatePlatformStats() {
    const result = await this.request('/stats/update', {
      method: 'POST',
    });
    return result.data;
  }
}

export const api = new ApiClient();

export const staticBaseURL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:5000';