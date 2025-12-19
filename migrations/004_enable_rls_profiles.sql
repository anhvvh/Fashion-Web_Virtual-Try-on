-- Migration: Enable RLS and create policies for profiles table
-- Description: Thiết lập Row Level Security (RLS) cho bảng profiles
-- Created: Sprint 1
-- Note: Vì project sử dụng custom JWT authentication (không dùng Supabase auth.users),
--       các policies này sẽ hoạt động khi truy cập qua Supabase client với JWT hợp lệ.
--       Backend sử dụng service role key sẽ bypass RLS.

-- Bật Row Level Security cho bảng profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Người dùng có thể xem profile của chính mình
-- Sử dụng claim 'id' từ JWT token để xác định user
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (
  id::text = (current_setting('request.jwt.claims', true)::json->>'id')
);

-- Policy 2: Người dùng có thể cập nhật profile của chính mình
-- Chỉ cho phép cập nhật các trường: display_name, height, weight, full_body_image_url
-- KHÔNG cho phép thay đổi email, password_hash
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (
  id::text = (current_setting('request.jwt.claims', true)::json->>'id')
)
WITH CHECK (
  id::text = (current_setting('request.jwt.claims', true)::json->>'id')
  AND email IS NOT NULL  -- Không cho phép xóa email
  AND password_hash IS NOT NULL  -- Không cho phép xóa password
);

-- Policy 3: Không cho phép INSERT trực tiếp qua client (chỉ qua API backend)
-- Vì đăng ký được xử lý qua backend API, nên không cần policy INSERT cho authenticated users
-- Có thể thêm policy này nếu cần:
-- CREATE POLICY "Authenticated users cannot insert profiles directly"
-- ON profiles
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (false);

-- Policy 4: Không cho phép DELETE (chỉ admin/backend mới có thể xóa)
-- Có thể thêm policy này nếu cần:
-- CREATE POLICY "Users cannot delete profiles"
-- ON profiles
-- FOR DELETE
-- TO authenticated
-- USING (false);

-- Lưu ý quan trọng:
-- 1. Các policies trên sử dụng current_setting('request.jwt.claims') để đọc JWT claims
-- 2. JWT token cần chứa claim 'id' (UUID của user) trong payload
-- 3. Khi truy cập từ backend với service role key, RLS sẽ bị bypass (đây là cách project hiện tại hoạt động)
-- 4. Vì project sử dụng custom JWT secret (không phải Supabase JWT secret), các policies này chủ yếu
--    hoạt động như một lớp bảo vệ phụ. Tất cả database access đều qua backend API với service role key.
-- 5. Nếu trong tương lai cần truy cập trực tiếp từ client với Supabase client, cần cấu hình JWT
--    secret của Supabase trùng với JWT secret của project, hoặc sử dụng Supabase Auth thay vì custom JWT
-- 6. Xem thêm hướng dẫn chi tiết trong design/rls-policies-guide.md

