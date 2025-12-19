import { profileService } from '../services/profile_service.js';
import { sendSuccess } from '../utils/response.js';
import { HTTP_STATUS } from '../config/constants.js';

export const profileController = {
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;

      const profile = await profileService.getProfile(userId);

      return sendSuccess(res, profile, HTTP_STATUS.OK);
    } catch (error) {
      return next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      let { displayName, height, weight } = req.body;
      const imageFile = req.file;

      if (displayName === '') displayName = null;
      
      if (height === '' || height === undefined) {
        height = null;
      } else {
        height = Number(height);
        if (isNaN(height)) height = null;
      }
      
      if (weight === '' || weight === undefined) {
        weight = null;
      } else {
        weight = Number(weight);
        if (isNaN(weight)) weight = null;
      }

      const updatedProfile = await profileService.updateProfile(
        userId,
        { displayName, height, weight },
        imageFile
      );

      return sendSuccess(res, updatedProfile, HTTP_STATUS.OK);
    } catch (error) {
      return next(error);
    }
  },
};

