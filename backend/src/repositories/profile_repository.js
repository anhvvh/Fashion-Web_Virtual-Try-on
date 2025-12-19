import { supabase } from '../config/supabase.js';
import { ConflictError } from '../utils/app_error.js';

export const profileRepository = {
  async findByEmail(email) {
    const normalizedEmail = email.toLowerCase().trim();
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, password_hash, display_name, height, weight, full_body_image_url, created_at, updated_at')
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

  async create(profileData) {
    const { email, passwordHash } = profileData;
    const normalizedEmail = email.toLowerCase().trim();

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        email: normalizedEmail,
        password_hash: passwordHash,
      })
      .select('id, email, display_name, height, weight, full_body_image_url, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictError('Email đã được sử dụng');
      }
      throw error;
    }

    return data;
  },
};

