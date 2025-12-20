-- Migration: Create product-images storage bucket for Sprint 2
-- Description: Tạo storage bucket để lưu trữ ảnh sản phẩm (US-04)
-- Created: Sprint 2

-- Tạo storage bucket cho product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Tạo policy cho public read (mọi người có thể xem ảnh)
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Tạo policy cho admin upload (chỉ admin mới có thể upload)
-- Lưu ý: Policy này sử dụng role từ profiles table
-- Backend sẽ sử dụng service role key để upload, nên policy này là lớp bảo vệ phụ
CREATE POLICY "Admin upload access for product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'service_role'
);

-- Tạo policy cho admin update (chỉ admin mới có thể cập nhật)
CREATE POLICY "Admin update access for product images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'product-images' AND
  auth.role() = 'service_role'
);

-- Tạo policy cho admin delete (chỉ admin mới có thể xóa)
CREATE POLICY "Admin delete access for product images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'product-images' AND
  auth.role() = 'service_role'
);

-- Comment cho bucket
COMMENT ON TABLE storage.buckets IS 'Storage bucket product-images: Lưu trữ ảnh sản phẩm (flat lay), public read, admin write';

