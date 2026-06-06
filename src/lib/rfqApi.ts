const API_BASE = "http://localhost:8080/api/v1";

export const getRFQs = async () => {
  const response = await fetch(`${API_BASE}/rfqs`);

  if (!response.ok) {
    throw new Error("Failed to fetch RFQs");
  }

  return response.json();
};

export const createRFQ = async (data: any) => {
  const response = await fetch(`${API_BASE}/rfqs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create RFQ");
  }

  return response.json();
};