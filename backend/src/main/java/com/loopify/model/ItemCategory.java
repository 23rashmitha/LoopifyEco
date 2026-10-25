package com.loopify.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "item_categories")
public class ItemCategory {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, unique = true, length = 128)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "icon_name", length = 64)
    private String iconName = "Boxes";

    @Column(name = "estimated_replacement_cost", precision = 10, scale = 2, nullable = false)
    private BigDecimal estimatedReplacementCost = BigDecimal.valueOf(50.00);

    public ItemCategory() {}

    public ItemCategory(String id, String name, String description, String iconName, BigDecimal estimatedReplacementCost) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.iconName = iconName;
        this.estimatedReplacementCost = estimatedReplacementCost;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }
    public BigDecimal getEstimatedReplacementCost() { return estimatedReplacementCost; }
    public void setEstimatedReplacementCost(BigDecimal estimatedReplacementCost) { this.estimatedReplacementCost = estimatedReplacementCost; }
}
