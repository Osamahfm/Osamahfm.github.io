import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const storage = {
  // ─── Token ─────────────────────────────────────────────
  async getToken() {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setToken(token) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (e) {
      console.error("Failed to save token:", e);
    }
  },

  async removeToken() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error("Failed to remove token:", e);
    }
  },

  // ─── User ──────────────────────────────────────────────
  async getUser() {
    try {
      const json = await AsyncStorage.getItem(USER_KEY);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  },

  async setUser(user) {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save user:", e);
    }
  },

  async removeUser() {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (e) {
      console.error("Failed to remove user:", e);
    }
  },

  // ─── Clear All ─────────────────────────────────────────
  async clearAll() {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } catch (e) {
      console.error("Failed to clear storage:", e);
    }
  },
};
