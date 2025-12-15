import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Virtual Try-on
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Trải nghiệm công nghệ thử đồ trực tuyến tiên tiến. Mua sắm thời
              trang thông minh và tiện lợi hơn bao giờ hết.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-pink-400 transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/#features"
                  className="hover:text-pink-400 transition-colors"
                >
                  Tính năng
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-pink-400 transition-colors"
                >
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-pink-400 transition-colors"
                >
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-pink-400 transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Virtual Try-on. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

