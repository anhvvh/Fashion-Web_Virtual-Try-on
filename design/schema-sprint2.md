# Database Schema Design - Sprint 2

## Tổng quan
Schema được thiết kế cho Sprint 2, hỗ trợ các tính năng quản lý danh mục và sản phẩm (US-03, US-04).

## Bảng: categories

### Mô tả
Bảng lưu thông tin danh mục sản phẩm để phân loại và tổ chức sản phẩm.

### Cấu trúc

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Định danh duy nhất |
| name | VARCHAR(100) | NOT NULL | Tên danh mục, 1-100 ký tự |
| slug | VARCHAR(100) | NOT NULL, UNIQUE | Slug dùng cho URL, tự động generate từ name |
| description | VARCHAR(500) | NULL | Mô tả danh mục, tối đa 500 ký tự |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT now() | Thời gian tạo |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT now() | Thời gian cập nhật |

### Indexes
- PRIMARY KEY trên `id`
- UNIQUE INDEX trên `slug` (tự động tạo bởi UNIQUE constraint)
- INDEX trên `slug` để tối ưu truy vấn theo slug

### Constraints
- UNIQUE constraint trên `slug` để đảm bảo slug không trùng lặp
- CHECK constraint trên `name`: LENGTH(name) >= 1 AND LENGTH(name) <= 100

### Trigger
- Trigger tự động cập nhật `updated_at` khi bản ghi được cập nhật

### Row Level Security (RLS)
- **RLS Enabled:** Có
- **Policies:**
  - **SELECT:** Tất cả người dùng (authenticated và anonymous) có thể xem categories (public)
  - **INSERT:** Chỉ admin mới có thể tạo category mới (kiểm tra role='admin' trong profiles)
  - **UPDATE:** Chỉ admin mới có thể cập nhật category
  - **DELETE:** Chỉ admin mới có thể xóa category

**Lưu ý:** 
- Categories là public data, mọi người có thể xem
- Chỉ admin mới có quyền CRUD operations
- Backend sử dụng service role key sẽ bypass RLS

## Bảng: products

### Mô tả
Bảng lưu thông tin sản phẩm bao gồm tên, giá, danh mục, mô tả và ảnh sản phẩm.

### Cấu trúc

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|-----|--------------|-----------|-------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Định danh duy nhất |
| name | VARCHAR(200) | NOT NULL | Tên sản phẩm, 1-200 ký tự |
| price | NUMERIC(10,2) | NOT NULL, CHECK (price > 0) | Giá sản phẩm, > 0, tối đa 2 chữ số thập phân |
| category_id | UUID | NOT NULL, FOREIGN KEY | ID danh mục, tham chiếu đến categories.id |
| description | VARCHAR(1000) | NULL | Mô tả sản phẩm, tối đa 1000 ký tự |
| image_url | TEXT | NULL | URL ảnh sản phẩm (flat lay) trong Supabase Storage |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT now() | Thời gian tạo |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT now() | Thời gian cập nhật |

### Indexes
- PRIMARY KEY trên `id`
- INDEX trên `category_id` để tối ưu truy vấn filter theo category
- INDEX trên `created_at` để tối ưu sắp xếp theo ngày tạo

### Constraints
- FOREIGN KEY constraint trên `category_id` tham chiếu đến `categories.id` với ON DELETE RESTRICT (không cho phép xóa category nếu còn products)
- CHECK constraint trên `price`: price > 0
- CHECK constraint trên `name`: LENGTH(name) >= 1 AND LENGTH(name) <= 200

### Trigger
- Trigger tự động cập nhật `updated_at` khi bản ghi được cập nhật

### Row Level Security (RLS)
- **RLS Enabled:** Có
- **Policies:**
  - **SELECT:** Tất cả người dùng (authenticated và anonymous) có thể xem products (public)
  - **INSERT:** Chỉ admin mới có thể tạo product mới (kiểm tra role='admin' trong profiles)
  - **UPDATE:** Chỉ admin mới có thể cập nhật product
  - **DELETE:** Chỉ admin mới có thể xóa product

**Lưu ý:** 
- Products là public data, mọi người có thể xem
- Chỉ admin mới có quyền CRUD operations
- Foreign key với ON DELETE RESTRICT đảm bảo không thể xóa category nếu còn products

## Storage: product-images

### Mô tả
Storage bucket trong Supabase để lưu trữ ảnh sản phẩm (flat lay - trải phẳng).

### Cấu hình
- **Bucket name:** `product-images`
- **Public:** `true` (public bucket, mọi người có thể xem ảnh)
- **File size limit:** 5MB
- **Allowed MIME types:** image/jpeg, image/jpg, image/png
- **Storage path pattern:** `{category_slug}/{product_id}_{timestamp}_{filename}`

### Quyền truy cập (RLS Policies)
- Tất cả người dùng có thể đọc ảnh (public read)
- Chỉ admin mới có thể upload/xóa ảnh

## Mối quan hệ
- `products.category_id` → `categories.id` (Foreign Key, ON DELETE RESTRICT)

## Notes
- Slug được tự động generate từ name (lowercase, replace spaces với dashes, remove special chars)
- Nếu slug bị trùng, backend sẽ thêm số vào cuối để đảm bảo unique
- Image URL được lưu trong cột `image_url` của bảng products
- Khi xóa product, cần xóa ảnh khỏi Storage bucket
- Khi xóa category, cần đảm bảo không còn products nào thuộc category đó (ON DELETE RESTRICT)

