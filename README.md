# ApartmentManagement

Hệ thống quản lý chung cư/dân cư theo mô hình fullstack, tập trung vào các nghiệp vụ:
- Quản lý cư dân, hộ gia đình (UC01)
- Quản lý khoản phí và giao dịch (UC02)
- Quản lý yêu cầu cư dân — đăng ký, cập nhật thông tin, tạm trú/tạm vắng, sinh/tử (UC03)
- Quản lý bảo trì và vận hành (UC04)
- Quản lý đăng ký, trông gửi xe (UC05)

## Thông tin học phần

| | |
|---|---|
| **Trường** | Đại học Bách khoa Hà Nội — Trường Công nghệ Thông tin và Truyền thông |
| **Học phần** | IT3120 – Phân tích và Thiết kế Hệ thống |
| **Giảng viên** | TS. Nguyễn Hữu Đức |
| **Mã lớp** | 168486 |

### Thành viên

| Họ và tên | MSSV |
|---|---|
| Hồ Minh Dũng | 20235050 |
| Lê Tùng Lâm | 202416259 |
| Nguyễn Mạnh Hùng | 20235339 |
| Đặng Tuấn Anh | 20234999 |
| Vũ Hải Minh | 20235166 |

## Công nghệ sử dụng

### Frontend (`frontend`)
- React 18 + Vite
- Material UI (MUI) 5
- Zustand (state management)
- Axios
- React Router 6
- Recharts

### Backend (`backend`)
- Java 17 + Spring Boot 3.2.5
- Spring Data JPA
- Spring Security + JWT (stateless auth)
- PostgreSQL
- Maven
- Lombok

## Cấu trúc dự án

```text
ApartmentManagement/
├── backend/
│   ├── src/main/java/com/apartmentmanagement/
│   │   ├── config/          # CORS, JPA, Seed Data
│   │   ├── controller/      # REST controllers
│   │   ├── dto/request/     # Request DTOs
│   │   ├── dto/response/    # Response DTOs (ApiResponse<T>)
│   │   ├── entity/          # JPA entities
│   │   ├── enums/           # Enum types
│   │   ├── exception/       # GlobalExceptionHandler + custom exceptions
│   │   ├── repository/      # Spring Data JPA repositories
│   │   ├── security/        # JWT filter, token provider, SecurityConfig
│   │   └── service/         # Business logic
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance + API service functions
│   │   ├── components/      # Shared components (Sidebar, Topbar, ProtectedRoute, ...)
│   │   ├── feature/         # Feature-specific components
│   │   ├── hooks/           # Custom hooks
│   │   ├── layout/          # Layout variants per role
│   │   ├── pages/           # Route-level pages, split by role
│   │   ├── routes/          # Route definitions (leader, accountant, user)
│   │   └── store/           # Zustand stores (auth, theme, notification)
│   └── vite.config.js
└── docs/                    # Báo cáo bài tập lớn
```

## Yêu cầu môi trường

- Java 17+ (khuyến nghị 21)
- Maven 3.8+ (hoặc dùng `./mvnw`)
- Node.js 18+
- npm 9+
- PostgreSQL (local hoặc cloud)

## Thiết lập môi trường

### 1) Backend

Cấu hình trong `backend/src/main/resources/application.properties`:

| Biến | Mô tả |
|---|---|
| `server.port` | Port backend (mặc định: 3000) |
| `spring.datasource.url` | JDBC URL PostgreSQL |
| `spring.datasource.username` | Database username |
| `spring.datasource.password` | Database password |
| `app.jwt.secret` | Secret key cho JWT |
| `app.jwt.expiration-ms` | Token hết hạn (mặc định: 7 ngày) |
| `app.cors.allowed-origins` | Frontend origin (mặc định: `http://localhost:5173`) |

### 2) Frontend

Tạo file `frontend/.env` từ `frontend/.env.example`:

```
VITE_SERVER_URL=http://localhost:3000/api
```

## Chạy dự án local

### Backend (port 3000)

```bash
cd backend

# Dùng Maven wrapper (không cần cài Maven)
./mvnw spring-boot:run

# Hoặc build JAR rồi chạy
mvn clean package -DskipTests
java -jar target/apartment-management-1.0.0-SNAPSHOT.jar
```

Khi khởi động lần đầu, `SeedDataConfig` tự động tạo dữ liệu mẫu: permissions, roles, users, households, fees, transactions.

### Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

## Scripts

### Backend
| Lệnh | Mô tả |
|---|---|
| `./mvnw spring-boot:run` | Chạy backend dev mode |
| `mvn clean package -DskipTests` | Build JAR |
| `java -jar target/apartment-management-1.0.0-SNAPSHOT.jar` | Chạy production |

### Frontend
| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Chạy frontend dev mode |
| `npm run build` | Build production |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## Vai trò người dùng

| Vai trò | Mô tả |
|---|---|
| `HAMLET LEADER` | Quản trị chính, duyệt yêu cầu, quản lý cư dân/hộ/phí |
| `ACCOUNTANT` | Xử lý nghiệp vụ phí và giao dịch |
| `HOUSE MEMBER` | Cư dân thuộc hộ, theo dõi phí và gửi yêu cầu |
| `MEMBER` | Tài khoản cư dân chưa được gắn vào hộ |

## Tài khoản mẫu

| Vai trò | Email | Mật khẩu |
|---|---|---|
| HAMLET LEADER | `admin@res.com` | `123456` |
| HAMLET LEADER | `leader@resident.test` | `123456` |
| ACCOUNTANT | `accountant@resident.test` | `123456` |
| ACCOUNTANT | `accountant2@resident.test` | `123456` |
| HOUSE MEMBER | `household.leader1@resident.test` | `123456` |
| HOUSE MEMBER | `household.member1@resident.test` | `123456` |
| HOUSE MEMBER | `household.leader2@resident.test` | `123456` |
| MEMBER | `member@resident.test` | `123456` |

## Trạng thái tính năng

### Đã implement (UC01 & UC02)
- Đăng nhập/phân quyền với JWT
- Quản lý căn hộ/hộ khẩu: CRUD, thêm/xóa thành viên, tách/chuyển hộ
- Quản lý cư dân: CRUD, gắn vào hộ, đổi mật khẩu
- Quản lý khoản thu: CRUD, thống kê theo hộ
- Quản lý giao dịch: ghi nhận thanh toán, xem lịch sử
- Dashboard thống kê
- Công nợ: xem theo hộ, tính dư nợ

### STUB (UC03, UC04, UC05, Chat, Permissions/Roles)
Các endpoint này trả về HTTP 200 với body `{success: false, message: "Tính năng đang phát triển", data: null}`. Frontend hiển thị thông báo tương ứng khi gọi các API này.

## Triển khai

- Frontend: Vercel/Netlify
- Backend: VPS/Render/Railway
- Database: PostgreSQL

## License

MIT — xem file `LICENSE`.
