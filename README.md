# Loopify Campus
> **"Before buying new, discover what your campus can reuse."**  
> A Verified, Intelligent Reuse System for College Event Materials

---

## 1. Executive Summary & Status
**Loopify Campus** is a centralized, production-grade campus materials reuse platform connecting students, student activity councils, academic departments, and event coordinators. It eliminates duplicate purchasing for college fests, technical exhibitions, and seminars by making existing campus equipment discoverable, reservable, and verifiable.

### System Readiness Audit: 100% Complete Across All 3 Layers
| Layer | Tech Stack | Status | Execution Environment |
|---|---|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS | **100% Complete** | VS Code / IntelliJ / Terminal (`npm run dev`) |
| **Backend** | Java 17+, Spring Boot 3.3.4, Spring Data JPA | **100% Complete** | VS Code / IntelliJ IDEA / Maven (`mvn spring-boot:run`) |
| **Database** | MySQL 8.0+ / H2 In-Memory (Zero Setup) | **100% Complete** | Pre-seeded SQL scripts or auto-seeded H2 |

---

## 2. The Three Signature Innovations
1. **Event Reuse Readiness Score:** Compares event demands against usable, date-compatible inventory to calculate what percentage can be fulfilled through campus reuse before purchasing.
2. **Reuse-First Decision Assistant:** An intelligent, rule-based recommendation engine offering concrete next steps: reuse existing stock, inspect pending units, repair workshop items, or purchase only confirmed shortages.
3. **Reuse Chain & Lost-Opportunity Tracker:** Unique QR codes unlock an immutable lifecycle passport showing checkouts, returns, repairs, and verified reuse count. Unfulfilled demands are tracked to help deans plan future resource stockpiles.

---

## 3. Running in VS Code (Quickest Path)

### Step 1: Run Frontend
Open the terminal in VS Code (`Ctrl + ~` or `Cmd + ~`):
```bash
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### Step 2: Run Spring Boot Backend
You have two execution methods in VS Code:

#### Method A: Using VS Code Run/Debug (Press `F5`)
1. Ensure the **Extension Pack for Java** and **Spring Boot Tools** extensions are installed.
2. Press `F5` or open the **Run & Debug** tab on the left.
3. Select **"Spring Boot - Loopify Backend (H2 Dev Profile)"** and click play.  
   *(Requires zero external database setup—auto-provisions and auto-seeds all data in memory!)*
4. Backend will start on **`http://localhost:8080/api/v1`**.

#### Method B: Using Terminal with Maven
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```
*(Or use `mvn spring-boot:run` to connect to a live local MySQL instance).*

---

## 4. Running in IntelliJ IDEA

1. **Open Backend:**
   - In IntelliJ IDEA, click **File > Open** and select the `/backend` folder (or open the root repository).
   - IntelliJ will automatically detect `backend/pom.xml` as a Maven project and sync dependencies.
2. **Run Spring Boot:**
   - Navigate to `src/main/java/com/loopify/LoopifyApplication.java`.
   - Click the green **Run** arrow next to `public static void main(String[] args)`.
   - **Tip for zero-config run:** In Run Configurations, set Active Profile to `dev` to run with embedded H2 + auto-seeding.
3. **Open Frontend:**
   - Open IntelliJ's built-in terminal and run `npm run dev`.

---

## 5. Database Architecture & Setup

### Option A: Zero Configuration (Built-in H2 Mode)
When running with the `dev` profile (`-Dspring-boot.run.profiles=dev`), Spring Boot automatically boots an in-memory database and executes `DataInitializer.java` to seed campus departments, categories, inventory items, events, and reservations. No MySQL installation required!

### Option B: Local MySQL 8.0+ Instance
To run against standard MySQL:
1. Ensure MySQL is running on `localhost:3306`.
2. Execute the scripts in `database/scripts/` in sequential order:
   - `01_create_database.sql` &mdash; Creates `loopify_campus` schema
   - `02_create_tables.sql` &mdash; Creates all 9 normalized relational tables with foreign keys and check constraints
   - `03_create_indexes.sql` &mdash; Optimizes search, category, status, and barcode queries
   - `04_seed_reference_data.sql` &mdash; Campus departments, venues, and item categories
   - `05_seed_demo_data.sql` &mdash; Realistic campus inventory, events, and reservations
   - `06_validation_queries.sql` &mdash; Verifies data integrity
   - `07_reporting_queries.sql` &mdash; Campus reuse reporting analytics
3. Adjust credentials in `backend/src/main/resources/application.yml` (default: username `root`, password `root`).

---

## 6. Key Application Routes

- `/` &mdash; Public Landing Page with interactive Readiness Calculator Simulator
- `/dashboard` &mdash; Main Dashboard with KPI cards, signature readiness card, and impact metrics
- `/inventory` &mdash; Centralized Reusable Material Catalog with search, multi-filters, grid/table view
- `/inventory/new` &mdash; Register new reusable materials
- `/events` &mdash; Campus events with live reuse readiness scores
- `/events/new` &mdash; Event planner with dynamic material requirement lines builder
- `/events/:id/readiness` &mdash; **Signature Screen: Readiness Score & Decision Assistant**
- `/reservations` &mdash; Request approval pipeline with pessimistic concurrency locking
- `/handover` &mdash; Physical custody handover & return verification
- `/passport` &mdash; **Innovation 3: QR Reuse Passport & Item Journey**
- `/inspections` &mdash; Condition tracking & coordinator sign-off hub
- `/repairs` &mdash; Central Workshop repair maintenance queue
- `/reports` &mdash; Lost opportunity and unfulfilled demand analytics
- `/specs` &mdash; Interactive viewer for MySQL Schema, ER diagrams, and Spring Boot REST APIs

---

## 7. Testing & Verification

- **Frontend Verification:** `npm run lint` and `npm run build` verify TypeScript types and bundle integrity.
- **Backend Unit & Logic Tests:** `mvn test` in `/backend` verifies repository locks, readiness calculations, and REST controllers.
- **Readiness Logic:** `src/utils/readiness.test.ts` contains mathematical assertion tests for the readiness score algorithm.
