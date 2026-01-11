import { addDays, format } from 'date-fns';

export class BaseScraper {
  constructor(airlineCode, airlineName) {
    this.airlineCode = airlineCode;
    this.airlineName = airlineName;
  }

  /**
   * Search for award flights
   * @param {Object} params - Search parameters
   * @param {string} params.origin - Origin airport code
   * @param {string} params.destination - Destination airport code
   * @param {Date} params.startDate - Start date for search
   * @param {Date} params.endDate - End date for search
   * @param {string} params.cabinClass - Cabin class (economy, business, first)
   * @returns {Promise<Array>} Array of flight objects
   */
  async search(params) {
    throw new Error('search() must be implemented by subclass');
  }

  /**
   * Delay execution
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Random delay between min and max ms
   */
  async randomDelay(min, max) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return this.delay(ms);
  }

  /**
   * Generate UUID
   */
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Random element from array
   */
  randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Random integer between min and max (inclusive)
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
