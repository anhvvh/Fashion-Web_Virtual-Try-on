# Database Schema Design - Sprint 1

## Tổng quan
Schema được thiết kế cho Sprint 1, hỗ trợ các tính năng authentication và profile management (US-01, US-02).

## Bảng: profiles

### Mô tả
Bảng lưu thông tin người dùng bao gồm thông tin đăng nhập và hồ sơ cá nhân.

### Cấu trúc

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Định danh duy nhất |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email đăng nhập, lowercase, unique |
| password_hash | VARCHAR(255) | NOT NULL | Mật khẩu đã được hash (bcrypt) |
| display_name | VARCHAR(100) | NULL | Tên hiển thị (tùy chọn) |
| height | INTEGER | NULL, CHECK (height >= 100 AND height <= 250) | Chiều cao (cm), 100-250 |
| weight | NUMERIC(5,2) | NULL, CHECK (weight >= 30 AND weight <= 250) | Cân nặng (kg), 30-250 |
| full_body_image_url | TEXT | NULL | URL ảnh chân dung toàn thân trong Supabase Storage |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT now() | Thời gian tạo |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT now() | Thời gian cập nhật |

### Indexes
- PRIMARY KEY trên `id`
- UNIQUE INDEX trên `email` (tự động tạo bởi UNIQUE constraint)
- INDEX trên `email` để tối ưu truy vấn đăng nhập (tùy chọn, vì đã có UNIQUE)

### Constraints
- UNIQUE constraint trên `email` để đảm bảo email không trùng lặp
- CHECK constraint trên `height`: giá trị từ 100 đến 250 cm
- CHECK constraint trên `weight`: giá trị từ 30 đến 250 kg

### Trigger
- Trigger tự động cập nhật `updated_at` khi bản ghi được cập nhật

## Storage: full-body-images

### Mô tả
Storage bucket trong Supabase để lưu trữ ảnh chân dung toàn thân của người dùng.

### Cấu hình
- **Bucket name:** `full-body-images`
- **Public:** `false` (private bucket, chỉ người dùng đã đăng nhập mới truy cập được)
- **File size limit:** 5MB
- **Allowed MIME types:** image/jpeg, image/jpg, image/png
- **Storage path pattern:** `{user_id}/{timestamp}_{filename}`

### Quyền truy cập (RLS Policies)
- Người dùng chỉ có thể upload/đọc/xóa ảnh của chính mình
- Admin có thể truy cập tất cả ảnh

## Mối quan hệ
- Không có foreign key trong Sprint 1 (sẽ được mở rộng trong các sprint sau)

## Notes
- Không sử dụng bảng `auth.users` mặc định của Supabase, tự quản lý authentication
- Password luôn được hash bằng bcrypt trước khi lưu
- Email được normalize thành lowercase trước khi lưu
- Storage bucket là private để bảo vệ quyền riêng tư

