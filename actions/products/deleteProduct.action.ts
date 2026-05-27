import { apiRequest } from "@/api/ecommerceApi";

export const deleteProduct = async (id: string | number, token: string) => {
  try {
    const { data } = await apiRequest<{ statusCode: number; message: string }>({
      method: 'DELETE',
      url: `/api/products/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || "No se pudo eliminar el libro";
    throw "No se pudo conectar con el servidor";
  }
};
