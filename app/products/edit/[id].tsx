import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { BookForm } from '@/components/BookForm';
import { useAuth } from '@/context/AuthContext';
import { getProductById, updateProduct } from '@/actions/products/getProducts.action';
import { emptyBookForm, mapFormToPayload, mapProductToForm } from '@/services/bookMappers';
import { BookFormValues } from '@/interfaces/product.interface';

export default function EditBookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const [values, setValues] = useState<BookFormValues>(emptyBookForm);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getProductById(id as string);
        setValues(mapProductToForm(response.data));
      } catch (err: any) {
        Alert.alert('Error', typeof err === 'string' ? err : 'No se pudo cargar el libro');
        router.back();
      } finally {
        setInitialLoading(false);
      }
    };
    load();
  }, [id]);

  const onChange = (field: keyof BookFormValues, value: string) => setValues((prev) => ({ ...prev, [field]: value }));

  const onSubmit = async () => {
    if (!session?.token) return Alert.alert('Sesión requerida', 'Debes iniciar sesión como vendedor.');
    setSaving(true);
    try {
      await updateProduct(id as string, mapFormToPayload(values), session.token);
      Alert.alert('Actualizado', 'Los datos del libro fueron actualizados.');
      router.replace('/products');
    } catch (err: any) {
      Alert.alert('Error', typeof err === 'string' ? err : 'No se pudo actualizar el libro');
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return <View className="flex-1 bg-cream items-center justify-center"><ActivityIndicator size="large" color="#1F3A5F" /></View>;
  }

  return <BookForm title="Editar libro" subtitle="Modifica portada, datos editoriales y disponibilidad." values={values} onChange={onChange} onSubmit={onSubmit} submitLabel="Actualizar libro" isLoading={saving} />;
}
