# ReLoop Campus: REST API Documentation (Phase 3 & 4)

Base URL: `http://localhost:8080/api/v1` (or local simulated reactive engine)

All endpoints return JSON responses. Errors use standard HTTP codes with a standardized body:
```json
{
  "timestamp": "2026-10-25T12:00:00Z",
  "status": 409,
  "error": "INSUFFICIENT_INVENTORY",
  "message": "Stock conflict: Only 6 units available for dates 2026-11-10 to 2026-11-12, but 10 requested.",
  "path": "/api/v1/reservations/res-101/approve"
}
```

---

## 1. Authentication & Users
- `POST /api/v1/auth/login` &mdash; Authenticates user and returns JWT bearer token.
- `POST /api/v1/auth/register` &mdash; Register new user account.
- `GET /api/v1/auth/me` &mdash; Retrieve current user profile and assigned roles.

## 2. Reusable Inventory
- `GET /api/v1/inventory` &mdash; Query inventory with search text, category, department, and condition filters.
- `POST /api/v1/inventory` &mdash; Register new material lot and assign QR code identifier.
- `GET /api/v1/inventory/{id}` &mdash; Retrieve detailed material specifications, condition, and active allocations.
- `GET /api/v1/inventory/qr/{token}` &mdash; Public endpoint resolving QR code to item details and Reuse Passport.

## 3. Events & Material Demands
- `GET /api/v1/events` &mdash; List upcoming and past campus events.
- `POST /api/v1/events` &mdash; Create event and define required material lines.
- `GET /api/v1/events/{id}/readiness` &mdash; Calculate live **Event Reuse Readiness Score**.
- `GET /api/v1/events/{id}/reuse-recommendations` &mdash; Retrieve **Reuse-First Decision Assistant** recommendations.

## 4. Reservations & Stock Allocations
- `GET /api/v1/reservations` &mdash; List reservations filtered by status.
- `POST /api/v1/reservations` &mdash; Submit material reservation.
- `PATCH /api/v1/reservations/{id}/approve` &mdash; Transactional approval with pessimistic stock locking.
- `PATCH /api/v1/reservations/{id}/reject` &mdash; Reject reservation with reason.
- `PATCH /api/v1/reservations/{id}/cancel` &mdash; Cancel reservation and release stock.

## 5. Physical Custody Handover & Return
- `POST /api/v1/reservations/{id}/handover` &mdash; Record physical checkout, custodian, and condition check.
- `POST /api/v1/reservations/{id}/return` &mdash; Verify physical return and log verified completed reuse.

## 6. Inspections & Repairs
- `POST /api/v1/inventory/{id}/inspections` &mdash; Record condition inspection sign-off.
- `GET /api/v1/repairs` &mdash; List workshop maintenance queue.
- `PATCH /api/v1/repairs/{id}/status` &mdash; Update repair status.

## 7. Reports & Analytics
- `GET /api/v1/reports/summary` &mdash; High-level circulation metrics.
- `GET /api/v1/reports/unfulfilled-demand` &mdash; Lost opportunity and shortage analytics.
- `GET /api/v1/inventory/{id}/reuse-passport` &mdash; Chronological lifecycle timeline.
