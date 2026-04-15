import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { getProducts } from '@/actions/products/getProducts.action';
import { Product } from '@/interfaces/product.interface';
import { BookCard } from '@/components/BookCard';
import { useAuth } from '@/context/AuthContext';
import { normalizeRole } from '@/utils/authHelpers';

export default function ProductsScreen() {
  const { session, clearSession } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const isSeller = normalizeRole(session?.role) === 'seller';

  const loadProducts = async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    try {
      const response = await getProducts();
      setProducts(response.data || []);
      setError('');
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'No se pudo cargar el catálogo');
    } finally {
      refresh ? setRefreshing(false) : setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return products;
    return products.filter((item) => [item.name, item.brand, item.color, item.model].join(' ').toLowerCase().includes(normalized));
  }, [products, query]);

  if (loading) {
    return <View className="flex-1 bg-cream items-center justify-center"><ActivityIndicator size="large" color="#1F3A5F" /><Text className="text-muted mt-4">Cargando biblioteca...</Text></View>;
  }

  return (
    <View className="flex-1 bg-cream px-5 pt-14">
      <View className="flex-row justify-between items-start mb-5">
        <View className="flex-1 pr-4">
          <Text className="text-primary text-3xl font-bold">Catálogo de libros</Text>
          <Text className="text-muted mt-1">Explora, filtra y administra ejemplares.</Text>
        </View>
        <Pressable className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-3" onPress={() => router.push('/profile')}>
          <Text className="text-primary font-semibold">Perfil</Text>
        </Pressable>
      </View>

      <TextInput className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-4 mb-4" placeholder="Buscar por título, autor, género o ISBN" value={query} onChangeText={setQuery} />

      {isSeller ? (
        <View className="flex-row gap-3 mb-4">
          <Pressable className="flex-1 bg-secondary rounded-2xl py-4 items-center" onPress={() => router.push('/products/create')}>
            <Text className="text-white font-bold">Crear libro</Text>
          </Pressable>
          <Pressable className="px-5 bg-white border border-[#E7DBCD] rounded-2xl items-center justify-center" onPress={async () => { await clearSession(); router.replace('/auth/login'); }}>
            <Text className="text-accent font-bold">Salir</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable className="mb-4 bg-white border border-[#E7DBCD] rounded-2xl py-4 items-center" onPress={async () => { await clearSession(); router.replace('/auth/login'); }}>
          <Text className="text-accent font-bold">Cerrar sesión</Text>
        </Pressable>
      )}

      {error ? <Text className="bg-[#FEE2E2] text-[#991B1B] px-4 py-3 rounded-2xl mb-4">{error}</Text> : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadProducts(true)} tintColor="#1F3A5F" />}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => <BookCard item={item} onEdit={isSeller ? (id) => router.push(`/products/edit/${id}`) : undefined} />}
        ListEmptyComponent={<View className="bg-paper rounded-[28px] p-8 border border-[#E8DED1]"><Text className="text-center text-muted">No encontramos libros con ese filtro.</Text></View>}
      />
    </View>
  );
}
