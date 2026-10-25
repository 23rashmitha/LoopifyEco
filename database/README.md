# ReLoop Campus: MySQL Database Setup & Execution Guide (Phase 2)

## 1. Prerequisites
- **MySQL 8.0+** (Community Edition or Enterprise)
- **MySQL Workbench** or MySQL CLI
- Default database port: `3306`

---

## 2. Execution Order
Execute the SQL scripts strictly in dependency order:

```bash
# 1. Create the reloop_campus database
mysql -u root -p < database/scripts/01_create_database.sql

# 2. Create normalized tables with InnoDB and foreign keys
mysql -u root -p < database/scripts/02_create_tables.sql

# 3. Create high-performance query indexes
mysql -u root -p < database/scripts/03_create_indexes.sql

# 4. Insert reference data (Roles, Categories, Departments)
mysql -u root -p < database/scripts/04_seed_reference_data.sql

# 5. Insert coherent demonstration records
mysql -u root -p < database/scripts/05_seed_demo_data.sql

# 6. Run audit and integrity validation queries
mysql -u root -p < database/scripts/06_validation_queries.sql

# 7. Run reporting and readiness queries
mysql -u root -p < database/scripts/07_reporting_queries.sql
```

---

## 3. Spring Boot Backend Connection Settings
In `backend/src/main/resources/application.yml` or via environment variables:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/reloop_campus?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: ${DB_USER:reloop_user}
    password: ${DB_PASSWORD:reloop_pass}
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: validate   # Never auto-generate or drop production schema
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQLDialect
```
