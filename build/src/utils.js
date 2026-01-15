export const arrayWrap = (value) => {
    return Array.isArray(value) ? value : [value];
};
