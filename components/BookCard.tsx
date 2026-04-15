import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Product } from '@/interfaces/product.interface';

interface Props {
  item: Product;
  onEdit?: (id: number) => void;
}

export const BookCard = ({ item, onEdit }: Props) => {
  return (
    <View className="bg-paper rounded-[28px] p-4 mb-4 border border-[#E8DED1] shadow-card">
      <View className="flex-row">
        <Image
          source={{ uri: item.imageUrl || 'https://placehold.co/200x300?text=Libro' }}
          className="w-24 h-36 rounded-2xl bg-[#E9E2D6]"
          resizeMode="cover"
        />
        <View className="flex-1 ml-4 justify-between">
          <View>
            <Text className="text-xs uppercase tracking-widest text-secondary font-semibold">{item.color || 'General'}</Text>
            <Text className="text-ink text-xl font-bold mt-1">{item.name}</Text>
            <Text className="text-muted mt-1">Autor: {item.brand || 'Sin autor'}</Text>
            <Text className="text-muted">ISBN: {item.model || 'Sin ISBN'}</Text>
            <Text className="text-muted">Páginas: {item.weight || 0}</Text>
          </View>
          <View>
            <Text className="text-primary text-lg font-extrabold">${Number(item.price).toLocaleString('es-CO')}</Text>
            <Text className="text-muted mt-1">Disponibles: {item.stock}</Text>
          </View>
        </View>
      </View>

      <Text className="text-muted mt-4 leading-5">{item.description || 'Sin sinopsis disponible.'}</Text>

      {onEdit ? (
        <Pressable className="mt-4 self-start bg-primary px-4 py-3 rounded-2xl" onPress={() => onEdit(item.id)}>
          <Text className="text-white font-semibold">Editar libro</Text>
        </Pressable>
      ) : null}
    </View>
  );
};
