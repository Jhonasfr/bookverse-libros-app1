import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import {
  createAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
} from '@/actions/users/addresses.action';
import { Address, CreateAddressDto } from '@/interfaces/address.interface';

const emptyForm: CreateAddressDto = { city: '', country: 'Colombia', state: '', street: '', zipCode: '', isDefault: false };

export default function AddressesScreen() {
  const { session } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState<CreateAddressDto>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (refresh = false) => {
    if (!session?.token) return;
    refresh ? setRefreshing(true) : setLoading(true);
    try {
      const res = await getAddresses(session.token);
      setAddresses(res.data || []);
      setError('');
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'No se pudieron cargar las direcciones');
    } finally {
      refresh ? setRefreshing(false) : setLoading(false);
    }
  }, [session?.token]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalVisible(true);
  };

  const openEdit = (addr: Address) => {
    setEditing(addr);
    setForm({ city: addr.city, country: addr.country, state: addr.state, street: addr.street, zipCode: addr.zipCode, isDefault: addr.isDefault });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!session?.token) return;
    if (!form.street || !form.city || !form.state) {
      Alert.alert('Campos requeridos', 'Calle, ciudad y departamento son obligatorios.');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateAddress(editing.id, form, session.token);
      } else {
        await createAddress(form, session.token);
      }
      setModalVisible(false);
      load(true);
    } catch (err: any) {
      Alert.alert('Error', typeof err === 'string' ? err : 'No se pudo guardar la dirección');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (addr: Address) => {
    Alert.alert('Eliminar dirección', '¿Deseas eliminar esta dirección?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await deleteAddress(addr.id, session!.token);
            load(true);
          } catch (err: any) {
            Alert.alert('Error', typeof err === 'string' ? err : 'No se pudo eliminar');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator size="large" color="#1F3A5F" />
        <Text className="text-muted mt-4">Cargando direcciones...</Text>
      </View>
    );
  }

  return (
    <>
      <View className="flex-1 bg-cream px-5 pt-14">
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center">
            <Pressable className="mr-3" onPress={() => router.back()}>
              <Text className="text-primary text-lg">←</Text>
            </Pressable>
            <View>
              <Text className="text-primary text-2xl font-bold">Mis direcciones</Text>
              <Text className="text-muted text-sm">Para envíos y entregas</Text>
            </View>
          </View>
          <Pressable className="bg-secondary px-4 py-2 rounded-2xl" onPress={openCreate}>
            <Text className="text-white font-semibold">+ Nueva</Text>
          </Pressable>
        </View>

        {error ? (
          <Text className="bg-[#FEE2E2] text-[#991B1B] px-4 py-3 rounded-2xl mb-4">{error}</Text>
        ) : null}

        <FlatList
          data={addresses}
          keyExtractor={(item) => String(item.id)}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#1F3A5F" />
          }
          contentContainerStyle={{ paddingBottom: 24 }}
          ListEmptyComponent={
            <View className="bg-paper rounded-[28px] p-8 border border-[#E8DED1] items-center">
              <Text className="text-muted text-center">No tienes direcciones registradas.</Text>
              <Pressable className="mt-4 bg-secondary px-6 py-3 rounded-2xl" onPress={openCreate}>
                <Text className="text-white font-semibold">Agregar dirección</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <View className="bg-paper rounded-[24px] p-4 mb-4 border border-[#E8DED1]">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 mr-3">
                  <Text className="text-ink font-bold">{item.street}</Text>
                  <Text className="text-muted text-sm">{item.city}, {item.state}</Text>
                  <Text className="text-muted text-sm">{item.country} {item.zipCode ? `- ${item.zipCode}` : ''}</Text>
                  {item.isDefault && (
                    <View className="mt-1 self-start bg-secondary/10 px-2 py-1 rounded-lg">
                      <Text className="text-secondary text-xs font-semibold">Principal</Text>
                    </View>
                  )}
                </View>
                <View className="gap-2">
                  <Pressable className="bg-primary px-3 py-2 rounded-xl" onPress={() => openEdit(item)}>
                    <Text className="text-white text-xs font-semibold">Editar</Text>
                  </Pressable>
                  <Pressable className="border border-[#E7DBCD] px-3 py-2 rounded-xl" onPress={() => handleDelete(item)}>
                    <Text className="text-[#991B1B] text-xs font-semibold">Eliminar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-black/40 justify-end">
          <ScrollView className="bg-cream rounded-t-[32px]" contentContainerStyle={{ padding: 24 }}>
            <Text className="text-ink text-xl font-bold mb-4">
              {editing ? 'Editar dirección' : 'Nueva dirección'}
            </Text>

            {([
              { key: 'street', label: 'Calle / Dirección', placeholder: 'Ej: Cra 7 #45-89, Apto 602' },
              { key: 'city', label: 'Ciudad', placeholder: 'Ej: Bogotá' },
              { key: 'state', label: 'Departamento', placeholder: 'Ej: Cundinamarca' },
              { key: 'country', label: 'País', placeholder: 'Ej: Colombia' },
              { key: 'zipCode', label: 'Código postal', placeholder: 'Ej: 110111' },
            ] as const).map(({ key, label, placeholder }) => (
              <View key={key} className="mb-3">
                <Text className="text-ink font-semibold mb-1">{label}</Text>
                <TextInput
                  className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-3 text-ink"
                  placeholder={placeholder}
                  value={form[key] as string}
                  onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
                />
              </View>
            ))}

            <Pressable
              className={`flex-row items-center gap-2 mb-4 ${form.isDefault ? 'opacity-100' : 'opacity-60'}`}
              onPress={() => setForm((p) => ({ ...p, isDefault: !p.isDefault }))}
            >
              <View className={`w-5 h-5 rounded border-2 ${form.isDefault ? 'bg-secondary border-secondary' : 'border-[#E7DBCD]'}`} />
              <Text className="text-ink">Marcar como dirección principal</Text>
            </Pressable>

            <Pressable
              className="bg-secondary rounded-2xl py-4 items-center mb-2"
              onPress={handleSave}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator color="#fff" />
                : <Text className="text-white font-bold">Guardar dirección</Text>
              }
            </Pressable>
            <Pressable className="py-3 items-center" onPress={() => setModalVisible(false)}>
              <Text className="text-muted">Cancelar</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}
