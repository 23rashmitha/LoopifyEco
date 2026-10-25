-- ====================================================================
-- ReLoop Campus: Analytical & Reporting Queries (Phase 2)
-- Powers Event Readiness, Reuse Opportunity & Department Reports
-- ====================================================================

USE reloop_campus;

-- 1. Inventory Summary by Category & Department
SELECT
    cat.name AS category_name,
    dept.name AS department_name,
    COUNT(inv.id) AS lot_count,
    SUM(inv.total_quantity) AS total_units,
    SUM(inv.usable_quantity) AS usable_ready_units,
    SUM(inv.inspection_pending_quantity) AS inspection_pending_units,
    SUM(inv.under_repair_quantity) AS under_repair_units
FROM inventory_items inv
JOIN item_categories cat ON inv.category_id = cat.id
JOIN departments dept ON inv.owner_department_id = dept.id
GROUP BY cat.name, dept.name
ORDER BY cat.name, dept.name;

-- 2. Event Reuse Readiness Inputs Query (for Event evt-01)
-- Matches event requirements with currently allocatable unreserved stock
SELECT
    req.id AS requirement_id,
    cat.name AS category_name,
    req.requested_quantity,
    COALESCE(SUM(inv.usable_quantity), 0) AS category_stock_ready,
    LEAST(req.requested_quantity, COALESCE(SUM(inv.usable_quantity), 0)) AS allocatable_units,
    GREATEST(0, req.requested_quantity - LEAST(req.requested_quantity, COALESCE(SUM(inv.usable_quantity), 0))) AS shortage_units,
    COALESCE(SUM(inv.inspection_pending_quantity), 0) AS pending_inspection_units
FROM event_material_requirements req
JOIN item_categories cat ON req.category_id = cat.id
LEFT JOIN inventory_items inv ON inv.category_id = req.category_id AND inv.lifecycle_status = 'AVAILABLE'
WHERE req.event_id = 'evt-01'
GROUP BY req.id, cat.name, req.requested_quantity;

-- 3. Verified Completed Reuses & Avoided Procurement Spend
-- Strictly joins verified returns with category replacement price
SELECT
    cat.name AS category_name,
    SUM(ret.quantity_returned) AS verified_reused_units,
    cat.estimated_replacement_cost,
    SUM(ret.quantity_returned * cat.estimated_replacement_cost) AS total_avoided_spend
FROM return_records ret
JOIN inventory_items inv ON ret.inventory_item_id = inv.id
JOIN item_categories cat ON inv.category_id = cat.id
GROUP BY cat.name, cat.estimated_replacement_cost
ORDER BY total_avoided_spend DESC;

-- 4. Lost Opportunity & Recurring Shortages Bottlenecks
SELECT
    cat.name AS category_name,
    COUNT(unf.id) AS incidents_count,
    SUM(unf.shortage_quantity) AS total_unmet_units,
    GROUP_CONCAT(DISTINCT unf.shortage_reason SEPARATOR ' | ') AS reported_reasons
FROM unfulfilled_requests unf
JOIN item_categories cat ON unf.category_id = cat.id
GROUP BY cat.name
ORDER BY total_unmet_units DESC;

-- 5. Complete Reuse Passport Chronological Journey for an Item (e.g. item-disp-01)
SELECT
    evt.timestamp,
    evt.event_type,
    evt.actor_name,
    evt.actor_role,
    evt.event_description,
    evt.quantity_involved,
    evt.condition_observed
FROM item_lifecycle_events evt
WHERE evt.inventory_item_id = 'item-disp-01'
ORDER BY evt.timestamp ASC;
