-- Migration: Add role column to profiles table for Sprint 2
-- Description: Thêm role-based access control (Task 2 - Sprint 2)
-- Created: Sprint 2

-- Thêm cột role vào bảng profiles
-- Sử dụng VARCHAR với CHECK constraint thay vì ENUM để dễ dàng thêm role mới sau này
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user' 
CHECK (role IN ('user', 'admin'));

-- Tạo index cho role để tối ưu truy vấn filter theo role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Cập nhật tất cả user hiện có thành 'user' (nếu có giá trị NULL)
-- Lưu ý: Vì đã set DEFAULT 'user' và NOT NULL, nên các user mới sẽ tự động có role='user'
UPDATE profiles 
SET role = 'user' 
WHERE role IS NULL;

-- Comment cho cột role
COMMENT ON COLUMN profiles.role IS 'Vai trò của người dùng: user (mặc định) hoặc admin';

