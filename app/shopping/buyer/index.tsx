import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getMyOrders } from '@/actions/orders/getOrders.action';
import { cancelOrder } from '@/actions/orders/cancelOrder.action';
import { Order, OrderStatus } from '@/interfaces/order.interface';

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  PROCESSING: 'En proceso',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const canCancel = (status: OrderStatus) => ['PENDING', 'PROCESSING'].includes(status);

export default function BuyerOrdersScreen() {
  const { session } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (refresh = false) => {
    if (!session?.token) return;
    refresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await getMyOrders(session.token);
      setOrders(res.data || []);
      setError('');
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'No se pudieron cargar las órdenes');
    } finally {
      refresh ? setRefreshing(false) : setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => { load(); }, [load]);

  const handleCancel = (order: Order) => {
    Alert.alert('Cancelar orden', '¿Deseas cancelar esta orden?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Sí, cancelar', style: 'destructive', onPress: async () => {
          try {
            await cancelOrder(order.id, session!.token);
            load(true);
          } catch (err: any) {
            Alert.alert('Error', typeof err === 'string' ? err : 'No se pudo cancelar');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1F3A5F" />
        <Text className="text-muted mt-4">Cargando órdenes...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-cream px-5 pt-14">
      <View className="flex-row items-center mb-5">
        <Pressable className="mr-3" onPress={() => router.back()}>
          <Text className="text-primary text-lg">←</Text>
        </Pressable>
        <View>
          <Text className="text-primary text-2xl font-bold">Mis compras</Text>
          <Text className="text-muted text-sm">Historial de órdenes</Text>
        </View>
      </View>

      {error ? (
        <Text className="bg-[#FEE2E2] text-[#991B1B] px-4 py-3 rounded-2xl mb-4">{error}</Text>
      ) : null}

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#1F3A5F" />
        }
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="bg-paper rounded-[28px] p-8 border border-[#E8DED1] items-center">
            <Text className="text-muted text-center">No tienes compras registradas.</Text>
            <Pressable className="mt-4 bg-secondary px-6 py-3 rounded-2xl" onPress={() => router.push('/products')}>
              <Text className="text-white font-semibold">Explorar catálogo</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const colorClass = STATUS_COLORS[item.status] ?? 'bg-gray-100 text-gray-800';
          const [bg, fg] = colorClass.split(' ');
          return (
            <View className="bg-paper rounded-[24px] p-4 mb-4 border border-[#E8DED1]">
              <View className="flex-row justify-between items-start mb-2">
                <Text className="text-ink font-bold">Orden #{item.id}</Text>
                <View className={`px-3 py-1 rounded-full ${bg}`}>
                  <Text className={`text-xs font-semibold ${fg}`}>
                    {STATUS_LABELS[item.status] ?? item.status}
                  </Text>
                </View>
              </View>

              {item.items?.map((i, idx) => (
                <Text key={idx} className="text-muted text-sm">
                  • {i.productName || `Producto #${i.productId}`} × {i.quantity}
                </Text>
              ))}

              <View className="flex-row justify-between items-center mt-3">
                <Text className="text-primary font-bold text-base">
                  ${Number(item.totalAmount ?? 0).toLocaleString('es-CO')}
                </Text>
                <Text className="text-muted text-xs">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-CO') : ''}
                </Text>
              </View>

              {canCancel(item.status) && (
                <Pressable
                  className="mt-3 border border-[#991B1B] rounded-2xl py-2 items-center"
                  onPress={() => handleCancel(item)}
                >
                  <Text className="text-[#991B1B] font-semibold text-sm">Cancelar orden</Text>
                </Pressable>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
