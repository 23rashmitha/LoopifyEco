-- ====================================================================
-- ReLoop Campus: Seed Reference Data (Roles, Categories, Departments)
-- ====================================================================

USE reloop_campus;

-- Insert Roles
INSERT INTO roles (id, role_name, description) VALUES
('role-student', 'STUDENT', 'General student body and club member. Can browse inventory and request event materials.'),
('role-organizer', 'ORGANIZER', 'Event lead or committee coordinator. Can submit reservation requests and track event readiness.'),
('role-coordinator', 'ITEM_COORDINATOR', 'Department store manager or custodian. Can approve reservations, manage stock, verify handovers/returns, and inspect items.'),
('role-admin', 'ADMIN', 'Campus facility administrator or dean. Full audit and policy permissions across all campus departments.')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Insert Item Categories
INSERT INTO item_categories (id, name, description, icon_name, estimated_replacement_cost) VALUES
('cat-disp', 'Display Boards & Partitions', 'Double-sided foam and felt boards for poster presentations and exhibition booths.', 'LayoutGrid', 45.00),
('cat-ban', 'Banners & Adjustable Stands', 'Telescopic aluminum banner frames, vertical standees, and backdrop supports.', 'Flag', 65.00),
('cat-sign', 'Signboards & Directional Stands', 'Directional campus navigation stands, podium placards, and registration signs.', 'Signpost', 28.00),
('cat-drape', 'Exhibition Backdrop & Stage Drapes', 'Flame-retardant velvet stage backdrops, partition curtains, and pipe fittings.', 'Sparkles', 85.00),
('cat-ext', 'Heavy Extension Cords & Surge Strips', 'Commercial 50ft grounded 15A cords, heavy-duty surge protectors, and cable bridges.', 'Zap', 35.00),
('cat-table', 'Registration Booth Tables & Counters', '6ft foldable commercial polyethylene tables and registration desks.', 'Table', 75.00),
('cat-light', 'Stage Spotlights & AV Equipment', 'DMX LED spotlights, portable PA stands, and projector mounts.', 'Sun', 140.00)
ON DUPLICATE KEY UPDATE name = VALUES(name), estimated_replacement_cost = VALUES(estimated_replacement_cost);

-- Insert Campus Departments
INSERT INTO departments (id, name, code, contact_email, storage_location) VALUES
('dept-mech', 'Mechanical Engineering & Central Workshop', 'MECH-WS', 'workshop@campus.edu', 'Engineering Block B, Basement Bay 3'),
('dept-sac', 'Student Activity Council', 'SAC', 'sac@campus.edu', 'Student Union Building, Room 204'),
('dept-cult', 'Cultural Affairs Committee', 'CULT', 'cultural@campus.edu', 'Auditorium Green Room & Storage Hall'),
('dept-dosa', 'Dean of Students Office', 'DOSA', 'dosa@campus.edu', 'Administrative Complex, West Wing'),
('dept-eee', 'Electrical Engineering & Tech Club', 'EEE-TECH', 'eeetech@campus.edu', 'E-Block Laboratory Storage 102')
ON DUPLICATE KEY UPDATE contact_email = VALUES(contact_email);
