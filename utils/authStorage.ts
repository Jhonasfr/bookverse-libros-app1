import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "bookverse_session";

export type StoredSession = {
  token: string;
  userId: number;
  email: string;
  role: string;
};

export const saveSession = async (session: StoredSession) => {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = async (): Promise<StoredSession | null> => {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearStoredSession = async () => {
  await AsyncStorage.removeItem(SESSION_KEY);
};
