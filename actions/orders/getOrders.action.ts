import { apiRequest } from "@/api/ecommerceApi";
import { Order } from "@/interfaces/order.interface";

export const getMyOrders = async (token: string) => {
  try {
    const { data } = await apiRequest<{ statusCode: number; message: string; data: Order[] }>({
      method: 'GET',
      url: '/api/orders/my',
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || "No se pudieron cargar las órdenes";
    throw "No se pudo conectar con el servidor";
  }
};
