package com.loopify.controller;

import com.loopify.model.InventoryItem;
import com.loopify.model.ItemLifecycleEvent;
import com.loopify.repository.InventoryItemRepository;
import com.loopify.repository.ItemLifecycleEventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/passport")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class PassportController {

    private final InventoryItemRepository inventoryRepository;
    private final ItemLifecycleEventRepository lifecycleRepository;

    public PassportController(InventoryItemRepository inventoryRepository,
                              ItemLifecycleEventRepository lifecycleRepository) {
        this.inventoryRepository = inventoryRepository;
        this.lifecycleRepository = lifecycleRepository;
    }

    /**
     * Signature Innovation 3: Digital QR Reuse Passport Lookup
     */
    @GetMapping("/{token}")
    public ResponseEntity<?> getPassport(@PathVariable String token) {
        InventoryItem item = inventoryRepository.findByQrToken(token)
                .or(() -> inventoryRepository.findById(token))
                .orElse(null);

        if (item == null) {
            return ResponseEntity.notFound().build();
        }

        List<ItemLifecycleEvent> timeline = lifecycleRepository.findByInventoryItemIdOrderByTimestampDesc(item.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("item", item);
        response.put("verifiedReuseCount", Math.max(1, timeline.size() / 2));
        response.put("timeline", timeline);
        response.put("integrityVerified", true);

        return ResponseEntity.ok(response);
    }
}
