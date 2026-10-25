/**
 * Loopify Campus Enterprise API Client
 * Connects directly to Spring Boot REST backend on http://localhost:8080/api/v1
 * Provides automatic token injection, error handling, health detection, and graceful fallback.
 */

const DEFAULT_API_URL = 'http://localhost:8080/api/v1';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL;

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

export const api = {
  getToken(): string {
    return localStorage.getItem('loopify_jwt_token') || localStorage.getItem('reloop_auth_token') || '';
  },

  setToken(token: string): void {
    localStorage.setItem('loopify_jwt_token', token);
    localStorage.setItem('reloop_auth_token', token);
  },

  clearToken(): void {
    localStorage.removeItem('loopify_jwt_token');
    localStorage.removeItem('reloop_auth_token');
  },

  getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  },

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText);
      throw new Error(`API GET Error (${response.status}): ${errText}`);
    }
    return response.json();
  },

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText);
      throw new Error(`API POST Error (${response.status}): ${errText}`);
    }
    return response.json();
  },

  async put<T>(endpoint: string, body: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText);
      throw new Error(`API PUT Error (${response.status}): ${errText}`);
    }
    return response.json();
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText);
      throw new Error(`API DELETE Error (${response.status}): ${errText}`);
    }
    return response.status === 204 ? ({} as T) : response.json();
  },

  // Health and connectivity probe
  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/items`, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  },

  // Authentication endpoints
  async login(credentials: { email: string; password: string }) {
    const result = await this.post<{ token: string; user: any }>('/auth/login', credentials);
    if (result && result.token) {
      this.setToken(result.token);
    }
    return result;
  },

  async register(data: { fullName: string; email: string; password: string; departmentId?: string; role?: string }) {
    const result = await this.post<{ token: string; user: any }>('/auth/register', data);
    if (result && result.token) {
      this.setToken(result.token);
    }
    return result;
  },

  async getMe() {
    return this.get<any>('/auth/me');
  },

  // Inventory API
  async getInventory() {
    return this.get<any[]>('/items');
  },

  async createInventoryItem(item: any) {
    return this.post<any>('/items', item);
  },

  async updateInventoryItem(id: string, updates: any) {
    return this.put<any>(`/items/${id}`, updates);
  },

  async deleteInventoryItem(id: string) {
    return this.delete<any>(`/items/${id}`);
  },

  // Events API
  async getEvents() {
    return this.get<any[]>('/events');
  },

  async createEvent(event: any) {
    return this.post<any>('/events', event);
  },

  async getEventReadiness(eventId: string) {
    return this.get<any>(`/events/${eventId}/readiness`);
  },

  // Reservations API
  async getReservations() {
    return this.get<any[]>('/reservations');
  },

  async createReservation(data: { eventId: string; requesterUserId: string; items: any[] }) {
    return this.post<any>('/reservations', data);
  },

  async approveReservation(reservationId: string, payload?: { reviewerUserId?: string; notes?: string }) {
    return this.post<any>(`/reservations/${reservationId}/approve`, payload || {});
  },

  async rejectReservation(reservationId: string, payload?: { reviewerUserId?: string; reason?: string }) {
    return this.post<any>(`/reservations/${reservationId}/reject`, payload || {});
  },

  async cancelReservation(reservationId: string, payload?: { userId?: string }) {
    return this.post<any>(`/reservations/${reservationId}/cancel`, payload || {});
  },

  // Handovers & Returns
  async recordHandover(data: any) {
    return this.post<any>('/handovers', data);
  },

  async recordReturn(data: any) {
    return this.post<any>('/returns', data);
  },

  // Condition Inspections & Workshop Repairs
  async getInspections() {
    return this.get<any[]>('/inspections');
  },

  async recordInspection(data: any) {
    return this.post<any>('/inspections', data);
  },

  async getRepairs() {
    return this.get<any[]>('/repairs');
  },

  async updateRepair(repairId: string, data: any) {
    return this.put<any>(`/repairs/${repairId}`, data);
  },

  // QR Reuse Passport
  async getPassport(tokenOrBarcode: string) {
    return this.get<any>(`/passport/${tokenOrBarcode}`);
  },

  // Sustainability & Unfulfilled Demand Reports
  async getReportsSummary() {
    return this.get<any>('/reports/summary');
  },

  async getUnfulfilledRequests() {
    return this.get<any[]>('/reports/unfulfilled');
  },
};
