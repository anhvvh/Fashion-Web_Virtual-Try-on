import { categoriesRepository } from '../repositories/categories_repository.js';
import { ValidationError, NotFoundError, ConflictError } from '../utils/app_error.js';

const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const generateUniqueSlug = async (baseSlug, excludeId = null) => {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await categoriesRepository.findBySlug(slug);
    
    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    throw new ValidationError('Tên danh mục là bắt buộc');
  }

  const trimmed = name.trim();
  if (trimmed.length < MIN_NAME_LENGTH) {
    throw new ValidationError('Tên danh mục không được để trống');
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    throw new ValidationError(`Tên danh mục không được vượt quá ${MAX_NAME_LENGTH} ký tự`);
  }

  return trimmed;
};

const validateDescription = (description) => {
  if (!description || description === '') {
    return null;
  }

  if (typeof description !== 'string') {
    throw new ValidationError('Mô tả phải là chuỗi ký tự');
  }

  const trimmed = description.trim();
  if (trimmed.length > MAX_DESCRIPTION_LENGTH) {
    throw new ValidationError(`Mô tả không được vượt quá ${MAX_DESCRIPTION_LENGTH} ký tự`);
  }

  return trimmed || null;
};

export const categoriesService = {
  async getAllCategories() {
    const categories = await categoriesRepository.findAll();
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await categoriesRepository.countProducts(category.id);
        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          productCount,
          createdAt: category.created_at,
          updatedAt: category.updated_at,
        };
      })
    );

    return categoriesWithCount;
  },

  async getCategoryById(categoryId) {
    const category = await categoriesRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundError('Danh mục không tồn tại');
    }

    const productCount = await categoriesRepository.countProducts(category.id);

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      productCount,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    };
  },

  async createCategory(categoryData) {
    const { name, description } = categoryData;

    const validatedName = validateName(name);
    const validatedDescription = validateDescription(description);

    const baseSlug = generateSlug(validatedName);
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    const category = await categoriesRepository.create({
      name: validatedName,
      slug: uniqueSlug,
      description: validatedDescription,
    });

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      productCount: 0,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
    };
  },

  async updateCategory(categoryId, updateData) {
    const { name, description } = updateData;

    const existingCategory = await categoriesRepository.findById(categoryId);
    if (!existingCategory) {
      throw new NotFoundError('Danh mục không tồn tại');
    }

    const updatePayload = {};

    if (name !== undefined) {
      updatePayload.name = validateName(name);
      const baseSlug = generateSlug(updatePayload.name);
      updatePayload.slug = await generateUniqueSlug(baseSlug, categoryId);
    }

    if (description !== undefined) {
      updatePayload.description = validateDescription(description);
    }

    const updatedCategory = await categoriesRepository.update(categoryId, updatePayload);

    const productCount = await categoriesRepository.countProducts(categoryId);

    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      slug: updatedCategory.slug,
      description: updatedCategory.description,
      productCount,
      createdAt: updatedCategory.created_at,
      updatedAt: updatedCategory.updated_at,
    };
  },

  async deleteCategory(categoryId) {
    const category = await categoriesRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundError('Danh mục không tồn tại');
    }

    const productCount = await categoriesRepository.countProducts(categoryId);
    if (productCount > 0) {
      throw new ConflictError('Không thể xóa danh mục đang có sản phẩm');
    }

    await categoriesRepository.delete(categoryId);
  },
};

