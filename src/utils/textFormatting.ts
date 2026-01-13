
export const toTitleCase = (text: string): string => {
    if (!text) return '';

    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};


export const formatName = (name: string): string => {
    return toTitleCase(name);
};


export const formatAddress = (address: string): string => {
    return toTitleCase(address);
};
