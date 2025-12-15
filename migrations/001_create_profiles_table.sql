-- Migration: Create profiles table for Sprint 1
-- Description: Thiết kế schema cho authentication và profile management (US-01, US-02)
-- Created: Sprint 1

-- Tạo bảng profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  height INTEGER CHECK (height >= 100 AND height <= 250),
  weight NUMERIC(5,2) CHECK (weight >= 30 AND weight <= 250),
  full_body_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tạo index cho email để tối ưu truy vấn đăng nhập
-- (UNIQUE constraint đã tự động tạo index, nhưng có thể thêm để rõ ràng)
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger để tự động cập nhật updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comment cho bảng và các cột quan trọng
COMMENT ON TABLE profiles IS 'Bảng lưu thông tin người dùng bao gồm thông tin đăng nhập và hồ sơ cá nhân';
COMMENT ON COLUMN profiles.email IS 'Email đăng nhập, phải là unique và lowercase';
COMMENT ON COLUMN profiles.password_hash IS 'Mật khẩu đã được hash bằng bcrypt';
COMMENT ON COLUMN profiles.height IS 'Chiều cao tính bằng cm, giá trị từ 100 đến 250';
COMMENT ON COLUMN profiles.weight IS 'Cân nặng tính bằng kg, giá trị từ 30 đến 250';
COMMENT ON COLUMN profiles.full_body_image_url IS 'URL ảnh chân dung toàn thân trong Supabase Storage bucket full-body-images';

