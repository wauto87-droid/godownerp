// ============================================================================
// GOOGLE SHEETS API CLIENT - WITH CORS FIX
// ============================================================================

class GoogleSheetsAPI {
  constructor(scriptUrl, userEmail) {
    this.scriptUrl = scriptUrl;
    this.userEmail = userEmail;
    this.debug = true; // Set to false to disable console logs
  }

  /**
   * Test connection to Apps Script
   * Helps debug CORS/network issues
   */
  async testConnection() {
    try {
      console.log('🧪 Testing connection to:', this.scriptUrl);
      
      const urlParams = new URLSearchParams({
        action: 'getItems',
        email: this.userEmail
      });
      
      const testUrl = this.scriptUrl + '?' + urlParams.toString();
      
      const response = await fetch(testUrl, {
        method: 'POST',
        mode: 'cors', // CRITICAL: Enable CORS
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: true })
      });
      
      if (this.debug) {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
      }
      
      const result = await response.json();
      
      if (this.debug) {
        console.log('Test result:', result);
      }
      
      return {
        success: true,
        message: 'Connection successful',
        result: result
      };
    } catch (error) {
      console.error('Connection test failed:', error);
      return {
        success: false,
        message: 'Connection failed: ' + error.message,
        error: error
      };
    }
  }

  /**
   * Generic request handler - WITH CORS FIX
   */
  async request(action, data = null, params = {}) {
    let lastError = null;
    let retryCount = 0;
    const maxRetries = 2;
    
    while (retryCount < maxRetries) {
      try {
        if (this.debug) {
          console.log(`📤 Request attempt ${retryCount + 1}:`, action);
        }
        
        // Build URL with query parameters
        const urlParams = new URLSearchParams({
          action: action,
          email: this.userEmail,
          ...params
        });
        
        let url = this.scriptUrl + '?' + urlParams.toString();
        
        // Prepare request body
        let requestBody = null;
        let requestMethod = 'POST';
        
        if (data) {
          requestBody = JSON.stringify(data);
        } else {
          // For simple requests without data body, use GET
          requestMethod = 'GET';
        }
        
        if (this.debug) {
          console.log('Request URL:', url);
          console.log('Request Method:', requestMethod);
          console.log('Request Body:', requestBody);
        }
        
        // Make fetch request with CORS support
        const fetchOptions = {
          method: requestMethod,
          mode: 'cors', // CRITICAL: This enables CORS
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
        // Only add body for POST requests
        if (requestMethod === 'POST' && requestBody) {
          fetchOptions.body = requestBody;
        }
        
        const response = await fetch(url, fetchOptions);
        
        if (this.debug) {
          console.log('Response Status:', response.status);
          console.log('Response OK:', response.ok);
        }
        
        // Check for network errors
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (this.debug) {
          console.log('Response Data:', result);
        }
        
        // Check for API errors
        if (!result.success) {
          throw new Error(result.message || 'API returned error');
        }
        
        return result;
        
      } catch (error) {
        console.error(`❌ Request attempt ${retryCount + 1} failed:`, error);
        lastError = error;
        retryCount++;
        
        // Wait before retry (exponential backoff)
        if (retryCount < maxRetries) {
          const waitTime = Math.pow(2, retryCount) * 500; // 500ms, 1000ms, 2000ms
          console.log(`⏳ Retrying in ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    // All retries failed
    console.error('💥 All retries failed. Last error:', lastError);
    
    throw lastError || new Error('Request failed after multiple attempts');
  }

  // ============================================================================
  // API METHODS
  // ============================================================================

  async initialize() {
    return this.request('initialize');
  }

  async getItems() {
    return this.request('getItems');
  }

  async addItem(itemData) {
    return this.request('addItem', itemData);
  }

  async getUsers() {
    return this.request('getUsers');
  }

  async getBookings(filters = {}) {
    return this.request('getBookings', null, filters);
  }

  async createBooking(bookingData) {
    return this.request('createBooking', bookingData);
  }

  async updateBookingStatus(bookingId, action) {
    return this.request('updateBookingStatus', {
      bookingId,
      action
    });
  }

  async getLoadings(filters = {}) {
    return this.request('getLoadings', null, filters);
  }

  async createLoading(loadingData) {
    return this.request('createLoading', loadingData);
  }

  async getTransactions(filters = {}) {
    return this.request('getTransactions', null, filters);
  }

  async createTransaction(transactionData) {
    return this.request('createTransaction', transactionData);
  }

  async getInventory() {
    return this.request('getInventory');
  }

  async getDispatch(filters = {}) {
    return this.request('getDispatch', null, filters);
  }

  async createDispatch(dispatchData) {
    return this.request('createDispatch', dispatchData);
  }

  async getReturns(filters = {}) {
    return this.request('getReturns', null, filters);
  }

  async createReturn(returnData) {
    return this.request('createReturn', returnData);
  }

  async generateDeliveryNote(loadId) {
    return this.request('generateDeliveryNote', { loadId });
  }

  async exportSheet(sheetName) {
    return this.request('exportSheet', null, { sheetName });
  }

  async importItems(items) {
    return this.request('importItems', { items });
  }

  async getAuditLog(limit = 100) {
    return this.request('getAuditLog', null, { limit });
  }
}
