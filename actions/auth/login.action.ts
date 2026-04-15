import { apiRequest } from '@/api/ecommerceApi';
import { AuthResponse } from '@/interfaces/auth.interface';
import { encryptPassword } from '@/utils/crypto';

export const loginAction = async (email: string, password: string) => {
  try {
    const { data } = await apiRequest<AuthResponse>({
      method: 'POST',
      url: '/api/auth/login',
      data: {
        email: email.trim().toLowerCase(),
        encryptedPassword: encryptPassword(password),
      },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || 'No se pudo iniciar sesión';
    throw 'No se pudo conectar con el servidor. Si estás en navegador, prueba la API compartida o levanta tu backend local en http://localhost:8080.';
  }
};
