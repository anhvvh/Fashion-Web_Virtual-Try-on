import { supabase } from '../config/supabase.js';
import { ConflictError, NotFoundError } from '../utils/app_error.js';

export const profileRepository = {
  async findByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, password_hash, display_name, height, weight, full_body_image_url, role, created_at, updated_at')
      .eq('email', normalizedEmail)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  },

  async findById(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, display_name, height, weight, full_body_image_url, role, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  },

  async create(profileData) {
    const { email, passwordHash } = profileData;
    const normalizedEmail = email.toLowerCase().trim();

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        email: normalizedEmail,
        password_hash: passwordHash,
      })
      .select('id, email, display_name, height, weight, full_body_image_url, role, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictError('Email đã được sử dụng');
      }
      throw error;
    }

    return data;
  },

  async update(userId, updateData) {
    const { displayName, height, weight, fullBodyImageUrl } = updateData;
    
    const updatePayload = {};
    if (displayName !== undefined) {
      updatePayload.display_name = displayName || null;
    }
    if (height !== undefined) {
      updatePayload.height = height || null;
    }
    if (weight !== undefined) {
      updatePayload.weight = weight || null;
    }
    if (fullBodyImageUrl !== undefined) {
      updatePayload.full_body_image_url = fullBodyImageUrl || null;
    }
    updatePayload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId)
      .select('id, email, display_name, height, weight, full_body_image_url, role, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Người dùng không tồn tại');
      }
      throw error;
    }

    return data;
  },
};

