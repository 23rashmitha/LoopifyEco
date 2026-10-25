-- ====================================================================
-- ReLoop Campus: Seed Coherent Demo Data (Phase 2 DML)
-- Coherent with frontend mock dataset & realistic campus scenarios
-- ====================================================================

USE reloop_campus;

-- Users (BCrypt hashed passwords for future Spring Boot security; demo pass: password123)
INSERT INTO users (id, full_name, email, password_hash, department_id, account_status) VALUES
('usr-1', 'Alex Chen', 'alex.chen@campus.edu', '$2a$12$e80YhYvQj68q1Wv4R6Lz0e6LqWzK3M.gE8yR9bK2Y1aZ5bK1Y9.', 'dept-sac', 'ACTIVE'),
('usr-2', 'Priya Sharma', 'priya.sharma@campus.edu', '$2a$12$e80YhYvQj68q1Wv4R6Lz0e6LqWzK3M.gE8yR9bK2Y1aZ5bK1Y9.', 'dept-mech', 'ACTIVE'),
('usr-3', 'Prof. Marcus Vance', 'marcus.vance@campus.edu', '$2a$12$e80YhYvQj68q1Wv4R6Lz0e6LqWzK3M.gE8yR9bK2Y1aZ5bK1Y9.', 'dept-dosa', 'ACTIVE'),
('usr-4', 'Sophia Patel', 'sophia.patel@campus.edu', '$2a$12$e80YhYvQj68q1Wv4R6Lz0e6LqWzK3M.gE8yR9bK2Y1aZ5bK1Y9.', 'dept-cult', 'ACTIVE')
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name);

-- User Role Assignments
INSERT INTO user_roles (user_id, role_id) VALUES
('usr-1', 'role-organizer'),
('usr-2', 'role-coordinator'),
('usr-3', 'role-admin'),
('usr-4', 'role-student')
ON DUPLICATE KEY UPDATE assigned_at = CURRENT_TIMESTAMP;

-- Inventory Items (Ensures total_quantity = usable + reserved + borrowed + inspection_pending + under_repair)
INSERT INTO inventory_items (
    id, name, description, category_id, owner_department_id, storage_location,
    total_quantity, usable_quantity, reserved_quantity, borrowed_quantity,
    inspection_pending_quantity, under_repair_quantity, item_condition, lifecycle_status, qr_token
) VALUES
('item-disp-01', 'Heavy-Duty 4x3ft Foam-Core Display Boards', 'Presentation poster boards with aluminum edges and clamp stands.', 'cat-disp', 'dept-mech', 'Central Workshop Rack A-12', 10, 6, 0, 0, 2, 2, 'GOOD', 'AVAILABLE', 'RLP-DISP-001'),
('item-ban-01', 'Telescopic Aluminum Roll-Up Banner Stands', 'Adjustable height (6ft to 8ft) stands with weighted steel base.', 'cat-ban', 'dept-sac', 'SAC Hub Locker Bay 4', 8, 6, 2, 0, 0, 0, 'EXCELLENT', 'AVAILABLE', 'RLP-BAN-002'),
('item-sign-01', 'Directional Campus Wayfinding Signboards', 'Double-sided insertable directional signs with stable rubber bases.', 'cat-sign', 'dept-dosa', 'Admin West Wing Archive Hall', 6, 6, 0, 0, 0, 0, 'GOOD', 'AVAILABLE', 'RLP-SIGN-003'),
('item-ext-01', 'Commercial 50ft 15A Heavy Extension Cords & Bridges', 'Lighted triple-tap yellow rubber cords with safety rubber ramps.', 'cat-ext', 'dept-eee', 'E-Block Laboratory Storage 102', 12, 10, 0, 2, 0, 0, 'EXCELLENT', 'AVAILABLE', 'RLP-EXT-004'),
('item-drape-01', 'Burgundy Velvet Stage Backdrop & Pipe Frame Kit', 'Modular 10x8ft pipe and drape sets with blackout flame-resistant drape.', 'cat-drape', 'dept-cult', 'Auditorium Green Room Cage B', 8, 7, 0, 0, 1, 0, 'GOOD', 'AVAILABLE', 'RLP-DRP-005'),
('item-table-01', '6ft Foldable High-Density Registration Tables', 'White polyethylene commercial folding tables with locking legs.', 'cat-table', 'dept-sac', 'Student Union Basement Storage', 14, 10, 4, 0, 0, 0, 'GOOD', 'AVAILABLE', 'RLP-TBL-006'),
('item-light-01', 'Chauvet DMX RGBW Stage LED Par Cans', 'Color-mixing spotlights with barn doors and 3-pin DMX linking cables.', 'cat-light', 'dept-cult', 'Auditorium Green Room AV Rack', 6, 4, 0, 0, 0, 2, 'GOOD', 'AVAILABLE', 'RLP-LGT-007')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Campus Events
INSERT INTO campus_events (id, name, description, organizer_id, department_id, start_date, end_date, venue, status) VALUES
('evt-01', 'EnGenius 2026: Annual Technical Symposium & Hackathon', '3-day campus-wide technology festival with 45 project booths.', 'usr-1', 'dept-sac', '2026-11-10', '2026-11-12', 'Campus Sports & Convention Complex', 'PLANNING'),
('evt-02', 'EcoVerve Campus Sustainability Conclave', 'Inter-collegiate environmental summit and student project fair.', 'usr-4', 'dept-cult', '2026-11-18', '2026-11-19', 'Main University Auditorium', 'APPROVED'),
('evt-03', 'National Robotics League Qualifier', 'Autonomous robotics competition arenas and pit garage stations.', 'usr-1', 'dept-eee', '2026-12-05', '2026-12-07', 'Indoor Athletic Arena', 'PLANNING')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Event Material Requirements
INSERT INTO event_material_requirements (id, event_id, category_id, requested_quantity, specification_notes) VALUES
('req-01-disp', 'evt-01', 'cat-disp', 10, '36x48 poster boards for student competition booths.'),
('req-01-ban', 'evt-01', 'cat-ban', 4, 'Entrance hall welcome banners.'),
('req-01-ext', 'evt-01', 'cat-ext', 6, 'Hackathon workstation power drops with safety bridge covers.'),
('req-01-sign', 'evt-01', 'cat-sign', 4, 'Wayfinding between main gate and convention complex.'),
('req-02-drape', 'evt-02', 'cat-drape', 6, 'Stage framing for plenary speaker sessions.'),
('req-02-ban', 'evt-02', 'cat-ban', 3, 'Keynote and workshop banners.'),
('req-02-light', 'evt-02', 'cat-light', 4, 'Accent stage lighting.')
ON DUPLICATE KEY UPDATE requested_quantity = VALUES(requested_quantity);

-- Reservations
INSERT INTO reservations (id, event_id, requester_id, start_date, end_date, status, reviewer_id, decision_reason) VALUES
('res-101', 'evt-02', 'usr-4', '2026-11-18', '2026-11-19', 'APPROVED', 'usr-2', 'Verified available stock for requested dates. No conflicting allocations.'),
('res-102', 'evt-01', 'usr-1', '2026-11-10', '2026-11-12', 'PENDING', NULL, NULL)
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- Reservation Items
INSERT INTO reservation_items (id, reservation_id, inventory_item_id, quantity_requested, quantity_allocated, status) VALUES
('resi-1', 'res-101', 'item-ban-01', 2, 2, 'ALLOCATED'),
('resi-2', 'res-102', 'item-disp-01', 6, 6, 'ALLOCATED'),
('resi-3', 'res-102', 'item-ban-01', 4, 4, 'ALLOCATED'),
('resi-4', 'res-102', 'item-ext-01', 6, 6, 'ALLOCATED')
ON DUPLICATE KEY UPDATE quantity_allocated = VALUES(quantity_allocated);

-- Handover Records
INSERT INTO handover_records (id, reservation_id, event_id, inventory_item_id, quantity_handed_over, released_by_user_id, received_by_user_id, initial_condition, notes) VALUES
('hnd-01', 'res-101', 'evt-02', 'item-ext-01', 2, 'usr-2', 'usr-1', 'EXCELLENT', 'Checked plug pins and jackets. Both verified working.')
ON DUPLICATE KEY UPDATE quantity_handed_over = VALUES(quantity_handed_over);

-- Return Records (Verified completed reuse)
INSERT INTO return_records (id, handover_id, reservation_id, inventory_item_id, quantity_returned, received_by_user_id, returned_by_user_id, return_condition, is_complete_return, requires_inspection, notes) VALUES
('ret-01', 'hnd-01', 'res-101', 'item-disp-01', 6, 'usr-2', 'usr-1', 'GOOD', TRUE, FALSE, 'All 6 boards returned clean. Re-racked in Central Workshop.')
ON DUPLICATE KEY UPDATE quantity_returned = VALUES(quantity_returned);

-- Inspections
INSERT INTO condition_inspections (id, inventory_item_id, inspector_id, previous_condition, assessed_condition, recommended_status, notes) VALUES
('insp-01', 'item-disp-01', 'usr-2', 'MINOR_WEAR', 'GOOD', 'AVAILABLE', 'Inspected 2 boards from storage. Frame screws tightened, faces cleaned.'),
('insp-02', 'item-drape-01', 'usr-2', 'GOOD', 'MINOR_WEAR', 'AVAILABLE', 'Minor scuffing on base plate. Acoustic velvet fabric fully intact.')
ON DUPLICATE KEY UPDATE notes = VALUES(notes);

-- Repairs
INSERT INTO repair_records (id, inventory_item_id, damage_description, assigned_to, status, repair_cost, notes) VALUES
('rep-01', 'item-disp-01', 'Corner aluminum trim loose and base clamp thumb screw stripped.', 'Mechanical Workshop Apprentice Crew', 'IN_PROGRESS', 18.50, 'Re-tapping thumb screw thread and re-riveting corner channel.'),
('rep-02', 'item-light-01', 'DMX input port loose on one fixture; powerCON passthrough intermittent.', 'EEE Hardware Repair Desk', 'REPORTED', 35.00, 'Awaiting replacement 3-pin XLR chassis connectors.')
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- Item Lifecycle Events (Reuse Passport)
INSERT INTO item_lifecycle_events (id, inventory_item_id, event_type, actor_name, actor_role, event_description, quantity_involved, condition_observed) VALUES
('evt-life-01', 'item-disp-01', 'REGISTERED', 'Priya Sharma', 'Item Coordinator', 'Cataloged 10 newly acquired heavy-duty foam-core display boards for campus event sharing.', 10, 'EXCELLENT'),
('evt-life-02', 'item-disp-01', 'HANDED_OVER', 'Priya Sharma', 'Item Coordinator', 'Issued 6 boards to Department of Computer Science for IEEE Student Conference.', 6, 'GOOD'),
('evt-life-03', 'item-disp-01', 'RETURNED', 'Alex Chen', 'Organizer', 'Returned all 6 boards following conference conclusion. Verified completed reuse cycle.', 6, 'GOOD'),
('evt-life-04', 'item-disp-01', 'DAMAGE_REPORTED', 'Priya Sharma', 'Item Coordinator', 'Flagged 2 boards during routine quarterly stock audit with loose corner trim. Routed to workshop repair.', 2, 'DAMAGED_REPAIRABLE'),
('evt-life-05', 'item-disp-01', 'INSPECTION_COMPLETED', 'Priya Sharma', 'Item Coordinator', 'Inspected 2 boards awaiting verification. Condition certified as GOOD, returned to active usable pool.', 2, 'GOOD')
ON DUPLICATE KEY UPDATE event_description = VALUES(event_description);

-- Unfulfilled Demand Requests
INSERT INTO unfulfilled_requests (id, event_id, category_id, requested_quantity, fulfilled_quantity, shortage_quantity, shortage_reason) VALUES
('unf-01', 'evt-01', 'cat-disp', 18, 10, 8, 'Campus-wide shortage during peak mid-semester exhibition rush.'),
('unf-02', 'evt-02', 'cat-light', 8, 4, 4, '2 units in repair and 2 units already in active use by Drama Dept.')
ON DUPLICATE KEY UPDATE shortage_quantity = VALUES(shortage_quantity);
