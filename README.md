# Virtual Try-on

Ứng dụng thử đồ ảo (Virtual Try-on) sử dụng GenAI.

## Tech Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **Database & Storage:** Supabase
- **Authentication:** JWT

## Cấu trúc Project

```
├── backend/                # Backend API
│   ├── src/
│   │   ├── config/        # Cấu hình (env, supabase, constants)
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Database access
│   │   ├── middlewares/   # Auth, error handling
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utilities
│   └── package.json
├── frontend/              # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── features/      # Feature modules
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utilities
│   │   └── assets/        # Static assets
│   └── package.json
├── sprints/               # Sprint documentation
├── .cursor/               # Cursor rules & commands
└── README.md
```

## Yêu cầu

- Node.js >= 18
- npm >= 9
- Tài khoản Supabase

## Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/anhvvh/Fashion-Web_Virtual-Try-on.git
cd Fashion-Web_Virtual-Try-on
```

### 2. Cấu hình Backend

```bash
cd backend
npm install
cp .env.example .env
```

Cập nhật file `.env` với thông tin Supabase và JWT secret:

```env
PORT=3000
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### 3. Cấu hình Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

### 4. Chạy ứng dụng

**Backend (Terminal 1):**

```bash
cd backend
npm run dev
```

Backend chạy tại: http://localhost:3000

**Frontend (Terminal 2):**

```bash
cd frontend
npm run dev
```

Frontend chạy tại: http://localhost:5173

## Scripts

### Backend

| Command | Mô tả |
|---------|-------|
| `npm run dev` | Chạy development server với nodemon |
| `npm start` | Chạy production server |
| `npm run lint` | Kiểm tra linting |
| `npm run lint:fix` | Sửa lỗi linting |
| `npm run format` | Format code với Prettier |

### Frontend

| Command | Mô tả |
|---------|-------|
| `npm run dev` | Chạy development server |
| `npm run build` | Build production |
| `npm run preview` | Preview production build |
| `npm run lint` | Kiểm tra linting |
| `npm run format` | Format code với Prettier |

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/health` | Health check |

## License

ISC
