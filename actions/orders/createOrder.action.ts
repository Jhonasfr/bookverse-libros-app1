import { apiRequest } from "@/api/ecommerceApi";
import { CreateOrderDto, Order } from "@/interfaces/order.interface";

export const createOrder = async (payload: CreateOrderDto, token: string) => {
  try {
    const { data } = await apiRequest<{ statusCode: number; message: string; data: Order }>({
      method: 'POST',
      url: '/api/orders',
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || "No se pudo crear la orden";
    throw "No se pudo conectar con el servidor";
  }
};
