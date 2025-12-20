import { supabase } from '../config/supabase.js';
import { NotFoundError, ConflictError } from '../utils/app_error.js';

export const categoriesRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  async findById(categoryId) {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, created_at, updated_at')
      .eq('id', categoryId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  },

  async findBySlug(slug) {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, created_at, updated_at')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  },

  async create(categoryData) {
    const { name, slug, description } = categoryData;

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: name.trim(),
        slug,
        description: description ? description.trim() : null,
      })
      .select('id, name, slug, description, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictError('Slug đã tồn tại');
      }
      throw error;
    }

    return data;
  },

  async update(categoryId, updateData) {
    const { name, slug, description } = updateData;

    const updatePayload = {};
    if (name !== undefined) {
      updatePayload.name = name.trim();
    }
    if (slug !== undefined) {
      updatePayload.slug = slug;
    }
    if (description !== undefined) {
      updatePayload.description = description ? description.trim() : null;
    }
    updatePayload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('categories')
      .update(updatePayload)
      .eq('id', categoryId)
      .select('id, name, slug, description, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Danh mục không tồn tại');
      }
      if (error.code === '23505') {
        throw new ConflictError('Slug đã tồn tại');
      }
      throw error;
    }

    return data;
  },

  async delete(categoryId) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      if (error.code === '23503') {
        throw new ConflictError('Không thể xóa danh mục đang có sản phẩm');
      }
      if (error.code === 'PGRST116') {
        throw new NotFoundError('Danh mục không tồn tại');
      }
      throw error;
    }
  },

  async countProducts(categoryId) {
    const { count, error } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId);

    if (error) {
      throw error;
    }

    return count || 0;
  },
};

