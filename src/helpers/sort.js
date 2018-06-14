

export const __sortByNumber = (array, direction) => {
    direction = direction || 'desc';
    if(direction === 'asc') {
        array.sort((a, b) => a - b);
    } else {
        array.sort((a, b) => b - a);
    }
    return array;
};

export const __sortByNumberOnKey = (array, key, direction) => {
    direction = direction || 'desc';
    console.log(array)
    if(direction === 'asc') {
        array.sort((a, b) => a[key] - b[key]);
    } else {
        array.sort((a, b) => b[key] - a[key]);
    }
    console.log(array)
    return array;
};