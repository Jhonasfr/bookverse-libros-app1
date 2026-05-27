import { apiRequest } from "@/api/ecommerceApi";
import { Order, OrderStatus } from "@/interfaces/order.interface";

export const updateOrderStatus = async (id: string | number, status: OrderStatus, token: string) => {
  try {
    const { data } = await apiRequest<{ statusCode: number; message: string; data: Order }>({
      method: 'PUT',
      url: `/api/orders/${id}/status`,
      params: { status },
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || "No se pudo actualizar el estado";
    throw "No se pudo conectar con el servidor";
  }
};
