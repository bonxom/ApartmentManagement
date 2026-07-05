# Apartment Management - Spring Boot Backend (Demo)

Backend Spring Boot cho hệ thống Quản lý Chung cư, phục vụ demo 2 use case chính:
- **UC01**: Quản lý cư dân và căn hộ (hộ khẩu)
- **UC02**: Quản lý thu phí và công nợ

## Công nghệ

- Java 17+
- Spring Boot 3.2.5
- Spring Data JPA
- Spring Security + JWT
- PostgreSQL
- Maven
- Lombok

## Yêu cầu môi trường

- Java 17 hoặc 21
- Maven 3.8+ (hoặc dùng `./mvnw`)
- PostgreSQL (local hoặc cloud)

## Cấu hình

File cấu hình: `src/main/resources/application.properties`

Các biến chính:
```properties
server.port=3000                              # Port backend 
spring.datasource.url=jdbc:postgresql://localhost:5432/resident_management
spring.datasource.username=postgres
spring.datasource.password=postgres
app.jwt.secret=<your-jwt-secret>              # Secret key cho JWT
app.jwt.expiration-ms=604800000               # Token hết hạn: 7 ngày
app.cors.allowed-origins=http://localhost:5173 # Frontend origin
```

## Chạy backend

```bash
cd backend-springboot

# Cách 1: Dùng Maven wrapper (không cần cài Maven)
./mvnw spring-boot:run

# Cách 2: Dùng Maven đã cài
mvn spring-boot:run

# Cách 3: Build JAR và chạy
mvn clean package -DskipTests
java -jar target/apartment-management-1.0.0-SNAPSHOT.jar
```

Backend chạy tại `http://localhost:3000`.

Khi khởi động lần đầu, seed data sẽ tự động được tạo:
- Permissions (37 quyền)
- Roles: HAMLET LEADER, ACCOUNTANT, HOUSE MEMBER, MEMBER
- Users: Admin, kế toán, chủ hộ, thành viên (xem danh sách bên dưới)
- Households: 2 hộ mẫu (SEED-HH-001, SEED-HH-002)
- Fees: 5 khoản thu mẫu (phí bắt buộc và tự nguyện)
- Transactions: 3 giao dịch mẫu

## Chạy frontend

Frontend giữ nguyên, không cần sửa gì vì backend Spring Boot chạy cùng port 3000:

```bash
cd frontend
npm install
npm run dev
```

Frontend chạy tại `http://localhost:5173`.

## Tài khoản demo

| Vai trò | Email | Mật khẩu | Mô tả |
|---------|-------|----------|-------|
| HAMLET LEADER (Admin) | `admin@res.com` | `123456` | Quản trị viên, toàn quyền |
| HAMLET LEADER | `leader@resident.test` | `123456` | Lãnh đạo thôn |
| ACCOUNTANT | `accountant@resident.test` | `123456` | Kế toán - Trần Quốc Huy |
| ACCOUNTANT | `accountant2@resident.test` | `123456` | Kế toán - Nguyễn Thị Mai |
| HOUSE MEMBER | `household.leader1@resident.test` | `123456` | Chủ hộ SEED-HH-001 - Nguyễn Văn Chủ |
| HOUSE MEMBER | `household.member1@resident.test` | `123456` | Thành viên - Lê Thị Thành Viên |
| HOUSE MEMBER | `household.leader2@resident.test` | `123456` | Chủ hộ SEED-HH-002 - Trần Thị Chủ |
| MEMBER | `member@resident.test` | `123456` | Cư dân chưa có hộ - Đặng Hoài Nam |

## Cấu trúc source

```
backend-springboot/src/main/java/com/apartmentmanagement/
├── ApartmentManagementApplication.java
├── config/
│   ├── CorsConfig.java          # CORS configuration
│   ├── JpaConfig.java           # JPA auditing
│   └── SeedDataConfig.java      # Seed data cho demo
├── security/
│   ├── JwtAuthFilter.java       # JWT authentication filter
│   ├── JwtTokenProvider.java    # JWT token generation/validation
│   ├── SecurityConfig.java      # Spring Security configuration
│   └── UserDetailsServiceImpl.java
├── controller/
│   ├── AuthController.java      # Login, Register, GetMe
│   ├── UserController.java      # CRUD Users (UC01)
│   ├── HouseholdController.java # CRUD Households (UC01)
│   ├── FeeController.java       # CRUD Fees, Statistics (UC02)
│   ├── TransactionController.java # CRUD Transactions (UC02)
│   ├── StatsController.java     # Dashboard statistics
│   ├── RequestController.java   # STUB - Requests
│   ├── ChatController.java      # STUB - Chat
│   ├── PermissionController.java # STUB - Permissions
│   └── RoleController.java      # STUB - Roles
├── service/
│   ├── AuthService.java
│   ├── UserService.java
│   ├── HouseholdService.java
│   ├── FeeService.java
│   ├── TransactionService.java
│   └── StubService.java
├── repository/
│   ├── UserRepository.java
│   ├── RoleRepository.java
│   ├── PermissionRepository.java
│   ├── HouseholdRepository.java
│   ├── FeeRepository.java
│   ├── TransactionRepository.java
│   ├── RequestRepository.java
│   └── ResidentHistoryRepository.java
├── entity/                      # JPA entities
│   ├── User.java
│   ├── Role.java
│   ├── Permission.java
│   ├── Household.java
│   ├── Fee.java
│   ├── Transaction.java
│   ├── Request.java
│   ├── ResidentHistory.java
│   ├── ChatParticipant.java
│   └── Message.java
├── dto/
│   ├── request/                 # Request DTOs
│   └── response/                # Response DTOs
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── BusinessException.java
│   └── UnauthorizedException.java
└── enums/
    ├── RoleEnum.java
    ├── FeeType.java
    ├── FeeStatus.java
    ├── TransactionStatus.java
    ├── UserStatus.java
    ├── RequestStatus.java
    └── RequestType.java
```

## Endpoint Coverage Table

### Auth
| Method | Path | Status | Module |
|--------|------|--------|--------|
| POST | /api/auth/login | **IMPLEMENTED** | Auth |
| POST | /api/auth/register | **IMPLEMENTED** | Auth |
| GET | /api/auth/me | **IMPLEMENTED** | Auth |

### Users (UC01)
| Method | Path | Status | Module |
|--------|------|--------|--------|
| GET | /api/users | **IMPLEMENTED** | UC01 |
| GET | /api/users/me/household | **IMPLEMENTED** | UC01 |
| GET | /api/users/{id} | **IMPLEMENTED** | UC01 |
| POST | /api/users | **IMPLEMENTED** | UC01 |
| PUT | /api/users/{id} | **IMPLEMENTED** | UC01 |
| DELETE | /api/users/{id} | **IMPLEMENTED** | UC01 |
| PATCH | /api/users/{id}/password | **IMPLEMENTED** | UC01 |

### Households (UC01)
| Method | Path | Status | Module |
|--------|------|--------|--------|
| GET | /api/households | **IMPLEMENTED** | UC01 |
| GET | /api/households/{id} | **IMPLEMENTED** | UC01 |
| POST | /api/households | **IMPLEMENTED** | UC01 |
| PUT | /api/households/{id} | **IMPLEMENTED** | UC01 |
| DELETE | /api/households/{id} | **IMPLEMENTED** | UC01 |
| GET | /api/households/{id}/members | **IMPLEMENTED** | UC01 |
| GET | /api/households/{id}/members-info | **IMPLEMENTED** | UC01 |
| GET | /api/households/{householdId}/member/{userId} | **IMPLEMENTED** | UC01 |
| POST | /api/households/{id}/members | **IMPLEMENTED** | UC01 |
| DELETE | /api/households/{householdId}/members/{memberId} | **IMPLEMENTED** | UC01 |
| GET | /api/households/{householdId}/resident-history | **IMPLEMENTED** | UC01 |
| POST | /api/households/split | **IMPLEMENTED** | UC01 |
| POST | /api/households/move | **IMPLEMENTED** | UC01 |
| GET | /api/households/{householdId}/changes | **IMPLEMENTED** | UC01 |
| PUT | /api/households/{householdId}/resident-history | **IMPLEMENTED** | UC01 |
| PUT | /api/households/{householdId}/resident-history/complete | **IMPLEMENTED** | UC01 |
| POST | /api/households/{householdId}/temporary-residents | **STUB** | UC03 |

### Fees (UC02)
| Method | Path | Status | Module |
|--------|------|--------|--------|
| GET | /api/fees | **IMPLEMENTED** | UC02 |
| POST | /api/fees | **IMPLEMENTED** | UC02 |
| GET | /api/fees/my-household | **IMPLEMENTED** | UC02 |
| GET | /api/fees/household/{householdId} | **IMPLEMENTED** | UC02 |
| GET | /api/fees/{feeId}/statistics | **IMPLEMENTED** | UC02 |
| PUT | /api/fees/{feeId} | **IMPLEMENTED** | UC02 |
| DELETE | /api/fees/{feeId} | **IMPLEMENTED** | UC02 |

### Transactions (UC02)
| Method | Path | Status | Module |
|--------|------|--------|--------|
| GET | /api/transactions | **IMPLEMENTED** | UC02 |
| POST | /api/transactions | **IMPLEMENTED** | UC02 |
| PUT | /api/transactions/{id} | **IMPLEMENTED** | UC02 |
| DELETE | /api/transactions/{id} | **IMPLEMENTED** | UC02 |

### Stats (Dashboard)
| Method | Path | Status | Module |
|--------|------|--------|--------|
| GET | /api/stats/dashboard | **IMPLEMENTED** | UC01/UC02 |
| GET | /api/stats/user-dashboard | **IMPLEMENTED** | UC01/UC02 |

### Requests (STUB - UC03: Phản ánh dịch vụ)
| Method | Path | Status | Module |
|--------|------|--------|--------|
| POST | /api/requests/update-info | STUB | UC03 |
| POST | /api/requests/payment | STUB | UC03 |
| POST | /api/requests/temporary-residence | STUB | UC03 |
| POST | /api/requests/temporary-absence | STUB | UC03 |
| POST | /api/requests/birth | STUB | UC03 |
| POST | /api/requests/death | STUB | UC03 |
| GET | /api/requests | STUB | UC03 |
| GET | /api/requests/my-household | STUB | UC03 |
| GET | /api/requests/my-household/payments | STUB | UC03 |
| PUT | /api/requests/{id}/review | STUB | UC03 |

### Chat (STUB)
| Method | Path | Status | Module |
|--------|------|--------|--------|
| GET | /api/chat/messages | STUB | Chat |
| POST | /api/chat/messages | STUB | Chat |
| DELETE | /api/chat/messages/{id} | STUB | Chat |
| GET | /api/chat/participants | STUB | Chat |
| PUT | /api/chat/status | STUB | Chat |
| POST | /api/chat/initialize | STUB | Chat |
| POST | /api/chat/sync-all | STUB | Chat |
| POST | /api/chat/add-me | STUB | Chat |

### Permissions (STUB)
| Method | Path | Status | Module |
|--------|------|--------|--------|
| GET | /api/permissions | STUB | Admin |
| POST | /api/permissions | STUB | Admin |
| GET | /api/permissions/{id} | STUB | Admin |
| PUT | /api/permissions/{id} | STUB | Admin |
| DELETE | /api/permissions/{id} | STUB | Admin |

### Roles (STUB)
| Method | Path | Status | Module |
|--------|------|--------|--------|
| GET | /api/roles | STUB | Admin |
| POST | /api/roles | STUB | Admin |
| GET | /api/roles/{id} | STUB | Admin |
| PUT | /api/roles/{id} | STUB | Admin |
| DELETE | /api/roles/{id} | STUB | Admin |
| GET | /api/roles/{id}/permissions | STUB | Admin |
| PUT | /api/roles/{id}/permissions | STUB | Admin |

### Tổng kết
- **IMPLEMENTED**: 44 endpoints
- **STUB** (trả `"Tính năng đang phát triển"`): 34 endpoints
- **Tổng**: 78 endpoints

## Stub Endpoint Response

Tất cả các endpoint STUB trả về HTTP 200 với response:
```json
{
  "success": false,
  "message": "Tính năng đang phát triển",
  "data": null    // hoặc [] cho danh sách
}
```

Frontend sẽ hiển thị nội dung `"Tính năng đang phát triển"` khi gọi các endpoint này.

## Phạm vi demo

### Đã implement (UC01 & UC02)
- Đăng nhập/phân quyền với JWT
- Quản lý căn hộ/hộ khẩu: CRUD, thêm/xóa thành viên, tách/chuyển hộ
- Quản lý cư dân: CRUD, gắn vào hộ, đổi mật khẩu
- Quản lý khoản thu: CRUD, thống kê theo hộ
- Quản lý giao dịch: ghi nhận thanh toán, xem lịch sử
- Dashboard thống kê
- Công nợ: xem theo hộ, tính dư nợ

### Ngoài phạm vi (STUB)
- UC03: Phản ánh dịch vụ, yêu cầu cư dân (đăng ký, sửa thông tin, tạm trú/vắng, sinh/tử, duyệt yêu cầu)
- UC04: Bảo trì
- UC05: Đăng ký xe
- Chat nội bộ
- Quản lý Permissions/Roles (admin nâng cao)

Tất cả các tính năng này vẫn có UI trên frontend nhưng khi gọi API sẽ nhận thông báo `"Tính năng đang phát triển"`.

## License

MIT
