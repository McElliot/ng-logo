export class Util {

  /**
   * https://gist.github.com/barlas/760cbf77b31c6922d159
   * This method returns turkish chars to english lowercase version
   * Usage: Util.turkishToLower("türkçeişğİIiıŞÜĞ");
   */
  static turkishToLower(value: any) {
    let string = value;
    const letters: any = {'İ': 'i', 'I': 'ı', 'Ş': 'ş', 'Ğ': 'ğ', 'Ü': 'ü', 'Ö': 'ö', 'Ç': 'ç'};
    string = string.replace(/(([İIŞĞÜÇÖ]))/g, function (letter: string) {
      return letters[letter];
    });
    return string.toLowerCase();
  }

  /**
   * https://gist.github.com/barlas/760cbf77b31c6922d159
   * This method returns turkish chars to english uppercase version
   * Usage: Util.turkishToUpper("türkçeişğİIiıŞÜĞ");
   */
  static turkishToUpper(value: any) {
    let string = value;
    const letters: any = {'i': 'İ', 'ş': 'Ş', 'ğ': 'Ğ', 'ü': 'Ü', 'ö': 'Ö', 'ç': 'Ç', 'ı': 'I'};
    string = string.replace(/(([iışğüçö]))/g, function (letter: string) {
      return letters[letter];
    });
    return string.toUpperCase();
  }

  /**
   * Get value by given path of object
   * @example
   * var m = {a: {b:1, c: {d: {e: [1,2,3]}}}}
   * Util.get(m, "a.c.d.e") // result is (3) [1, 2, 3]
   * @param value - The object from which to import data
   * @param path - String path of the target property
   */
  static get(value: any, path: string) {
    let data = value;
    if (!!path && path.constructor === String) {
      path.split('.').forEach(function (val: any) {
        data = (data !== null && typeof data !== 'undefined') ? data[val] : null;
      });
    }
    return data;
  }

  /**
   * This method returns Object type
   * @param value - The target data from which will learn the type.
   */
  static type(value: any): string {
    const reg = new RegExp(/^\[object (.*)\]$/);
    return Object.prototype.toString.call(value).match(reg)[1];
  }

  /**
   * Compare two multidimensional objects, check one of them is contains other.
   * @example
   * var one = {a:1, b:2, c: {d:1, e:2}};
   * var two = {b: 2, c: {d:1}}
   * one.contains(two); // return false -> it includes two
   * @param value - The target object
   * @param filter - The object which will be looking for
   * @param exact - I can't remember why I add this feature
   * @param debug - If it is true, will generate output to the console
   */
  static contains(value: any, filter: any, exact = true, debug = false) {
    const method = key => {
      let nValue = value[key];
      let nFilter = filter[key];
      if (nFilter !== null && typeof nFilter !== 'undefined' && Util.type(nFilter) !== 'Object' &&
        nValue !== null && typeof nValue !== 'undefined' && Util.type(nValue) !== 'Object') {
        if (Util.type(nFilter) === 'Array') {
          return !Util.contains(nFilter, exact);
        } else if (exact) {
          return !(nValue === nFilter);
        } else {
          nFilter = nFilter.constructor.name === 'String' ? Util.turkishToLower(nFilter) : nFilter;
          nValue = nValue.constructor.name === 'String' ? Util.turkishToLower(nValue) : nValue;
          if (!new RegExp(nFilter, 'gi').test(nValue) && debug) {
            console.log('false: ', nValue, nFilter);
          }
          return !new RegExp(nFilter, 'gi').test(nValue);
        }
      } else {
        if (nValue !== null && typeof nValue !== 'undefined' && Util.type(nValue) === 'Object' &&
          nFilter !== null && typeof nFilter !== 'undefined' && Util.type(nFilter) === 'Object') {
          return !Util.contains(nValue, nFilter, exact);
        } else {
          if (nValue !== nFilter && debug) {
            console.log('false: ', key, nValue, nFilter);
          }
          return !(nValue === nFilter);
        }
      }
    };
    return !Object.keys(filter).some(method);
  }

  /**
   * Copy any text to clipboard
   * @param text - The text which will be copied
   */
  static copy(text: any) {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = text || (<any>event).target.innerText;
    tempInput.select();
    document.execCommand('copy');
    tempInput.remove();
  }

  /**
   * Removes null and undefined props from object
   * var test  = {a:1,b:2,d:{c:null, d:4}}
   * test.clear(); // returns {a:1,b:2,d:{d:4}}
   *
   * @param  [value] - The object will be clearad
   * @param [hard=false] - this option require if clear all empty things as [], {}, '', null.
   * @param [clone=true] - If clone true default variable not effected
   * @returns any;
   */
  static clear(value: any, hard = false, clone = false) {
    const _this: any = clone ? JSON.parse(JSON.stringify(value)) : value;
    if (_this.constructor === Object && hard.constructor === Boolean) {
      Object.keys(_this).forEach((key) => {
        if (_this.hasOwnProperty(key)) {
          const nValue = _this[key];
          if (nValue !== null && nValue.constructor === Object) {
            Util.clear(nValue, hard);
          }
          if (nValue === null ||
            (hard && nValue.constructor === Object && Util.isNull(nValue)) ||
            (hard && (nValue.constructor === String || nValue.constructor === Array) && nValue.length === 0)
          ) {
            delete _this[key];
          }
        }
      });
    }
    return _this;
  }

  /**
   * Object is null check
   * @returns Boolean
   */
  static isNull(value: any) {
    return value.constructor === Object && Object.keys(value).length === 0;
  }

  static findRemoveUnique(array: any[]) {
    const filter = (item, pos) => {
      return array.indexOf(item) === pos;
    };
    return array.filter(filter);
  }

  /**
   * Returns true if `value` is an array, else returns false.
   * @param value - The value to test.
   * @returns Boolean
   */

  static isArray(value: any) {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  /**
   * Returns true if `value` is an object (excluding null), else returns false.
   * @param value - The value to test.
   * @returns Boolean
   */
  static isObject(value) {
    return value !== null && Object.prototype.toString.call(value) === '[object Object]';
  }

  /**
   * Returns true if `value` is neither null nor undefined, else returns false.
   * @param value - The value to test.
   * @returns Boolean
   */
  static isNullOrUndef(value) {
    return value === null || typeof value === 'undefined';
  }

  /**
   * Returns a deep copy of `source` without keeping references on objects and arrays.
   * @param source - The value to clone.
   * @returns any
   */
  static clone(source: any) {
    if (Util.isArray(source)) {
      return source.map(Util.clone);
    }
    if (Util.isObject(source)) {
      const target = {};
      const keys = Object.keys(source);
      const kLength = keys.length;
      let k = 0;
      for (; k < kLength; ++k) {
        target[keys[k]] = Util.clone(source[keys[k]]);
      }
      return target;
    }
    return source;
  }

  static version() {
    console.log('v1');
  }

  /**
   * Find index of given value inside array
   * Usage:
   * @param array - source array
   * @param value - variable will be find index
   */
  static findAllIndex(array: Array<any>, value: any) {
    const method = (a: any, e: number, i: any) => {
      if (e === value) {
        a.push(i);
      }
      return a;
    };
    return array.reduce(method, []);
  }

  /**
   * Remove character from given string with given count
   * Usage: Util.removeChar('serkan', 3, 2);
   * @param value - String value will be split
   * @param start - start position, 0 (zero) is first char
   * @param count - how much char will be get
   */
  static removeBetween(value: string, start: number, count = 1) {
    const str = value.split('');
    str.splice(start, count);
    return str.join('');
  }

  /**
   * Add char string to specified position
   * @param data: string - Given string data will be replaced
   * @param value - Given string  data will be added
   * @param index - The start position of the inserted a new string
   */
  static addBetween(data, value, index) {
    const str = data.split('');
    str[index] = value;
    return str.join('');
  }

  /**
   * Extract pre-defined keys from objects list, with ordering options
   * @param data - Object source
   * @param keys - Which properties will be exported
   *
   * Usage:
   * let data, keys;
   * data = [{ s: 144, b: 2, c: 3 }, { s: 10, b: 20, c: 30 }, { s: 21, b: 22, c: 23 }];
   * keys = [ "b", "c" ];
   *
   * const {s,b,c} = Util.extract(data,keys);
   * console.log(s); // [144, 10, 21]
   */
  static extract(data, keys) {
    const result = {};
    keys.map((prop, propKey) => {
      result[prop] = (data.map((item, itemKey) => {
        return item[prop];
      }));
    });
    return result;
  }

  /**
   * Creates the number of items requested from the defined starting number.
   * @param start - which number will be started
   * @param count - how many items will be added
   * @returns Array<number>;
   *
   * Usage:
   * Util.range(13, 4); // result: [13, 14, 15, 16]
   */
  static range(start = 0, count = 0): Array<number> {
    return [...Array(count)].map((u, i) => start + i);
  }

  /**
   * Convert dot separated string to object then assign the value to latest key
   * @param prop: string - Object property paths
   * @param value: any - The value will assign the path.
   * @returns Object;
   *
   * @Usage
   * Util.make("a.b.c", 'some value');  will return {a: {b: {c: 'some value'}}};
   */
  static make(prop: string, value: any): Object {
    const props = prop.split('.');
    let temp = {};
    props.reverse().forEach(function (key, index) {
      if (index === 0) {
        temp[key] = value || null;
      } else {
        const hold = temp;
        temp = {};
        temp[key] = hold;
      }
    });
    return temp;
  }

  /**
   * Check given date is valid
   * @param value - any value
   */
  static isDateValid(value: any) {
    const date: any = new Date(value);
    return date && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
  }
}
