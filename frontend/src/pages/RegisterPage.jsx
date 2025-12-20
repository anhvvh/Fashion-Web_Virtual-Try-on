import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authService } from '../services/auth';

const registerSchema = z
  .object({
    email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authService.register(data.email, data.password, data.confirmPassword);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMessage =
        err?.error?.message || err?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-md">
          <div className="bg-white border border-gray-200 rounded-lg p-8 md:p-10">
            <h1 
              className="text-3xl md:text-4xl font-medium text-center mb-2 text-gray-900"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Đăng ký
            </h1>
            <p className="text-sm text-gray-600 text-center mb-8">Tạo tài khoản mới để bắt đầu</p>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">Đăng ký thành công! Đang chuyển đến trang đăng nhập...</p>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
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
                  {...register('email')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-normal text-sm ${
                    errors.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
                  }`}
                  placeholder="your@email.com"
                  disabled={isLoading || success}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                  Mật khẩu
                </label>
                <input
                  id="password"
                  type="password"
                  {...register('password')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-normal text-sm ${
                    errors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
                  }`}
                  placeholder="Tối thiểu 8 ký tự"
                  disabled={isLoading || success}
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900 mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 transition-normal text-sm ${
                    errors.confirmPassword
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:border-gray-900 focus:ring-gray-900'
                  }`}
                  placeholder="Nhập lại mật khẩu"
                  disabled={isLoading || success}
                />
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang xử lý...' : success ? 'Thành công!' : 'Đăng ký'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Đã có tài khoản?{' '}
                <Link to="/login" className="text-gray-900 hover:text-gray-700 font-medium transition-normal underline">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

