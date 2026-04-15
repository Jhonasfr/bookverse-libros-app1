import { apiRequest } from '@/api/ecommerceApi';
import { AuthResponse, RegisterRequest } from '@/interfaces/auth.interface';
import { encryptPassword } from '@/utils/crypto';

const splitName = (name: string, lastName?: string) => {
  const cleanedName = name.trim().replace(/\s+/g, ' ');
  const parts = cleanedName.split(' ').filter(Boolean);
  const derivedFirstName = parts.shift() || cleanedName;
  const derivedLastName = lastName?.trim() || parts.join(' ') || 'Usuario';

  return {
    firstName: derivedFirstName,
    lastName: derivedLastName,
  };
};

const makeIdentificationNumber = (value?: string) => {
  const digits = (value || '').replace(/\D/g, '');
  if (digits.length >= 6) return digits;
  return `${Date.now()}`.slice(-10);
};

export const registerAction = async (userData: RegisterRequest) => {
  try {
    const { firstName, lastName } = splitName(userData.name, userData.lastName);
    const { data } = await apiRequest<AuthResponse>({
      method: 'POST',
      url: '/api/auth/register',
      data: {
        firstName,
        lastName,
        identificationNumber: makeIdentificationNumber(userData.identificationNumber),
        email: userData.email.trim().toLowerCase(),
        role: userData.role.toUpperCase(),
        encryptedPassword: encryptPassword(userData.password),
      },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || 'No se pudo registrar la cuenta';
    throw 'No se pudo conectar con el servidor. Si estás en navegador, prueba la API compartida o levanta tu backend local en http://localhost:8080.';
  }
};
