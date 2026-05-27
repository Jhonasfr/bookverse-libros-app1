import React from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';

const CATEGORIES = [
  { id: 1,  name: 'Literatura',       icon: '📖', description: 'Novelas, cuentos y poesía' },
  { id: 2,  name: 'Ciencia',          icon: '🔬', description: 'Física, biología y más' },
  { id: 3,  name: 'Historia',         icon: '🏛️', description: 'Desde la antigüedad hasta hoy' },
  { id: 4,  name: 'Tecnología',       icon: '💻', description: 'Programación y desarrollo' },
  { id: 5,  name: 'Arte y Diseño',    icon: '🎨', description: 'Creatividad visual' },
  { id: 6,  name: 'Filosofía',        icon: '🧠', description: 'Pensamiento y reflexión' },
  { id: 7,  name: 'Economía',         icon: '📊', description: 'Finanzas y negocios' },
  { id: 8,  name: 'Infantil',         icon: '🐣', description: 'Para los más pequeños' },
  { id: 9,  name: 'Autoayuda',        icon: '🌱', description: 'Crecimiento personal' },
  { id: 10, name: 'Idiomas',          icon: '🌍', description: 'Aprende nuevos idiomas' },
];

export default function CategoriesScreen() {
  return (
    <View className="flex-1 bg-cream px-5 pt-14">
      <View className="flex-row items-center mb-5">
        <Pressable className="mr-3" onPress={() => router.back()}>
          <Text className="text-primary text-lg">←</Text>
        </Pressable>
        <View>
          <Text className="text-primary text-2xl font-bold">Categorías</Text>
          <Text className="text-muted text-sm">Explora por género literario</Text>
        </View>
      </View>

      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            className="flex-1 bg-paper border border-[#E8DED1] rounded-[24px] p-4"
            onPress={() => router.push({ pathname: '/products', params: { categoryId: item.id, categoryName: item.name } })}
          >
            <Text className="text-3xl mb-2">{item.icon}</Text>
            <Text className="text-ink font-bold text-base">{item.name}</Text>
            <Text className="text-muted text-xs mt-1">{item.description}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
