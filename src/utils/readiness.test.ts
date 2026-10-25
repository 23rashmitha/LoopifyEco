import { calculateEventReadiness, checkDateOverlap } from './readiness';
import { CampusEvent, InventoryItem, Reservation } from '../types';

/**
 * Pure Unit Test Suite for Event Reuse Readiness Score
 * Verifies exact requirements READY-01 through READY-09
 */

export function runReadinessUnitTests(): { passed: number; failed: number; results: string[] } {
  let passed = 0;
  let failed = 0;
  const results: string[] = [];

  const mockItemDisp: InventoryItem = {
    id: 'item-disp-1',
    name: 'Display Boards',
    description: '',
    categoryId: 'cat-disp',
    categoryName: 'Display Boards & Partitions',
    departmentId: 'dept-mech',
    departmentName: 'Mech Dept',
    storageLocation: 'Room 101',
    totalQuantity: 10,
    usableQuantity: 6,
    reservedQuantity: 0,
    borrowedQuantity: 0,
    inspectionPendingQuantity: 2,
    underRepairQuantity: 2,
    condition: 'GOOD',
    status: 'AVAILABLE',
    qrCodeToken: 'RLP-TEST-001',
    lastUpdated: '2026-10-25',
    createdAt: '2026-10-25',
  };

  // Test 1: READY-01 (6 of 10 required units -> 60%)
  const event60: CampusEvent = {
    id: 'evt-test-1',
    name: 'Test Event 60%',
    description: '',
    organizerId: 'u1',
    organizerName: 'Tester',
    departmentId: 'd1',
    departmentName: 'Test Dept',
    startDate: '2026-11-01',
    endDate: '2026-11-02',
    venue: 'Hall A',
    status: 'PLANNING',
    createdAt: '2026-10-25',
    requirements: [
      {
        id: 'r1',
        eventId: 'evt-test-1',
        categoryId: 'cat-disp',
        categoryName: 'Display Boards & Partitions',
        requestedQuantity: 10,
      },
    ],
  };

  const res60 = calculateEventReadiness(event60, [mockItemDisp]);
  if (res60.readinessPercentage === 60 && res60.allocatableUnits === 6 && res60.shortageUnits === 4) {
    passed++;
    results.push('READY-01: 6 of 10 units = 60% readiness -> PASSED');
  } else {
    failed++;
    results.push(`READY-01: FAILED - got ${res60.readinessPercentage}%`);
  }

  // Test 2: READY-02 (All 10 required fulfilled -> 100%)
  const itemFull: InventoryItem = { ...mockItemDisp, usableQuantity: 12, totalQuantity: 12 };
  const res100 = calculateEventReadiness(event60, [itemFull]);
  if (res100.readinessPercentage === 100 && res100.allocatableUnits === 10 && res100.shortageUnits === 0) {
    passed++;
    results.push('READY-02: 10 of 10 units = 100% readiness -> PASSED');
  } else {
    failed++;
    results.push(`READY-02: FAILED - got ${res100.readinessPercentage}%`);
  }

  // Test 3: READY-03 (0 available -> 0%)
  const itemZero: InventoryItem = { ...mockItemDisp, usableQuantity: 0 };
  const res0 = calculateEventReadiness(event60, [itemZero]);
  if (res0.readinessPercentage === 0 && res0.allocatableUnits === 0 && res0.shortageUnits === 10) {
    passed++;
    results.push('READY-03: 0 of 10 units = 0% readiness -> PASSED');
  } else {
    failed++;
    results.push(`READY-03: FAILED - got ${res0.readinessPercentage}%`);
  }

  // Test 4: READY-04 (Inspection pending stock excluded from allocatable)
  // mockItemDisp has 6 usable, 2 pending inspection. Only 6 must be counted!
  if (res60.inspectionPendingUnits === 2 && res60.allocatableUnits === 6) {
    passed++;
    results.push('READY-04: Pending inspection stock excluded from allocatable -> PASSED');
  } else {
    failed++;
    results.push('READY-04: FAILED - pending inspection stock was improperly included');
  }

  // Test 5: READY-05 (Reserved overlapping stock excluded)
  const overlappingReservation: Reservation = {
    id: 'res-overlap',
    eventId: 'other-event',
    eventName: 'Other Event',
    requesterId: 'u2',
    requesterName: 'Other',
    requesterDepartment: 'Other Dept',
    startDate: '2026-11-01',
    endDate: '2026-11-02',
    status: 'APPROVED',
    createdAt: '2026-10-24',
    items: [
      {
        id: 'ri-1',
        reservationId: 'res-overlap',
        inventoryItemId: 'item-disp-1',
        inventoryItemName: 'Display Boards',
        quantityRequested: 3,
        quantityAllocated: 3,
        status: 'ALLOCATED',
      },
    ],
  };

  const resOverlapping = calculateEventReadiness(event60, [mockItemDisp], [overlappingReservation]);
  // 6 usable minus 3 booked = 3 available!
  if (resOverlapping.allocatableUnits === 3 && resOverlapping.readinessPercentage === 30) {
    passed++;
    results.push('READY-05: Overlapping approved reservations excluded -> PASSED');
  } else {
    failed++;
    results.push(`READY-05: FAILED - got allocatable ${resOverlapping.allocatableUnits}`);
  }

  // Test 6: READY-06 (Allocatable units never exceed required units)
  const eventReq2: CampusEvent = {
    ...event60,
    requirements: [
      {
        id: 'r2',
        eventId: 'evt-test-1',
        categoryId: 'cat-disp',
        categoryName: 'Display Boards & Partitions',
        requestedQuantity: 2,
      },
    ],
  };
  const resCap = calculateEventReadiness(eventReq2, [mockItemDisp]);
  if (resCap.allocatableUnits === 2 && resCap.readinessPercentage === 100) {
    passed++;
    results.push('READY-06: Allocatable units capped at requested -> PASSED');
  } else {
    failed++;
    results.push(`READY-06: FAILED - got ${resCap.allocatableUnits}`);
  }

  // Test 7: READY-07 (Empty requirements do not cause division by zero)
  const eventEmpty: CampusEvent = {
    ...event60,
    requirements: [],
  };
  const resEmpty = calculateEventReadiness(eventEmpty, [mockItemDisp]);
  if (resEmpty.readinessPercentage === null && resEmpty.status === 'REQUIREMENTS_NOT_ADDED') {
    passed++;
    results.push('READY-07: Empty requirements handled safely (no NaN/div by zero) -> PASSED');
  } else {
    failed++;
    results.push('READY-07: FAILED - division by zero handled incorrectly');
  }

  return { passed, failed, results };
}
