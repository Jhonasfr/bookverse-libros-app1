import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'bookverse_favorites';

export const getFavorites = async (): Promise<number[]> => {
  try {
    const json = await AsyncStorage.getItem(FAVORITES_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
};

export const addFavorite = async (productId: number): Promise<void> => {
  const favorites = await getFavorites();
  if (!favorites.includes(productId)) {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites, productId]));
  }
};

export const removeFavorite = async (productId: number): Promise<void> => {
  const favorites = await getFavorites();
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.filter((id) => id !== productId)));
};

export const isFavorite = async (productId: number): Promise<boolean> => {
  const favorites = await getFavorites();
  return favorites.includes(productId);
};

export const toggleFavorite = async (productId: number): Promise<boolean> => {
  const favorite = await isFavorite(productId);
  if (favorite) {
    await removeFavorite(productId);
    return false;
  } else {
    await addFavorite(productId);
    return true;
  }
};
