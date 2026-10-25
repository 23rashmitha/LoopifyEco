-- ====================================================================
-- ReLoop Campus: Optimal Indexes for Query Patterns (Phase 2)
-- ====================================================================

USE reloop_campus;

-- 1. Inventory search & category queries
CREATE INDEX idx_inv_category_status ON inventory_items (category_id, lifecycle_status);
CREATE INDEX idx_inv_dept_status ON inventory_items (owner_department_id, lifecycle_status);
CREATE INDEX idx_inv_qr ON inventory_items (qr_token);

-- 2. Event calendar queries
CREATE INDEX idx_event_dates_status ON campus_events (start_date, end_date, status);
CREATE INDEX idx_event_organizer ON campus_events (organizer_id);

-- 3. Temporal overlap reservation queries (crucial for concurrency checks)
CREATE INDEX idx_res_interval_status ON reservations (start_date, end_date, status);
CREATE INDEX idx_res_event ON reservations (event_id, status);
CREATE INDEX idx_res_requester ON reservations (requester_id, created_at);

-- 4. Reservation allocation item lookups
CREATE INDEX idx_resi_inv_res ON reservation_items (inventory_item_id, reservation_id);

-- 5. Physical custody checks
CREATE INDEX idx_hnd_res ON handover_records (reservation_id, inventory_item_id);
CREATE INDEX idx_ret_handover ON return_records (handover_id, inventory_item_id);

-- 6. Condition tracking & repair queue lookups
CREATE INDEX idx_insp_item_date ON condition_inspections (inventory_item_id, inspection_date);
CREATE INDEX idx_rep_status_item ON repair_records (status, inventory_item_id);

-- 7. Reuse passport timeline lookups
CREATE INDEX idx_life_item_time ON item_lifecycle_events (inventory_item_id, timestamp);

-- 8. Opportunity and shortage tracking
CREATE INDEX idx_unf_event_cat ON unfulfilled_requests (event_id, category_id);
