import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { profileService } from '../services/profile';
import { authService } from '../services/auth';

const profileSchema = z.object({
  displayName: z.string().max(100, 'Tên hiển thị không được vượt quá 100 ký tự').optional().or(z.literal('')),
  height: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || isNaN(Number(val)) ? null : Number(val)),
    z
      .number({ invalid_type_error: 'Chiều cao phải là số' })
      .min(100, 'Chiều cao phải từ 100 đến 250 cm')
      .max(250, 'Chiều cao phải từ 100 đến 250 cm')
      .nullable()
      .optional()
  ),
  weight: z.preprocess(
    (val) => (val === '' || val === null || val === undefined || isNaN(Number(val)) ? null : Number(val)),
    z
      .number({ invalid_type_error: 'Cân nặng phải là số' })
      .min(30, 'Cân nặng phải từ 30 đến 250 kg')
      .max(250, 'Cân nặng phải từ 30 đến 250 kg')
      .nullable()
      .optional()
  ),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageWarning, setImageWarning] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoadingProfile(true);
    setError(null);

    try {
      const profile = await profileService.getProfile();
      reset({
        displayName: profile.displayName || '',
        height: profile.height || null,
        weight: profile.weight || null,
      });
      setCurrentImageUrl(profile.fullBodyImageUrl);
      
      const user = authService.getUser();
      if (user) {
        const updatedUser = { ...user, ...profile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      const errorMessage = err?.error?.message || err?.message || 'Không thể tải thông tin hồ sơ. Vui lòng thử lại.';
      setError(errorMessage);
      if (err?.error?.statusCode === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const validateImage = (file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Chỉ chấp nhận file ảnh định dạng JPG, JPEG hoặc PNG';
    }

    if (file.size > MAX_FILE_SIZE) {
      return 'Kích thước file không được vượt quá 5MB';
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const ratio = width / height;
        const recommendedRatios = [3 / 4, 9 / 16];
        const minDimension = Math.min(width, height);

        let warning = null;
        if (minDimension < 720) {
          warning = 'Khuyến nghị: Kích thước ảnh tối thiểu 720px cho chiều ngắn hơn';
        } else if (!recommendedRatios.some((r) => Math.abs(ratio - r) < 0.1)) {
          warning = 'Khuyến nghị: Tỷ lệ ảnh nên là 3:4 hoặc 9:16 để có kết quả tốt nhất';
        }
        resolve(warning);
      };
      img.onerror = () => {
        resolve('File ảnh không hợp lệ');
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      setImageWarning(null);
      return;
    }

    const validationError = validateImage(file);
    if (typeof validationError === 'string') {
      setError(validationError);
      setImageFile(null);
      setImagePreview(null);
      setImageWarning(null);
      e.target.value = '';
      return;
    }

    const warning = await validationError;
    setImageFile(file);
    setImageWarning(warning);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedProfile = await profileService.updateProfile(data, imageFile);
      setSuccess(true);

      const user = authService.getUser();
      if (user) {
        const updatedUser = { ...user, ...updatedProfile };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      setCurrentImageUrl(updatedProfile.fullBodyImageUrl);
      setImageFile(null);
      setImagePreview(null);
      setImageWarning(null);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      const errorMessage = err?.error?.message || err?.message || 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.';
      setError(errorMessage);
      if (err?.error?.statusCode === 401) {
        setTimeout(() => navigate('/login'), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const user = authService.getUser();

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-8 text-center">
              <p className="text-gray-600">Đang tải thông tin hồ sơ...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-10">
            <h1 
              className="text-3xl md:text-4xl font-medium text-center mb-2 text-gray-900"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Hồ sơ của tôi
            </h1>
            <p className="text-sm text-gray-600 text-center mb-8">Cập nhật thông tin cá nhân và ảnh toàn thân</p>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">Cập nhật hồ sơ thành công!</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {imageWarning && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">{imageWarning}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed text-sm"
                />
                <p className="mt-1.5 text-xs text-gray-500">Email không thể thay đổi</p>
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-900 mb-2">
                  Tên hiển thị
                </label>
                <input
                  id="displayName"
                  type="text"
                  {...register('displayName')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-normal text-sm ${
                    errors.displayName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
                  }`}
                  placeholder="Tên hiển thị (tùy chọn)"
                  disabled={isLoading}
                />
                {errors.displayName && <p className="mt-1.5 text-xs text-red-600">{errors.displayName.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-900 mb-2">
                    Chiều cao (cm)
                  </label>
                  <input
                    id="height"
                    type="number"
                    {...register('height')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-normal text-sm ${
                      errors.height ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
                    }`}
                    placeholder="100-250"
                    min="100"
                    max="250"
                    disabled={isLoading}
                  />
                  {errors.height && <p className="mt-1.5 text-xs text-red-600">{errors.height.message}</p>}
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-900 mb-2">
                    Cân nặng (kg)
                  </label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    {...register('weight')}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-normal text-sm ${
                      errors.weight ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
                    }`}
                    placeholder="30-250"
                    min="30"
                    max="250"
                    disabled={isLoading}
                  />
                  {errors.weight && <p className="mt-1.5 text-xs text-red-600">{errors.weight.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-900 mb-2">
                  Ảnh chân dung toàn thân
                </label>
                <input
                  id="image"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-normal text-sm"
                  disabled={isLoading}
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Định dạng: JPG, PNG | Tối đa: 5MB | Khuyến nghị: Tỷ lệ 3:4 hoặc 9:16, tối thiểu 720px
                </p>

                {(imagePreview || currentImageUrl) && (
                  <div className="mt-4">
                    <img
                      src={imagePreview || currentImageUrl}
                      alt="Preview"
                      className="max-w-xs max-h-96 rounded-lg border border-gray-300 object-contain"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

