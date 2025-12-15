import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 opacity-50"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
            Thử đồ trực tuyến
            <br />
            <span className="text-gray-800">như đang ở cửa hàng</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Trải nghiệm công nghệ AI tiên tiến để thử quần áo trực tuyến. Xem
            bạn trông như thế nào với bộ đồ yêu thích trước khi mua.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Bắt đầu ngay
            </Link>
            <Link
              to="/#features"
              className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-200 hover:border-pink-300 transition-all shadow-md hover:shadow-lg"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>

        <div className="mt-16 md:mt-24 max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  Preview: Virtual Try-on Experience
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

