# Hướng dẫn RLS Policies cho bảng profiles

## Tổng quan

Bảng `profiles` sử dụng Row Level Security (RLS) để đảm bảo người dùng chỉ có thể truy cập và chỉnh sửa profile của chính mình.

## Cách hoạt động

### 1. JWT Token Structure

JWT token được tạo trong `auth_service.js` với payload:
```json
{
  "id": "uuid-của-user",
  "email": "user@example.com"
}
```

### 2. RLS Policies

Các policies sử dụng `current_setting('request.jwt.claims')` để đọc claim `id` từ JWT token và so sánh với `id` của bản ghi trong database.

### 3. Backend vs Client Access

- **Backend (Service Role Key):** Sử dụng `SUPABASE_SERVICE_ROLE_KEY` sẽ bypass RLS, có quyền truy cập tất cả dữ liệu
- **Client (Anon Key + JWT):** Sử dụng `SUPABASE_ANON_KEY` với JWT token sẽ bị kiểm tra bởi RLS policies

## Các Policies đã tạo

### Policy 1: SELECT - Xem profile của chính mình
```sql
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (
  id::text = (current_setting('request.jwt.claims', true)::json->>'id')
);
```
- Cho phép người dùng chỉ xem profile có `id` khớp với `id` trong JWT token

### Policy 2: UPDATE - Cập nhật profile của chính mình
```sql
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (
  id::text = (current_setting('request.jwt.claims', true)::json->>'id')
)
WITH CHECK (
  id::text = (current_setting('request.jwt.claims', true)::json->>'id')
  AND email IS NOT NULL
  AND password_hash IS NOT NULL
);
```
- Cho phép người dùng cập nhật profile của chính mình
- Đảm bảo không thể xóa `email` và `password_hash`
- Không cho phép thay đổi `id` (sử dụng USING và WITH CHECK)

### Policy 3: INSERT - Không cho phép
- Không có policy INSERT cho authenticated users
- INSERT chỉ được thực hiện qua backend API với service role key

### Policy 4: DELETE - Không cho phép
- Không có policy DELETE cho authenticated users
- DELETE chỉ được thực hiện qua backend API hoặc admin

## Cách sử dụng trong code

### Backend (Bypass RLS)

Backend sử dụng service role key nên không bị ảnh hưởng bởi RLS:

```javascript
import { supabase } from '../config/supabase.js';

// Backend có thể truy cập tất cả profiles
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('email', email);
```

### Client (Bị kiểm tra bởi RLS)

Nếu sử dụng Supabase client từ frontend, cần set JWT token:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY,
  {
    global: {
      headers: {
        Authorization: `Bearer ${jwtToken}` // JWT token từ login
      }
    }
  }
);

// Chỉ có thể xem profile của chính mình
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

**Lưu ý:** Vì project hiện tại sử dụng custom API backend, không cần sử dụng Supabase client từ frontend. Tất cả database access đều qua backend API.

## Testing RLS Policies

### Test từ Supabase Dashboard

1. Vào **SQL Editor** trong Supabase Dashboard
2. Test policy SELECT:
```sql
-- Giả lập JWT claim (thay YOUR_USER_ID bằng UUID thực tế)
SET request.jwt.claims = '{"id": "YOUR_USER_ID"}';
SELECT * FROM profiles WHERE id::text = 'YOUR_USER_ID';
```

3. Test policy UPDATE:
```sql
SET request.jwt.claims = '{"id": "YOUR_USER_ID"}';
UPDATE profiles 
SET display_name = 'Test Name' 
WHERE id::text = 'YOUR_USER_ID';
```

### Test từ Backend API

RLS không ảnh hưởng đến backend vì sử dụng service role key:
```bash
# Test get profile
curl -X GET http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test update profile  
curl -X PUT http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"displayName": "New Name", "height": 175}'
```

## Lưu ý quan trọng

1. **JWT Claim Format:** JWT token cần chứa claim `id` (UUID dạng string) để policies hoạt động đúng
2. **Service Role Key:** Chỉ sử dụng trong backend, không bao giờ expose ra frontend
3. **Anon Key:** Có thể sử dụng ở frontend nhưng phải kèm JWT token hợp lệ
4. **Email/Password Protection:** Policies đảm bảo không thể xóa email và password_hash
5. **Future Enhancement:** Nếu cần role-based access (admin, user), có thể thêm policies với điều kiện role

## Troubleshooting

### Policy không hoạt động?

1. Kiểm tra RLS đã được enable: `SELECT * FROM pg_policies WHERE tablename = 'profiles';`
2. Kiểm tra JWT token có chứa claim `id` không
3. Kiểm tra format của claim `id` (phải là string UUID)
4. Test với service role key để xem có phải lỗi RLS không

### Lỗi "permission denied"?

- Đảm bảo JWT token hợp lệ và chưa hết hạn
- Đảm bảo claim `id` trong JWT khớp với `id` trong database
- Kiểm tra xem có đang cố gắng thực hiện hành động không được phép (INSERT/DELETE)

