import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { loginAction } from '@/actions/auth/login.action';
import { useAuth } from '@/context/AuthContext';
import { normalizeRole } from '@/utils/authHelpers';

export default function LoginScreen() {
  const { setAuthSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onLogin = async () => {
    if (!email || !password) return setError('Completa correo y contraseña.');

    setIsLoading(true);
    setError('');
    try {
      const response = await loginAction(email, password);
      await setAuthSession(response.data);
      router.replace(normalizeRole(response.data.role) === 'seller' ? '/products/create' : '/products');
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'No fue posible iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-cream" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 pt-20 pb-10 justify-between">
          <View>
            <View className="bg-primary rounded-[32px] p-7">
              <Text className="text-[#E7EEF7] uppercase tracking-[3px] text-xs">BookVerse</Text>
              <Text className="text-white text-4xl font-bold mt-3">Tu biblioteca móvil</Text>
              <Text className="text-[#D7E3F2] mt-3 leading-6">Administra usuarios y publica libros.</Text>
            </View>

            <View className="bg-paper rounded-[30px] p-6 mt-6 border border-[#E8DED1]">
              <Text className="text-ink text-2xl font-bold">Iniciar sesión</Text>
              <Text className="text-muted mt-1">Ingresa a tu panel de lectura y ventas.</Text>

              {error ? <Text className="bg-[#FEE2E2] text-[#991B1B] px-4 py-3 rounded-2xl mt-5">{error}</Text> : null}

              <Text className="text-ink font-semibold mt-5 mb-2">Correo</Text>
              <View className="flex-row items-center bg-white border border-[#E7DBCD] rounded-2xl px-4">
                <Ionicons name="mail-outline" size={20} color="#64748B" />
                <TextInput className="flex-1 py-4 ml-3 text-ink" value={email} onChangeText={setEmail} placeholder="correo@ejemplo.com" autoCapitalize="none" keyboardType="email-address" />
              </View>

              <Text className="text-ink font-semibold mt-4 mb-2">Contraseña</Text>
              <View className="flex-row items-center bg-white border border-[#E7DBCD] rounded-2xl px-4">
                <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
                <TextInput className="flex-1 py-4 ml-3 text-ink" value={password} onChangeText={setPassword} placeholder="********" secureTextEntry={!showPassword} />
                <Pressable onPress={() => setShowPassword((s) => !s)}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#64748B" />
                </Pressable>
              </View>

              <Pressable className="bg-secondary rounded-2xl py-4 mt-6 items-center" onPress={onLogin} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-base">Entrar</Text>}
              </Pressable>

              <Pressable className="mt-5 items-center" onPress={() => router.push('/auth/register')}>
                <Text className="text-primary font-semibold">Crear una cuenta nueva</Text>
              </Pressable>
            </View>
          </View>

          <Text className="text-center text-muted mt-8">Proyecto adaptado a temática de libros</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
