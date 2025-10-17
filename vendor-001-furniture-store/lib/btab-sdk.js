/**
 * BTAB SDK for Vendor Sites
 * Provides easy integration with BTAB API
 */

import axios from 'axios';

class BTABClient {
  constructor(apiKey, options = {}) {
    this.apiKey = apiKey || process.env.BTAB_API_KEY;
    this.baseURL = options.baseURL || process.env.NEXT_PUBLIC_API_URL || 'https://api.btab.app/api/v1';

    // Create axios instance with defaults
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: options.timeout || 10000
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          console.error('Invalid API key or expired session');
        }
        return Promise.reject(error);
      }
    );
  }

  // ============= Catalog Methods =============

  /**
   * Get all products from main catalog
   */
  async getProducts(params = {}) {
    const response = await this.client.get('/products', { params });
    return response.data;
  }

  /**
   * Get single product details
   */
  async getProduct(productId) {
    const response = await this.client.get(`/products/${productId}`);
    return response.data;
  }

  /**
   * Search products
   */
  async searchProducts(query) {
    const response = await this.client.get('/products/search', {
      params: { q: query }
    });
    return response.data;
  }

  // ============= Vendor Catalog Methods =============

  /**
   * Get vendor's selected products
   */
  async getVendorProducts() {
    const response = await this.client.get('/my-products');
    return response.data;
  }

  /**
   * Add product to vendor's catalog
   */
  async addToVendorCatalog(productId, customPrice = null) {
    const payload = { product_id: productId };
    if (customPrice) {
      payload.custom_retail_price_cents = customPrice;
    }

    const response = await this.client.post('/my-products', payload);
    return response.data;
  }

  /**
   * Update vendor product pricing
   */
  async updateVendorProduct(vendorProductId, customPrice) {
    const response = await this.client.put(`/my-products/${vendorProductId}`, {
      custom_retail_price_cents: customPrice
    });
    return response.data;
  }

  /**
   * Remove product from vendor catalog
   */
  async removeFromVendorCatalog(vendorProductId) {
    const response = await this.client.delete(`/my-products/${vendorProductId}`);
    return response.data;
  }

  // ============= Orders Methods =============

  /**
   * Create a new order
   */
  async createOrder(orderData) {
    const response = await this.client.post('/orders', orderData);
    return response.data;
  }

  /**
   * Get vendor's orders
   */
  async getOrders(params = {}) {
    const response = await this.client.get('/orders', { params });
    return response.data;
  }

  /**
   * Get single order details
   */
  async getOrder(orderId) {
    const response = await this.client.get(`/orders/${orderId}`);
    return response.data;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId, status) {
    const response = await this.client.put(`/orders/${orderId}/status`, { status });
    return response.data;
  }

  // ============= Analytics Methods =============

  /**
   * Get vendor analytics
   */
  async getAnalytics(dateRange = '30d') {
    const response = await this.client.get('/analytics', {
      params: { range: dateRange }
    });
    return response.data;
  }

  /**
   * Track page view
   */
  async trackPageView(page, metadata = {}) {
    try {
      await this.client.post('/analytics/pageview', {
        page,
        metadata,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      // Don't throw on analytics errors
      console.warn('Failed to track page view:', error.message);
    }
  }

  /**
   * Track conversion event
   */
  async trackConversion(eventType, value, metadata = {}) {
    try {
      await this.client.post('/analytics/conversion', {
        event_type: eventType,
        value,
        metadata,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to track conversion:', error.message);
    }
  }

  // ============= Customer Methods =============

  /**
   * Register customer
   */
  async registerCustomer(customerData) {
    const response = await this.client.post('/customers/register', customerData);
    return response.data;
  }

  /**
   * Customer login
   */
  async loginCustomer(email, password) {
    const response = await this.client.post('/customers/login', {
      email,
      password
    });
    return response.data;
  }

  /**
   * Get customer profile
   */
  async getCustomerProfile(customerId) {
    const response = await this.client.get(`/customers/${customerId}`);
    return response.data;
  }

  // ============= Utility Methods =============

  /**
   * Health check
   */
  async healthCheck() {
    const response = await this.client.get('/health');
    return response.data;
  }

  /**
   * Get vendor info
   */
  async getVendorInfo() {
    const response = await this.client.get('/vendor/info');
    return response.data;
  }
}

// React Hook for using BTAB SDK with SWR
export function useBTAB(apiKey) {
  const client = new BTABClient(apiKey);
  return client;
}

// SWR fetcher function
export const btabFetcher = (url, apiKey) => {
  const client = new BTABClient(apiKey);
  return client.client.get(url).then(res => res.data);
};

export default BTABClient;