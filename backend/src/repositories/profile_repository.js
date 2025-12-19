import { supabase } from '../config/supabase.js';
import { NotFoundError, ConflictError } from '../utils/app_error.js';

export const profileRepository = {
  async findByEmail(email) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, password_hash, display_name, height, weight, full_body_image_url, created_at, updated_at')
      .eq('email', email.toLowerCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, display_name, height, weight, full_body_image_url, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('User not found');
      }
      throw error;
    }

    return data;
  },

  async create({ email, passwordHash }) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        email: email.toLowerCase(),
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

  async update(id, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id, email, display_name, height, weight, full_body_image_url, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('User not found');
      }
      throw error;
    }

    return data;
  },
};

