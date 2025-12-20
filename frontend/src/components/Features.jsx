export default function Features() {
  const features = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      title: 'Thử đồ thời gian thực',
      description:
        'Xem ngay hình ảnh bạn mặc quần áo với công nghệ AI tiên tiến, không cần tải xuống hay chờ đợi.',
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      title: 'Độ chính xác cao',
      description:
        'Công nghệ AI phân tích hình dáng cơ thể để hiển thị quần áo phù hợp với tỷ lệ chính xác.',
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      title: 'Mọi thiết bị',
      description:
        'Trải nghiệm mượt mà trên điện thoại, tablet và máy tính. Responsive design hoàn hảo.',
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
      title: 'Bộ sưu tập đa dạng',
      description:
        'Hàng ngàn sản phẩm từ các thương hiệu thời trang, từ casual đến formal, đáp ứng mọi phong cách.',
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      title: 'Mua sắm dễ dàng',
      description:
        'Thêm vào giỏ hàng và thanh toán ngay trên nền tảng. Quy trình mua sắm đơn giản và nhanh chóng.',
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: 'Bảo mật thông tin',
      description:
        'Dữ liệu cá nhân và hình ảnh được bảo vệ an toàn với công nghệ mã hóa tiên tiến.',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 
            className="text-3xl md:text-4xl font-medium mb-4 text-gray-900"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Tính năng nổi bật
          </h2>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Khám phá những tính năng giúp bạn mua sắm thời trang thông minh và
            tiện lợi hơn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-normal"
            >
              <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium mb-2 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

