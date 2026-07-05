# Pajedhow Dhow Furnitures — Spring Boot Backend

Production-ready REST API for the Pajedhow marketplace frontend. Built with **Spring Boot 3.3**, **Spring Security (JWT)**, **Spring Data JPA / Hibernate**, and **MySQL 8**.

It mirrors the frontend domain exactly: products, categories, suppliers, orders, customers, staff, coupons, banners, reviews, activity logs, and dashboard analytics — with role-based access control for the admin surface and a secure customer account area.

---

## Tech stack

| Concern         | Choice                                   |
|-----------------|------------------------------------------|
| Language        | Java 17                                  |
| Framework       | Spring Boot 3.3.5                         |
| Security        | Spring Security + JWT (jjwt 0.12)         |
| Persistence     | Spring Data JPA / Hibernate              |
| Database        | MySQL 8                                  |
| Build           | Maven                                    |
| Boilerplate     | Lombok                                   |

---

## Roles & access model

Five system roles (mirroring the frontend):

| Role          | Scope                                                                 |
|---------------|-----------------------------------------------------------------------|
| `SUPER_ADMIN` | Full access, incl. staff management and order deletion                |
| `MANAGER`     | Products, categories, suppliers, orders, coupons, banners, reviews    |
| `EDITOR`      | Content: products, categories, suppliers, banners                     |
| `SUPPORT`     | Orders (create/update status), review moderation                      |
| `CUSTOMER`    | Own profile, addresses, orders, and review submissions                |

Access is enforced two ways:
- **URL rules** in `SecurityConfig` (`/api/admin/**` requires a staff role, `/api/account/**` requires login).
- **Method-level `@PreAuthorize`** on sensitive admin operations for fine-grained control.

> On registration, emails starting with `admin@` are provisioned as `SUPER_ADMIN` (matching the frontend demo rule); everyone else becomes a `CUSTOMER`. Staff accounts are otherwise created by a Super Admin via `/api/admin/staff`.

---

## Getting started

### 1. Prerequisites
- JDK 17+
- Maven 3.9+
- MySQL 8 running locally (the app auto-creates the `pajedhow` database)

### 2. Configure
Copy `.env.example` and adjust, or set the variables in your shell / IDE run config. Sensible defaults are baked into `application.yml`, so with a default local MySQL (`root`/`root`) you can run without any config.

### 3. Run
```bash
cd backend
mvn spring-boot:run
```
The API starts on `http://localhost:8080`. On first run, `DataSeeder` populates categories, suppliers, sample products, coupons, banners, and two demo accounts:

| Role     | Email                | Password    |
|----------|----------------------|-------------|
| Admin    | `admin@pajedhow.com` | `admin1234` |
| Customer | `buyer@pajedhow.com` | `buyer1234` |

Disable seeding in production with `APP_SEED_ENABLED=false`.

### 4. Build a jar
```bash
mvn clean package
java -jar target/pajedhow-backend-1.0.0.jar
```

---

## Authentication flow

1. `POST /api/auth/register` or `POST /api/auth/login` → returns `{ accessToken, refreshToken, user }`.
2. Send `Authorization: Bearer <accessToken>` on protected requests.
3. When the access token expires, `POST /api/auth/refresh` with the refresh token.

---

## API reference

### Public (no auth)
| Method | Path                              | Description                     |
|--------|-----------------------------------|---------------------------------|
| POST   | `/api/auth/register`              | Create a customer account       |
| POST   | `/api/auth/login`                 | Login                           |
| POST   | `/api/auth/refresh`               | Exchange refresh token          |
| GET    | `/api/health`                     | Health check                    |
| GET    | `/api/config/whatsapp`            | WhatsApp contact number         |
| GET    | `/api/products`                   | List published products (paged, `q`, `category`) |
| GET    | `/api/products/slug/{slug}`       | Product by slug                 |
| GET    | `/api/products/{id}`              | Product by id                   |
| GET    | `/api/products/{id}/reviews`      | Published reviews for a product |
| GET    | `/api/categories`                 | List categories                 |
| GET    | `/api/categories/{slug}`          | Category by slug                |
| GET    | `/api/suppliers`                  | List suppliers                  |
| GET    | `/api/banners/active`             | Active banners                  |
| GET    | `/api/reviews/product/{id}`       | Published reviews for a product |

### Customer (auth: any logged-in user)
| Method | Path                          | Description                 |
|--------|-------------------------------|-----------------------------|
| GET    | `/api/auth/me`                | Current user                |
| GET/PUT| `/api/account/profile`        | View / update profile       |
| GET/POST | `/api/account/addresses`    | List / add address          |
| PUT/DELETE | `/api/account/addresses/{id}` | Update / delete address  |
| GET    | `/api/account/orders`         | My orders                   |
| POST   | `/api/account/orders`         | Place an order (checkout)   |
| POST   | `/api/account/reviews`        | Submit a review (pending)   |

### Admin (auth: staff roles)
| Method | Path                                   | Roles                              |
|--------|----------------------------------------|------------------------------------|
| GET    | `/api/admin/dashboard`                 | any staff                          |
| GET    | `/api/admin/activity`                  | any staff                          |
| CRUD   | `/api/admin/products`                  | create/update: SUPER_ADMIN/MANAGER/EDITOR; delete: SUPER_ADMIN/MANAGER |
| CRUD   | `/api/admin/categories`                | same as products                   |
| CRUD   | `/api/admin/suppliers`                 | same as products                   |
| GET/POST | `/api/admin/orders`                  | list: any staff; create: SUPER_ADMIN/MANAGER/SUPPORT |
| PATCH  | `/api/admin/orders/{id}/status`        | SUPER_ADMIN/MANAGER/SUPPORT        |
| DELETE | `/api/admin/orders/{id}`               | SUPER_ADMIN                        |
| GET    | `/api/admin/customers`                 | any staff                          |
| PATCH  | `/api/admin/customers/{id}/status`     | SUPER_ADMIN/MANAGER                |
| CRUD   | `/api/admin/staff`                     | SUPER_ADMIN                        |
| CRUD   | `/api/admin/coupons`                   | SUPER_ADMIN/MANAGER                |
| CRUD   | `/api/admin/banners`                   | SUPER_ADMIN/MANAGER/EDITOR         |
| GET    | `/api/admin/reviews`, `/reviews/pending` | any staff                        |
| PATCH  | `/api/admin/reviews/{id}/status`       | SUPER_ADMIN/MANAGER/SUPPORT/EDITOR |
| DELETE | `/api/admin/reviews/{id}`              | SUPER_ADMIN/MANAGER                |

---

## Project structure
```
backend/src/main/java/com/pajedhow/backend/
├── config/        AppProperties, SecurityConfig, DataSeeder
├── controller/    Public + customer controllers
│   └── admin/     Admin controllers
├── dto/           Request/response records
├── entity/        JPA entities (+ enums, Role)
├── exception/     Custom exceptions + GlobalExceptionHandler
├── mapper/        Entity → DTO mappers
├── repository/    Spring Data repositories
├── security/      JWT service, filter, user details, principal
├── service/       Business logic
└── util/          SecurityUtils, Slugs
```

---

## Connecting the frontend

Point the Next.js app at this API (e.g. `NEXT_PUBLIC_API_URL=http://localhost:8080`) and send the JWT as a `Bearer` token. CORS already allows `http://localhost:3000` and `:5173` — add your deployed origin via `APP_CORS_ORIGINS`.

## Security notes
- Passwords hashed with BCrypt.
- Stateless JWT auth (no server sessions).
- All write operations validated with Bean Validation (`jakarta.validation`).
- Centralised error responses via `GlobalExceptionHandler` (consistent JSON shape + proper HTTP status codes).
- Set a strong `APP_JWT_SECRET` and `APP_SEED_ENABLED=false` in production.
