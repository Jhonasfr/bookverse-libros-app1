import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getProductById } from '@/actions/products/getProducts.action';
import { deleteProduct } from '@/actions/products/deleteProduct.action';
import { getAddresses } from '@/actions/users/addresses.action';
import { createOrder } from '@/actions/orders/createOrder.action';
import { Product } from '@/interfaces/product.interface';
import { Address } from '@/interfaces/address.interface';
import { normalizeRole } from '@/utils/authHelpers';
import { isFavorite, toggleFavorite } from '@/utils/favoritesStorage';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorite, setFavorite] = useState(false);

  const [buyModal, setBuyModal] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [buying, setBuying] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isSeller = normalizeRole(session?.role) === 'seller';
  const isBuyer = normalizeRole(session?.role) === 'buyer';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProductById(id as string);
      setProduct(res.data);
      const fav = await isFavorite(res.data.id);
      setFavorite(fav);
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'No se pudo cargar el libro');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleToggleFavorite = async () => {
    if (!product) return;
    const next = await toggleFavorite(product.id);
    setFavorite(next);
  };

  const handleDelete = () => {
    if (!session?.token || !product) return;
    Alert.alert('Eliminar libro', '¿Seguro que deseas eliminar este libro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          setDeleting(true);
          try {
            await deleteProduct(product.id, session.token);
            Alert.alert('Eliminado', 'El libro fue eliminado.');
            router.replace('/products');
          } catch (err: any) {
            Alert.alert('Error', typeof err === 'string' ? err : 'No se pudo eliminar');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  const handleOpenBuy = async () => {
    if (!session?.token) {
      Alert.alert('Sesión requerida', 'Debes iniciar sesión para comprar.');
      return;
    }
    try {
      const res = await getAddresses(session.token);
      const list: Address[] = res.data || [];
      setAddresses(list);
      const def = list.find((a) => a.isDefault);
      setSelectedAddress(def?.id ?? list[0]?.id ?? null);
    } catch {
      setAddresses([]);
      setSelectedAddress(null);
    }
    setBuyModal(true);
  };

  const handleBuy = async () => {
    if (!session?.token || !product) return;
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      Alert.alert('Cantidad inválida', 'Ingresa una cantidad válida.');
      return;
    }
    if (!selectedAddress && addresses.length > 0) {
      Alert.alert('Dirección requerida', 'Selecciona una dirección de envío.');
      return;
    }
    if (addresses.length === 0) {
      Alert.alert(
        'Sin dirección',
        'Necesitas registrar una dirección de envío.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Agregar dirección', onPress: () => { setBuyModal(false); router.push('/profile/addresses'); } },
        ]
      );
      return;
    }
    setBuying(true);
    try {
      await createOrder(
        { items: [{ productId: product.id, quantity: qty }], shippingAddressId: selectedAddress! },
        session.token
      );
      setBuyModal(false);
      Alert.alert('¡Compra realizada!', 'Tu orden fue creada con éxito.', [
        { text: 'Ver mis compras', onPress: () => router.push('/shopping/buyer') },
        { text: 'Seguir explorando', style: 'cancel' },
      ]);
    } catch (err: any) {
      Alert.alert('Error', typeof err === 'string' ? err : 'No se pudo realizar la compra');
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1F3A5F" />
        <Text className="text-muted mt-4">Cargando libro...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View className="flex-1 bg-cream items-center justify-center px-6">
        <Text className="text-[#991B1B] text-center mb-4">{error || 'Libro no encontrado'}</Text>
        <Pressable className="bg-primary px-6 py-3 rounded-2xl" onPress={() => router.back()}>
          <Text className="text-white font-semibold">Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <ScrollView className="flex-1 bg-cream" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="relative">
          <Image
            source={{ uri: product.imageUrl || 'https://placehold.co/400x600?text=Libro' }}
            className="w-full h-72 bg-[#E9E2D6]"
            resizeMode="cover"
          />
          <Pressable
            className="absolute top-12 left-5 bg-white/90 rounded-2xl px-4 py-2"
            onPress={() => router.back()}
          >
            <Text className="text-primary font-semibold">← Volver</Text>
          </Pressable>
          <Pressable
            className="absolute top-12 right-5 bg-white/90 rounded-2xl px-4 py-2"
            onPress={handleToggleFavorite}
          >
            <Text className="text-xl">{favorite ? '❤️' : '🤍'}</Text>
          </Pressable>
        </View>

        <View className="px-5 pt-6">
          <Text className="text-xs uppercase tracking-widest text-secondary font-semibold">
            {product.color || 'General'}
          </Text>
          <Text className="text-ink text-2xl font-bold mt-1">{product.name}</Text>
          <Text className="text-muted mt-1">Autor: {product.brand || 'Sin autor'}</Text>
          <Text className="text-muted">ISBN: {product.model || 'Sin ISBN'}</Text>
          <Text className="text-muted">Páginas: {product.weight || 0}</Text>

          <View className="flex-row items-center justify-between mt-4">
            <Text className="text-primary text-2xl font-extrabold">
              ${Number(product.price).toLocaleString('es-CO')}
            </Text>
            <Text className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
            </Text>
          </View>

          {product.description ? (
            <View className="mt-5 bg-paper rounded-2xl p-4 border border-[#E8DED1]">
              <Text className="text-muted font-semibold mb-2">Sinopsis</Text>
              <Text className="text-ink leading-6">{product.description}</Text>
            </View>
          ) : null}

          <View className="mt-4 gap-2">
            {isBuyer && product.stock > 0 && (
              <Pressable
                className="bg-secondary rounded-2xl py-4 items-center"
                onPress={handleOpenBuy}
              >
                <Text className="text-white font-bold text-base">Comprar ahora</Text>
              </Pressable>
            )}

            {isSeller && (
              <>
                <Pressable
                  className="bg-primary rounded-2xl py-4 items-center"
                  onPress={() => router.push(`/products/edit/${product.id}`)}
                >
                  <Text className="text-white font-bold text-base">Editar libro</Text>
                </Pressable>
                <Pressable
                  className="bg-white border border-[#E7DBCD] rounded-2xl py-4 items-center"
                  onPress={handleDelete}
                  disabled={deleting}
                >
                  {deleting
                    ? <ActivityIndicator color="#991B1B" />
                    : <Text className="text-[#991B1B] font-bold text-base">Eliminar libro</Text>
                  }
                </Pressable>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal visible={buyModal} transparent animationType="slide">
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-cream rounded-t-[32px] p-6">
            <Text className="text-ink text-xl font-bold mb-1">Confirmar compra</Text>
            <Text className="text-muted mb-4">{product.name}</Text>

            <Text className="text-ink font-semibold mb-2">Cantidad</Text>
            <TextInput
              className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-3 mb-4 text-ink"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              placeholder="1"
            />

            {addresses.length > 0 ? (
              <>
                <Text className="text-ink font-semibold mb-2">Dirección de envío</Text>
                {addresses.map((addr) => (
                  <Pressable
                    key={addr.id}
                    className={`border rounded-2xl px-4 py-3 mb-2 ${selectedAddress === addr.id ? 'border-secondary bg-secondary/10' : 'border-[#E7DBCD] bg-white'}`}
                    onPress={() => setSelectedAddress(addr.id)}
                  >
                    <Text className="text-ink font-semibold">{addr.street}</Text>
                    <Text className="text-muted text-xs">{addr.city}, {addr.state}, {addr.country}</Text>
                  </Pressable>
                ))}
              </>
            ) : (
              <View className="bg-paper border border-[#E8DED1] rounded-2xl p-4 mb-4">
                <Text className="text-muted text-sm">No tienes direcciones registradas.</Text>
                <Pressable onPress={() => { setBuyModal(false); router.push('/profile/addresses'); }}>
                  <Text className="text-secondary font-semibold mt-1">Agregar dirección →</Text>
                </Pressable>
              </View>
            )}

            <Pressable
              className="bg-secondary rounded-2xl py-4 items-center mt-2"
              onPress={handleBuy}
              disabled={buying}
            >
              {buying
                ? <ActivityIndicator color="#fff" />
                : <Text className="text-white font-bold">Confirmar compra</Text>
              }
            </Pressable>
            <Pressable className="py-4 items-center" onPress={() => setBuyModal(false)}>
              <Text className="text-muted">Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
