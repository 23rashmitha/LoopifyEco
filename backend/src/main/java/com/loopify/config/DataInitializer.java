package com.loopify.config;

import com.loopify.model.*;
import com.loopify.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final ItemCategoryRepository categoryRepository;
    private final InventoryItemRepository inventoryRepository;
    private final CampusEventRepository eventRepository;
    private final ItemLifecycleEventRepository lifecycleEventRepository;
    private final UserRepository userRepository;
    private final RepairRecordRepository repairRepository;
    private final ConditionInspectionRepository inspectionRepository;
    private final UnfulfilledRequestRepository unfulfilledRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(DepartmentRepository departmentRepository,
                           ItemCategoryRepository categoryRepository,
                           InventoryItemRepository inventoryRepository,
                           CampusEventRepository eventRepository,
                           ItemLifecycleEventRepository lifecycleEventRepository,
                           UserRepository userRepository,
                           RepairRecordRepository repairRepository,
                           ConditionInspectionRepository inspectionRepository,
                           UnfulfilledRequestRepository unfulfilledRepository,
                           PasswordEncoder passwordEncoder) {
        this.departmentRepository = departmentRepository;
        this.categoryRepository = categoryRepository;
        this.inventoryRepository = inventoryRepository;
        this.eventRepository = eventRepository;
        this.lifecycleEventRepository = lifecycleEventRepository;
        this.userRepository = userRepository;
        this.repairRepository = repairRepository;
        this.inspectionRepository = inspectionRepository;
        this.unfulfilledRepository = unfulfilledRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (departmentRepository.count() > 0) {
            return; // Already initialized
        }

        System.out.println("🌱 Initializing Loopify Campus Database Reference & Demo Seed Data...");

        // 1. Departments
        Department d1 = new Department("dept_admin", "Central Campus Store & Facilities", "ADMIN", "facilities@campus.edu", "Main Administrative Building, Room 102");
        Department d2 = new Department("dept_mech", "Mechanical Engineering Workshop", "MECH", "mech.store@campus.edu", "Engineering Block B, Ground Floor Bay 3");
        Department d3 = new Department("dept_eee", "Electrical & Electronics Lab", "EEE", "eee.lab@campus.edu", "Tech Tower, Room 204");
        Department d4 = new Department("dept_cs", "Computer Science Society", "CS", "cs.club@campus.edu", "Computing Centre, Annex Room 12");
        Department d5 = new Department("dept_sc", "Student Council & Cultural Hub", "SC", "studentcouncil@campus.edu", "Student Activity Centre, Level 2");
        departmentRepository.saveAll(List.of(d1, d2, d3, d4, d5));

        // 2. Real Authenticated Users with BCrypt Passwords for All 4 Roles
        User uAdmin = new User("usr_admin_01", "Dr. Robert Vance", "admin@loopify.edu", passwordEncoder.encode("admin123"), Enums.UserRole.CENTRAL_ADMIN, d1);
        User uCoord = new User("usr_coord_01", "Sarah Jenkins", "coordinator@loopify.edu", passwordEncoder.encode("coord123"), Enums.UserRole.DEPT_COORDINATOR, d2);
        User uOrg = new User("usr_org_01", "Alex Chen", "organizer@loopify.edu", passwordEncoder.encode("student123"), Enums.UserRole.STUDENT_ORGANIZER, d4);
        User uTech = new User("usr_tech_01", "Marcus Brody", "workshop@loopify.edu", passwordEncoder.encode("tech123"), Enums.UserRole.WORKSHOP_STAFF, d2);
        userRepository.saveAll(List.of(uAdmin, uCoord, uOrg, uTech));

        // 3. Categories
        ItemCategory c1 = new ItemCategory("cat_display", "Display & Poster Stands", "Free-standing bulletin boards, poster easels, and presentation panels", "Presentation", BigDecimal.valueOf(65.00));
        ItemCategory c2 = new ItemCategory("cat_audio", "Sound & Public Address", "Microphones, portable PA speakers, amplifiers, and audio cables", "Mic", BigDecimal.valueOf(180.00));
        ItemCategory c3 = new ItemCategory("cat_power", "Power & Electrical Cables", "Heavy-duty extension cords, surge-protected power strips, and cable ramps", "Zap", BigDecimal.valueOf(25.00));
        ItemCategory c4 = new ItemCategory("cat_lighting", "Stage & Ambient Lighting", "LED stage lights, spotlight flood fixtures, and color par cans", "Sun", BigDecimal.valueOf(95.00));
        ItemCategory c5 = new ItemCategory("cat_banners", "Banners & Backdrops", "Retractable roll-up stands, backdrop frames, and truss connectors", "Flag", BigDecimal.valueOf(75.00));
        categoryRepository.saveAll(List.of(c1, c2, c3, c4, c5));

        // 4. Inventory Items
        InventoryItem item1 = new InventoryItem("inv_disp_01", "Dual-Sided Poster Boards (6x4 ft)", "Sturdy felt-covered pinup boards with aluminum locking frames", "cat_display", "dept_admin", "Main Admin Basement Bay 4", 8, 6, "LPF-DISP-001", "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80");
        InventoryItem item2 = new InventoryItem("inv_disp_02", "Retractable Banner Stands (8x3 ft)", "Adjustable height aluminum rollup mechanism with padded carrying bag", "cat_banners", "dept_mech", "Mech Workshop Tool Room Shelf A", 8, 6, "LPF-BAN-001", "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80");
        InventoryItem item3 = new InventoryItem("inv_pow_01", "Heavy-Duty 25m Extension Cords", "Industrial outdoor rated rubberized cable with 4 grounded outlets", "cat_power", "dept_eee", "Tech Tower Cable Locker", 12, 10, "LPF-POW-001", "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=600&q=80");
        InventoryItem item4 = new InventoryItem("inv_aud_01", "Wireless Handheld UHF Mic Pair", "Dual channel receiver with balanced XLR outputs and noise suppression", "cat_audio", "dept_sc", "SAC Media Cupboard Box 3", 4, 3, "LPF-AUD-001", "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80");
        InventoryItem item5 = new InventoryItem("inv_light_01", "RGB LED Stage Par Wash Lights", "54-LED wash fixture with DMX control and sound-activation", "cat_lighting", "dept_sc", "SAC Lighting Rig Crate", 8, 8, "LPF-LGT-001", "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80");
        inventoryRepository.saveAll(List.of(item1, item2, item3, item4, item5));

        // 5. Sample Events
        CampusEvent evt1 = new CampusEvent("evt_engenius", "EnGenius 2026 Annual Symposium", "Three-day university-wide engineering showcase with 45 student design project booths", "usr_org_01", "Alex Chen (Robotics Club)", "dept_mech", LocalDate.now().plusDays(5), LocalDate.now().plusDays(8), "Engineering Quad & Main Auditorium", 450);
        CampusEvent evt2 = new CampusEvent("evt_cultural", "Symphony Spring Fest 2026", "Campus music competition, theatre performances, and outdoor art gallery", "usr_org_02", "Priya Sharma (Cultural Secretary)", "dept_sc", LocalDate.now().plusDays(14), LocalDate.now().plusDays(16), "Open Air Amphitheatre", 800);
        eventRepository.saveAll(List.of(evt1, evt2));

        // 6. Initial Lifecycle Logs
        ItemLifecycleEvent log1 = new ItemLifecycleEvent("log_01", "inv_disp_01", Enums.LifecycleEventType.REGISTERED, "usr_admin_01", "Dr. Robert Vance", "ADMIN", "Initial baseline catalog registration into Loopify platform.", Enums.ItemCondition.EXCELLENT);
        ItemLifecycleEvent log2 = new ItemLifecycleEvent("log_02", "inv_disp_01", Enums.LifecycleEventType.INSPECTION_COMPLETED, "usr_coord_01", "Sarah Jenkins", "ITEM_COORDINATOR", "Routine semester inventory check. All units verified intact.", Enums.ItemCondition.GOOD);
        lifecycleEventRepository.saveAll(List.of(log1, log2));

        // 7. Active Workshop Repair Record
        RepairRecord rep1 = new RepairRecord();
        rep1.setId("rep_01");
        rep1.setInventoryItem(item4);
        rep1.setDamageDescription("Wireless UHF Mic receiver antenna loose connector repaired & solder point reinforced");
        rep1.setAssignedTo("Marcus Brody (Central Workshop)");
        rep1.setStatus("IN_PROGRESS");
        rep1.setReportedDate(LocalDateTime.now().minusDays(2));
        rep1.setRepairCost(BigDecimal.valueOf(25.00));
        rep1.setNotes("Awaiting antenna test after solder replacement.");
        repairRepository.save(rep1);

        // 8. Sample Inspection Sign-Off Record
        ConditionInspection insp1 = new ConditionInspection();
        insp1.setId("insp_01");
        insp1.setInventoryItem(item1);
        insp1.setInspectorId("usr_coord_01");
        insp1.setInspectorName("Sarah Jenkins");
        insp1.setPreviousCondition(Enums.ItemCondition.GOOD);
        insp1.setAssessedCondition(Enums.ItemCondition.EXCELLENT);
        insp1.setRecommendedStatus(Enums.ItemLifecycleStatus.AVAILABLE);
        insp1.setNotes("All pins and brackets tightened. Cleaned surfaces.");
        insp1.setComponentsIntact(true);
        inspectionRepository.save(insp1);

        // 9. Unfulfilled Demand (Lost-Opportunity Tracking)
        UnfulfilledRequest unf1 = new UnfulfilledRequest();
        unf1.setId("unf_01");
        unf1.setEvent(evt1);
        unf1.setCategory(c1);
        unf1.setRequestedQuantity(10);
        unf1.setFulfilledQuantity(6);
        unf1.setShortageQuantity(4);
        unf1.setShortageReason("Campus shortage during simultaneous department symposium dates.");
        unfulfilledRepository.save(unf1);

        System.out.println("✅ Loopify Campus Database Seed Completed Successfully with Auth, Workshop & Lost-Opportunity Data!");
    }
}
