import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Product } from '@/interfaces/product.interface';
import { toggleFavorite } from '@/utils/favoritesStorage';

interface Props {
  item: Product;
  isFav?: boolean;
  onFavToggle?: (id: number) => void;
  onEdit?: (id: number) => void;
  onPress?: (id: number) => void;
}

export const BookCard = ({ item, isFav = false, onFavToggle, onEdit, onPress }: Props) => {
  const handleFav = async () => {
    await toggleFavorite(item.id);
    onFavToggle?.(item.id);
  };

  return (
    <Pressable
      className="bg-paper rounded-[28px] p-4 mb-4 border border-[#E8DED1] shadow-card"
      onPress={() => onPress?.(item.id)}
    >
      <View className="flex-row">
        <Image
          source={{ uri: item.imageUrl || 'https://placehold.co/200x300?text=Libro' }}
          className="w-24 h-36 rounded-2xl bg-[#E9E2D6]"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4 justify-between">
          <View>
            <Text className="text-xs uppercase tracking-widest text-secondary font-semibold">
              {item.color || 'General'}
            </Text>
            <Text className="text-ink text-xl font-bold mt-1">{item.name}</Text>
            <Text className="text-muted mt-1">Autor: {item.brand || 'Sin autor'}</Text>
            <Text className="text-muted">ISBN: {item.model || 'Sin ISBN'}</Text>
            <Text className="text-muted">Páginas: {item.weight || 0}</Text>
          </View>
          <View className="flex-row items-end justify-between">
            <View>
              <Text className="text-primary text-lg font-extrabold">
                ${Number(item.price).toLocaleString('es-CO')}
              </Text>
              <Text className="text-muted mt-1">Disponibles: {item.stock}</Text>
            </View>
            <Pressable onPress={handleFav} hitSlop={8}>
              <Text className="text-xl">{isFav ? '❤️' : '🤍'}</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Text className="text-muted mt-4 leading-5 text-sm" numberOfLines={3}>
        {item.description || 'Sin sinopsis disponible.'}
      </Text>

      <View className="flex-row gap-2 mt-4">
        {onPress && (
          <Pressable
            className="flex-1 bg-primary/10 border border-primary/20 px-4 py-3 rounded-2xl items-center"
            onPress={() => onPress(item.id)}
          >
            <Text className="text-primary font-semibold text-sm">Ver detalle</Text>
          </Pressable>
        )}
        {onEdit && (
          <Pressable
            className="flex-1 bg-primary px-4 py-3 rounded-2xl items-center"
            onPress={() => onEdit(item.id)}
          >
            <Text className="text-white font-semibold text-sm">Editar</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};
