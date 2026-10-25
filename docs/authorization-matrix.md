# ReLoop Campus: Role-Based Access Control (RBAC) & Authorization Matrix

This document defines the server-side authorization boundaries enforced by Spring Security and checked in the React frontend.

---

## Roles Overview
1. **STUDENT:** General campus user or club member. Can search verified catalog, view event schedules, and view public Reuse Passports.
2. **ORGANIZER:** Lead organizer or committee head. Can create events, enter material requirements, view readiness scores, run Decision Assistant, and submit reservation requests.
3. **ITEM_COORDINATOR:** Department store manager or workshop custodian. Can manage inventory, approve/reject reservations, execute physical checkouts and returns, conduct condition inspections, and triage repairs.
4. **ADMIN:** Campus Dean of Students or Facilities Administrator. Full system oversight, audit logs, disposal authorization, and campus-wide opportunity analytics.

---

## Detailed Permissions Matrix

| Resource / Action | STUDENT | ORGANIZER | ITEM_COORDINATOR | ADMIN | Enforcement Mechanism |
|---|:---:|:---:|:---:|:---:|---|
| **Browse / Search Inventory** | YES | YES | YES | YES | `permitAll()` public endpoint |
| **View Item Details & QR Passport** | YES | YES | YES | YES | `permitAll()` public endpoint |
| **Register New Inventory Item** | NO | NO | YES | YES | `@PreAuthorize("hasAnyRole('ITEM_COORDINATOR', 'ADMIN')")` |
| **Update Item Status / Location** | NO | NO | YES | YES | Checked against owning department |
| **Create Campus Event & Needs** | NO | YES | YES | YES | `@PreAuthorize("hasAnyRole('ORGANIZER', 'ITEM_COORDINATOR', 'ADMIN')")` |
| **View Reuse Readiness Score** | YES | YES | YES | YES | Calculation endpoint |
| **Run Decision Assistant** | YES | YES | YES | YES | Recommendation engine |
| **Submit Reservation Request** | NO | YES | YES | YES | Checked against event organizer |
| **Approve / Reject Reservation** | NO | NO | YES | YES | `@PreAuthorize("hasAnyRole('ITEM_COORDINATOR', 'ADMIN')")` |
| **Verify Physical Handover** | NO | NO | YES | YES | Custodian sign-off required |
| **Verify Return & Condition** | NO | NO | YES | YES | Custodian sign-off required |
| **Conduct Condition Inspection** | NO | NO | YES | YES | `@PreAuthorize("hasAnyRole('ITEM_COORDINATOR', 'ADMIN')")` |
| **Update Repair Record** | NO | NO | YES | YES | Central Workshop assigned |
| **View Opportunity Report** | YES | YES | YES | YES | Aggregated data |
| **Decommission / Retire Asset** | NO | NO | NO | YES | `@PreAuthorize("hasRole('ADMIN')")` |
