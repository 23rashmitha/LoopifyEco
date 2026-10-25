# ReLoop Campus: Database Architecture & Business Rules (Phase 2)

## 1. Executive Summary
ReLoop Campus is an enterprise relational database architecture for college event materials reuse, engineered for MySQL 8.0 with InnoDB. The database supports centralized inventory management, double-booking prevention, verified handovers/returns, QR Reuse Passports, and three signature innovations:
1. **Event Reuse Readiness Score**
2. **Reuse-First Decision Assistant**
3. **Reuse Chain & Lost-Opportunity Tracker**

---

## 2. The 20 Core Business Rules & Enforcement Matrix

| Rule # | Business Rule Description | Enforcement Layer | Implementation Details |
|---|---|---|---|
| **BR-01** | Inventory quantities cannot become negative. | Database Constraint | `INT UNSIGNED` column types and check constraint on all balances. |
| **BR-02** | Reservation quantities must be strictly positive (> 0). | Database Constraint | `CHECK (quantity_requested > 0)` in `reservation_items`. |
| **BR-03** | Allocations cannot exceed eligible available stock. | Service Logic + DB | Checked inside `@Transactional` method with `SELECT ... FOR UPDATE`. |
| **BR-04** | Overlapping approved reservations must not double-book. | Transactional Workflow | Temporal overlap query `startA <= endB AND startB <= endA` prevents double allocation. |
| **BR-05** | Pending requests do not consume physical stock until approved. | Service Logic | Usable pool remains available until coordinator signs off approval. |
| **BR-06** | Rejected and cancelled reservations release stock immediately. | Service Logic + DB | Reallocates reserved quantity back to usable pool. |
| **BR-07** | Inspection-pending and damaged stock cannot count as ready. | Query & Readiness Logic | Excluded in WHERE clause `lifecycle_status = 'AVAILABLE' AND usable_quantity > 0`. |
| **BR-08** | Completed repair requires post-repair inspection sign-off. | Business Workflow | Repaired stock moves to `INSPECTION_PENDING`, not directly to `AVAILABLE`. |
| **BR-09** | Handover must be recorded separately from reservation approval. | Relational Separation | `handover_records` is a distinct table from `reservations`. |
| **BR-10** | Return quantities cannot exceed quantities actually handed over. | Database + Service | Verified against `handover_records.quantity_handed_over`. |
| **BR-11** | Retired/scrapped inventory cannot be allocated for events. | Query Filter | `lifecycle_status != 'RETIRED'` enforced in repository queries. |
| **BR-12** | Item history must preserve immutable audit events. | Append-Only Event Log | `item_lifecycle_events` records timestamp, actor, and outcome. |
| **BR-13** | QR identifier must never expose confidential data or secrets. | Security Architecture | QR code contains opaque public token (e.g. `RLP-DISP-001`), resolved via API. |
| **BR-14** | User roles are assigned through normalized role model. | Normalized Schema | Many-to-many `user_roles` table with foreign keys. |
| **BR-15** | Frontend permissions are not a substitute for backend auth. | Spring Security | Endpoint authorization checked on every `/api/v1/*` route. |
| **BR-16** | Readiness score derived from eligible stock vs requirements. | Pure Pure Calculation | Readiness % = (allocatable units / total required units) * 100. |
| **BR-17** | Completed reuse counted ONLY upon verified return. | Audit Metric | Counted from `return_records`, never from reservations or checkouts. |
| **BR-18** | Unfulfilled requests and disposal must not be double counted. | Aggregation Logic | Distinct tables and grouping by event and category. |
| **BR-19** | Estimated savings distinguished from verified spending. | Reporting Transparency | Labeled explicitly with documented unit replacement catalog prices. |
| **BR-20** | Deleting account does not erase historical accountability. | Referential Integrity | Foreign keys use `ON DELETE RESTRICT` for audit and handover tables. |

---

## 3. Temporal Overlap & Concurrency Strategy
When an approval occurs:
1. `SELECT * FROM inventory_items WHERE id = ? FOR UPDATE;`
2. Recalculate all approved reservation items that overlap `[event.start_date, event.end_date]`.
3. Check `effectiveAvailable = usable_quantity - overlappingAllocated`.
4. If `effectiveAvailable < requested`, rollback and throw `InsufficientInventoryException`.
5. Update stock, persist reservation status `APPROVED`, and commit.
