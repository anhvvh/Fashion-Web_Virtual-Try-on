import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { authService } from '../services/auth';

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getUser();
      const authenticated = authService.isAuthenticated();
      setUser(currentUser);
      setIsAuthenticated(authenticated);
    };

    checkAuth();
    
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white font-semibold text-sm">V</span>
            </div>
            <span className="text-lg font-medium text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
              Virtual Try-on
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 transition-normal text-sm font-medium"
            >
              Trang chủ
            </Link>
            <Link
              to="/#features"
              className="text-gray-700 hover:text-gray-900 transition-normal text-sm font-medium"
            >
              Tính năng
            </Link>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin/categories"
                    className="text-gray-700 hover:text-gray-900 transition-normal text-sm font-medium"
                  >
                    Quản lý
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-gray-900 transition-normal text-sm font-medium"
                >
                  {user?.displayName || user?.email || 'Tài khoản'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900 transition-normal text-sm font-medium"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 transition-normal text-sm font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-black text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 transition-normal text-sm font-medium"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button className="text-gray-700 hover:text-gray-900 p-2">
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
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

