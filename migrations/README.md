# Database Migrations

Thư mục chứa các script migration SQL cho database Supabase.

## Cách sử dụng

### 1. Chạy migration trên Supabase Dashboard

1. Đăng nhập vào Supabase Dashboard
2. Vào phần **SQL Editor**
3. Copy nội dung file migration và paste vào editor
4. Click **Run** để thực thi

### 2. Thứ tự chạy migrations

Chạy các file theo thứ tự số:

1. `001_create_profiles_table.sql` - Tạo bảng profiles
2. `004_enable_rls_profiles.sql` - Bật RLS và tạo policies cho bảng profiles
3. `002_create_storage_bucket.sql` - Tạo storage bucket (cần thực hiện qua Dashboard hoặc CLI)
4. `003_seed_sample_data.sql` - Tạo dữ liệu mẫu (chỉ dùng trong development)

### 3. Lưu ý quan trọng

- **002_create_storage_bucket.sql**: Storage buckets không thể tạo trực tiếp bằng SQL. Cần tạo qua Supabase Dashboard hoặc CLI, sau đó mới chạy phần RLS Policies.
- **003_seed_sample_data.sql**: File này chỉ dùng trong môi trường development. Passwords trong file là placeholder, cần hash thực tế bằng bcrypt trước khi insert.
- Luôn backup database trước khi chạy migrations trong production.

## Rollback

Nếu cần rollback, sử dụng các câu lệnh:

```sql
-- Rollback 003
TRUNCATE TABLE profiles CASCADE;

-- Rollback 002 (xóa storage bucket qua Dashboard)
-- Drop policies
DROP POLICY IF EXISTS "Users can upload their own full-body images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own full-body images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own full-body images" ON storage.objects;

-- Rollback 004 (xóa RLS policies và tắt RLS)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Rollback 001
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS profiles;
```

