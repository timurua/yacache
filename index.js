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

    constructor(config) {
        this.maxCreatedAgeMilliseconds = config.maxCreatedAgeMilliseconds ? config.maxCreatedAgeMilliseconds : 1000 * 60 * 60;
        this.itemConfigs = {};
        this.items = {};
    }

    _isValidItem(item) {
        return (new Date().getTime() - item.createdDate.getTime()) < this.maxCreatedAgeMilliseconds;
    }

    get(key) {
        const item = this.items[key];
        if (typeof item !== 'undefined') {
            if (this._isValidItem(item)) {
                return new Promise(function (resolve) {
                    resolve(item.item);
                });
            } else {
                delete this.items[key];
            }
        }
        const itemConfig = this.itemConfigs[key];
        if (typeof itemConfig !== 'undefined') {
            return new Promise((resolve, reject)=> {
                itemConfig.factory().then((newItem) => {
                    this.items[key] = new CacheItem(newItem);
                    resolve(newItem);
                }).catch((error) => {
                    reject(error);
                });
            });
        }
        throw `No factory method defined for key ${key}`;

    }

    addItemConfig(key, config) {
        this.itemConfigs[key] = {
            factory: config.factory
        };
    }
}

module.exports = {Cache};

