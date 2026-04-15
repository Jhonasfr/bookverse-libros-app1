import { apiRequest } from '@/api/ecommerceApi';
import { CreateProductDto, Product } from '@/interfaces/product.interface';

export const createProduct = async (payload: CreateProductDto, token: string) => {
  try {
    const { data } = await apiRequest<{ statusCode: number; message: string; data: Product }>({
      method: 'POST',
      url: '/api/products',
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || 'No se pudo crear el libro';
    throw 'No se pudo conectar con el servidor';
  }
};
