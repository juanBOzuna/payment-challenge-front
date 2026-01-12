/**
 * Capitalizes the first letter of each word in a string (Title Case)
 * @param text - The text to capitalize
 * @returns The text with each word capitalized
 */
export const toTitleCase = (text: string): string => {
    if (!text) return '';

    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

/**
 * Formats a full name to Title Case
 * @param name - The name to format
 * @returns The formatted name
 */
export const formatName = (name: string): string => {
    return toTitleCase(name);
};

/**
 * Formats an address to Title Case
 * @param address - The address to format
 * @returns The formatted address
 */
export const formatAddress = (address: string): string => {
    return toTitleCase(address);
};
