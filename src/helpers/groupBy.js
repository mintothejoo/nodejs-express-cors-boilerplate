

export const __groupBy = (list, keyGetter) => {
    const map = {};
    list.forEach((item) => {
        const key = keyGetter(item);
        if(!map.hasOwnProperty(key)){
            map[key] = [];
        }
        const collection = map[key];
        if (!collection) {
            map[key] = [item];
        } else {
            collection.push(item);
        }
    });
    return map;
};