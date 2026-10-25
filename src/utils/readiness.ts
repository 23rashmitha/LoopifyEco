import {
  CampusEvent,
  InventoryItem,
  Reservation,
  ReadinessCalculation,
  RequirementReadinessDetail,
} from '../types';

/**
 * Checks if two date ranges overlap.
 * Both ranges are assumed inclusive for event duration.
 * Two intervals [startA, endA] and [startB, endB] overlap if:
 * startA <= endB and startB <= endA.
 */
export function checkDateOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA <= endB && startB <= endA;
}

/**
 * Calculates the Event Reuse Readiness Score for a campus event.
 * Follows the strict Phase 1-4 mathematical specification:
 * - Readiness % = (allocatable reusable units / total required units) * 100
 * - Denominator: sum of all required units across material requirements
 * - Numerator: sum of allocatable eligible units (capped at each requirement's requested quantity)
 * - Excludes reserved/overlapping stock, inspection-pending stock, damaged stock, retired stock
 * - Handles empty requirements gracefully without division by zero
 */
export function calculateEventReadiness(
  event: CampusEvent,
  allInventory: InventoryItem[],
  existingReservations: Reservation[] = []
): ReadinessCalculation {
  if (!event || !event.requirements || event.requirements.length === 0) {
    return {
      eventId: event?.id || 'unknown',
      eventName: event?.name || 'Untitled Event',
      totalRequiredUnits: 0,
      allocatableUnits: 0,
      shortageUnits: 0,
      inspectionPendingUnits: 0,
      readinessPercentage: null,
      status: 'REQUIREMENTS_NOT_ADDED',
      requirementsAdded: false,
      breakdown: [],
    };
  }

  // Pre-calculate allocated quantities for items during this event's date window from other approved reservations
  const reservedItemQuantities: Record<string, number> = {};

  existingReservations.forEach((res) => {
    // Only approved reservations consume inventory pool
    if (res.status === 'APPROVED' && res.eventId !== event.id) {
      if (checkDateOverlap(event.startDate, event.endDate, res.startDate, res.endDate)) {
        res.items.forEach((itemLine) => {
          reservedItemQuantities[itemLine.inventoryItemId] =
            (reservedItemQuantities[itemLine.inventoryItemId] || 0) + itemLine.quantityAllocated;
        });
      }
    }
  });

  let totalRequiredUnits = 0;
  let totalAllocatableUnits = 0;
  let totalShortageUnits = 0;
  let totalInspectionPendingUnits = 0;

  const breakdown: RequirementReadinessDetail[] = [];

  for (const req of event.requirements) {
    const requested = Math.max(0, Number(req.requestedQuantity) || 0);
    totalRequiredUnits += requested;

    if (requested === 0) {
      breakdown.push({
        requirementId: req.id,
        categoryId: req.categoryId,
        categoryName: req.categoryName,
        requestedQuantity: 0,
        allocatableQuantity: 0,
        inspectionPendingQuantity: 0,
        shortageQuantity: 0,
        status: 'FULFILLED',
        matchingItems: [],
      });
      continue;
    }

    // Find inventory items matching category that are active and not retired/damaged
    const matchingItems = allInventory.filter(
      (item) => item.categoryId === req.categoryId && item.status !== 'RETIRED'
    );

    let categoryAllocatable = 0;
    let categoryInspectionPending = 0;
    const itemDetails: RequirementReadinessDetail['matchingItems'] = [];

    for (const item of matchingItems) {
      // Usable ready quantity is item.usableQuantity minus existing overlapping reservations
      const overlappingBooked = reservedItemQuantities[item.id] || 0;
      const effectiveAvailable = Math.max(0, item.usableQuantity - overlappingBooked);

      // Usable item must also have good condition and not be in repair
      const isEligibleCondition =
        item.condition === 'EXCELLENT' || item.condition === 'GOOD' || item.condition === 'MINOR_WEAR';

      const eligibleForEvent = isEligibleCondition && item.status !== 'UNDER_REPAIR'
        ? effectiveAvailable
        : 0;

      categoryAllocatable += eligibleForEvent;
      categoryInspectionPending += item.inspectionPendingQuantity || 0;

      itemDetails.push({
        itemId: item.id,
        itemName: item.name,
        departmentName: item.departmentName,
        availableNow: eligibleForEvent,
        condition: item.condition,
      });
    }

    // Crucial rule: Allocatable units for a requirement CANNOT exceed requested quantity
    const fulfilledUnits = Math.min(requested, categoryAllocatable);
    const shortage = Math.max(0, requested - fulfilledUnits);

    totalAllocatableUnits += fulfilledUnits;
    totalShortageUnits += shortage;
    totalInspectionPendingUnits += categoryInspectionPending;

    breakdown.push({
      requirementId: req.id,
      categoryId: req.categoryId,
      categoryName: req.categoryName,
      requestedQuantity: requested,
      allocatableQuantity: fulfilledUnits,
      inspectionPendingQuantity: categoryInspectionPending,
      shortageQuantity: shortage,
      status: shortage === 0 ? 'FULFILLED' : fulfilledUnits > 0 ? 'PARTIAL' : 'UNAVAILABLE',
      matchingItems: itemDetails,
    });
  }

  let readinessPercentage: number | null = null;
  let status: ReadinessCalculation['status'] = 'REQUIREMENTS_NOT_ADDED';

  if (totalRequiredUnits > 0) {
    // Pure mathematical precision capped at 100%
    const rawRatio = (totalAllocatableUnits / totalRequiredUnits) * 100;
    readinessPercentage = Math.round(Math.min(100, Math.max(0, rawRatio)));

    if (readinessPercentage === 100) {
      status = 'READY';
    } else if (readinessPercentage >= 50) {
      status = 'PARTIALLY_READY';
    } else {
      status = 'CRITICAL_SHORTAGE';
    }
  }

  return {
    eventId: event.id,
    eventName: event.name,
    totalRequiredUnits,
    allocatableUnits: totalAllocatableUnits,
    shortageUnits: totalShortageUnits,
    inspectionPendingUnits: totalInspectionPendingUnits,
    readinessPercentage,
    status,
    requirementsAdded: true,
    breakdown,
  };
}
