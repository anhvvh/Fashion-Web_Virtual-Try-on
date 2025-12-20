# Sprint 1: Project Setup & Authentication
## Mục tiêu Sprint
Thiết lập project và xây dựng các tính năng authentication cơ bản
User Stories: US-01, US-02
## Tasks
### 1. Thiết lập Project (Priority: High)
**Mô tả:** Khởi tạo và cấu hình project
**Công việc:**
- [x] Khởi tạo project backend với NodeJS/ExpressJS
- [x] Cấu hình ESLint, Prettier cho backend
- [x] Khởi tạo project frontend với ReactJS/Vite
- [x] Cấu hình ESLint, Prettier cho frontend
- [x] Cấu hình JWT cho authentication
- [x] Setup environment variables (.env.example)
- [x] Tạo cấu trúc thư mục cho cả frontend và backend
- [x] Setup CORS cho API
- [x] Tạo file README với hướng dẫn setup & run project

**Acceptance Criteria:**
- Project chạy được trên local
- Environment variables được cấu hình đúng
- File README được tạo và chứa hướng dẫn setup & run project

---

### 2. Tạo Landing Page (Priority: Medium)
**Mô tả:** Xây dựng trang landing page cho ứng dụng

**Công việc:**
- [x] Thiết kế layout landing page
- [x] Tạo header với logo và navigation
- [x] Tạo hero section
- [x] Tạo features section
- [x] Tạo footer
- [x] Responsive design cho mobile và tablet
- [x] Thêm routing cho landing page

**Acceptance Criteria:**
- Landing page hiển thị đầy đủ các sections
- Responsive trên các thiết bị
- Navigation hoạt động
- UI/UX thân thiện, đẹp mắt và fashionista

---

### 3. Thiết kế Database (Priority: High)
**Mô tả:** Thiết kế schema cho sprint 1 (auth/profile)

**Công việc:**
- [x] Xác định bảng cho các tính năng trong sprint 1 và các cột cần thiết
- [x] Thiết lập indexes và constraints
- [x] Viết script/migration SQL trên Supabase
- [x] Thiết kế storage cho các tính năng trong sprint 1 trên Supabase
- [x] Thiết kế script/migration cho storage

**Acceptance Criteria:**
- Schema `profiles` được tạo trên Supabase, có unique email
- Có sẵn dữ liệu mẫu cho bảng `profiles` ứng với user stories trong sprint 1
- Storage được tạo trên Supabase cho avatar
- Lưu được schema vào thư mục /design, scripts vào thư mục /migrations

---

### 4. Thiết kế Flow (Priority: High)
**Mô tả:** Xác định luồng auth/profile cho sprint 1

**Công việc:**
- [x] Phác thảo flow đăng ký (register)
- [x] Phác thảo flow đăng nhập (login + JWT)
- [x] Phác thảo flow lấy/cập nhật profile và upload avatar (Storage)
- [x] Phác thảo flow logout và bảo vệ routes
- [x] Lưu lại sơ đồ/ngắn gọn trong thư mục thiết kế

**Acceptance Criteria:**
- Có tài liệu flow rõ ràng cho register, login, profile (get/update), upload avatar, logout
- Flow được review và chốt trước khi dev tính năng

---

### 5. Tạo tính năng Đăng ký (Priority: High)
**Mô tả:** Xây dựng chức năng đăng ký tài khoản mới dựa trên flow đã chốt

**Công việc:**
- [x] Tạo API endpoint đăng ký (POST /api/auth/register)
- [x] Validate dữ liệu đầu vào (email, password, etc.)
- [x] Hash password trước khi lưu (dùng bcrypt, không dùng Supabase Auth)
- [x] Tạo UI form đăng ký
- [x] Kết nối frontend với API đăng ký
- [x] Xử lý error và success messages
- [x] Email validation và unique check
- [x] Fix trigger function để auto-create profile

**Acceptance Criteria:**
- User có thể đăng ký tài khoản mới
- Password được hash an toàn (qua bcrypt)
- Validation hoạt động đúng
- Error handling đầy đủ
- Không cho phép email trùng lặp
- Profile tự động được tạo khi đăng ký thành công

---

### 6. Tạo tính năng Đăng nhập (Priority: High)
**Mô tả:** Xây dựng chức năng đăng nhập

**Công việc:**
- [x] Tạo API endpoint đăng nhập (POST /api/auth/login)
- [x] Verify email và password
- [x] Generate JWT token khi đăng nhập thành công
- [x] Tạo UI form đăng nhập
- [x] Kết nối frontend với API đăng nhập
- [x] Lưu JWT token (localStorage)
- [ ] Implement logout functionality
- [ ] Protected routes setup
- [x] Xử lý error messages

**Acceptance Criteria:**
- User có thể đăng nhập với email/password
- JWT token được tạo và lưu trữ
- Redirect sau khi đăng nhập thành công
- Logout hoạt động đúng
- Protected routes chỉ truy cập khi đã login

---

### 7. Tạo tính năng Cập nhật Hồ sơ (Priority: Medium)
**Mô tả:** Cho phép user cập nhật thông tin cá nhân

**Công việc:**
- [x] Tạo API endpoint lấy thông tin user (GET /api/user/profile)
- [x] Tạo API endpoint cập nhật profile (PUT /api/user/profile)
- [x] Tạo API endpoint upload ảnh toàn thân (POST /api/user/profile/photo)
- [x] Implement JWT verification middleware (đã có sẵn)
- [x] Tạo UI profile page
- [x] Form cập nhật thông tin (display_name, height_cm, weight_kg)
- [x] Upload ảnh toàn thân (sử dụng Supabase Storage)
- [x] Validate dữ liệu cập nhật (height: 100-250cm, weight: 30-250kg)
- [x] Xử lý upload file với multer
- [x] Update UI sau khi save thành công
- [x] Tạo Dashboard component
- [x] Tạo AuthenticatedHeader component cho UI thống nhất
- [x] Tạo ProtectedRoute component

**Acceptance Criteria:**
- User có thể xem thông tin profile
- User có thể cập nhật thông tin (display_name, height_cm, weight_kg)
- Upload ảnh toàn thân hoạt động với Supabase Storage
- Validation đầy đủ (height: 100-250cm, weight: 30-250kg, file: jpg/jpeg/png, max 5MB)
- Chỉ user đã login mới truy cập được (ProtectedRoute)
- UI phản hồi khi save thành công/thất bại
- Giao diện thống nhất giữa các trang đã đăng nhập

## Definition of Done
- Code được review
- Unit tests passed (nếu có)
- Functionality tested trên môi trường local
- Documentation cập nhật
- Code được merge vào branch chính

## Notes
- Ưu tiên hoàn thành Task 1 trước để các task khác có thể triển khai
- Task 3 và 4 cần hoàn thành trước Task 5
- Tập trung vào security cho authentication features