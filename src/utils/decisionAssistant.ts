import {
  CampusEvent,
  InventoryItem,
  Reservation,
  DecisionRecommendation,
} from '../types';
import { calculateEventReadiness } from './readiness';

/**
 * Generates transparent, rule-based recommendations for each event material requirement.
 * Adheres strictly to the prompt:
 * - Never fabricates environmental or financial savings
 * - Clearly explains the reason based on recorded inventory
 * - Highlights inspection or repair dependencies
 * - Recommends purchasing only the confirmed remaining shortage
 */
export function generateReuseRecommendations(
  event: CampusEvent,
  allInventory: InventoryItem[],
  reservations: Reservation[] = []
): DecisionRecommendation[] {
  if (!event || !event.requirements || event.requirements.length === 0) {
    return [
      {
        requirementId: 'none',
        categoryName: 'No Requirements',
        requestedQuantity: 0,
        suggestedReusableQuantity: 0,
        remainingShortage: 0,
        action: 'REQUIREMENTS_NOT_ADDED',
        actionLabel: 'Add Requirements First',
        reason: 'Event currently has no material requirements entered. Define quantities to generate recommendations.',
      },
    ];
  }

  const readiness = calculateEventReadiness(event, allInventory, reservations);
  const recommendations: DecisionRecommendation[] = [];

  for (const detail of readiness.breakdown) {
    const requested = detail.requestedQuantity;
    const allocatable = detail.allocatableQuantity;
    const shortage = detail.shortageQuantity;
    const categoryName = detail.categoryName;

    // Find category items in other departments or awaiting inspection/repair
    const categoryItems = allInventory.filter((i) => i.categoryId === detail.categoryId);
    const inspectionPendingItems = categoryItems.filter((i) => i.inspectionPendingQuantity > 0);
    const repairItems = categoryItems.filter((i) => i.underRepairQuantity > 0);

    const pendingQty = inspectionPendingItems.reduce((acc, i) => acc + i.inspectionPendingQuantity, 0);
    const repairQty = repairItems.reduce((acc, i) => acc + i.underRepairQuantity, 0);

    const holdingDepartments = Array.from(new Set(categoryItems.map((i) => i.departmentName)));

    if (shortage === 0 && allocatable >= requested) {
      // Complete match from existing inventory
      const locations = Array.from(new Set(categoryItems.map((i) => `${i.storageLocation} (${i.departmentName})`))).join(', ');
      recommendations.push({
        requirementId: detail.requirementId,
        categoryName,
        requestedQuantity: requested,
        suggestedReusableQuantity: requested,
        remainingShortage: 0,
        action: 'REUSE_EXISTING',
        actionLabel: 'Reuse Existing Stock (100% Covered)',
        reason: `Full requirement of ${requested} unit${requested > 1 ? 's' : ''} is verified ready in campus inventory. Storage: ${locations}.`,
      });
    } else if (allocatable > 0 && shortage > 0) {
      // Partial match
      let dependencyNote = '';
      if (pendingQty > 0) {
        dependencyNote = `${pendingQty} unit${pendingQty > 1 ? 's' : ''} currently awaiting coordinator condition inspection.`;
      } else if (repairQty > 0) {
        dependencyNote = `${repairQty} unit${repairQty > 1 ? 's' : ''} under repair in Central Workshop.`;
      }

      recommendations.push({
        requirementId: detail.requirementId,
        categoryName,
        requestedQuantity: requested,
        suggestedReusableQuantity: allocatable,
        remainingShortage: shortage,
        action: pendingQty >= shortage ? 'INSPECT_BEFORE_USE' : 'PURCHASE_REMAINING_SHORTAGE',
        actionLabel: pendingQty >= shortage 
          ? `Inspect ${Math.min(shortage, pendingQty)} Pending Units to Close Gap` 
          : `Allocate ${allocatable} Reusable Units & Purchase Remaining ${shortage}`,
        reason: `Can fulfill ${allocatable} of ${requested} units immediately from campus stock. ${
          pendingQty > 0
            ? `Completing condition inspection on ${pendingQty} pending units could fulfill up to ${Math.min(shortage, pendingQty)} more.`
            : `Remaining ${shortage} units should be procured or rented only after reserving the ${allocatable} reusable units.`
        }`,
        dependencyNote: dependencyNote || undefined,
        alternativeOptions: holdingDepartments.length > 1 ? holdingDepartments : undefined,
      });
    } else {
      // Zero immediate allocatable stock
      if (pendingQty >= requested) {
        recommendations.push({
          requirementId: detail.requirementId,
          categoryName,
          requestedQuantity: requested,
          suggestedReusableQuantity: 0,
          remainingShortage: requested,
          action: 'INSPECT_BEFORE_USE',
          actionLabel: `Inspect ${pendingQty} Pending Units (Covers Demand)`,
          reason: `No immediately verified stock available, but ${pendingQty} units exist on campus awaiting condition inspection in ${
            inspectionPendingItems.map((i) => i.departmentName).join(', ')
          }. If approved, full demand can be fulfilled without buying new.`,
          dependencyNote: 'Action required: Item Coordinator must conduct and sign off condition inspection.',
        });
      } else if (repairQty > 0) {
        recommendations.push({
          requirementId: detail.requirementId,
          categoryName,
          requestedQuantity: requested,
          suggestedReusableQuantity: 0,
          remainingShortage: requested,
          action: 'REPAIR_THEN_REASSESS',
          actionLabel: `Expedite Repair for ${repairQty} Units`,
          reason: `Inventory has ${repairQty} units under repair. Check with workshop team if repairs can be completed prior to event start.`,
          dependencyNote: 'Repaired items must pass post-repair inspection before being marked usable.',
        });
      } else {
        // True shortage, must purchase or rent
        recommendations.push({
          requirementId: detail.requirementId,
          categoryName,
          requestedQuantity: requested,
          suggestedReusableQuantity: 0,
          remainingShortage: requested,
          action: 'PURCHASE_REMAINING_SHORTAGE',
          actionLabel: `Purchase or External Rental Required (${requested} Units)`,
          reason: `Verified campus inventory has zero available, pending, or repairable units for this category across all departments. Purchasing new or renting is required.`,
        });
      }
    }
  }

  return recommendations;
}
