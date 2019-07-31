import {configuration} from '~/shared/configuration';
import {STORAGE_TYPES} from '~/shared/enums';


export class StorageService {
  public storageType: Storage;
  storageAvailability: boolean;

  constructor() {
    this.storageType = window[configuration.storage || STORAGE_TYPES.LOCAL];
    this.storageAvailability = true;
  }

  getItem(key: any) {
    try {
      return JSON.parse(this.storageType.getItem(key));
    } catch (e) {
      this.storageAvailability = false;
      return null;
    }
  }

  setItem(key: string, value: any) {
    try {
      this.storageType.setItem(key, JSON.stringify(value));
    } catch (exception) {
      this.storageAvailability = false;
      throw exception;
    }
  }

  removeItem(key: string) {
    try {
      this.storageType.removeItem(key);
    } catch (e) {
      this.storageAvailability = false;
    }
  }

  clear() {
    let result;
    try {
      result = this.storageType.clear();
    } catch (e) {
      this.storageAvailability = false;
      result = null;
    }
    return result;
  }

  getConfig(key: string) {
    let result;
    try {
      result = JSON.parse(this.storageType.getItem(key));
    } catch (e) {
      result = null;
      this.storageAvailability = false;
    }
    return result;
  }

  getStorageAvailability() {
    return this.storageAvailability;
  }
}

const StorageClass = new StorageService();
export {StorageClass};
