import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Tên danh mục là bắt buộc')
    .max(100, 'Tên danh mục không được vượt quá 100 ký tự')
    .trim(),
  description: z
    .string()
    .max(500, 'Mô tả không được vượt quá 500 ký tự')
    .optional()
    .or(z.literal('')),
});

export default function CategoryForm({ category, onSubmit, onCancel, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name || '',
          description: category.description || '',
        }
      : {
          name: '',
          description: '',
        },
  });

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    if (!category) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
          Tên danh mục <span className="text-red-600">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-normal text-sm ${
            errors.name
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
          }`}
          placeholder="Ví dụ: Áo thun, Váy, Quần Jeans"
          disabled={isLoading}
        />
        {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
          Mô tả
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-normal resize-y text-sm ${
            errors.description
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
          }`}
          placeholder="Mô tả về danh mục (tùy chọn)"
          disabled={isLoading}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-black text-white py-3 px-6 rounded-lg text-sm font-medium hover:bg-gray-900 transition-normal disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang xử lý...' : category ? 'Cập nhật' : 'Tạo mới'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg text-sm font-medium hover:border-gray-900 transition-normal disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}

