import { profileRepository } from '../repositories/profile_repository.js';
import { ValidationError, NotFoundError } from '../utils/app_error.js';
import { supabase } from '../config/supabase.js';

const MIN_HEIGHT = 100;
const MAX_HEIGHT = 250;
const MIN_WEIGHT = 30;
const MAX_WEIGHT = 250;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const STORAGE_BUCKET = 'full-body-images';

const validateHeight = (height) => {
  if (height === null || height === undefined) {
    return null;
  }

  const heightNum = Number(height);
  if (isNaN(heightNum)) {
    throw new ValidationError('Chiều cao phải là số');
  }

  if (heightNum < MIN_HEIGHT || heightNum > MAX_HEIGHT) {
    throw new ValidationError(`Chiều cao phải từ ${MIN_HEIGHT} đến ${MAX_HEIGHT} cm`);
  }

  return Math.round(heightNum);
};

const validateWeight = (weight) => {
  if (weight === null || weight === undefined) {
    return null;
  }

  const weightNum = Number(weight);
  if (isNaN(weightNum)) {
    throw new ValidationError('Cân nặng phải là số');
  }

  if (weightNum < MIN_WEIGHT || weightNum > MAX_WEIGHT) {
    throw new ValidationError(`Cân nặng phải từ ${MIN_WEIGHT} đến ${MAX_WEIGHT} kg`);
  }

  return parseFloat(weightNum.toFixed(2));
};

const validateDisplayName = (displayName) => {
  if (displayName === null || displayName === undefined || displayName === '') {
    return null;
  }

  const trimmed = displayName.trim();
  if (trimmed.length > 100) {
    throw new ValidationError('Tên hiển thị không được vượt quá 100 ký tự');
  }

  return trimmed || null;
};

const uploadImageToStorage = async (userId, imageFile) => {
  if (!imageFile) {
    return null;
  }

  if (!ALLOWED_MIME_TYPES.includes(imageFile.mimetype)) {
    throw new ValidationError('Chỉ chấp nhận file ảnh định dạng JPG, JPEG hoặc PNG');
  }

  if (imageFile.size > MAX_FILE_SIZE) {
    throw new ValidationError('Kích thước file không được vượt quá 5MB');
  }

  const timestamp = Date.now();
  const fileExtension = imageFile.originalname.split('.').pop();
  const fileName = `${timestamp}_${userId}.${fileExtension}`;
  const filePath = `${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, imageFile.buffer, {
      contentType: imageFile.mimetype,
      upsert: false,
    });

  if (error) {
    throw new Error(`Lỗi khi upload ảnh: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};

const deleteImageFromStorage = async (imageUrl) => {
  if (!imageUrl) {
    return;
  }

  try {
    const urlParts = imageUrl.split('/');
    const fileNameIndex = urlParts.findIndex((part) => part === STORAGE_BUCKET);
    if (fileNameIndex === -1) {
      return;
    }

    const filePath = urlParts.slice(fileNameIndex + 1).join('/');

    await supabase.storage.from(STORAGE_BUCKET).remove([filePath]);
  } catch (error) {
    console.error('Error deleting old image:', error);
  }
};

export const profileService = {
  async getProfile(userId) {
    const profile = await profileRepository.findById(userId);

    if (!profile) {
      throw new NotFoundError('Người dùng không tồn tại');
    }

    return {
      id: profile.id,
      email: profile.email,
      displayName: profile.display_name,
      height: profile.height,
      weight: profile.weight,
      fullBodyImageUrl: profile.full_body_image_url,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
    };
  },

  async updateProfile(userId, updateData, imageFile) {
    const { displayName, height, weight } = updateData;

    const validatedDisplayName = validateDisplayName(displayName);
    const validatedHeight = validateHeight(height);
    const validatedWeight = validateWeight(weight);

    let imageUrl = null;
    let oldImageUrl = null;

    if (imageFile) {
      const profile = await profileRepository.findById(userId);
      if (!profile) {
        throw new NotFoundError('Người dùng không tồn tại');
      }

      oldImageUrl = profile.full_body_image_url;
      imageUrl = await uploadImageToStorage(userId, imageFile);
    }

    const updatedProfile = await profileRepository.update(userId, {
      displayName: validatedDisplayName,
      height: validatedHeight,
      weight: validatedWeight,
      fullBodyImageUrl: imageUrl !== null ? imageUrl : undefined,
    });

    if (oldImageUrl && imageUrl) {
      await deleteImageFromStorage(oldImageUrl);
    }

    return {
      id: updatedProfile.id,
      email: updatedProfile.email,
      displayName: updatedProfile.display_name,
      height: updatedProfile.height,
      weight: updatedProfile.weight,
      fullBodyImageUrl: updatedProfile.full_body_image_url,
      createdAt: updatedProfile.created_at,
      updatedAt: updatedProfile.updated_at,
    };
  },
};

