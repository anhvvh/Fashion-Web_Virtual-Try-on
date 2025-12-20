import { categoriesService } from '../services/categories_service.js';
import { sendSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';

export const categoriesController = {
  async getAllCategories(_req, res, next) {
    try {
      const categories = await categoriesService.getAllCategories();
      return sendSuccess(res, categories, HTTP_STATUS.OK);
    } catch (error) {
      return next(error);
    }
  },

  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await categoriesService.getCategoryById(id);
      return sendSuccess(res, category, HTTP_STATUS.OK);
    } catch (error) {
      return next(error);
    }
  },

  async createCategory(req, res, next) {
    try {
      const { name, description } = req.body;
      const category = await categoriesService.createCategory({ name, description });
      return sendSuccess(res, category, HTTP_STATUS.CREATED);
    } catch (error) {
      return next(error);
    }
  },

  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      const category = await categoriesService.updateCategory(id, { name, description });
      return sendSuccess(res, category, HTTP_STATUS.OK);
    } catch (error) {
      return next(error);
    }
  },

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      await categoriesService.deleteCategory(id);
      return sendSuccess(res, null, HTTP_STATUS.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  },
};

