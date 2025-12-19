# Flow Design - Sprint 1

## Tổng quan
Tài liệu này mô tả các flow chính cho Sprint 1, bao gồm authentication (US-01) và profile management (US-02).

## 1. Register Flow (US-01)

### Mô tả
Luồng đăng ký tài khoản mới bằng email và mật khẩu.

### Flow Diagram

```mermaid
flowchart TD
    A[User mở form đăng ký] --> B[Nhập email, password, confirm password]
    B --> C{Client validate sơ bộ}
    C -->|Invalid| D[Hiển thị lỗi validation]
    D --> B
    C -->|Valid| E[Submit form]
    E --> F[POST /api/auth/register]
    F --> G{Server validate}
    G -->|Email không hợp lệ| H[Trả 400 Bad Request]
    G -->|Email đã tồn tại| I[Trả 409 Conflict]
    G -->|Password không đạt yêu cầu| J[Trả 400 Bad Request]
    G -->|Valid| K[Hash password với bcrypt]
    K --> L[Kiểm tra email unique trong DB]
    L -->|Email trùng| I
    L -->|Email unique| M[Tạo record trong profiles table]
    M --> N[Trả 201 Created với message]
    N --> O[Redirect đến login hoặc dashboard]
    H --> P[Client hiển thị error message]
    I --> P
    J --> P
    P --> B
```

### Các bước chi tiết
1. User mở form đăng ký
2. Nhập email, password, confirm password
3. Client validate sơ bộ (format email, độ dài password, password match)
4. Submit form → POST /api/auth/register
5. Server validate:
   - Email format hợp lệ
   - Email chưa tồn tại trong DB
   - Password đạt yêu cầu (min 8 ký tự, có chữ thường/hoa/số/ký tự đặc biệt)
6. Hash password với bcrypt
7. Tạo record trong profiles table (email lowercase, password_hash)
8. Trả response 201 Created
9. Client redirect đến login hoặc dashboard

### Error Handling
- Email trùng: 409 Conflict
- Email format sai: 400 Bad Request
- Password không đạt yêu cầu: 400 Bad Request
- Lỗi server: 500 Internal Server Error

---

## 2. Login Flow (US-01)

### Mô tả
Luồng đăng nhập bằng email và mật khẩu, trả về JWT token.

### Flow Diagram

```mermaid
flowchart TD
    A[User mở form đăng nhập] --> B[Nhập email, password]
    B --> C{Client validate sơ bộ}
    C -->|Invalid| D[Hiển thị lỗi validation]
    D --> B
    C -->|Valid| E[Submit form]
    E --> F[POST /api/auth/login]
    F --> G[Server tìm user theo email]
    G -->|Email không tồn tại| H[Trả 401 Unauthorized]
    G -->|Email tồn tại| I[Verify password với bcrypt]
    I -->|Password sai| H
    I -->|Password đúng| J[Generate JWT token]
    J --> K[Trả 200 OK với token và user info]
    K --> L[Client lưu token vào localStorage]
    L --> M[Redirect đến protected route]
    H --> N[Client hiển thị error message]
    N --> B
```

### Các bước chi tiết
1. User mở form đăng nhập
2. Nhập email, password
3. Client validate sơ bộ (format email, password không rỗng)
4. Submit form → POST /api/auth/login
5. Server tìm user theo email (lowercase)
6. Verify password với bcrypt
7. Nếu đúng: Generate JWT token (với payload: userId, email)
8. Trả response 200 OK với token và user info
9. Client lưu token vào localStorage (hoặc cookie)
10. Redirect đến protected route (dashboard/profile)

### Error Handling
- Email không tồn tại: 401 Unauthorized
- Password sai: 401 Unauthorized
- Lỗi server: 500 Internal Server Error

---

## 3. Profile Get/Update Flow (US-02)

### Mô tả
Luồng lấy và cập nhật thông tin profile, bao gồm upload ảnh toàn thân.

### Flow Diagram - Get Profile

```mermaid
flowchart TD
    A[User mở trang profile] --> B{Đã đăng nhập?}
    B -->|Chưa| C[Redirect đến login]
    B -->|Đã| D[Client gửi GET /api/user/profile]
    D --> E[Server verify JWT token]
    E -->|Token invalid| F[Trả 401 Unauthorized]
    E -->|Token valid| G[Lấy userId từ token]
    G --> H[Query profile từ DB]
    H --> I[Trả 200 OK với profile data]
    I --> J[Client hiển thị form với data]
    F --> C
```

### Flow Diagram - Update Profile

```mermaid
flowchart TD
    A[User điền form profile] --> B[Nhập display_name, height, weight]
    B --> C[Chọn ảnh toàn thân optional]
    C --> D{Client validate}
    D -->|Invalid| E[Hiển thị lỗi validation]
    E --> A
    D -->|Valid| F{Ảnh được chọn?}
    F -->|Có| G[Client validate ảnh: type, size, ratio]
    G -->|Invalid| H[Hiển thị lỗi ảnh]
    H --> A
    G -->|Valid| I[Upload ảnh lên Supabase Storage]
    I -->|Upload fail| J[Hiển thị lỗi upload]
    J --> A
    I -->|Upload success| K[Lấy URL ảnh]
    K --> L[PUT /api/user/profile với data + image_url]
    F -->|Không| L
    L --> M[Server verify JWT token]
    M -->|Token invalid| N[Trả 401 Unauthorized]
    M -->|Token valid| O[Lấy userId từ token]
    O --> P{Server validate data}
    P -->|Invalid| Q[Trả 400 Bad Request]
    P -->|Valid| R[Update profile trong DB]
    R --> S[Trả 200 OK với updated profile]
    S --> T[Client hiển thị success message]
    T --> U[Client refresh form với data mới]
    N --> V[Redirect đến login]
    Q --> W[Client hiển thị error message]
    W --> A
```

### Các bước chi tiết - Get Profile
1. User mở trang profile
2. Client kiểm tra token trong localStorage
3. Nếu chưa đăng nhập → redirect đến login
4. Nếu đã đăng nhập → gửi GET /api/user/profile với JWT token trong header
5. Server verify JWT token
6. Lấy userId từ token payload
7. Query profile từ DB theo userId
8. Trả response 200 OK với profile data
9. Client hiển thị form với data

### Các bước chi tiết - Update Profile
1. User điền form (display_name, height, weight)
2. User chọn ảnh toàn thân (optional)
3. Client validate:
   - Height: số, 100-250
   - Weight: số, 30-250
   - Ảnh: jpg/jpeg/png, ≤ 5MB, ratio 3:4 hoặc 9:16
4. Nếu có ảnh: Upload lên Supabase Storage bucket `full-body-images`
5. Lấy URL ảnh từ Storage
6. Submit form → PUT /api/user/profile với data + image_url
7. Server verify JWT token
8. Lấy userId từ token
9. Server validate data (height, weight ranges)
10. Update profile trong DB
11. Nếu có ảnh mới và có ảnh cũ: Xóa ảnh cũ khỏi Storage
12. Trả response 200 OK với updated profile
13. Client hiển thị success message và refresh form

### Error Handling
- Token invalid/expired: 401 Unauthorized → redirect login
- Validation error: 400 Bad Request
- Upload error: 500 Internal Server Error
- Lỗi server: 500 Internal Server Error

---

## 4. Logout Flow & Protected Routes (US-01)

### Mô tả
Luồng logout và bảo vệ các routes yêu cầu đăng nhập.

### Flow Diagram - Logout

```mermaid
flowchart TD
    A[User bấm nút Logout] --> B[Client xóa token khỏi localStorage]
    B --> C[Client xóa user info khỏi state]
    C --> D[Redirect đến landing page hoặc login]
```

### Flow Diagram - Protected Routes

```mermaid
flowchart TD
    A[User truy cập protected route] --> B{Token có trong localStorage?}
    B -->|Không| C[Redirect đến login]
    B -->|Có| D[Client gửi request với JWT token]
    D --> E[Server verify JWT token]
    E -->|Token invalid/expired| F[Trả 401 Unauthorized]
    E -->|Token valid| G[Cho phép truy cập]
    F --> C
    G --> H[Trả response thành công]
```

### Các bước chi tiết - Logout
1. User bấm nút Logout
2. Client xóa token khỏi localStorage (hoặc cookie)
3. Client xóa user info khỏi state/context
4. Redirect đến landing page hoặc login

### Các bước chi tiết - Protected Routes

#### Frontend Protection
1. Component/Route kiểm tra token trong localStorage
2. Nếu không có token → redirect đến login
3. Nếu có token → cho phép render component

#### Backend Protection (Middleware)
1. Request đến protected endpoint
2. Middleware kiểm tra JWT token trong header (Authorization: Bearer <token>)
3. Verify token với secret key
4. Nếu invalid/expired → trả 401 Unauthorized
5. Nếu valid → extract userId từ token và attach vào request
6. Cho phép request tiếp tục đến controller

### Protected Routes/Endpoints
- Frontend: `/profile`, `/dashboard` (nếu có)
- Backend: `/api/user/*` (tất cả endpoints liên quan đến user)

---

## Tổng hợp Flow Authentication

```mermaid
flowchart LR
    A[Landing Page] -->|Register| B[Register Flow]
    A -->|Login| C[Login Flow]
    B -->|Success| C
    C -->|Success| D[Protected Routes]
    D -->|Logout| A
    D -->|View/Update| E[Profile Flow]
```

---

## Notes
- Tất cả các flow đều có error handling đầy đủ
- JWT token có TTL hợp lý (ví dụ: 7 ngày)
- Password luôn được hash trước khi lưu
- Email được normalize thành lowercase
- Storage bucket là private, chỉ user sở hữu mới truy cập được
- Client validate sơ bộ để giảm số lượng request không hợp lệ
- Server validate lại để đảm bảo security

