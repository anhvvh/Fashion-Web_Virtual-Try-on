import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryForm from '../components/CategoryForm';
import { categoriesService } from '../services/categories';
import { authService } from '../services/auth';

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const user = authService.getUser();
  const isAdmin = user?.role === 'admin';

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAllCategories(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => categoriesService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsFormOpen(false);
      setSuccessMessage('Tạo danh mục thành công!');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (err) => {
      const message = err?.error?.message || err?.message || 'Tạo danh mục thất bại. Vui lòng thử lại.';
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(null), 5000);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => categoriesService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
      setSuccessMessage('Cập nhật danh mục thành công!');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (err) => {
      const message = err?.error?.message || err?.message || 'Cập nhật danh mục thất bại. Vui lòng thử lại.';
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(null), 5000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeleteConfirm(null);
      setSuccessMessage('Xóa danh mục thành công!');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (err) => {
      const message = err?.error?.message || err?.message || 'Xóa danh mục thất bại. Vui lòng thử lại.';
      setErrorMessage(message);
      setTimeout(() => setErrorMessage(null), 5000);
      setDeleteConfirm(null);
    },
  });

  const handleCreate = async (data) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdate = async (data) => {
    await updateMutation.mutateAsync({ id: editingCategory.id, data });
  };

  const handleDelete = async (id) => {
    await deleteMutation.mutateAsync(id);
  };

  const openEditForm = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
              <h1 className="text-2xl font-bold text-black mb-4">Không có quyền truy cập</h1>
              <p className="text-gray-600">Chỉ admin mới có thể quản lý danh mục.</p>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-8">
            <h1 
              className="text-3xl md:text-4xl font-medium text-gray-900 mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Quản lý Danh mục
            </h1>
            <p className="text-sm text-gray-600">Quản lý các danh mục sản phẩm</p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{errorMessage}</p>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Danh sách danh mục</h2>
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-900 transition-normal"
              >
                + Thêm danh mục
              </button>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">Đang tải...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <p className="text-red-600">Không thể tải danh sách danh mục. Vui lòng thử lại.</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">Chưa có danh mục nào. Hãy tạo danh mục đầu tiên!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Tên</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Slug</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Mô tả</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Ngày tạo</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50 transition-normal">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{category.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{category.slug}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {category.description || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(category.created_at).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => openEditForm(category)}
                              className="text-gray-700 hover:text-gray-900 transition-normal px-3 py-1.5 text-sm font-medium"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(category)}
                              className="text-red-600 hover:text-red-700 transition-normal px-3 py-1.5 text-sm font-medium"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {(isFormOpen || editingCategory) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 
                  className="text-2xl font-medium text-gray-900"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-600 hover:text-gray-900 transition-normal p-1"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <CategoryForm
                category={editingCategory}
                onSubmit={editingCategory ? handleUpdate : handleCreate}
                onCancel={closeForm}
                isLoading={createMutation.isPending || updateMutation.isPending}
              />
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 border border-gray-200">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Xác nhận xóa</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa danh mục <strong>"{deleteConfirm.name}"</strong>? Hành động
              này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg text-sm font-medium hover:bg-gray-900 transition-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleteMutation.isPending}
                className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg text-sm font-medium hover:border-gray-900 transition-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

