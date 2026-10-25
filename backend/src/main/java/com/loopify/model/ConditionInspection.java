package com.loopify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "condition_inspections")
public class ConditionInspection {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;

    @Column(name = "inspector_id", nullable = false, length = 64)
    private String inspectorId;

    @Column(name = "inspector_name", length = 255)
    private String inspectorName;

    @Column(name = "inspection_date")
    private LocalDateTime inspectionDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_condition", nullable = false, length = 32)
    private Enums.ItemCondition previousCondition;

    @Enumerated(EnumType.STRING)
    @Column(name = "assessed_condition", nullable = false, length = 32)
    private Enums.ItemCondition assessedCondition;

    @Enumerated(EnumType.STRING)
    @Column(name = "recommended_status", nullable = false, length = 32)
    private Enums.ItemLifecycleStatus recommendedStatus;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String notes;

    @Column(name = "components_intact", nullable = false)
    private boolean componentsIntact = true;

    public ConditionInspection() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public InventoryItem getInventoryItem() { return inventoryItem; }
    public void setInventoryItem(InventoryItem inventoryItem) { this.inventoryItem = inventoryItem; }

    public String getInspectorId() { return inspectorId; }
    public void setInspectorId(String inspectorId) { this.inspectorId = inspectorId; }

    public String getInspectorName() { return inspectorName; }
    public void setInspectorName(String inspectorName) { this.inspectorName = inspectorName; }

    public LocalDateTime getInspectionDate() { return inspectionDate; }
    public void setInspectionDate(LocalDateTime inspectionDate) { this.inspectionDate = inspectionDate; }

    public Enums.ItemCondition getPreviousCondition() { return previousCondition; }
    public void setPreviousCondition(Enums.ItemCondition previousCondition) { this.previousCondition = previousCondition; }

    public Enums.ItemCondition getAssessedCondition() { return assessedCondition; }
    public void setAssessedCondition(Enums.ItemCondition assessedCondition) { this.assessedCondition = assessedCondition; }

    public Enums.ItemLifecycleStatus getRecommendedStatus() { return recommendedStatus; }
    public void setRecommendedStatus(Enums.ItemLifecycleStatus recommendedStatus) { this.recommendedStatus = recommendedStatus; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public boolean isComponentsIntact() { return componentsIntact; }
    public void setComponentsIntact(boolean componentsIntact) { this.componentsIntact = componentsIntact; }
}
