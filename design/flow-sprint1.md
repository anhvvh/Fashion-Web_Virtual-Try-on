# Flow Design - Sprint 1

## Tổng quan
Tài liệu mô tả các luồng xử lý cho Sprint 1, bao gồm authentication (US-01) và profile management (US-02).

---

## 1. Flow Đăng ký (Register)

### Mô tả
Người dùng đăng ký tài khoản mới bằng email và mật khẩu.

### Luồng xử lý

```
[Frontend]                    [Backend]                    [Database]
    |                             |                             |
    |-- POST /api/auth/register --|                             |
    |   {email, password}         |                             |
    |                             |-- Validate input            |
    |                             |   - Email format            |
    |                             |   - Password strength       |
    |                             |                             |
    |                             |-- Check email exists -------|
    |                             |   SELECT * FROM profiles    |
    |                             |   WHERE email = ?           |
    |                             |<-- Email exists?            |
    |                             |                             |
    |                             |-- Hash password (bcrypt)    |
    |                             |                             |
    |                             |-- Insert new user ----------|
    |                             |   INSERT INTO profiles      |
    |                             |   (email, password_hash)    |
    |                             |<-- User created             |
    |                             |                             |
    |<-- 201 Created + message ---|                             |
    |                             |                             |
    |-- Redirect to /login -------|                             |
```

### Chi tiết xử lý

**Frontend:**
1. Người dùng mở form đăng ký (`/register`)
2. Nhập email, password, confirm password
3. Client-side validation (format email, password match)
4. Submit form → POST `/api/auth/register`
5. Nhận response:
   - Success (201): Hiển thị thông báo thành công → Redirect `/login`
   - Error (400/409): Hiển thị lỗi cụ thể (email trùng, format sai, etc.)

**Backend:**
1. Validate input:
   - Email: format hợp lệ, lowercase
   - Password: tối thiểu 8 ký tự (khuyến nghị: có chữ hoa/thường/số/ký tự đặc biệt)
2. Kiểm tra email đã tồn tại:
   - Query: `SELECT id FROM profiles WHERE email = $1`
   - Nếu tồn tại → 409 Conflict
3. Hash password bằng bcrypt (cost factor: 10)
4. Tạo user mới:
   - `INSERT INTO profiles (email, password_hash) VALUES ($1, $2)`
5. Trả response:
   - Success: 201 Created + `{message: "Đăng ký thành công"}`
   - Error: 400 Bad Request / 409 Conflict + error message

### Xử lý lỗi
- Email trùng: 409 Conflict - "Email đã được sử dụng"
- Email format sai: 400 Bad Request - "Email không hợp lệ"
- Password không đạt yêu cầu: 400 Bad Request - "Mật khẩu phải có ít nhất 8 ký tự"
- Lỗi database: 500 Internal Server Error - "Đã xảy ra lỗi, vui lòng thử lại"

---

## 2. Flow Đăng nhập (Login + JWT)

### Mô tả
Người dùng đăng nhập bằng email và mật khẩu, nhận JWT token để xác thực các request sau.

### Luồng xử lý

```
[Frontend]                    [Backend]                    [Database]
    |                             |                             |
    |-- POST /api/auth/login -----|                             |
    |   {email, password}         |                             |
    |                             |-- Validate input            |
    |                             |                             |
    |                             |-- Find user ----------------|
    |                             |   SELECT * FROM profiles    |
    |                             |   WHERE email = ?           |
    |                             |<-- User found?               |
    |                             |                             |
    |                             |-- Verify password (bcrypt)   |
    |                             |   compare(password, hash)    |
    |                             |                             |
    |                             |-- Generate JWT token        |
    |                             |   {userId, email, exp}       |
    |                             |                             |
    |<-- 200 OK + {token, user} --|                             |
    |                             |                             |
    |-- Save token (localStorage)  |                             |
    |-- Redirect to /profile ------|                             |
```

### Chi tiết xử lý

**Frontend:**
1. Người dùng mở form đăng nhập (`/login`)
2. Nhập email và password
3. Submit form → POST `/api/auth/login`
4. Nhận response:
   - Success (200): Lưu JWT token vào `localStorage` → Redirect `/profile` hoặc dashboard
   - Error (401): Hiển thị lỗi "Email hoặc mật khẩu không đúng"
5. Lưu token: `localStorage.setItem('token', response.token)`

**Backend:**
1. Validate input (email, password không rỗng)
2. Tìm user:
   - Query: `SELECT * FROM profiles WHERE email = $1`
   - Nếu không tìm thấy → 401 Unauthorized
3. Verify password:
   - `bcrypt.compare(password, user.password_hash)`
   - Nếu không khớp → 401 Unauthorized
4. Generate JWT token:
   - Payload: `{userId: user.id, email: user.email}`
   - Secret: từ env variable `JWT_SECRET`
   - Expiration: 24h (hoặc 7d tùy config)
   - Algorithm: HS256
5. Trả response:
   - Success: 200 OK + `{token: "...", user: {id, email, display_name}}`
   - Error: 401 Unauthorized - "Email hoặc mật khẩu không đúng"

### Xử lý lỗi
- Email không tồn tại: 401 Unauthorized
- Password sai: 401 Unauthorized (không phân biệt email/password sai để bảo mật)
- Token generation lỗi: 500 Internal Server Error

---

## 3. Flow Lấy Thông tin Hồ sơ (Get Profile)

### Mô tả
Người dùng đã đăng nhập xem thông tin hồ sơ của mình.

### Luồng xử lý

```
[Frontend]                    [Backend]                    [Database]
    |                             |                             |
    |-- GET /api/user/profile ----|                             |
    |   Header: Authorization      |                             |
    |   Bearer {token}             |                             |
    |                             |-- Verify JWT token          |
    |                             |   jwt.verify(token)          |
    |                             |<-- Valid?                    |
    |                             |                             |
    |                             |-- Get user profile ---------|
    |                             |   SELECT * FROM profiles    |
    |                             |   WHERE id = ?              |
    |                             |<-- Profile data              |
    |                             |                             |
    |<-- 200 OK + profile data ---|                             |
    |                             |                             |
    |-- Display profile form ------|                             |
```

### Chi tiết xử lý

**Frontend:**
1. Người dùng truy cập `/profile` (protected route)
2. Kiểm tra token trong `localStorage`
3. Nếu không có token → Redirect `/login`
4. Gọi API: GET `/api/user/profile` với header `Authorization: Bearer {token}`
5. Nhận response:
   - Success (200): Hiển thị form với dữ liệu profile
   - Error (401): Token hết hạn/không hợp lệ → Clear token → Redirect `/login`

**Backend:**
1. Middleware `auth.js` verify JWT:
   - Extract token từ header `Authorization`
   - `jwt.verify(token, JWT_SECRET)`
   - Nếu invalid/expired → 401 Unauthorized
2. Lấy userId từ token payload
3. Query profile:
   - `SELECT id, email, display_name, height, weight, full_body_image_url, created_at, updated_at FROM profiles WHERE id = $1`
4. Trả response:
   - Success: 200 OK + profile data (không bao gồm password_hash)
   - Error: 401 Unauthorized - "Token không hợp lệ hoặc đã hết hạn"

### Xử lý lỗi
- Token không có: 401 Unauthorized
- Token hết hạn: 401 Unauthorized
- Token không hợp lệ: 401 Unauthorized
- User không tồn tại: 404 Not Found (hiếm khi xảy ra)

---

## 4. Flow Cập nhật Hồ sơ (Update Profile)

### Mô tả
Người dùng cập nhật thông tin hồ sơ (display_name, height, weight).

### Luồng xử lý

```
[Frontend]                    [Backend]                    [Database]
    |                             |                             |
    |-- PUT /api/user/profile ----|                             |
    |   Header: Authorization      |                             |
    |   Body: {display_name,      |                             |
    |          height, weight}     |                             |
    |                             |-- Verify JWT token          |
    |                             |                             |
    |                             |-- Validate input            |
    |                             |   - height: 100-250         |
    |                             |   - weight: 30-250          |
    |                             |                             |
    |                             |-- Update profile -----------|
    |                             |   UPDATE profiles SET ...   |
    |                             |   WHERE id = ?              |
    |                             |<-- Updated                   |
    |                             |                             |
    |<-- 200 OK + updated data ---|                             |
    |                             |                             |
    |-- Show success message ------|                             |
```

### Chi tiết xử lý

**Frontend:**
1. Người dùng chỉnh sửa form profile
2. Nhập/điều chỉnh: display_name (optional), height, weight
3. Submit form → PUT `/api/user/profile` với header `Authorization: Bearer {token}`
4. Nhận response:
   - Success (200): Hiển thị thông báo thành công, cập nhật UI
   - Error (400): Hiển thị lỗi validation
   - Error (401): Redirect `/login`

**Backend:**
1. Middleware verify JWT (tương tự Get Profile)
2. Validate input:
   - height: số nguyên, 100-250 cm
   - weight: số, 30-250 kg
   - display_name: string, tối đa 100 ký tự (optional)
3. Update profile:
   - `UPDATE profiles SET display_name = $1, height = $2, weight = $3, updated_at = now() WHERE id = $4`
4. Trả response:
   - Success: 200 OK + updated profile data
   - Error: 400 Bad Request - validation errors

### Xử lý lỗi
- Validation lỗi: 400 Bad Request - "Chiều cao phải từ 100-250 cm"
- Token không hợp lệ: 401 Unauthorized
- Database error: 500 Internal Server Error

---

## 5. Flow Cập nhật Ảnh chân dung (Upload Full Body Image)

### Mô tả
Người dùng upload ảnh chân dung toàn thân, lưu vào Supabase Storage và cập nhật URL vào profile.

### Luồng xử lý

```
[Frontend]                    [Backend]                    [Supabase Storage]
    |                             |                             |
    |-- POST /api/user/profile/   |                             |
    |   upload-avatar             |                             |
    |   Header: Authorization     |                             |
    |   FormData: {image}          |                             |
    |                             |-- Verify JWT token          |
    |                             |                             |
    |                             |-- Validate file             |
    |                             |   - Type: jpg/jpeg/png      |
    |                             |   - Size: <= 5MB            |
    |                             |                             |
    |                             |-- Upload to Storage --------|
    |                             |   bucket: full-body-images   |
    |                             |   path: {userId}/{timestamp}|
    |                             |<-- Public URL                |
    |                             |                             |
    |                             |-- Update profile -----------|
    |                             |   UPDATE profiles SET       |
    |                             |   full_body_image_url = ?   |
    |                             |   WHERE id = ?               |
    |                             |                             |
    |<-- 200 OK + {image_url} -----|                             |
    |                             |                             |
    |-- Show preview image --------|                             |
```

### Chi tiết xử lý

**Frontend:**
1. Người dùng chọn file ảnh từ input file
2. Client-side validation:
   - Kiểm tra loại file (jpg/jpeg/png)
   - Kiểm tra dung lượng (≤ 5MB)
   - Preview ảnh (optional)
3. Submit → POST `/api/user/profile/upload-avatar` với FormData
4. Nhận response:
   - Success (200): Hiển thị ảnh mới, cập nhật UI
   - Error (400): Hiển thị lỗi (file không hợp lệ, quá lớn)
   - Error (401): Redirect `/login`

**Backend:**
1. Middleware verify JWT
2. Validate file:
   - MIME type: `image/jpeg`, `image/jpg`, `image/png`
   - File size: ≤ 5MB
   - Nếu không hợp lệ → 400 Bad Request
3. Upload to Supabase Storage:
   - Bucket: `full-body-images`
   - Path: `{userId}/{timestamp}_{originalFilename}`
   - Options: `{upsert: false}` (không ghi đè)
   - Nếu ảnh cũ tồn tại, có thể xóa trước (optional)
4. Lấy public URL từ Storage response
5. Update profile:
   - `UPDATE profiles SET full_body_image_url = $1, updated_at = now() WHERE id = $2`
6. Trả response:
   - Success: 200 OK + `{image_url: "...", message: "Upload thành công"}`
   - Error: 400/500 + error message

### Xử lý lỗi
- File không hợp lệ: 400 Bad Request - "Chỉ chấp nhận file JPG, JPEG, PNG"
- File quá lớn: 400 Bad Request - "File không được vượt quá 5MB"
- Upload Storage lỗi: 500 Internal Server Error - "Lỗi upload ảnh, vui lòng thử lại"
- Token không hợp lệ: 401 Unauthorized

### Lưu ý
- Ảnh cũ có thể được xóa tự động khi upload ảnh mới (tùy chọn)
- Storage bucket là private, cần signed URL hoặc RLS policy để truy cập

---

## 6. Flow Đăng xuất

### Mô tả
Người dùng đăng xuất, xóa token và redirect về trang công khai.

### Luồng xử lý

```
[Frontend]
    |
    |-- User clicks "Logout"
    |
    |-- Remove token from localStorage
    |   localStorage.removeItem('token')
    |
    |-- Clear any user state
    |
    |-- Redirect to /login or /
    |
```

### Chi tiết xử lý

**Frontend:**
1. Người dùng bấm nút "Logout"
2. Xóa token: `localStorage.removeItem('token')`
3. Clear user state (nếu có Redux/Context)
4. Redirect: `/login` hoặc `/` (landing page)

**Backend:**
- Không cần API endpoint (stateless JWT)
- Token sẽ tự động invalid khi hết hạn

### Lưu ý
- JWT là stateless, không cần blacklist token
- Token vẫn còn hiệu lực cho đến khi hết hạn, nhưng client đã xóa nên không thể sử dụng

---

## 7. Flow Bảo vệ Routes (Protected Routes)

### Mô tả
Bảo vệ các route/endpoint yêu cầu đăng nhập, redirect nếu chưa đăng nhập.

### Luồng xử lý Frontend

```
[User accesses protected route]
    |
    |-- Check localStorage for token
    |
    |-- Token exists?
    |   |
    |   |-- Yes: Allow access
    |   |   |
    |   |   |-- API call fails with 401?
    |   |       |
    |   |       |-- Yes: Clear token → Redirect /login
    |   |       |
    |   |       |-- No: Continue
    |   |
    |   |-- No: Redirect /login
```

### Chi tiết xử lý

**Frontend (React Router):**
1. Tạo component `ProtectedRoute`:
   - Check `localStorage.getItem('token')`
   - Nếu có token → render component
   - Nếu không có → redirect `/login`
2. Wrap protected routes:
   ```jsx
   <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
   ```
3. Interceptor cho API calls:
   - Thêm header `Authorization: Bearer {token}` vào mọi request
   - Nếu response 401 → clear token → redirect `/login`

**Backend (Express Middleware):**
1. Middleware `auth.js`:
   ```javascript
   function verifyToken(req, res, next) {
     const token = req.headers.authorization?.split(' ')[1];
     if (!token) return res.status(401).json({error: 'Token required'});
     
     try {
       const decoded = jwt.verify(token, JWT_SECRET);
       req.userId = decoded.userId;
       next();
     } catch (error) {
       return res.status(401).json({error: 'Token invalid or expired'});
     }
   }
   ```
2. Áp dụng middleware cho protected routes:
   ```javascript
   router.get('/profile', verifyToken, getProfile);
   router.put('/profile', verifyToken, updateProfile);
   ```

### Protected Routes
- Frontend: `/profile`, `/dashboard` (nếu có)
- Backend: `/api/user/*` (tất cả user endpoints)

### Public Routes
- Frontend: `/`, `/login`, `/register`
- Backend: `/api/auth/*` (login, register)

---

## Tổng kết

### API Endpoints

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | `/api/auth/register` | No | Đăng ký tài khoản |
| POST | `/api/auth/login` | No | Đăng nhập, nhận JWT |
| GET | `/api/user/profile` | Yes | Lấy thông tin profile |
| PUT | `/api/user/profile` | Yes | Cập nhật profile |
| POST | `/api/user/profile/upload-avatar` | Yes | Upload ảnh toàn thân |

### Frontend Routes

| Route | Auth | Component |
|-------|------|-----------|
| `/` | No | LandingPage |
| `/login` | No | LoginPage |
| `/register` | No | RegisterPage |
| `/profile` | Yes | ProfilePage |

### Security Notes
- JWT secret phải được lưu trong env variable
- Password luôn được hash bằng bcrypt trước khi lưu
- Token expiration: 24h (có thể config)
- CORS chỉ cho phép origin frontend
- Không log plaintext password
- Error messages không lộ thông tin hệ thống

