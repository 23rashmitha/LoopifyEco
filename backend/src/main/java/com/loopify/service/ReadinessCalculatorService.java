package com.loopify.service;

import com.loopify.model.*;
import com.loopify.repository.CampusEventRepository;
import com.loopify.repository.InventoryItemRepository;
import com.loopify.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReadinessCalculatorService {

    private final CampusEventRepository eventRepository;
    private final InventoryItemRepository inventoryRepository;
    private final ReservationRepository reservationRepository;

    public ReadinessCalculatorService(CampusEventRepository eventRepository,
                                      InventoryItemRepository inventoryRepository,
                                      ReservationRepository reservationRepository) {
        this.eventRepository = eventRepository;
        this.inventoryRepository = inventoryRepository;
        this.reservationRepository = reservationRepository;
    }

    public static class ItemReadiness {
        private String itemId;
        private String itemName;
        private int requiredQuantity;
        private int allocatableQuantity;
        private int shortageQuantity;
        private int scorePercentage;

        public ItemReadiness(String itemId, String itemName, int requiredQuantity, int allocatableQuantity) {
            this.itemId = itemId;
            this.itemName = itemName;
            this.requiredQuantity = requiredQuantity;
            this.allocatableQuantity = allocatableQuantity;
            this.shortageQuantity = Math.max(0, requiredQuantity - allocatableQuantity);
            this.scorePercentage = requiredQuantity > 0 ? (int) Math.round(((double) allocatableQuantity / requiredQuantity) * 100) : 100;
        }

        public String getItemId() { return itemId; }
        public String getItemName() { return itemName; }
        public int getRequiredQuantity() { return requiredQuantity; }
        public int getAllocatableQuantity() { return allocatableQuantity; }
        public int getShortageQuantity() { return shortageQuantity; }
        public int getScorePercentage() { return scorePercentage; }
    }

    public static class EventReadinessReport {
        private String eventId;
        private String eventName;
        private int totalRequiredUnits;
        private int allocatableUnits;
        private int shortageUnits;
        private int overallReadinessPercentage;
        private List<ItemReadiness> items = new ArrayList<>();
        private List<String> recommendations = new ArrayList<>();

        public String getEventId() { return eventId; }
        public void setEventId(String eventId) { this.eventId = eventId; }
        public String getEventName() { return eventName; }
        public void setEventName(String eventName) { this.eventName = eventName; }
        public int getTotalRequiredUnits() { return totalRequiredUnits; }
        public void setTotalRequiredUnits(int totalRequiredUnits) { this.totalRequiredUnits = totalRequiredUnits; }
        public int getAllocatableUnits() { return allocatableUnits; }
        public void setAllocatableUnits(int allocatableUnits) { this.allocatableUnits = allocatableUnits; }
        public int getShortageUnits() { return shortageUnits; }
        public void setShortageUnits(int shortageUnits) { this.shortageUnits = shortageUnits; }
        public int getOverallReadinessPercentage() { return overallReadinessPercentage; }
        public void setOverallReadinessPercentage(int overallReadinessPercentage) { this.overallReadinessPercentage = overallReadinessPercentage; }
        public List<ItemReadiness> getItems() { return items; }
        public void setItems(List<ItemReadiness> items) { this.items = items; }
        public List<String> getRecommendations() { return recommendations; }
        public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }
    }

    public EventReadinessReport calculateForEvent(String eventId) {
        CampusEvent event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with ID: " + eventId));

        EventReadinessReport report = new EventReadinessReport();
        report.setEventId(event.getId());
        report.setEventName(event.getName());

        List<InventoryItem> items = inventoryRepository.findAll();
        int totalReq = 0;
        int totalAlloc = 0;

        for (InventoryItem item : items) {
            // Sample standard baseline requirement check
            int req = item.getName().contains("Board") ? 10 : item.getName().contains("Banner") ? 4 : 5;
            int alloc = Math.min(req, item.getUsableQuantity());

            totalReq += req;
            totalAlloc += alloc;

            report.getItems().add(new ItemReadiness(item.getId(), item.getName(), req, alloc));
        }

        int shortage = Math.max(0, totalReq - totalAlloc);
        int pct = totalReq > 0 ? (int) Math.round(((double) totalAlloc / totalReq) * 100) : 100;

        report.setTotalRequiredUnits(totalReq);
        report.setAllocatableUnits(totalAlloc);
        report.setShortageUnits(shortage);
        report.setOverallReadinessPercentage(pct);

        if (shortage == 0) {
            report.getRecommendations().add("All items fully available in campus inventory. Zero purchasing required!");
        } else {
            report.getRecommendations().add("Allocate " + totalAlloc + " verified reusable units from campus hubs.");
            report.getRecommendations().add("Shortage of " + shortage + " units identified. Procure or request inter-departmental transfer.");
        }

        return report;
    }
}
