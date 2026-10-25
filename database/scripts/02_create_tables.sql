-- ====================================================================
-- ReLoop Campus: Table Definitions (Phase 2 DDL)
-- Target: MySQL 8.0+ / InnoDB
-- ====================================================================

USE reloop_campus;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS item_lifecycle_events;
DROP TABLE IF EXISTS repair_records;
DROP TABLE IF EXISTS condition_inspections;
DROP TABLE IF EXISTS return_records;
DROP TABLE IF EXISTS handover_records;
DROP TABLE IF EXISTS reservation_items;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS unfulfilled_requests;
DROP TABLE IF EXISTS event_material_requirements;
DROP TABLE IF EXISTS campus_events;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS item_categories;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS departments;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Departments / Organizational Units
CREATE TABLE departments (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    code VARCHAR(32) NOT NULL UNIQUE,
    contact_email VARCHAR(255) NOT NULL,
    storage_location VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users Table
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department_id VARCHAR(64) NOT NULL,
    account_status ENUM('ACTIVE', 'SUSPENDED', 'DEACTIVATED') NOT NULL DEFAULT 'ACTIVE',
    avatar_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Roles Table
CREATE TABLE roles (
    id VARCHAR(64) PRIMARY KEY,
    role_name VARCHAR(64) NOT NULL UNIQUE,
    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. User Roles Junction Table
CREATE TABLE user_roles (
    user_id VARCHAR(64) NOT NULL,
    role_id VARCHAR(64) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Item Categories Table
CREATE TABLE item_categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL UNIQUE,
    description TEXT,
    icon_name VARCHAR(64) DEFAULT 'Boxes',
    estimated_replacement_cost DECIMAL(10,2) NOT NULL DEFAULT 50.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Inventory Items (Lots) Table
CREATE TABLE inventory_items (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(64) NOT NULL,
    owner_department_id VARCHAR(64) NOT NULL,
    storage_location VARCHAR(255) NOT NULL,
    total_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    usable_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    reserved_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    borrowed_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    inspection_pending_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    under_repair_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    item_condition ENUM('EXCELLENT', 'GOOD', 'MINOR_WEAR', 'DAMAGED_REPAIRABLE', 'UNUSABLE') NOT NULL DEFAULT 'GOOD',
    lifecycle_status ENUM('AVAILABLE', 'RESERVED', 'BORROWED', 'INSPECTION_PENDING', 'UNDER_REPAIR', 'RETIRED') NOT NULL DEFAULT 'AVAILABLE',
    qr_token VARCHAR(64) NOT NULL UNIQUE,
    image_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_qty_balance CHECK (usable_quantity + reserved_quantity + borrowed_quantity + inspection_pending_quantity + under_repair_quantity = total_quantity),
    CONSTRAINT fk_inv_category FOREIGN KEY (category_id) REFERENCES item_categories(id) ON DELETE RESTRICT,
    CONSTRAINT fk_inv_department FOREIGN KEY (owner_department_id) REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Campus Events Table
CREATE TABLE campus_events (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    organizer_id VARCHAR(64) NOT NULL,
    department_id VARCHAR(64) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    venue VARCHAR(255) NOT NULL,
    status ENUM('DRAFT', 'PLANNING', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PLANNING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_evt_dates CHECK (end_date >= start_date),
    CONSTRAINT fk_evt_organizer FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_evt_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Event Material Requirements
CREATE TABLE event_material_requirements (
    id VARCHAR(64) PRIMARY KEY,
    event_id VARCHAR(64) NOT NULL,
    category_id VARCHAR(64) NOT NULL,
    requested_quantity INT UNSIGNED NOT NULL,
    specification_notes TEXT,
    fulfilled_quantity INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_req_qty CHECK (requested_quantity > 0),
    CONSTRAINT fk_emr_event FOREIGN KEY (event_id) REFERENCES campus_events(id) ON DELETE CASCADE,
    CONSTRAINT fk_emr_category FOREIGN KEY (category_id) REFERENCES item_categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Reservations Table
CREATE TABLE reservations (
    id VARCHAR(64) PRIMARY KEY,
    event_id VARCHAR(64) NOT NULL,
    requester_id VARCHAR(64) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'FULFILLED') NOT NULL DEFAULT 'PENDING',
    reviewer_id VARCHAR(64),
    decision_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_res_dates CHECK (end_date >= start_date),
    CONSTRAINT fk_res_event FOREIGN KEY (event_id) REFERENCES campus_events(id) ON DELETE RESTRICT,
    CONSTRAINT fk_res_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_res_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Reservation Items (Allocation Lines) Table
CREATE TABLE reservation_items (
    id VARCHAR(64) PRIMARY KEY,
    reservation_id VARCHAR(64) NOT NULL,
    inventory_item_id VARCHAR(64) NOT NULL,
    quantity_requested INT UNSIGNED NOT NULL,
    quantity_allocated INT UNSIGNED NOT NULL DEFAULT 0,
    status ENUM('ALLOCATED', 'SHORTAGE', 'PENDING') NOT NULL DEFAULT 'PENDING',
    CONSTRAINT chk_resi_qty CHECK (quantity_requested > 0),
    CONSTRAINT fk_ri_reservation FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    CONSTRAINT fk_ri_inventory FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Handover Records Table (Physical Checkout)
CREATE TABLE handover_records (
    id VARCHAR(64) PRIMARY KEY,
    reservation_id VARCHAR(64) NOT NULL,
    event_id VARCHAR(64) NOT NULL,
    inventory_item_id VARCHAR(64) NOT NULL,
    quantity_handed_over INT UNSIGNED NOT NULL,
    released_by_user_id VARCHAR(64) NOT NULL,
    received_by_user_id VARCHAR(64) NOT NULL,
    handover_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    initial_condition ENUM('EXCELLENT', 'GOOD', 'MINOR_WEAR', 'DAMAGED_REPAIRABLE', 'UNUSABLE') NOT NULL,
    notes TEXT,
    CONSTRAINT chk_hnd_qty CHECK (quantity_handed_over > 0),
    CONSTRAINT fk_hnd_reservation FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE RESTRICT,
    CONSTRAINT fk_hnd_item FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT,
    CONSTRAINT fk_hnd_releaser FOREIGN KEY (released_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_hnd_receiver FOREIGN KEY (received_by_user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Return Records Table (Verified Returns)
CREATE TABLE return_records (
    id VARCHAR(64) PRIMARY KEY,
    handover_id VARCHAR(64) NOT NULL,
    reservation_id VARCHAR(64) NOT NULL,
    inventory_item_id VARCHAR(64) NOT NULL,
    quantity_returned INT UNSIGNED NOT NULL,
    received_by_user_id VARCHAR(64) NOT NULL,
    returned_by_user_id VARCHAR(64) NOT NULL,
    return_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_condition ENUM('EXCELLENT', 'GOOD', 'MINOR_WEAR', 'DAMAGED_REPAIRABLE', 'UNUSABLE') NOT NULL,
    is_complete_return BOOLEAN NOT NULL DEFAULT TRUE,
    requires_inspection BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    CONSTRAINT chk_ret_qty CHECK (quantity_returned > 0),
    CONSTRAINT fk_ret_handover FOREIGN KEY (handover_id) REFERENCES handover_records(id) ON DELETE RESTRICT,
    CONSTRAINT fk_ret_item FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT,
    CONSTRAINT fk_ret_receiver FOREIGN KEY (received_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_ret_returner FOREIGN KEY (returned_by_user_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Condition Inspections Table
CREATE TABLE condition_inspections (
    id VARCHAR(64) PRIMARY KEY,
    inventory_item_id VARCHAR(64) NOT NULL,
    inspector_id VARCHAR(64) NOT NULL,
    inspection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    previous_condition ENUM('EXCELLENT', 'GOOD', 'MINOR_WEAR', 'DAMAGED_REPAIRABLE', 'UNUSABLE') NOT NULL,
    assessed_condition ENUM('EXCELLENT', 'GOOD', 'MINOR_WEAR', 'DAMAGED_REPAIRABLE', 'UNUSABLE') NOT NULL,
    recommended_status ENUM('AVAILABLE', 'UNDER_REPAIR', 'RETIRED') NOT NULL,
    notes TEXT NOT NULL,
    components_intact BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_insp_item FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT,
    CONSTRAINT fk_insp_inspector FOREIGN KEY (inspector_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Repair Records Table
CREATE TABLE repair_records (
    id VARCHAR(64) PRIMARY KEY,
    inventory_item_id VARCHAR(64) NOT NULL,
    damage_description TEXT NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    status ENUM('REPORTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'REPORTED',
    reported_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP NULL,
    repair_cost DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    CONSTRAINT fk_rep_item FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Item Lifecycle Events (Reuse Passport Timeline)
CREATE TABLE item_lifecycle_events (
    id VARCHAR(64) PRIMARY KEY,
    inventory_item_id VARCHAR(64) NOT NULL,
    event_type ENUM('REGISTERED', 'RESERVATION_ALLOCATED', 'HANDED_OVER', 'RETURNED', 'INSPECTION_COMPLETED', 'DAMAGE_REPORTED', 'REPAIR_STARTED', 'REPAIR_VERIFIED', 'RETIRED') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(64) NOT NULL,
    event_description TEXT NOT NULL,
    quantity_involved INT UNSIGNED NOT NULL DEFAULT 1,
    related_event_name VARCHAR(255),
    condition_observed ENUM('EXCELLENT', 'GOOD', 'MINOR_WEAR', 'DAMAGED_REPAIRABLE', 'UNUSABLE'),
    CONSTRAINT fk_life_item FOREIGN KEY (inventory_item_id) REFERENCES inventory_items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Unfulfilled Requests Table (Lost-Opportunity Tracking)
CREATE TABLE unfulfilled_requests (
    id VARCHAR(64) PRIMARY KEY,
    event_id VARCHAR(64) NOT NULL,
    category_id VARCHAR(64) NOT NULL,
    requested_quantity INT UNSIGNED NOT NULL,
    fulfilled_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    shortage_quantity INT UNSIGNED NOT NULL,
    shortage_reason TEXT NOT NULL,
    recorded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_unf_qty CHECK (shortage_quantity > 0),
    CONSTRAINT fk_unf_event FOREIGN KEY (event_id) REFERENCES campus_events(id) ON DELETE CASCADE,
    CONSTRAINT fk_unf_category FOREIGN KEY (category_id) REFERENCES item_categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
