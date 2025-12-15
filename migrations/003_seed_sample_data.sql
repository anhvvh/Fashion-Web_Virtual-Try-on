-- Migration: Seed sample data for profiles table
-- Description: Tạo dữ liệu mẫu cho testing và development (Sprint 1)
-- Created: Sprint 1
-- Note: Passwords được hash bằng bcrypt với cost factor 10
--       Mật khẩu gốc cho tất cả user mẫu là "password123"

-- Xóa dữ liệu cũ nếu có (chỉ dùng trong development)
-- TRUNCATE TABLE profiles CASCADE;

-- Insert sample users
-- User 1: Đã có đầy đủ thông tin profile
INSERT INTO profiles (email, password_hash, display_name, height, weight, full_body_image_url)
VALUES (
  'user1@example.com',
  '$2a$10$rOzJq1Xr9q1Xr9q1Xr9q1O3Xr9q1Xr9q1Xr9q1Xr9q1Xr9q1Xr9q1Xr', -- password123
  'Nguyễn Văn A',
  170,
  65.5,
  'https://example.supabase.co/storage/v1/object/public/full-body-images/user1/image.jpg'
) ON CONFLICT (email) DO NOTHING;

-- User 2: Chỉ có thông tin cơ bản (chưa cập nhật profile)
INSERT INTO profiles (email, password_hash, display_name, height, weight, full_body_image_url)
VALUES (
  'user2@example.com',
  '$2a$10$rOzJq1Xr9q1Xr9q1Xr9q1O3Xr9q1Xr9q1Xr9q1Xr9q1Xr9q1Xr9q1Xr', -- password123
  NULL,
  NULL,
  NULL,
  NULL
) ON CONFLICT (email) DO NOTHING;

-- User 3: Có thông tin chiều cao, cân nặng nhưng chưa upload ảnh
INSERT INTO profiles (email, password_hash, display_name, height, weight, full_body_image_url)
VALUES (
  'user3@example.com',
  '$2a$10$rOzJq1Xr9q1Xr9q1Xr9q1O3Xr9q1Xr9q1Xr9q1Xr9q1Xr9q1Xr9q1Xr', -- password123
  'Trần Thị B',
  160,
  55.0,
  NULL
) ON CONFLICT (email) DO NOTHING;

-- Lưu ý quan trọng: 
-- - Passwords trong file này là placeholder, KHÔNG sử dụng trực tiếp
-- - Để tạo password hash thực tế, sử dụng bcrypt trong Node.js:
--   const bcrypt = require('bcryptjs');
--   const hash = bcrypt.hashSync('password123', 10);
--   console.log(hash); // Copy hash này vào password_hash
-- - Mật khẩu gốc cho tất cả user mẫu: "password123"
-- - Trong môi trường production, KHÔNG seed dữ liệu mẫu
-- - full_body_image_url là URL giả định, cần thay bằng URL thực từ Supabase Storage
-- - Sau khi có hash thực tế, cập nhật lại các giá trị password_hash trong file này

