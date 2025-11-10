// Multi-Tiered Storage Manager for Workout Tracker
// Implements three-tier storage strategy with automatic fallback:
// 1. Primary: R1's creationStorage with Base64 encoding
// 2. Secondary: IndexedDB
// 3. Tertiary: localStorage

// ===========================================
// Storage Manager Class
// ===========================================

class StorageManager {
  constructor() {
    this.dbName = 'WorkoutTrackerDB';
    this.dbVersion = 1;
    this.db = null;
    this.storageAvailable = {
      creationStorage: false,
      indexedDB: false,
      localStorage: false
    };
    this.initPromise = this.initialize();
  }

  // ===========================================
  // Initialization
  // ===========================================

  async initialize() {
    console.log('Initializing Storage Manager...');
    
    // Check creationStorage availability
    if (window.creationStorage && window.creationStorage.plain) {
      try {
        await window.creationStorage.plain.setItem('_test', 'test');
        await window.creationStorage.plain.removeItem('_test');
        this.storageAvailable.creationStorage = true;
        console.log('✓ creationStorage available');
      } catch (e) {
        console.warn('✗ creationStorage not available:', e);
      }
    }

    // Check IndexedDB availability
    if (window.indexedDB) {
      try {
        await this.openDatabase();
        this.storageAvailable.indexedDB = true;
        console.log('✓ IndexedDB available');
      } catch (e) {
        console.warn('✗ IndexedDB not available:', e);
      }
    }

    // Check localStorage availability
    try {
      localStorage.setItem('_test', 'test');
      localStorage.removeItem('_test');
      this.storageAvailable.localStorage = true;
      console.log('✓ localStorage available');
    } catch (e) {
      console.warn('✗ localStorage not available:', e);
    }

    console.log('Storage Manager initialized:', this.storageAvailable);
    return this.storageAvailable;
  }

  // ===========================================
  // IndexedDB Operations
  // ===========================================

  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('data')) {
          const objectStore = db.createObjectStore('data', { keyPath: 'key' });
          objectStore.createIndex('key', 'key', { unique: true });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        
        // Handle database errors
        this.db.onerror = (event) => {
          console.error('Database error:', event.target.error);
        };
        
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('Failed to open database:', event.target.error);
        reject(event.target.error);
      };

      request.onblocked = () => {
        console.warn('Database opening blocked');
      };
    });
  }

  async indexedDBSet(key, value) {
    if (!this.db) {
      await this.openDatabase();
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction(['data'], 'readwrite');
        
        transaction.onerror = (event) => {
          console.error('Transaction error:', event.target.error);
          reject(event.target.error);
        };

        const store = transaction.objectStore('data');
        const request = store.put({ key: key, value: value, timestamp: Date.now() });

        request.onsuccess = () => {
          resolve(true);
        };

        request.onerror = (event) => {
          console.error('IndexedDB set error:', event.target.error);
          reject(event.target.error);
        };
      } catch (error) {
        console.error('IndexedDB set exception:', error);
        reject(error);
      }
    });
  }

  async indexedDBGet(key) {
    if (!this.db) {
      await this.openDatabase();
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction(['data'], 'readonly');
        
        transaction.onerror = (event) => {
          console.error('Transaction error:', event.target.error);
          reject(event.target.error);
        };

        const store = transaction.objectStore('data');
        const request = store.get(key);

        request.onsuccess = (event) => {
          const result = event.target.result;
          resolve(result ? result.value : null);
        };

        request.onerror = (event) => {
          console.error('IndexedDB get error:', event.target.error);
          reject(event.target.error);
        };
      } catch (error) {
        console.error('IndexedDB get exception:', error);
        reject(error);
      }
    });
  }

  async indexedDBRemove(key) {
    if (!this.db) {
      await this.openDatabase();
    }

    return new Promise((resolve, reject) => {
      try {
        const transaction = this.db.transaction(['data'], 'readwrite');
        
        transaction.onerror = (event) => {
          console.error('Transaction error:', event.target.error);
          reject(event.target.error);
        };

        const store = transaction.objectStore('data');
        const request = store.delete(key);

        request.onsuccess = () => {
          resolve(true);
        };

        request.onerror = (event) => {
          console.error('IndexedDB remove error:', event.target.error);
          reject(event.target.error);
        };
      } catch (error) {
        console.error('IndexedDB remove exception:', error);
        reject(error);
      }
    });
  }

  // ===========================================
  // Multi-Tiered Storage Operations
  // ===========================================

  /**
   * Set item with multi-tiered storage strategy
   * Attempts to save to all available storage layers
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be serialized)
   * @returns {Promise<boolean>} - Success status
   */
  async setItem(key, value) {
    await this.initPromise; // Ensure initialization is complete

    let primarySuccess = false;
    let secondarySuccess = false;
    let tertiarySuccess = false;

    // Serialize value once
    const serialized = JSON.stringify(value);

    // Primary: creationStorage with Base64 encoding
    if (this.storageAvailable.creationStorage) {
      try {
        const encoded = btoa(serialized);
        await window.creationStorage.plain.setItem(key, encoded);
        primarySuccess = true;
        console.log(`✓ Saved to creationStorage: ${key}`);
      } catch (error) {
        console.error(`✗ Failed to save to creationStorage (${key}):`, error);
        this.storageAvailable.creationStorage = false;
      }
    }

    // Secondary: IndexedDB
    if (this.storageAvailable.indexedDB) {
      try {
        await this.indexedDBSet(key, serialized);
        secondarySuccess = true;
        console.log(`✓ Saved to IndexedDB: ${key}`);
      } catch (error) {
        console.error(`✗ Failed to save to IndexedDB (${key}):`, error);
        this.storageAvailable.indexedDB = false;
      }
    }

    // Tertiary: localStorage
    if (this.storageAvailable.localStorage) {
      try {
        localStorage.setItem(key, serialized);
        tertiarySuccess = true;
        console.log(`✓ Saved to localStorage: ${key}`);
      } catch (error) {
        console.error(`✗ Failed to save to localStorage (${key}):`, error);
        this.storageAvailable.localStorage = false;
      }
    }

    // Return true if at least one storage method succeeded
    const success = primarySuccess || secondarySuccess || tertiarySuccess;
    
    if (!success) {
      console.error(`✗ Failed to save ${key} to any storage layer`);
    }

    return success;
  }

  /**
   * Get item with multi-tiered storage strategy
   * Attempts to load from storage layers in priority order
   * @param {string} key - Storage key
   * @returns {Promise<any>} - Stored value or null
   */
  async getItem(key) {
    await this.initPromise; // Ensure initialization is complete

    let value = null;

    // Try Primary: creationStorage
    if (this.storageAvailable.creationStorage) {
      try {
        const stored = await window.creationStorage.plain.getItem(key);
        if (stored) {
          const decoded = atob(stored);
          value = JSON.parse(decoded);
          console.log(`✓ Loaded from creationStorage: ${key}`);
          
          // Sync to other storage layers if they don't have it
          this.syncToSecondaryStorage(key, value);
          return value;
        }
      } catch (error) {
        console.error(`✗ Failed to load from creationStorage (${key}):`, error);
      }
    }

    // Try Secondary: IndexedDB
    if (this.storageAvailable.indexedDB && !value) {
      try {
        const stored = await this.indexedDBGet(key);
        if (stored) {
          value = JSON.parse(stored);
          console.log(`✓ Loaded from IndexedDB: ${key}`);
          
          // Sync back to primary storage
          this.syncToPrimaryStorage(key, value);
          return value;
        }
      } catch (error) {
        console.error(`✗ Failed to load from IndexedDB (${key}):`, error);
      }
    }

    // Try Tertiary: localStorage
    if (this.storageAvailable.localStorage && !value) {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          value = JSON.parse(stored);
          console.log(`✓ Loaded from localStorage: ${key}`);
          
          // Sync back to primary and secondary storage
          this.syncToPrimaryStorage(key, value);
          this.syncToSecondaryStorage(key, value);
          return value;
        }
      } catch (error) {
        console.error(`✗ Failed to load from localStorage (${key}):`, error);
      }
    }

    return value;
  }

  /**
   * Remove item from all storage layers
   * @param {string} key - Storage key
   * @returns {Promise<boolean>} - Success status
   */
  async removeItem(key) {
    await this.initPromise;

    let success = false;

    // Remove from creationStorage
    if (this.storageAvailable.creationStorage) {
      try {
        await window.creationStorage.plain.removeItem(key);
        console.log(`✓ Removed from creationStorage: ${key}`);
        success = true;
      } catch (error) {
        console.error(`✗ Failed to remove from creationStorage (${key}):`, error);
      }
    }

    // Remove from IndexedDB
    if (this.storageAvailable.indexedDB) {
      try {
        await this.indexedDBRemove(key);
        console.log(`✓ Removed from IndexedDB: ${key}`);
        success = true;
      } catch (error) {
        console.error(`✗ Failed to remove from IndexedDB (${key}):`, error);
      }
    }

    // Remove from localStorage
    if (this.storageAvailable.localStorage) {
      try {
        localStorage.removeItem(key);
        console.log(`✓ Removed from localStorage: ${key}`);
        success = true;
      } catch (error) {
        console.error(`✗ Failed to remove from localStorage (${key}):`, error);
      }
    }

    return success;
  }

  // ===========================================
  // Data Synchronization
  // ===========================================

  /**
   * Sync data to primary storage (creationStorage)
   * Used when data is loaded from fallback storage
   */
  async syncToPrimaryStorage(key, value) {
    if (this.storageAvailable.creationStorage) {
      try {
        const serialized = JSON.stringify(value);
        const encoded = btoa(serialized);
        await window.creationStorage.plain.setItem(key, encoded);
        console.log(`↻ Synced to creationStorage: ${key}`);
      } catch (error) {
        console.error(`✗ Failed to sync to creationStorage (${key}):`, error);
      }
    }
  }

  /**
   * Sync data to secondary storage layers (IndexedDB and localStorage)
   * Used when data is loaded from primary storage
   */
  async syncToSecondaryStorage(key, value) {
    const serialized = JSON.stringify(value);

    // Sync to IndexedDB
    if (this.storageAvailable.indexedDB) {
      try {
        await this.indexedDBSet(key, serialized);
        console.log(`↻ Synced to IndexedDB: ${key}`);
      } catch (error) {
        console.error(`✗ Failed to sync to IndexedDB (${key}):`, error);
      }
    }

    // Sync to localStorage
    if (this.storageAvailable.localStorage) {
      try {
        localStorage.setItem(key, serialized);
        console.log(`↻ Synced to localStorage: ${key}`);
      } catch (error) {
        console.error(`✗ Failed to sync to localStorage (${key}):`, error);
      }
    }
  }

  /**
   * Get storage availability status
   * @returns {Object} - Availability status for each storage layer
   */
  getStorageStatus() {
    return { ...this.storageAvailable };
  }
}

// ===========================================
// Export Storage Manager Instance
// ===========================================

// Create singleton instance
const storageManager = new StorageManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = storageManager;
}

// Make available globally for the app
window.storageManager = storageManager;
