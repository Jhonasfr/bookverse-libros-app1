import { apiRequest } from '@/api/ecommerceApi';
import { PersonalInfoRequest, UserProfile } from '@/interfaces/auth.interface';

export const getProfileAction = async (token: string) => {
  try {
    const [meResponse, personalInfoResponse] = await Promise.allSettled([
      apiRequest<UserProfile>({
        method: 'GET',
        url: '/api/users/me',
        headers: { Authorization: `Bearer ${token}` },
      }),
      apiRequest<UserProfile>({
        method: 'GET',
        url: '/api/users/me/personal-info',
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const me = meResponse.status === 'fulfilled' ? meResponse.value.data : {};
    const personal = personalInfoResponse.status === 'fulfilled' ? personalInfoResponse.value.data : {};

    return {
      ...me,
      ...personal,
      name: [personal?.firstName, personal?.lastName].filter(Boolean).join(' ') || (me as UserProfile)?.name || '',
    } as UserProfile;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || 'No se pudo cargar el perfil';
    throw 'No se pudo conectar con el servidor';
  }
};

export const updateProfileAction = async (payload: PersonalInfoRequest, token: string) => {
  try {
    const { data } = await apiRequest<UserProfile>({
      method: 'PUT',
      url: '/api/users/me/personal-info',
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error: any) {
    if (error.response) throw error.response.data.message || 'No se pudo actualizar el perfil';
    throw 'No se pudo conectar con el servidor';
  }
};
