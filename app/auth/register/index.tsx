import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { registerAction } from '@/actions/auth/register.action';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const submit = async () => {
    if (!name || !lastName || !identificationNumber || !email || !password || !confirmPassword) {
      return setMessage('Completa todos los campos antes de registrarte.');
    }

    if (password !== confirmPassword) {
      return setMessage('Las contraseñas no coinciden.');
    }

    setLoading(true);
    setMessage('');

    try {
      await registerAction({ name, lastName, identificationNumber, email, password, role });
      setMessage('Cuenta creada correctamente. Ahora inicia sesión.');
      setTimeout(() => router.replace('/auth/login'), 1300);
    } catch (err: any) {
      setMessage(typeof err === 'string' ? err : 'No fue posible registrar la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-cream" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 22, paddingTop: 70, paddingBottom: 40 }}>
        <View className="bg-paper rounded-[28px] p-6 border border-[#E8DED1]">
          <Text className="text-primary text-sm uppercase tracking-[3px]">Registro</Text>
          <Text className="text-ink text-3xl font-bold mt-2">Crea tu perfil lector</Text>
          <Text className="text-muted mt-2">Puedes entrar como comprador o vendedor de libros.</Text>

          {message ? <Text className="mt-5 bg-[#EFF6FF] text-primary px-4 py-3 rounded-2xl">{message}</Text> : null}

          <Text className="text-ink font-semibold mt-5 mb-2">Nombre</Text>
          <TextInput className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-4" value={name} onChangeText={setName} placeholder="Tu nombre" />

          <Text className="text-ink font-semibold mt-4 mb-2">Apellido</Text>
          <TextInput className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-4" value={lastName} onChangeText={setLastName} placeholder="Tu apellido" />

          <Text className="text-ink font-semibold mt-4 mb-2">Documento</Text>
          <TextInput className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-4" value={identificationNumber} onChangeText={setIdentificationNumber} placeholder="Número de identificación" keyboardType="number-pad" />

          <Text className="text-ink font-semibold mt-4 mb-2">Correo</Text>
          <TextInput className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-4" value={email} onChangeText={setEmail} placeholder="correo@ejemplo.com" autoCapitalize="none" keyboardType="email-address" />

          <Text className="text-ink font-semibold mt-4 mb-2">Contraseña</Text>
          <TextInput className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-4" value={password} onChangeText={setPassword} placeholder="********" secureTextEntry />

          <Text className="text-ink font-semibold mt-4 mb-2">Confirmar contraseña</Text>
          <TextInput className="bg-white border border-[#E7DBCD] rounded-2xl px-4 py-4" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="********" secureTextEntry />

          <Text className="text-ink font-semibold mt-4 mb-3">Tipo de cuenta</Text>
          <View className="flex-row gap-3">
            <Pressable className={`flex-1 rounded-2xl py-4 items-center ${role === 'buyer' ? 'bg-primary' : 'bg-white border border-[#E7DBCD]'}`} onPress={() => setRole('buyer')}>
              <Text className={role === 'buyer' ? 'text-white font-bold' : 'text-ink font-semibold'}>Comprador</Text>
            </Pressable>
            <Pressable className={`flex-1 rounded-2xl py-4 items-center ${role === 'seller' ? 'bg-secondary' : 'bg-white border border-[#E7DBCD]'}`} onPress={() => setRole('seller')}>
              <Text className={role === 'seller' ? 'text-white font-bold' : 'text-ink font-semibold'}>Vendedor</Text>
            </Pressable>
          </View>

          <Pressable className="bg-accent rounded-2xl py-4 mt-6 items-center" onPress={submit} disabled={loading}>
            {loading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold">Registrar cuenta</Text>}
          </Pressable>

          <Pressable className="mt-5 items-center" onPress={() => router.back()}>
            <Text className="text-primary font-semibold">Volver al login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
