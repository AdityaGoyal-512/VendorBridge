const API_BASE = "http://localhost:8080/api/v1";

export const getVendors = async () => {
  const res = await fetch(`${API_BASE}/vendors`);
  return await res.json();
};