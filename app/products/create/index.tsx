import React, { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { BookForm } from '@/components/BookForm';
import { useAuth } from '@/context/AuthContext';
import { createProduct } from '@/actions/products/createProduct.action';
import { emptyBookForm, mapFormToPayload } from '@/services/bookMappers';
import { BookFormValues } from '@/interfaces/product.interface';

export default function CreateBookScreen() {
  const { session } = useAuth();
  const [values, setValues] = useState<BookFormValues>(emptyBookForm);
  const [loading, setLoading] = useState(false);

  const onChange = (field: keyof BookFormValues, value: string) => setValues((prev) => ({ ...prev, [field]: value }));

  const onSubmit = async () => {
    if (!session?.token) return Alert.alert('Sesión requerida', 'Debes iniciar sesión como vendedor.');
    if (!values.title || !values.author || !values.price || !values.stock || !values.coverUrl) {
      return Alert.alert('Campos obligatorios', 'Completa título, autor, precio, stock y URL de portada.');
    }

    setLoading(true);
    try {
      await createProduct(mapFormToPayload(values), session.token);
      Alert.alert('Libro creado', 'El libro se registró correctamente.');
      router.replace('/products');
    } catch (err: any) {
      Alert.alert('Error', typeof err === 'string' ? err : 'No fue posible crear el libro');
    } finally {
      setLoading(false);
    }
  };

  return <BookForm title="Nuevo libro" subtitle="Registra un libro con portada, precio y datos editoriales." values={values} onChange={onChange} onSubmit={onSubmit} submitLabel="Guardar libro" isLoading={loading} />;
}
