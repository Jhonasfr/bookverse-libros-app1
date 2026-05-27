import { apiRequest } from "@/api/ecommerceApi";
import { Address, CreateAddressDto } from "@/interfaces/address.interface";

export const getAddresses = async (token: string) => {
  try {
    const { data } = await apiRequest<{ statusCode: number; message: string; data: Address[] }>({
      method: 'GET',
      url: '/api/users/me/addresses',
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || "No se pudieron cargar las direcciones";
    throw "No se pudo conectar con el servidor";
  }
};

export const createAddress = async (payload: CreateAddressDto, token: string) => {
  try {
    const { data } = await apiRequest<{ statusCode: number; message: string; data: Address }>({
      method: 'POST',
      url: '/api/users/me/addresses',
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || "No se pudo crear la dirección";
    throw "No se pudo conectar con el servidor";
  }
};

export const updateAddress = async (addressId: number, payload: CreateAddressDto, token: string) => {
  try {
    const { data } = await apiRequest<{ statusCode: number; message: string; data: Address }>({
      method: 'PUT',
      url: `/api/users/me/addresses/${addressId}`,
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || "No se pudo actualizar la dirección";
    throw "No se pudo conectar con el servidor";
  }
};

export const deleteAddress = async (addressId: number, token: string) => {
  try {
    const { data } = await apiRequest<{ statusCode: number; message: string }>({
      method: 'DELETE',
      url: `/api/users/me/addresses/${addressId}`,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || "No se pudo eliminar la dirección";
    throw "No se pudo conectar con el servidor";
  }
};
