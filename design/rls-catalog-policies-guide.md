# Hướng dẫn tạo RLS Policies cho Categories và Products trên Supabase

## Tổng quan

File này hướng dẫn cách tạo Row Level Security (RLS) policies cho bảng `categories` và `products` trên Supabase Dashboard hoặc qua SQL Editor.

## Cách 1: Chạy SQL Migration (Khuyến nghị)

### Bước 1: Mở SQL Editor trên Supabase Dashboard

1. Đăng nhập vào [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào menu **SQL Editor** ở sidebar bên trái
4. Click **New query** để tạo query mới

### Bước 2: Chạy migration file

Copy toàn bộ nội dung từ file `migrations/009_enable_rls_catalog.sql` và paste vào SQL Editor, sau đó click **Run** hoặc nhấn `Ctrl+Enter` (Windows/Linux) hoặc `Cmd+Enter` (Mac).

**Lưu ý quan trọng:**
- Đảm bảo đã chạy các migration trước đó (005, 006, 007) để tạo bảng categories và products
- Đảm bảo bảng `profiles` đã có cột `role` (nếu chưa có, cần chạy migration thêm cột role trước)

## Cách 2: Tạo Policies qua Supabase Dashboard (Thủ công)

### Bước 1: Enable RLS cho bảng categories

1. Vào **Table Editor** → chọn bảng `categories`
2. Click tab **Policies** ở phía trên
3. Nếu RLS chưa được bật, click nút **Enable RLS** (màu xanh)

### Bước 2: Tạo Policy "Public read access for categories"

1. Trong tab **Policies** của bảng `categories`, click **New Policy**
2. Chọn **For full customization** (hoặc **Create policy from scratch**)
3. Điền thông tin:
   - **Policy name:** `Public read access for categories`
   - **Allowed operation:** `SELECT`
   - **Target roles:** Để trống hoặc chọn `anon`, `authenticated`
   - **USING expression:** `true`
   - **WITH CHECK expression:** Để trống (không cần cho SELECT)
4. Click **Review** → **Save policy**

### Bước 3: Tạo Policy "Admin insert access for categories"

1. Click **New Policy** trong tab Policies
2. Điền thông tin:
   - **Policy name:** `Admin insert access for categories`
   - **Allowed operation:** `INSERT`
   - **Target roles:** `authenticated` (hoặc để trống)
   - **USING expression:** Để trống (không cần cho INSERT)
   - **WITH CHECK expression:** Copy đoạn code sau:

```sql
EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = (current_setting('request.jwt.claims', true)::json->>'id')::uuid
  AND profiles.role = 'admin'
)
OR auth.role() = 'service_role'
```

3. Click **Review** → **Save policy**

### Bước 4: Tạo Policy "Admin update access for categories"

1. Click **New Policy**
2. Điền thông tin:
   - **Policy name:** `Admin update access for categories`
   - **Allowed operation:** `UPDATE`
   - **Target roles:** `authenticated`
   - **USING expression:** Copy đoạn code sau:

```sql
EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = (current_setting('request.jwt.claims', true)::json->>'id')::uuid
  AND profiles.role = 'admin'
)
OR auth.role() = 'service_role'
```

   - **WITH CHECK expression:** Copy cùng đoạn code trên
3. Click **Review** → **Save policy**

### Bước 5: Tạo Policy "Admin delete access for categories"

1. Click **New Policy**
2. Điền thông tin:
   - **Policy name:** `Admin delete access for categories`
   - **Allowed operation:** `DELETE`
   - **Target roles:** `authenticated`
   - **USING expression:** Copy đoạn code sau:

```sql
EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = (current_setting('request.jwt.claims', true)::json->>'id')::uuid
  AND profiles.role = 'admin'
)
OR auth.role() = 'service_role'
```

   - **WITH CHECK expression:** Để trống (không cần cho DELETE)
3. Click **Review** → **Save policy**

### Bước 6: Lặp lại cho bảng products

Thực hiện tương tự các bước 1-5 cho bảng `products`:
- Enable RLS
- Tạo 4 policies tương tự với tên thay `categories` thành `products`

## Kiểm tra Policies đã tạo

### Cách 1: Qua Dashboard

1. Vào **Table Editor** → chọn bảng `categories` hoặc `products`
2. Click tab **Policies**
3. Bạn sẽ thấy danh sách các policies đã tạo

### Cách 2: Qua SQL Query

Chạy query sau trong SQL Editor:

```sql
-- Xem policies của bảng categories
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'categories';

-- Xem policies của bảng products
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'products';
```

## Giải thích các Policies

### 1. Public read access (SELECT)

```sql
USING (true)
```

- Cho phép mọi người (kể cả anonymous users) xem danh sách categories và products
- Không cần authentication

### 2. Admin insert/update/delete access

```sql
EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = (current_setting('request.jwt.claims', true)::json->>'id')::uuid
  AND profiles.role = 'admin'
)
OR auth.role() = 'service_role'
```

- Kiểm tra xem user có role='admin' trong bảng profiles không
- Hoặc cho phép service_role (backend với service role key) bypass RLS
- `current_setting('request.jwt.claims')` đọc claim `id` từ JWT token

## Lưu ý quan trọng

1. **JWT Claims:** Policies này yêu cầu JWT token phải chứa claim `id` (UUID của user) trong payload. Backend cần set claim này khi tạo JWT.

2. **Service Role Key:** Backend sử dụng service role key sẽ bypass tất cả RLS policies. Đây là cách project hiện tại hoạt động.

3. **Cột role:** Đảm bảo bảng `profiles` đã có cột `role` với giá trị 'user' hoặc 'admin' trước khi tạo policies.

4. **Testing:** Sau khi tạo policies, test các scenarios:
   - Anonymous user có thể SELECT categories/products
   - User thường không thể INSERT/UPDATE/DELETE
   - Admin user có thể thực hiện tất cả operations
   - Backend với service role key có thể thực hiện tất cả operations

## Troubleshooting

### Lỗi: "column profiles.role does not exist"

**Nguyên nhân:** Bảng profiles chưa có cột role.

**Giải pháp:** Chạy migration thêm cột role vào bảng profiles trước (Task 2 của Sprint 2).

### Lỗi: "function current_setting(unknown, boolean) does not exist"

**Nguyên nhân:** Cú pháp SQL không đúng.

**Giải pháp:** Đảm bảo sử dụng đúng cú pháp:
```sql
current_setting('request.jwt.claims', true)::json->>'id'
```

### Policies không hoạt động

**Nguyên nhân có thể:**
- JWT token không chứa claim `id`
- User chưa có role='admin' trong profiles
- RLS chưa được enable

**Giải pháp:**
- Kiểm tra JWT token có chứa claim `id` không
- Kiểm tra user có role='admin' trong bảng profiles
- Đảm bảo RLS đã được enable cho bảng

## Tài liệu tham khảo

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- File migration: `migrations/009_enable_rls_catalog.sql`
- Schema design: `design/schema-sprint2.md`

