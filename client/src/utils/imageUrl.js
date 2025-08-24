const API_ORIGIN = "http://localhost:5000";

export const getImageUrl = (relativePath) => {
  if (!relativePath) {
    return null; // Or a placeholder image URL
  }
  // If the path is already a full URL, return it as is
  if (relativePath.startsWith('http')) {
    return relativePath;
  }
  // Ensure the path starts with a slash
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${API_ORIGIN}${path}`;
};
