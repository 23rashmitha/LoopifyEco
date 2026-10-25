# ReLoop Campus: Database Data Dictionary (Phase 2)

## 1. Table: `departments`
Stores academic departments, student committees, and administrative offices holding materials.

| Column | Data Type | Nullable | Key | Default | Description | Example |
|---|---|---|---|---|---|---|
| `id` | VARCHAR(64) | NO | PK | - | Stable unique department ID | `'dept-mech'` |
| `name` | VARCHAR(255) | NO | UQ | - | Full formal department title | `'Mechanical Engineering & Central Workshop'` |
| `code` | VARCHAR(32) | NO | UQ | - | Short reference code | `'MECH-WS'` |
| `contact_email` | VARCHAR(255) | NO | - | - | Custodian contact email | `'workshop@campus.edu'` |
| `storage_location` | VARCHAR(255) | NO | - | - | Default campus storage room | `'Engineering Block B, Basement Bay 3'` |
| `is_active` | BOOLEAN | NO | - | TRUE | Active status flag | `TRUE` |
| `created_at` | TIMESTAMP | NO | - | CURRENT_TIMESTAMP | Row insertion timestamp | `2026-10-25 00:00:00` |
| `updated_at` | TIMESTAMP | NO | - | CURRENT_TIMESTAMP | Last modification | `2026-10-25 00:00:00` |

---

## 2. Table: `inventory_items`
Represents physical material lots registered for campus-wide event reuse.

| Column | Data Type | Nullable | Key | Default | Description | Example |
|---|---|---|---|---|---|---|
| `id` | VARCHAR(64) | NO | PK | - | Inventory item unique ID | `'item-disp-01'` |
| `name` | VARCHAR(255) | NO | - | - | Catalog material title | `'Heavy-Duty 4x3ft Foam-Core Display Boards'` |
| `description` | TEXT | YES | - | - | Specifications & handling notes | `'Poster boards with aluminum edges and clamp stands.'` |
| `category_id` | VARCHAR(64) | NO | FK | - | Reference to `item_categories.id` | `'cat-disp'` |
| `owner_department_id` | VARCHAR(64) | NO | FK | - | Reference to `departments.id` | `'dept-mech'` |
| `storage_location` | VARCHAR(255) | NO | - | - | Specific shelf / locker / room | `'Central Workshop Rack A-12'` |
| `total_quantity` | INT UNSIGNED | NO | - | 0 | Total physical stock owned | `10` |
| `usable_quantity` | INT UNSIGNED | NO | - | 0 | Ready, unreserved stock | `6` |
| `reserved_quantity` | INT UNSIGNED | NO | - | 0 | Locked by approved reservations | `0` |
| `borrowed_quantity` | INT UNSIGNED | NO | - | 0 | Currently checked out to events | `0` |
| `inspection_pending_quantity`| INT UNSIGNED | NO | - | 0 | Awaiting condition inspection | `2` |
| `under_repair_quantity` | INT UNSIGNED | NO | - | 0 | Under repair in workshop | `2` |
| `item_condition` | ENUM | NO | - | 'GOOD' | Current physical condition grade | `'GOOD'` |
| `lifecycle_status` | ENUM | NO | - | 'AVAILABLE' | Overall asset circulation status | `'AVAILABLE'` |
| `qr_token` | VARCHAR(64) | NO | UQ | - | Public alphanumeric QR identifier | `'RLP-DISP-001'` |
| `created_at` | TIMESTAMP | NO | - | CURRENT_TIMESTAMP | Creation timestamp | `2026-10-25 00:00:00` |

---

## 3. Table: `reservations`
Tracks material requests and stock allocation decisions for campus events.

| Column | Data Type | Nullable | Key | Default | Description | Example |
|---|---|---|---|---|---|---|
| `id` | VARCHAR(64) | NO | PK | - | Reservation identifier | `'res-101'` |
| `event_id` | VARCHAR(64) | NO | FK | - | Associated campus event | `'evt-01'` |
| `requester_id` | VARCHAR(64) | NO | FK | - | Requesting user | `'usr-1'` |
| `start_date` | DATE | NO | - | - | Scheduled start of use | `'2026-11-10'` |
| `end_date` | DATE | NO | - | - | Scheduled return date | `'2026-11-12'` |
| `status` | ENUM | NO | - | 'PENDING' | Status (`PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`, `FULFILLED`) | `'APPROVED'` |
| `reviewer_id` | VARCHAR(64) | YES | FK | NULL | Coordinator who reviewed | `'usr-2'` |
| `decision_reason` | TEXT | YES | - | NULL | Approval or rejection reason | `'Verified available stock for requested dates.'` |
| `created_at` | TIMESTAMP | NO | - | CURRENT_TIMESTAMP | Submission timestamp | `2026-10-24 16:20:00` |
| `reviewed_at` | TIMESTAMP | YES | - | NULL | Decision timestamp | `2026-10-25 09:00:00` |

---

## 4. Table: `item_lifecycle_events`
Append-only chronological audit log supporting the QR Reuse Passport.

| Column | Data Type | Nullable | Key | Default | Description | Example |
|---|---|---|---|---|---|---|
| `id` | VARCHAR(64) | NO | PK | - | Event unique ID | `'life-001'` |
| `inventory_item_id` | VARCHAR(64) | NO | FK | - | Target material item | `'item-disp-01'` |
| `event_type` | ENUM | NO | - | - | Event type (`REGISTERED`, `HANDED_OVER`, `RETURNED`, `INSPECTION_COMPLETED`, etc.) | `'RETURNED'` |
| `timestamp` | TIMESTAMP | NO | - | CURRENT_TIMESTAMP | Immutable event timestamp | `2026-10-25 14:00:00` |
| `actor_name` | VARCHAR(255) | NO | - | - | Verifying coordinator or organizer | `'Priya Sharma'` |
| `actor_role` | VARCHAR(64) | NO | - | - | Actor role | `'Item Coordinator'` |
| `event_description` | TEXT | NO | - | - | Factual description of action | `'Returned all 6 boards following conference conclusion.'` |
| `quantity_involved`| INT UNSIGNED | NO | - | 1 | Units in this transaction | `6` |
| `condition_observed`| ENUM | YES | - | NULL | Condition grade at this point | `'GOOD'` |
