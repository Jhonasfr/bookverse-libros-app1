import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { getProfileAction, updateProfileAction } from '@/actions/auth/updateProfile.action';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { session, profile, setProfile, clearSession } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!session?.token) {
        setBootLoading(false);
        return;
      }
      try {
        const data = await getProfileAction(session.token);
        setProfile(data);
        setFirstName(data.firstName || '');
        setLastName(data.lastName || '');
        setPhoneNumber(data.phoneNumber || '');
        setDateOfBirth(data.dateOfBirth || '');
      } catch {
        // allow screen to open with empty fields
      } finally {
        setBootLoading(false);
      }
    };
    load();
  }, [session?.token, setProfile]);

  const save = async () => {
    if (!session?.token) return Alert.alert('Sesión requerida', 'Debes iniciar sesión nuevamente.');
    if (!firstName || !lastName) return Alert.alert('Campos requeridos', 'Completa nombre y apellido.');

    setLoading(true);
    try {
      const updated = await updateProfileAction({ firstName, lastName, phoneNumber, dateOfBirth }, session.token);
      setProfile({ ...profile, ...updated, firstName, lastName, phoneNumber, dateOfBirth, name: `${firstName} ${lastName}`.trim() });
      Alert.alert('Perfil actualizado', 'Tus datos personales se guardaron correctamente.');
    } catch (err: any) {
      Alert.alert('Error', typeof err === 'string' ? err : 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (bootLoading) return <View className="flex-1 bg-cream items-center justify-center"><ActivityIndicator size="large" color="#1F3A5F" /></View>;

  return (
    <ScrollView className="flex-1 bg-cream" contentContainerStyle={{ padding: 22, paddingTop: 60, paddingBottom: 40 }}>
      <View className="bg-paper rounded-[28px] p-6 border border-[#E8DED1]">
        <Text className="text-primary text-sm uppercase tracking-[3px]">Mi cuenta</Text>
        <Text className="text-ink text-3xl font-bold mt-2">Perfil del usuario</Text>
        <Text className="text-muted mt-2">Actualiza tus datos personales conectados a la API compartida.</Text>

        <Text className="text-muted mt-4">Correo actual: {profile?.email || session?.email || 'No disponible'}</Text>
        <Text className="text-muted mt-1">Rol actual: {profile?.role || session?.role || 'Sin rol'}</Text>

        <Text className="text-ink font-semibold mt-5 mb-2">Nombre</Text>
        <TextInput className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-4" value={firstName} onChangeText={setFirstName} placeholder="Nombre" />

        <Text className="text-ink font-semibold mt-4 mb-2">Apellido</Text>
        <TextInput className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-4" value={lastName} onChangeText={setLastName} placeholder="Apellido" />

        <Text className="text-ink font-semibold mt-4 mb-2">Teléfono</Text>
        <TextInput className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-4" value={phoneNumber} onChangeText={setPhoneNumber} placeholder="+57 300 123 4567" />

        <Text className="text-ink font-semibold mt-4 mb-2">Fecha de nacimiento</Text>
        <TextInput className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-4" value={dateOfBirth} onChangeText={setDateOfBirth} placeholder="1990-05-15" autoCapitalize="none" />

        <Pressable className="bg-primary rounded-2xl py-4 mt-6 items-center" onPress={save} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Guardar cambios</Text>}
        </Pressable>

        <Pressable className="bg-white border border-[#E7DBCD] rounded-2xl py-4 mt-3 items-center" onPress={() => router.back()}>
          <Text className="text-primary font-bold">Volver</Text>
        </Pressable>

        <Pressable className="bg-[#FEE2E2] rounded-2xl py-4 mt-3 items-center" onPress={async () => { await clearSession(); router.replace('/auth/login'); }}>
          <Text className="text-[#991B1B] font-bold">Cerrar sesión</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
