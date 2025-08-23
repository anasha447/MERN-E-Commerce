const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:5000";

export function imageUrl(path) {
  if (!path) return "/placeholder.png"; // fallback
  if (path.startsWith("http")) return path; // external
  return `${API_ORIGIN}${path}`;
}
