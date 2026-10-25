# 🚀 Loopify Campus - Spring Boot 3.3.x Backend

Enterprise Java backend for **Loopify** (College Event Materials Reuse Platform), designed for execution in **IntelliJ IDEA**, **VS Code**, or standard terminal environments.

---

## 🛠️ Tech Stack & Architecture
- **Language & Runtime:** Java 17 or Java 21
- **Framework:** Spring Boot 3.3.4 (Spring Web, Spring Data JPA, Spring Validation)
- **Database:** MySQL 8.0+ (with automated H2 in-memory dev profile fallback)
- **Concurrency & Locking:** Pessimistic write locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) preventing double-bookings
- **Port:** `8080` (CORS configured for React frontend on port `3000` and `5173`)

---

## 💻 How to Run in IntelliJ IDEA

1. **Open Project:**
   - Launch IntelliJ IDEA.
   - Click **File** &rarr; **Open...**
   - Select the `backend` folder (or open root and choose `Open as Maven Project`).
2. **Maven Sync:**
   - IntelliJ will automatically detect `pom.xml` and download dependencies.
   - If not triggered automatically, click the **Maven** sidebar tab on the right and click the **Reload All Maven Projects** icon (🔄).
3. **Run Application:**
   - Navigate to `src/main/java/com/loopify/LoopifyApplication.java`.
   - Click the green **Run ▶** icon next to `public class LoopifyApplication` (or press `Shift + F10`).
   - The Spring Boot server will start on `http://localhost:8080`.

---

## 💻 How to Run in VS Code

1. **Install Extensions (Recommended):**
   - *Extension Pack for Java* (Microsoft)
   - *Spring Boot Extension Pack* (VMware)
2. **Open Terminal in `backend` folder:**
   ```bash
   cd backend
   ```
3. **Execute Spring Boot:**
   ```bash
   mvn clean spring-boot:run
   ```
   Or to run with the zero-config in-memory dev profile (no local MySQL needed):
   ```bash
   mvn clean spring-boot:run -Dspring-boot.run.profiles=dev
   ```

---

## 🗄️ Database Configuration

### Option A: Real MySQL 8.0 (Default Production Mode)
1. Ensure your local MySQL server is running on port `3306`.
2. Configure your MySQL credentials in `src/main/resources/application.yml` or via environment variables:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/loopify_campus?createDatabaseIfNotExist=true&useSSL=false
       username: root
       password: your_password
   ```
3. (Optional) You can execute the SQL migration scripts in `../database/scripts/`:
   - `01_create_database.sql`
   - `02_create_tables.sql`
   - `03_create_indexes.sql`
   - `04_seed_reference_data.sql`
   - `05_seed_demo_data.sql`

### Option B: Instant In-Memory H2 Dev Mode (Zero Setup)
If you don't have MySQL installed locally yet, you can run immediately:
```bash
mvn clean spring-boot:run -Dspring-boot.run.profiles=dev
```
- In IntelliJ: In the Run Configuration, add Active Profiles: `dev`.
- Data is seeded automatically by `DataInitializer.java`.
- Access H2 Web Console at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:loopify_campus`, User: `sa`, Password: blank).

---

## 🌐 Connecting React Frontend to Backend

1. In the root directory, start the React Vite app:
   ```bash
   npm run dev
   ```
2. By default, the React frontend connects to `http://localhost:8080/api/v1` via `src/services/api.ts`.
3. If the backend is running, the frontend queries real live endpoints. If running standalone, the frontend gracefully uses high-fidelity mock data.

---

## 📡 Core REST Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/inventory` | List all cataloged reusable materials across campus |
| `GET` | `/api/v1/events` | List all campus events |
| `GET` | `/api/v1/events/{id}/readiness` | **Innovation 1:** Calculate Event Reuse Readiness Score |
| `POST`| `/api/v1/reservations` | Submit material reservation request |
| `POST`| `/api/v1/reservations/{id}/approve` | Approve reservation with pessimistic write lock |
| `POST`| `/api/v1/handovers` | Log physical custody handover & condition |
| `POST`| `/api/v1/returns` | Record verified return & automatic damage triage |
| `GET` | `/api/v1/passport/{token}` | **Innovation 3:** Digital QR Reuse Passport lifecycle history |
