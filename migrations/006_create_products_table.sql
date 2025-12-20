-- Migration: Create products table for Sprint 2
-- Description: Thiết kế schema cho quản lý sản phẩm (US-04)
-- Created: Sprint 2

-- Tạo bảng products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL CHECK (LENGTH(name) >= 1 AND LENGTH(name) <= 200),
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  category_id UUID NOT NULL,
  description VARCHAR(1000),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) 
    REFERENCES categories(id) ON DELETE RESTRICT
);

-- Tạo index cho category_id để tối ưu truy vấn filter
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Tạo index cho created_at để tối ưu sắp xếp theo ngày tạo
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Tạo trigger để tự động cập nhật updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comment cho bảng và các cột quan trọng
COMMENT ON TABLE products IS 'Bảng lưu thông tin sản phẩm bao gồm tên, giá, danh mục, mô tả và ảnh sản phẩm';
COMMENT ON COLUMN products.name IS 'Tên sản phẩm, 1-200 ký tự';
COMMENT ON COLUMN products.price IS 'Giá sản phẩm, phải > 0, tối đa 2 chữ số thập phân';
COMMENT ON COLUMN products.category_id IS 'ID danh mục, tham chiếu đến categories.id';
COMMENT ON COLUMN products.description IS 'Mô tả sản phẩm, tối đa 1000 ký tự';
COMMENT ON COLUMN products.image_url IS 'URL ảnh sản phẩm (flat lay) trong Supabase Storage bucket product-images';

