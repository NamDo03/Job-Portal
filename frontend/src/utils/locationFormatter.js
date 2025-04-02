export const formatLocation = (location) => {
    if (!location) return "Location not specified";

    const parts = location.split(',').map(part => part.trim());
    return parts[parts.length - 1] || location;
};