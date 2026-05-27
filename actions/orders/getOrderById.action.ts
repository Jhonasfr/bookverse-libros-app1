import { apiRequest } from "@/api/ecommerceApi";
import { Order } from "@/interfaces/order.interface";

export const getOrderById = async (id: string | number, token: string) => {
  try {
    const { data } = await apiRequest<{ statusCode: number; message: string; data: Order }>({
      method: 'GET',
      url: `/api/orders/${id}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || "No se pudo cargar la orden";
    throw "No se pudo conectar con el servidor";
  }
};
