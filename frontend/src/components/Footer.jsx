import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white font-semibold text-sm">V</span>
              </div>
              <span className="text-lg font-medium text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
                Virtual Try-on
              </span>
            </Link>
            <p className="text-sm text-gray-600 mb-6 max-w-md leading-relaxed">
              Trải nghiệm công nghệ thử đồ trực tuyến tiên tiến. Mua sắm thời
              trang thông minh và tiện lợi hơn bao giờ hết.
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 font-medium mb-4 text-sm">Liên kết</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900 transition-normal text-sm"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/#features"
                  className="text-gray-600 hover:text-gray-900 transition-normal text-sm"
                >
                  Tính năng
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 transition-normal text-sm"
                >
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-gray-600 hover:text-gray-900 transition-normal text-sm"
                >
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-medium mb-4 text-sm">Hỗ trợ</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-normal text-sm">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-normal text-sm">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-normal text-sm">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-xs text-gray-500">
          <p>&copy; 2024 Virtual Try-on. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

