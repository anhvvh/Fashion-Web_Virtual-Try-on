-- Migration: Seed admin user for testing
-- Description: Tạo dữ liệu mẫu cho admin user để test (Task 2 - Sprint 2)
-- Created: Sprint 2
-- Note: Password hash là placeholder, cần thay bằng hash thực tế từ bcrypt

-- Tạo admin user mẫu
-- Lưu ý: Email và password_hash cần được thay thế bằng giá trị thực tế
INSERT INTO profiles (email, password_hash, display_name, role)
VALUES (
  'admin@example.com',
  '$2a$10$rOzJq1Xr9q1Xr9q1Xr9q1O3Xr9q1Xr9q1Xr9q1Xr9q1Xr9q1Xr9q1Xr', -- password123 (placeholder)
  'Admin User',
  'admin'
) ON CONFLICT (email) DO UPDATE SET role = 'admin';

-- Lưu ý quan trọng:
-- - Password hash trong file này là placeholder, KHÔNG sử dụng trực tiếp
-- - Để tạo password hash thực tế, sử dụng bcrypt trong Node.js:
--   const bcrypt = require('bcryptjs');
--   const hash = bcrypt.hashSync('password123', 10);
--   console.log(hash); // Copy hash này vào password_hash
-- - Mật khẩu gốc mặc định: "password123" (nên đổi trong production)
-- - Trong môi trường production, KHÔNG seed dữ liệu mẫu
-- - Sau khi có hash thực tế, cập nhật lại giá trị password_hash trong file này
-- - Nếu user với email này đã tồn tại, sẽ update role thành 'admin'

