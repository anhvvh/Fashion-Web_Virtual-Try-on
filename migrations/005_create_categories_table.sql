-- Migration: Create categories table for Sprint 2
-- Description: Thiết kế schema cho quản lý danh mục sản phẩm (US-03)
-- Created: Sprint 2

-- Tạo bảng categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL CHECK (LENGTH(name) >= 1 AND LENGTH(name) <= 100),
  slug VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tạo index cho slug để tối ưu truy vấn
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Tạo trigger để tự động cập nhật updated_at
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comment cho bảng và các cột quan trọng
COMMENT ON TABLE categories IS 'Bảng lưu thông tin danh mục sản phẩm để phân loại và tổ chức sản phẩm';
COMMENT ON COLUMN categories.name IS 'Tên danh mục, 1-100 ký tự';
COMMENT ON COLUMN categories.slug IS 'Slug dùng cho URL, tự động generate từ name, phải unique';
COMMENT ON COLUMN categories.description IS 'Mô tả danh mục, tối đa 500 ký tự';

