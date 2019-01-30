'use strict';

class CacheItem {
    // createdDate;
    // usedDate;
    // item;

    constructor(item) {
        this.createdDate = new Date();
        this.usedDate = new Date();
        this.item = item;
    }
}

class Cache {
    // maxCreatedAgeMilliseconds;
    // factoryMethod
    // pendingPromises

    constructor(config) {
        this.maxCreatedAgeMilliseconds = config.maxCreatedAgeMilliseconds ? config.maxCreatedAgeMilliseconds : 1000 * 60 * 60;
        this.factoryMethod = config.factoryMethod;
        this.pendingPromises = {};
        this.items = {};

    }

    _isValidItem(item) {
        return (new Date().getTime() - item.createdDate.getTime()) < this.maxCreatedAgeMilliseconds;
    }

    get(key) {
        const item = this.items[key];
        if (typeof item !== 'undefined') {
            if (this._isValidItem(item)) {
                return Promise.resolve(item.item);
            } else {
                delete this.items[key];
            }
        }

        if (typeof this.factoryMethod === 'undefined') {
            throw `No factory method defined for key ${key}`;
        }

        let pendingPromise = this.pendingPromises[key];
        if (typeof pendingPromise !== 'undefined') {
            return pendingPromise;
        }

        pendingPromise = new Promise((resolve, reject)=> {
            this.factoryMethod(key).then((newItem) => {
                delete this.pendingPromises[key];
                this.items[key] = new CacheItem(newItem);
                resolve(newItem);
            }).catch((error) => {
                delete this.pendingPromises[key];
                reject(error);
            });
        });
        this.pendingPromises[key] = pendingPromise;
        return pendingPromise;
    }

    put(key, value){
        this.items[key] = new CacheItem(value);
    }
}

module.exports = {Cache};

