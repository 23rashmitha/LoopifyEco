export type UserRole = 'STUDENT' | 'ORGANIZER' | 'ITEM_COORDINATOR' | 'ADMIN';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  departmentId: string;
  departmentName: string;
  avatarUrl?: string;
}

export type ItemCondition = 'EXCELLENT' | 'GOOD' | 'MINOR_WEAR' | 'DAMAGED_REPAIRABLE' | 'UNUSABLE';

export type ItemLifecycleStatus = 'AVAILABLE' | 'RESERVED' | 'BORROWED' | 'INSPECTION_PENDING' | 'UNDER_REPAIR' | 'RETIRED';

export interface ItemCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
  estimatedReplacementCost: number; // For avoiding purchase calculations
}

export interface Department {
  id: string;
  name: string;
  code: string;
  contactEmail: string;
  location: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  departmentId: string;
  departmentName: string;
  storageLocation: string;
  totalQuantity: number;
  usableQuantity: number;
  reservedQuantity: number;
  borrowedQuantity: number;
  inspectionPendingQuantity: number;
  underRepairQuantity: number;
  condition: ItemCondition;
  status: ItemLifecycleStatus;
  qrCodeToken: string;
  imageUrl?: string;
  lastUpdated: string;
  createdAt: string;
}

export type EventStatus = 'DRAFT' | 'PLANNING' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface EventMaterialRequirement {
  id: string;
  eventId: string;
  categoryId: string;
  categoryName: string;
  requestedQuantity: number;
  specificationNotes?: string;
  fulfilledQuantity?: number;
}

export interface CampusEvent {
  id: string;
  name: string;
  description: string;
  organizerId: string;
  organizerName: string;
  departmentId: string;
  departmentName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  venue: string;
  status: EventStatus;
  requirements: EventMaterialRequirement[];
  createdAt: string;
}

export type ReservationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'FULFILLED';

export interface ReservationItem {
  id: string;
  reservationId: string;
  inventoryItemId: string;
  inventoryItemName: string;
  quantityRequested: number;
  quantityAllocated: number;
  status: 'ALLOCATED' | 'SHORTAGE' | 'PENDING';
}

export interface Reservation {
  id: string;
  eventId: string;
  eventName: string;
  requesterId: string;
  requesterName: string;
  requesterDepartment: string;
  startDate: string;
  endDate: string;
  status: ReservationStatus;
  items: ReservationItem[];
  reviewerId?: string;
  reviewerName?: string;
  decisionReason?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface HandoverRecord {
  id: string;
  reservationId: string;
  eventId: string;
  eventName: string;
  inventoryItemId: string;
  inventoryItemName: string;
  quantityHandedOver: number;
  releasedByUserId: string;
  releasedByUserName: string;
  receivedByUserId: string;
  receivedByUserName: string;
  handoverDate: string;
  initialCondition: ItemCondition;
  notes?: string;
}

export interface ReturnRecord {
  id: string;
  handoverId: string;
  reservationId: string;
  inventoryItemId: string;
  inventoryItemName: string;
  quantityReturned: number;
  receivedByUserId: string;
  receivedByUserName: string;
  returnedByUserId: string;
  returnedByUserName: string;
  returnDate: string;
  returnCondition: ItemCondition;
  isCompleteReturn: boolean;
  notes?: string;
  requiresInspection: boolean;
}

export interface ConditionInspection {
  id: string;
  inventoryItemId: string;
  inventoryItemName: string;
  inspectorId: string;
  inspectorName: string;
  inspectionDate: string;
  previousCondition: ItemCondition;
  assessedCondition: ItemCondition;
  recommendedStatus: ItemLifecycleStatus;
  notes: string;
  componentsIntact: boolean;
}

export interface RepairRecord {
  id: string;
  inventoryItemId: string;
  inventoryItemName: string;
  damageDescription: string;
  assignedTo: string;
  status: 'REPORTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  reportedDate: string;
  completedDate?: string;
  repairCost?: number;
  notes?: string;
}

export type LifecycleEventType = 
  | 'REGISTERED'
  | 'RESERVATION_ALLOCATED'
  | 'HANDED_OVER'
  | 'RETURNED'
  | 'INSPECTION_COMPLETED'
  | 'DAMAGE_REPORTED'
  | 'REPAIR_STARTED'
  | 'REPAIR_VERIFIED'
  | 'RETIRED';

export interface ItemLifecycleEvent {
  id: string;
  inventoryItemId: string;
  eventType: LifecycleEventType;
  timestamp: string;
  actorName: string;
  actorRole: string;
  eventDescription: string;
  quantityInvolved: number;
  relatedEventName?: string;
  conditionObserved?: ItemCondition;
}

export interface UnfulfilledRequest {
  id: string;
  eventId: string;
  eventName: string;
  categoryId: string;
  categoryName: string;
  requestedQuantity: number;
  fulfilledQuantity: number;
  shortageQuantity: number;
  shortageReason: string;
  recordedDate: string;
}

export interface ReadinessCalculation {
  eventId: string;
  eventName: string;
  totalRequiredUnits: number;
  allocatableUnits: number;
  shortageUnits: number;
  inspectionPendingUnits: number;
  readinessPercentage: number | null;
  status: 'READY' | 'PARTIALLY_READY' | 'CRITICAL_SHORTAGE' | 'REQUIREMENTS_NOT_ADDED';
  requirementsAdded: boolean;
  breakdown: RequirementReadinessDetail[];
}

export interface RequirementReadinessDetail {
  requirementId: string;
  categoryId: string;
  categoryName: string;
  requestedQuantity: number;
  allocatableQuantity: number;
  inspectionPendingQuantity: number;
  shortageQuantity: number;
  status: 'FULFILLED' | 'PARTIAL' | 'UNAVAILABLE';
  matchingItems: {
    itemId: string;
    itemName: string;
    departmentName: string;
    availableNow: number;
    condition: ItemCondition;
  }[];
}

export type DecisionAction =
  | 'REUSE_EXISTING'
  | 'INSPECT_BEFORE_USE'
  | 'REPAIR_THEN_REASSESS'
  | 'CHECK_APPROVED_ALTERNATIVES'
  | 'PURCHASE_REMAINING_SHORTAGE'
  | 'REQUIREMENTS_NOT_ADDED';

export interface DecisionRecommendation {
  requirementId: string;
  categoryName: string;
  requestedQuantity: number;
  suggestedReusableQuantity: number;
  remainingShortage: number;
  action: DecisionAction;
  actionLabel: string;
  reason: string;
  dependencyNote?: string;
  alternativeOptions?: string[];
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  timestamp: string;
  read: boolean;
  link?: string;
}
