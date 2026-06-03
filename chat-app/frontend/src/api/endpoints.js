import client from "./client";

// ─── Authentication ─────────────────────────────────────────

export const register = async (username, email, password) => {
  const response = await client.post("/api/auth/register", {
    username,
    email,
    password,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await client.post("/api/auth/login", {
    email,
    password,
  });
  return response.data;
};

// ─── Users ──────────────────────────────────────────────────

export const getMe = async () => {
  const response = await client.get("/api/users/me");
  return response.data;
};

export const getUsers = async () => {
  const response = await client.get("/api/users");
  return response.data;
};

// ─── Messages ───────────────────────────────────────────────

export const getMessageHistory = async (userId, limit = 50, offset = 0) => {
  const response = await client.get(`/api/messages/${userId}`, {
    params: { limit, offset },
  });
  return response.data;
};
