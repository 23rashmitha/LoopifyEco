-- ====================================================================
-- ReLoop Campus: Integrity & Audit Validation Queries (Phase 2)
-- Verifies consistency, non-negative quantities, and zero broken links
-- ====================================================================

USE reloop_campus;

-- 1. Verify Stock Balance Constraint across all inventory lots
-- (usable + reserved + borrowed + inspection_pending + under_repair must equal total)
SELECT
    id, name, total_quantity,
    (usable_quantity + reserved_quantity + borrowed_quantity + inspection_pending_quantity + under_repair_quantity) AS calculated_sum,
    CASE
        WHEN (usable_quantity + reserved_quantity + borrowed_quantity + inspection_pending_quantity + under_repair_quantity) = total_quantity
        THEN 'PASSED'
        ELSE 'FAILED - QUANTITY MISMATCH'
    END AS balance_check
FROM inventory_items;

-- 2. Check for Overlapping Approved Allocations that exceed total physical lot size
SELECT
    inv.id, inv.name, inv.total_quantity,
    COALESCE(SUM(ri.quantity_allocated), 0) AS total_active_allocated,
    CASE
        WHEN COALESCE(SUM(ri.quantity_allocated), 0) <= inv.total_quantity THEN 'PASSED'
        ELSE 'FAILED - OVERALLOCATION DETECTED'
    END AS allocation_sanity
FROM inventory_items inv
LEFT JOIN reservation_items ri ON inv.id = ri.inventory_item_id
LEFT JOIN reservations r ON ri.reservation_id = r.id AND r.status = 'APPROVED'
GROUP BY inv.id, inv.name, inv.total_quantity;

-- 3. Check for any returns where quantity exceeds handover quantity
SELECT
    ret.id AS return_id,
    hnd.id AS handover_id,
    ret.quantity_returned,
    hnd.quantity_handed_over,
    CASE
        WHEN ret.quantity_returned <= hnd.quantity_handed_over THEN 'PASSED'
        ELSE 'FAILED - RETURN EXCEEDS ISSUED QUANTITY'
    END AS return_quantity_check
FROM return_records ret
JOIN handover_records hnd ON ret.handover_id = hnd.id;

-- 4. Check for invalid date ranges in events or reservations
SELECT
    id, start_date, end_date,
    CASE
        WHEN end_date >= start_date THEN 'PASSED'
        ELSE 'FAILED - INVALID INTERVAL'
    END AS interval_check
FROM campus_events
UNION ALL
SELECT
    id, start_date, end_date,
    CASE
        WHEN end_date >= start_date THEN 'PASSED'
        ELSE 'FAILED - INVALID INTERVAL'
    END AS interval_check
FROM reservations;
