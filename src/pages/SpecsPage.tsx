import React, { useState } from 'react';
import {
  Database,
  Server,
  Code2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Cpu,
  Lock,
  GitBranch,
  Copy,
  Check,
} from 'lucide-react';

export const SpecsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schema' | 'erd' | 'api' | 'concurrency'>('schema');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sampleDdlSnippet = `-- ====================================================================
-- Loopify Campus MySQL 8.0 DDL Schema (InnoDB, utf8mb4)
-- Enforces Referential Integrity, Temporal Overlap Locks, & Auditability
-- ====================================================================

CREATE TABLE IF NOT EXISTS inventory_items (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(64) NOT NULL,
    owner_department_id VARCHAR(64) NOT NULL,
    storage_location VARCHAR(255) NOT NULL,
    total_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    usable_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    reserved_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    borrowed_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    inspection_pending_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    under_repair_quantity INT UNSIGNED NOT NULL DEFAULT 0,
    item_condition ENUM('EXCELLENT', 'GOOD', 'MINOR_WEAR', 'DAMAGED_REPAIRABLE', 'UNUSABLE') NOT NULL DEFAULT 'GOOD',
    lifecycle_status ENUM('AVAILABLE', 'RESERVED', 'BORROWED', 'INSPECTION_PENDING', 'UNDER_REPAIR', 'RETIRED') NOT NULL DEFAULT 'AVAILABLE',
    qr_token VARCHAR(64) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_qty_balance CHECK (usable_quantity + reserved_quantity + borrowed_quantity + inspection_pending_quantity + under_repair_quantity = total_quantity),
    CONSTRAINT fk_inv_category FOREIGN KEY (category_id) REFERENCES item_categories(id) ON DELETE RESTRICT,
    CONSTRAINT fk_inv_department FOREIGN KEY (owner_department_id) REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reservations (
    id VARCHAR(64) PRIMARY KEY,
    event_id VARCHAR(64) NOT NULL,
    requester_id VARCHAR(64) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'FULFILLED') NOT NULL DEFAULT 'PENDING',
    reviewer_id VARCHAR(64),
    decision_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_date_interval CHECK (end_date >= start_date),
    CONSTRAINT fk_res_event FOREIGN KEY (event_id) REFERENCES campus_events(id) ON DELETE RESTRICT,
    CONSTRAINT fk_res_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

  const javaPessimisticLockSnippet = `// ====================================================================
// Spring Boot 3.3.x / Java 21 - Pessimistic Concurrency Reservation Lock
// Protects Against Double-Booking Across Overlapping Event Windows
// ====================================================================

@Service
@Transactional
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private InventoryItemRepository inventoryRepo;

    @Autowired
    private ReservationRepository reservationRepo;

    @Autowired
    private ItemLifecycleEventRepository lifecycleRepo;

    @Override
    public ReservationResponse approveReservation(String reservationId, String reviewerId, String reviewerNotes) {
        Reservation res = reservationRepo.findById(reservationId)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found: " + reservationId));

        if (res.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalStateException("Only PENDING reservations can be approved.");
        }

        // PESSIMISTIC_WRITE lock on inventory lot balances
        for (ReservationItem line : res.getItems()) {
            InventoryItem item = inventoryRepo.findByIdWithLock(line.getInventoryItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Item not found: " + line.getInventoryItemId()));

            // Temporal Overlap Stock Availability Check:
            // Calculate other approved allocations overlapping [res.startDate, res.endDate]
            int overlappingAllocated = reservationRepo.findAllocatedQuantityInInterval(
                item.getId(), res.getStartDate(), res.getEndDate(), res.getId()
            );

            int effectiveAvailable = item.getUsableQuantity() - overlappingAllocated;
            if (effectiveAvailable < line.getQuantityRequested()) {
                throw new InsufficientInventoryException(String.format(
                    "Concurrency conflict: Only %d units available for interval, but %d requested.",
                    effectiveAvailable, line.getQuantityRequested()
                ));
            }

            // Deduct usable pool & increment reserved pool atomically
            item.setUsableQuantity(item.getUsableQuantity() - line.getQuantityRequested());
            item.setReservedQuantity(item.getReservedQuantity() + line.getQuantityRequested());
            inventoryRepo.save(item);

            // Audit record for Reuse Passport
            lifecycleRepo.save(new ItemLifecycleEvent(
                item.getId(), LifecycleEventType.RESERVATION_ALLOCATED,
                reviewerId, "Approved allocation for event " + res.getEvent().getName()
            ));
        }

        res.setStatus(ReservationStatus.APPROVED);
        res.setReviewerId(reviewerId);
        res.setDecisionReason(reviewerNotes);
        return mapToResponse(reservationRepo.save(res));
    }
}`;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-mono">
            Full-Stack Engineering Blueprint
          </span>
          <span className="text-xs text-slate-500 font-semibold">Phases 2 & 3 Technical Architecture</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          MySQL Schema & Spring Boot REST API Architecture
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Enterprise specification engineered for high concurrency, zero double-booking, and auditability.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'schema'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>MySQL 8.0 Schema (DDL)</span>
        </button>

        <button
          onClick={() => setActiveTab('concurrency')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'concurrency'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Pessimistic Concurrency & Locking</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'api'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Spring Boot REST Endpoints</span>
        </button>

        <button
          onClick={() => setActiveTab('erd')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'erd'
              ? 'bg-emerald-800 text-white shadow-2xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Relational ER Diagram</span>
        </button>
      </div>

      {/* TAB 1: MySQL Schema DDL */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-lime-400" />
              <span className="text-xs font-bold text-white">database/scripts/02_create_tables.sql</span>
            </div>
            <button
              onClick={() => copyToClipboard(sampleDdlSnippet, 'ddl')}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedCode === 'ddl' ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'ddl' ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono overflow-x-auto p-2 text-emerald-300 leading-relaxed">
            {sampleDdlSnippet}
          </pre>
        </div>
      )}

      {/* TAB 2: Concurrency & Locking */}
      {activeTab === 'concurrency' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
              <span>Anti-Double Booking & Transaction Boundary Architecture</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              In college festivals, multiple departments submit reservation requests simultaneously for the same high-demand resources (such as display boards and banner stands). A naive frontend check or read-only database query fails under concurrent load. Loopify solves this via:
            </p>
            <ol className="list-decimal pl-5 text-xs text-slate-700 space-y-2">
              <li>
                <strong>Pessimistic Write Locking:</strong> In Spring Boot Data JPA, the inventory lot is locked using <code className="bg-slate-100 px-1.5 py-0.5 rounded-sm font-mono text-emerald-900 font-bold">@Lock(LockModeType.PESSIMISTIC_WRITE)</code> executing <code className="bg-slate-100 px-1.5 py-0.5 rounded-sm font-mono text-emerald-900">SELECT ... FOR UPDATE</code>.
              </li>
              <li>
                <strong>Temporal Overlap Calculus:</strong> Two event intervals <code className="font-mono bg-slate-100 px-1">[startA, endA]</code> and <code className="font-mono bg-slate-100 px-1">[startB, endB]</code> overlap if and only if <code className="font-mono bg-slate-100 px-1">startA &le; endB AND startB &le; endA</code>.
              </li>
              <li>
                <strong>Strict Atomic Stock Balance:</strong> The database constraint <code className="font-mono bg-slate-100 px-1">CHECK (usable + reserved + borrowed + inspection_pending + under_repair = total)</code> prevents phantom quantities.
              </li>
            </ol>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-lime-400 font-mono">
                ReservationServiceImpl.java - Concurrency Protection
              </span>
              <button
                onClick={() => copyToClipboard(javaPessimisticLockSnippet, 'java')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedCode === 'java' ? <Check className="w-3.5 h-3.5 text-lime-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'java' ? 'Copied' : 'Copy Java'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono overflow-x-auto p-2 text-emerald-300 leading-relaxed">
              {javaPessimisticLockSnippet}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: REST API Specifications */}
      {activeTab === 'api' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Spring Boot REST API Surface (/api/v1)</h3>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold">
              Production Contract
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs font-mono">
            {[
              { method: 'GET', path: '/api/v1/inventory', desc: 'Search and filter campus materials with pagination' },
              { method: 'POST', path: '/api/v1/inventory', desc: 'Register reusable material and generate QR token' },
              { method: 'GET', path: '/api/v1/events/{id}/readiness', desc: 'Calculate Event Reuse Readiness Score' },
              { method: 'GET', path: '/api/v1/events/{id}/reuse-recommendations', desc: 'Reuse-First Decision Assistant engine' },
              { method: 'POST', path: '/api/v1/reservations', desc: 'Submit reservation request with requirements' },
              { method: 'PATCH', path: '/api/v1/reservations/{id}/approve', desc: 'Transactional approval with stock locking' },
              { method: 'POST', path: '/api/v1/reservations/{id}/handover', desc: 'Physical custody transfer sign-off' },
              { method: 'POST', path: '/api/v1/reservations/{id}/return', desc: 'Verify physical return and log completed reuse' },
              { method: 'GET', path: '/api/v1/inventory/qr/{token}', desc: 'Public QR scan endpoint for Reuse Passport' },
              { method: 'POST', path: '/api/v1/inventory/{id}/inspections', desc: 'Submit condition inspection and certification' },
            ].map((ep, i) => (
              <div key={i} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                      ep.method === 'GET'
                        ? 'bg-blue-100 text-blue-800'
                        : ep.method === 'POST'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-bold text-slate-900">{ep.path}</span>
                </div>
                <span className="text-slate-500 font-sans text-xs">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ERD */}
      {activeTab === 'erd' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">Entity Relationship Diagram (Mermaid ERD)</h3>
          <p className="text-xs text-slate-500">
            Rendered from <code className="bg-slate-100 px-1 font-mono">database/design/er-diagram.mmd</code>
          </p>

          <div className="p-4 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
            {`erDiagram
    USERS ||--o{ RESERVATIONS : "requests"
    DEPARTMENTS ||--o{ INVENTORY_ITEMS : "owns/stores"
    ITEM_CATEGORIES ||--o{ INVENTORY_ITEMS : "classifies"
    CAMPUS_EVENTS ||--o{ EVENT_MATERIAL_REQUIREMENTS : "defines"
    CAMPUS_EVENTS ||--o{ RESERVATIONS : "schedules"
    RESERVATIONS ||--|{ RESERVATION_ITEMS : "allocates"
    INVENTORY_ITEMS ||--o{ RESERVATION_ITEMS : "supplied_by"
    RESERVATIONS ||--o{ HANDOVER_RECORDS : "verified_checkout"
    HANDOVER_RECORDS ||--o{ RETURN_RECORDS : "verified_return"
    INVENTORY_ITEMS ||--o{ CONDITION_INSPECTIONS : "evaluated_by"
    INVENTORY_ITEMS ||--o{ REPAIR_RECORDS : "serviced_in"
    INVENTORY_ITEMS ||--o{ ITEM_LIFECYCLE_EVENTS : "passport_history"`}
          </div>
        </div>
      )}
    </div>
  );
};
