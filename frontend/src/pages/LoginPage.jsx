import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authService } from '../services/auth';

const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(data.email, data.password);
      navigate('/');
    } catch (err) {
      const errorMessage =
        err?.error?.message || err?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
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
              Đăng nhập
            </h1>
            <p className="text-sm text-gray-600 text-center mb-8">Chào mừng bạn trở lại</p>

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
                  disabled={isLoading}
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
                  placeholder="Nhập mật khẩu"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition-normal disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-gray-900 hover:text-gray-700 font-medium transition-normal underline">
                  Đăng ký
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

