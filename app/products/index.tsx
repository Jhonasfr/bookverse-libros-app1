import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getProducts } from '@/actions/products/getProducts.action';
import { Product } from '@/interfaces/product.interface';
import { BookCard } from '@/components/BookCard';
import { useAuth } from '@/context/AuthContext';
import { normalizeRole } from '@/utils/authHelpers';
import { getFavorites } from '@/utils/favoritesStorage';

export default function ProductsScreen() {
  const { session, clearSession } = useAuth();
  const params = useLocalSearchParams<{ categoryId?: string; categoryName?: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');

  const isSeller = normalizeRole(session?.role) === 'seller';
  const isBuyer = normalizeRole(session?.role) === 'buyer';

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavoriteIds(favs);
  };

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

  useEffect(() => {
    loadProducts();
    loadFavorites();
  }, []);

  const filtered = useMemo(() => {
    let list = products;

    if (params.categoryId) {
      list = list.filter((p) => String(p.categoryId) === String(params.categoryId));
    }

    if (showOnlyFavorites) {
      list = list.filter((p) => favoriteIds.includes(p.id));
    }

    const normalized = query.trim().toLowerCase();
    if (normalized) {
      list = list.filter((p) =>
        [p.name, p.brand, p.color, p.model].join(' ').toLowerCase().includes(normalized)
      );
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) list = list.filter((p) => Number(p.price) >= min);
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) list = list.filter((p) => Number(p.price) <= max);
    }

    return list;
  }, [products, query, showOnlyFavorites, favoriteIds, params.categoryId, minPrice, maxPrice]);

  const onRefresh = async () => {
    await Promise.all([loadProducts(true), loadFavorites()]);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1F3A5F" />
        <Text className="text-muted mt-4">Cargando biblioteca...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-cream px-5 pt-14">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 pr-4">
          <Text className="text-primary text-3xl font-bold">
            {params.categoryName ? params.categoryName : 'Catálogo'}
          </Text>
          <Text className="text-muted mt-1">
            {params.categoryName ? `Libros de ${params.categoryName}` : 'Explora todos los libros'}
          </Text>
        </View>
        <Pressable
          className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-3"
          onPress={() => router.push('/profile')}
        >
          <Text className="text-primary font-semibold">Perfil</Text>
        </Pressable>
      </View>

      <TextInput
        className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-4 mb-3"
        placeholder="Buscar por título, autor, género o ISBN"
        value={query}
        onChangeText={setQuery}
      />

      <View className="flex-row gap-2 mb-3 flex-wrap">
        <Pressable
          className={`px-4 py-2 rounded-2xl border ${showFilters ? 'bg-primary border-primary' : 'bg-white border-[#E7DBCD]'}`}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text className={`font-semibold text-sm ${showFilters ? 'text-white' : 'text-primary'}`}>Filtros</Text>
        </Pressable>
        <Pressable
          className={`px-4 py-2 rounded-2xl border ${showOnlyFavorites ? 'bg-secondary border-secondary' : 'bg-white border-[#E7DBCD]'}`}
          onPress={() => { setShowOnlyFavorites(!showOnlyFavorites); loadFavorites(); }}
        >
          <Text className={`font-semibold text-sm ${showOnlyFavorites ? 'text-white' : 'text-primary'}`}>
            {showOnlyFavorites ? '❤️ Favoritos' : '🤍 Favoritos'}
          </Text>
        </Pressable>
        <Pressable
          className="px-4 py-2 rounded-2xl border bg-white border-[#E7DBCD]"
          onPress={() => router.push('/shopping/categories')}
        >
          <Text className="text-primary font-semibold text-sm">Categorías</Text>
        </Pressable>
      </View>

      {showFilters && (
        <View className="bg-paper border border-[#E8DED1] rounded-2xl p-4 mb-3 gap-2">
          <Text className="text-ink font-semibold mb-1">Filtrar por precio</Text>
          <View className="flex-row gap-2">
            <TextInput
              className="flex-1 bg-white border border-[#E7DBCD] rounded-xl px-3 py-3 text-ink"
              placeholder="Precio mín."
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
            />
            <TextInput
              className="flex-1 bg-white border border-[#E7DBCD] rounded-xl px-3 py-3 text-ink"
              placeholder="Precio máx."
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
          </View>
          {(minPrice || maxPrice) && (
            <Pressable onPress={() => { setMinPrice(''); setMaxPrice(''); }}>
              <Text className="text-secondary text-xs font-semibold">Limpiar filtros de precio</Text>
            </Pressable>
          )}
        </View>
      )}

      <View className="flex-row gap-2 mb-4 flex-wrap">
        {isSeller && (
          <Pressable className="flex-1 bg-secondary rounded-2xl py-3 items-center" onPress={() => router.push('/products/create')}>
            <Text className="text-white font-bold">+ Crear libro</Text>
          </Pressable>
        )}
        {isSeller && (
          <Pressable className="flex-1 bg-white border border-[#E7DBCD] rounded-2xl py-3 items-center" onPress={() => router.push('/shopping/seller')}>
            <Text className="text-primary font-semibold">Mis ventas</Text>
          </Pressable>
        )}
        {isBuyer && (
          <Pressable className="flex-1 bg-white border border-[#E7DBCD] rounded-2xl py-3 items-center" onPress={() => router.push('/shopping/buyer')}>
            <Text className="text-primary font-semibold">Mis compras</Text>
          </Pressable>
        )}
        <Pressable
          className="px-4 bg-white border border-[#E7DBCD] rounded-2xl py-3 items-center"
          onPress={async () => { await clearSession(); router.replace('/auth/login'); }}
        >
          <Text className="text-[#991B1B] font-bold">Salir</Text>
        </Pressable>
      </View>

      {error ? (
        <Text className="bg-[#FEE2E2] text-[#991B1B] px-4 py-3 rounded-2xl mb-4">{error}</Text>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1F3A5F" />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <BookCard
            item={item}
            isFav={favoriteIds.includes(item.id)}
            onFavToggle={(id) => {
              setFavoriteIds((prev) =>
                prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
              );
            }}
            onEdit={isSeller ? (id) => router.push(`/products/edit/${id}`) : undefined}
            onPress={(id) => router.push(`/products/${id}`)}
          />
        )}
        ListEmptyComponent={
          <View className="bg-paper rounded-[28px] p-8 border border-[#E8DED1]">
            <Text className="text-center text-muted">
              {showOnlyFavorites ? 'No tienes favoritos guardados.' : 'No encontramos libros con ese filtro.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}
