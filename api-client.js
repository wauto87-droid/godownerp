// ============================================================================
// GOOGLE SHEETS API CLIENT - FIXED
// ============================================================================

class GoogleSheetsAPI {
  constructor(scriptUrl, userEmail) {
    this.scriptUrl = scriptUrl;
    this.userEmail = userEmail;
  }

  /**
   * Generic request handler - FIXED VERSION
   * Passes action in query parameter AND body
   */
  async request(action, data = null, params = {}) {
    try {
      // Build URL with action and email as query parameters
      const urlParams = new URLSearchParams({
        action: action,
        email: this.userEmail,
        ...params
      });
      
      const url = this.scriptUrl + '?' + urlParams.toString();
      
      // Prepare request body
      const requestBody = data ? JSON.stringify({ ...data }) : null;
      
      console.log('Request URL:', url);
      console.log('Request Body:', requestBody);
      
      // Make fetch request
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
      });
      
      const result = await response.json();
      console.log('Response:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Request failed');
      }
      
      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
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
