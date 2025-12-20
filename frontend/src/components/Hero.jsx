import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-gray-900 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Thử đồ trực tuyến
            <br />
            <span className="text-gray-600">như đang ở cửa hàng</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-10 max-w-xl mx-auto leading-relaxed">
            Trải nghiệm công nghệ AI tiên tiến để thử quần áo trực tuyến. Xem
            bạn trông như thế nào với bộ đồ yêu thích trước khi mua.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-gray-900 transition-normal"
            >
              Bắt đầu ngay
            </Link>
            <Link
              to="/#features"
              className="w-full sm:w-auto border border-gray-300 text-gray-900 px-8 py-3 rounded-lg text-sm font-medium hover:border-gray-900 transition-normal"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <div className="aspect-video bg-gray-50 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 bg-black rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 md:w-12 md:h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 text-sm">
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

