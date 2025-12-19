import api from './api.js';

export const profileService = {
  async getProfile() {
    const response = await api.get('/user/profile');
    return response.data;
  },

  async updateProfile(profileData, imageFile) {
    const formData = new FormData();
    
    formData.append('displayName', profileData.displayName || '');
    
    if (profileData.height !== null && profileData.height !== undefined) {
      formData.append('height', profileData.height.toString());
    } else {
      formData.append('height', '');
    }
    
    if (profileData.weight !== null && profileData.weight !== undefined) {
      formData.append('weight', profileData.weight.toString());
    } else {
      formData.append('weight', '');
    }
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await api.put('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
};

