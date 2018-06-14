

export const isNumeric = (string) => {
    return !isNaN(parseFloat(string)) && isFinite(string);
};
