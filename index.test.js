var {Cache} = require('.');

test('basic', async function () {
    let seenKey = null;
    const cache = new Cache({
        factoryMethod: (key) => {
            seenKey = key;
            return new Promise(function (resolve, reject) {
                resolve("oneValue");
            });
        }
    });
    const value = await cache.get('one');
    expect(seenKey).toBe('one');
    expect(value).toBe('oneValue');
});

test('no factory', async function () {
    const testThrow = () => {
        const cache = new Cache({});
        cache.get("one");
    };
    expect(testThrow).toThrowError(/^No factory method defined for key one$/);
});

test('repeat', async function () {
    let times = 0;
    const cache = new Cache({
        factoryMethod: () => {
            times++;
            return new Promise(function (resolve, reject) {
                resolve("oneValue");
            });
        }
    });
    const value1 = await cache.get('one');
    expect(value1).toBe('oneValue');
    const value2 = await cache.get('one');
    expect(value2).toBe('oneValue');
    expect(times).toBe(1);
});

test('delay', async function () {
    let times = 0;
    const cache = new Cache({
        factoryMethod: () => {
            times++;
            return new Promise(function (resolve, reject) {
                setTimeout(()=>{
                    resolve("oneValue");
                }, 1);
            });
        }
    });
    const value1 = await cache.get('one');
    expect(value1).toBe('oneValue');
    const value2 = await cache.get('one');
    expect(value2).toBe('oneValue');
    expect(times).toBe(1);
});