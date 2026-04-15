import axios from 'axios';

const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

type UploadInput = {
  uri: string;
  mimeType?: string;
  fileName?: string;
  file?: File;
};

export const uploadImageToCloudinary = async (asset: UploadInput) => {
  if (!cloudName || !uploadPreset || cloudName === 'TU_CLOUD_NAME' || uploadPreset === 'TU_UPLOAD_PRESET') {
    throw 'Configura EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME y EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET en el archivo .env';
  }

  const form = new FormData();

  if (asset.file) {
    form.append('file', asset.file);
  } else {
    form.append('file', {
      uri: asset.uri,
      type: asset.mimeType || 'image/jpeg',
      name: asset.fileName || `book-cover-${Date.now()}.jpg`,
    } as any);
  }

  form.append('upload_preset', uploadPreset);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    form,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return response.data.secure_url as string;
};
