export const getPriceQueryParams = (searchParams, key, value) => {
    const hasValueInParam = searchParams.has(key);

    if (value && hasValueInParam) {
        searchParams.set(key, value);
    } else if (value) {
        searchParams.append(key, value);
    } else {
        searchParams.delete(key);
    }
    return searchParams;
};
