package com.loopify.model;

public class Enums {
    public enum ItemCondition {
        EXCELLENT, GOOD, MINOR_WEAR, DAMAGED_REPAIRABLE, UNUSABLE
    }

    public enum ItemLifecycleStatus {
        AVAILABLE, RESERVED, BORROWED, INSPECTION_PENDING, UNDER_REPAIR, RETIRED
    }

    public enum ReservationStatus {
        PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED
    }

    public enum UserRole {
        STUDENT_ORGANIZER, DEPT_COORDINATOR, CENTRAL_ADMIN, WORKSHOP_STAFF;

        public String getAuthority() {
            return "ROLE_" + this.name();
        }
    }

    public enum LifecycleEventType {
        REGISTERED, RESERVED, HANDED_OVER, RETURNED, INSPECTION_COMPLETED, DAMAGE_REPORTED, REPAIR_STARTED, REPAIR_VERIFIED, RETIRED
    }

    public enum InspectionResult {
        PASSED, NEEDS_MINOR_CLEANING, DAMAGED_REPAIRABLE, CONDEMNED_UNUSABLE
    }

    public enum RepairStatus {
        LOGGED, IN_PROGRESS, AWAITING_PARTS, COMPLETED, UNREPAIRABLE
    }

    public enum UnfulfilledReason {
        OUT_OF_STOCK, UNDER_REPAIR, DATE_CONFLICT, NO_CAMPUS_INVENTORY
    }
}
