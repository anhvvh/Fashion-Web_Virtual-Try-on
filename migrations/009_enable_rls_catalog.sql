-- Migration: Enable RLS and create policies for categories and products tables
-- Description: Thiết lập Row Level Security cho quản lý danh mục và sản phẩm (Sprint 2)
-- Created: Sprint 2

-- Enable RLS cho bảng categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Enable RLS cho bảng products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES CHO BẢNG CATEGORIES
-- ============================================

-- Policy: Public read access (mọi người có thể xem categories)
CREATE POLICY "Public read access for categories"
ON categories FOR SELECT
USING (true);

-- Policy: Admin insert access (chỉ admin mới có thể tạo category)
-- Lưu ý: Backend sử dụng service role key sẽ bypass RLS
-- Policy này là lớp bảo vệ phụ, kiểm tra role từ profiles table
CREATE POLICY "Admin insert access for categories"
ON categories FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (current_setting('request.jwt.claims', true)::json->>'id')::uuid
    AND profiles.role = 'admin'
  )
  OR auth.role() = 'service_role'
);

-- Policy: Admin update access (chỉ admin mới có thể cập nhật category)
CREATE POLICY "Admin update access for categories"
ON categories FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (current_setting('request.jwt.claims', true)::json->>'id')::uuid
    AND profiles.role = 'admin'
  )
  OR auth.role() = 'service_role'
);

-- Policy: Admin delete access (chỉ admin mới có thể xóa category)
CREATE POLICY "Admin delete access for categories"
ON categories FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (current_setting('request.jwt.claims', true)::json->>'id')::uuid
    AND profiles.role = 'admin'
  )
  OR auth.role() = 'service_role'
);

-- ============================================
-- POLICIES CHO BẢNG PRODUCTS
-- ============================================

-- Policy: Public read access (mọi người có thể xem products)
CREATE POLICY "Public read access for products"
ON products FOR SELECT
USING (true);

-- Policy: Admin insert access (chỉ admin mới có thể tạo product)
CREATE POLICY "Admin insert access for products"
ON products FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (current_setting('request.jwt.claims', true)::json->>'id')::uuid
    AND profiles.role = 'admin'
  )
  OR auth.role() = 'service_role'
);

-- Policy: Admin update access (chỉ admin mới có thể cập nhật product)
CREATE POLICY "Admin update access for products"
ON products FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (current_setting('request.jwt.claims', true)::json->>'id')::uuid
    AND profiles.role = 'admin'
  )
  OR auth.role() = 'service_role'
);

-- Policy: Admin delete access (chỉ admin mới có thể xóa product)
CREATE POLICY "Admin delete access for products"
ON products FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = (current_setting('request.jwt.claims', true)::json->>'id')::uuid
    AND profiles.role = 'admin'
  )
  OR auth.role() = 'service_role'
);

-- Comment cho policies
COMMENT ON POLICY "Public read access for categories" ON categories IS 'Cho phép mọi người xem danh sách categories';
COMMENT ON POLICY "Admin insert access for categories" ON categories IS 'Chỉ admin mới có thể tạo category mới';
COMMENT ON POLICY "Admin update access for categories" ON categories IS 'Chỉ admin mới có thể cập nhật category';
COMMENT ON POLICY "Admin delete access for categories" ON categories IS 'Chỉ admin mới có thể xóa category';

COMMENT ON POLICY "Public read access for products" ON products IS 'Cho phép mọi người xem danh sách products';
COMMENT ON POLICY "Admin insert access for products" ON products IS 'Chỉ admin mới có thể tạo product mới';
COMMENT ON POLICY "Admin update access for products" ON products IS 'Chỉ admin mới có thể cập nhật product';
COMMENT ON POLICY "Admin delete access for products" ON products IS 'Chỉ admin mới có thể xóa product';

