import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BookFormValues } from '@/interfaces/product.interface';
import { uploadImageToCloudinary } from '@/services/cloudinary';

interface Props {
  title: string;
  subtitle: string;
  values: BookFormValues;
  onChange: (field: keyof BookFormValues, value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  isLoading?: boolean;
}

const Field = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
}) => (
  <View className="mb-4">
    <Text className="text-ink font-semibold mb-2">{label}</Text>
    <TextInput
      className={`bg-white border border-[#E7DBCD] rounded-2xl px-4 py-4 text-ink ${multiline ? 'min-h-[110px]' : ''}`}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType || 'default'}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      placeholderTextColor="#8B93A1"
    />
  </View>
);

export const BookForm = ({ title, subtitle, values, onChange, onSubmit, submitLabel, isLoading }: Props) => {
  const [uploading, setUploading] = useState(false);

  const pickAndUploadImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets.length) return;

      const asset = result.assets[0];
      setUploading(true);

      const secureUrl = await uploadImageToCloudinary({
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName,
        file: (asset as any).file,
      });

      onChange('coverUrl', secureUrl);
      Alert.alert('Imagen subida', 'La portada fue cargada a Cloudinary correctamente.');
    } catch (error: any) {
      Alert.alert('Error al subir imagen', typeof error === 'string' ? error : 'No fue posible subir la imagen a Cloudinary.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-cream" contentContainerStyle={{ padding: 22, paddingBottom: 40 }}>
      <View className="bg-primary rounded-[30px] px-6 py-8 mb-6">
        <Text className="text-white text-3xl font-bold">{title}</Text>
        <Text className="text-[#D7E3F2] mt-2">{subtitle}</Text>
      </View>

      <View className="bg-paper rounded-[28px] p-5 border border-[#E8DED1]">
        <Field label="Título del libro" value={values.title} onChangeText={(v) => onChange('title', v)} placeholder="Ej: Cien años de soledad" />
        <Field label="Autor" value={values.author} onChangeText={(v) => onChange('author', v)} placeholder="Ej: Gabriel García Márquez" />
        <Field label="ISBN / referencia" value={values.isbn} onChangeText={(v) => onChange('isbn', v)} placeholder="Ej: 9780307474728" />
        <Field label="Género" value={values.genre} onChangeText={(v) => onChange('genre', v)} placeholder="Novela, ciencia ficción, poesía..." />
        <Field label="Sinopsis" value={values.synopsis} onChangeText={(v) => onChange('synopsis', v)} placeholder="Resumen corto del libro" multiline />
        <Field label="Precio" value={values.price} onChangeText={(v) => onChange('price', v)} placeholder="Ej: 45900" keyboardType="numeric" />
        <Field label="Stock" value={values.stock} onChangeText={(v) => onChange('stock', v)} placeholder="Ej: 20" keyboardType="numeric" />
        <Field label="Páginas" value={values.pages} onChangeText={(v) => onChange('pages', v)} placeholder="Ej: 320" keyboardType="numeric" />
        <Field label="Categoría ID" value={values.categoryId} onChangeText={(v) => onChange('categoryId', v)} placeholder="Ej: 1" keyboardType="numeric" />
        <Field label="URL de la portada" value={values.coverUrl} onChangeText={(v) => onChange('coverUrl', v)} placeholder="Se llena automáticamente al subir la imagen" />

        <Pressable className="bg-white border border-[#E7DBCD] rounded-2xl py-4 mt-2 items-center" onPress={pickAndUploadImage} disabled={uploading}>
          {uploading ? <ActivityIndicator color="#1F3A5F" /> : <Text className="text-primary font-bold">Subir imagen a Cloudinary</Text>}
        </Pressable>

        <Pressable className="bg-secondary rounded-2xl py-4 mt-3 items-center" onPress={onSubmit} disabled={isLoading || uploading}>
          {isLoading ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-base">{submitLabel}</Text>}
        </Pressable>
      </View>
    </ScrollView>
  );
};
