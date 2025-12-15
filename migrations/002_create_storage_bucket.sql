-- Migration: Create storage bucket for full-body images
-- Description: Tạo storage bucket để lưu trữ ảnh chân dung toàn thân (US-02)
-- Created: Sprint 1
-- Note: Script này cần được chạy thông qua Supabase Dashboard hoặc Supabase CLI
--       vì storage buckets không thể tạo trực tiếp bằng SQL thông thường

-- Thông tin bucket cần tạo:
-- - Name: full-body-images
-- - Public: false (private bucket)
-- - File size limit: 5MB
-- - Allowed MIME types: image/jpeg, image/jpg, image/png

-- Các bước thực hiện trên Supabase Dashboard:
-- 1. Vào Storage > New bucket
-- 2. Tên bucket: full-body-images
-- 3. Public bucket: TẮT (unchecked) - để bucket là private
-- 4. File size limit: 5242880 (5MB = 5 * 1024 * 1024 bytes)
-- 5. Allowed MIME types: image/jpeg,image/jpg,image/png

-- Hoặc sử dụng Supabase CLI:
-- supabase storage create full-body-images --public false

-- Sau khi tạo bucket, cần thiết lập RLS Policies:

-- Policy: Người dùng chỉ có thể upload ảnh của chính mình
-- INSERT policy
CREATE POLICY "Users can upload their own full-body images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'full-body-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Người dùng chỉ có thể xem ảnh của chính mình
-- SELECT policy
CREATE POLICY "Users can view their own full-body images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'full-body-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Người dùng chỉ có thể xóa ảnh của chính mình
-- DELETE policy
CREATE POLICY "Users can delete their own full-body images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'full-body-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Lưu ý quan trọng về RLS Policies:
-- - Vì project không sử dụng auth.users của Supabase mà tự quản lý authentication,
--   các policy trên sử dụng auth.uid() sẽ KHÔNG hoạt động.
-- - Cần implement custom authentication middleware và storage access control ở backend
-- - Storage bucket nên là PRIVATE, và backend sẽ kiểm tra JWT token trước khi cho phép upload/access
-- - Hoặc có thể sử dụng signed URLs từ backend để cho phép access tạm thời
-- - Cần review và điều chỉnh policies này khi implement authentication layer

