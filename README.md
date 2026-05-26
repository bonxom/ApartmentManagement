# ApartmentManagement

Hệ thống quản lý chung cư/dân cư theo mô hình fullstack, tập trung vào các nghiệp vụ:
- Quản lý cư dân, hộ gia đình
- Quản lý khoản phí và giao dịch
- Quản lý yêu cầu cư dân (đăng ký, cập nhật thông tin, tạm trú/tạm vắng, sinh/tử)
- Dashboard thống kê theo vai trò
- Chat nội bộ giữa các nhóm người dùng

## Công nghệ sử dụng

### Frontend (`frontend`)
- React 18 + Vite
- Material UI (MUI)
- Zustand (state management)
- Axios
- React Router
- Recharts

### Backend (`backend`)
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication

## Cấu trúc dự án

```text
ApartmentManagement/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── index.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── feature/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── store/
│   └── vite.config.js
└── README.md
```

## Yêu cầu môi trường

- Node.js 18+
- npm 9+
- MongoDB (local hoặc Atlas)

## Thiết lập môi trường

Dự án đã có file mẫu biến môi trường:
- `backend/.env.example`
- `frontend/.env.example`

### 1) Backend env

Tạo file `backend/.env` từ `backend/.env.example` và cập nhật giá trị thực tế.

Các biến chính:
- `PORT`
- `MONGO_URI`
- `MONGO_DB_NAME`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`

### 2) Frontend env

Tạo file `frontend/.env` từ `frontend/.env.example`.

Biến chính:
- `VITE_SERVER_URL` (ví dụ: `http://localhost:3000/api`)

## Chạy dự án local

### Chạy backend

```bash
cd backend
npm install
npm run dev
```

### Chạy frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend mặc định chạy tại `http://localhost:5173`.

## Scripts hữu ích

### Backend
- `npm run dev`: chạy backend với nodemon
- `npm start`: chạy backend production mode

### Frontend
- `npm run dev`: chạy frontend local
- `npm run build`: build production
- `npm run preview`: preview build
- `npm run lint`: kiểm tra lint

## Vai trò người dùng

- `HAMLET LEADER`: quản trị chính, duyệt yêu cầu, quản lý cư dân/hộ/phí
- `ACCOUNTANT`: xử lý nghiệp vụ phí và giao dịch
- `HOUSE MEMBER`: cư dân thuộc hộ, theo dõi phí và gửi yêu cầu
- `MEMBER`: tài khoản cư dân chưa được gắn vào hộ

## Triển khai

Bạn có thể triển khai:
- Frontend: Vercel/Netlify
- Backend: VPS/Render/Railway
- Database: MongoDB Atlas

## License

Dự án phát hành theo giấy phép MIT. Xem file `LICENSE` để biết chi tiết.
