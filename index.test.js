var {Cache} = require('.');

test('basic', async function () {
    const cache = new Cache({});
    cache.addItemConfig("one", {
        factory: ()=> {
            return new Promise(function(resolve, reject){
                resolve("oneValue");
            });
        }
    });
    const value = await cache.get('one');
    expect(value).toBe('oneValue');
});

test('no factory', async function () {
    const testThrow = ()=>{
        const cache = new Cache({});
        cache.get("one");
    };
    expect(testThrow).toThrowError(/^No factory method defined for key one$/);
});

test('repeat', async function () {
    const cache = new Cache({});
    let times = 0;
    cache.addItemConfig("one", {
        factory: ()=> {
            times++;
            return new Promise(function(resolve, reject){
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