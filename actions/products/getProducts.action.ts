import { apiRequest } from "@/api/ecommerceApi";
import { CreateProductDto, Product } from "@/interfaces/product.interface";

export const getProducts = async () => {
  try {
    const { data } = await apiRequest<{ statusCode: number; message: string; data: Product[] }>({
      method: 'GET',
      url: '/api/products',
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || "No se pudieron cargar los libros";
    throw "No se pudo conectar con el servidor";
  }
};

export const getProductById = async (id: string | number) => {
  try {
    const { data } = await apiRequest<{ statusCode: number; message: string; data: Product }>({
      method: 'GET',
      url: `/api/products/${id}`,
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || "No se pudo cargar el libro";
    throw "No se pudo conectar con el servidor";
  }
};

export const updateProduct = async (id: string | number, payload: Partial<CreateProductDto>, token: string) => {
  try {
    const { data } = await apiRequest<{ statusCode: number; message: string; data: Product }>({
      method: 'PUT',
      url: `/api/products/${id}`,
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || "No se pudo actualizar el libro";
    throw "No se pudo conectar con el servidor";
  }
};
