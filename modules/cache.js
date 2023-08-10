"use strict";

class Cache {
  constructor(cache) {
    this.cache = cache || {};
  }

  has = (key) => {
    this.deleteIfExpired(key);
    return key in this.cache;
  };

  set = (key, data, { timestamp, ttl } = {}) => {
    const cachedItem = new CachedItem({ data, timestamp, ttl });
    this.cache[key] = cachedItem;
  };

  get = (key) => {
    this.deleteIfExpired(key);
    return this.cache?.[key].data;
  };

  isExpired = (key) => {
    const cachedItem = this.cache?.[key];
    return !cachedItem || Date.now() > cachedItem.ttl;
  };

  delete = (key) => {
    delete this.cache[key];
  };

  deleteIfExpired = (key) => {
    if (this.isExpired(key)) this.delete(key);
  };

  reset = (doReset) => {
    if (doReset) {
      this.cache = {};
      return true;
    }
  };
}

class TTL {
  constructor() {
    this.DEFAULT = this.hoursLater(24);
  }

  minutesLater(minutes = 1) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date.getTime();
  }

  hoursLater(hours = 1) {
    const date = new Date();
    date.setHours(date.getHours() + hours);
    return date.getTime();
  }

  daysLater(days = 1) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.getTime();
  }

  endOfDay(date = new Date()) {
    date.setHours(23, 59, 59, 999);
    return date.getTime();
  }
}

class CachedItem {
  constructor({ data, timestamp, ttl }) {
    this.data = data;
    this.timestamp = timestamp || Date.now();
    this.ttl = this.timestamp + (ttl || new TTL().DEFAULT);
  }
}

module.exports = { cache: new Cache(), getTTL: new TTL() };
