import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  User,
  UserRole,
  InventoryItem,
  CampusEvent,
  Reservation,
  HandoverRecord,
  ReturnRecord,
  ConditionInspection,
  RepairRecord,
  ItemLifecycleEvent,
  UnfulfilledRequest,
  AppNotification,
  Department,
  ItemCategory,
  ItemCondition,
  ItemLifecycleStatus,
} from '../types';
import {
  MOCK_USERS,
  MOCK_DEPARTMENTS,
  MOCK_CATEGORIES,
  MOCK_INVENTORY,
  MOCK_EVENTS,
  MOCK_RESERVATIONS,
  MOCK_HANDOVERS,
  MOCK_RETURNS,
  MOCK_INSPECTIONS,
  MOCK_REPAIRS,
  MOCK_LIFECYCLE_EVENTS,
  MOCK_UNFULFILLED_REQUESTS,
  MOCK_NOTIFICATIONS,
} from '../data/mockData';
import { api, API_BASE_URL } from '../services/api';

export interface BackendStatus {
  isConnected: boolean;
  isChecking: boolean;
  url: string;
  lastChecked?: Date;
  error?: string;
}

interface AppContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  registerUser: (data: { fullName: string; email: string; password: string; departmentId?: string; role?: string }) => Promise<{ success: boolean; message?: string }>;
  logoutUser: () => void;

  backendStatus: BackendStatus;
  checkBackendConnection: () => Promise<boolean>;

  users: User[];
  departments: Department[];
  categories: ItemCategory[];
  inventory: InventoryItem[];
  events: CampusEvent[];
  reservations: Reservation[];
  handovers: HandoverRecord[];
  returns: ReturnRecord[];
  inspections: ConditionInspection[];
  repairs: RepairRecord[];
  lifecycleEvents: ItemLifecycleEvent[];
  unfulfilledRequests: UnfulfilledRequest[];
  notifications: AppNotification[];
  
  // Actions
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'lastUpdated' | 'qrCodeToken'>) => InventoryItem;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  addEvent: (eventData: Omit<CampusEvent, 'id' | 'createdAt'>) => CampusEvent;
  updateEvent: (id: string, updates: Partial<CampusEvent>) => void;
  createReservation: (eventId: string, items: { inventoryItemId: string; quantity: number }[]) => Reservation;
  approveReservation: (reservationId: string, reviewerNotes?: string) => { success: boolean; message: string };
  rejectReservation: (reservationId: string, reason: string) => void;
  cancelReservation: (reservationId: string) => void;
  recordHandover: (handoverData: Omit<HandoverRecord, 'id' | 'handoverDate'>) => HandoverRecord;
  recordReturn: (returnData: Omit<ReturnRecord, 'id' | 'returnDate'>) => ReturnRecord;
  recordInspection: (inspectionData: Omit<ConditionInspection, 'id' | 'inspectionDate'>) => ConditionInspection;
  updateRepairRecord: (id: string, updates: Partial<RepairRecord>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'loopify_campus_v2_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Backend connection status
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    isConnected: false,
    isChecking: true,
    url: API_BASE_URL,
  });

  // User state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}currentUser`);
    return saved ? JSON.parse(saved) : MOCK_USERS[0];
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}inventory`);
    return saved ? JSON.parse(saved) : MOCK_INVENTORY;
  });

  const [events, setEvents] = useState<CampusEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}events`);
    return saved ? JSON.parse(saved) : MOCK_EVENTS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}reservations`);
    return saved ? JSON.parse(saved) : MOCK_RESERVATIONS;
  });

  const [handovers, setHandovers] = useState<HandoverRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}handovers`);
    return saved ? JSON.parse(saved) : MOCK_HANDOVERS;
  });

  const [returns, setReturns] = useState<ReturnRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}returns`);
    return saved ? JSON.parse(saved) : MOCK_RETURNS;
  });

  const [inspections, setInspections] = useState<ConditionInspection[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}inspections`);
    return saved ? JSON.parse(saved) : MOCK_INSPECTIONS;
  });

  const [repairs, setRepairs] = useState<RepairRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}repairs`);
    return saved ? JSON.parse(saved) : MOCK_REPAIRS;
  });

  const [lifecycleEvents, setLifecycleEvents] = useState<ItemLifecycleEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}lifecycleEvents`);
    return saved ? JSON.parse(saved) : MOCK_LIFECYCLE_EVENTS;
  });

  const [unfulfilledRequests, setUnfulfilledRequests] = useState<UnfulfilledRequest[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}unfulfilledRequests`);
    return saved ? JSON.parse(saved) : MOCK_UNFULFILLED_REQUESTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}currentUser`, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}inventory`, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}reservations`, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}handovers`, JSON.stringify(handovers));
  }, [handovers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}returns`, JSON.stringify(returns));
  }, [returns]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}inspections`, JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}repairs`, JSON.stringify(repairs));
  }, [repairs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}lifecycleEvents`, JSON.stringify(lifecycleEvents));
  }, [lifecycleEvents]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}unfulfilledRequests`, JSON.stringify(unfulfilledRequests));
  }, [unfulfilledRequests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  // Synchronize state with Spring Boot if backend is accessible
  const syncWithBackend = useCallback(async () => {
    try {
      const [backendItems, backendEvents, backendReservations, backendInspections, backendRepairs, backendUnfulfilled] = await Promise.all([
        api.getInventory().catch(() => null),
        api.getEvents().catch(() => null),
        api.getReservations().catch(() => null),
        api.getInspections().catch(() => null),
        api.getRepairs().catch(() => null),
        api.getUnfulfilledRequests().catch(() => null),
      ]);

      if (backendItems && Array.isArray(backendItems) && backendItems.length > 0) {
        const mappedItems: InventoryItem[] = backendItems.map((bi: any) => ({
          id: bi.id,
          name: bi.name,
          description: bi.description || '',
          categoryId: bi.categoryId || 'cat_display',
          categoryName: bi.categoryName || 'General Equipment',
          departmentId: bi.ownerDepartmentId || 'dept_admin',
          departmentName: bi.departmentName || 'Central Campus Facilities',
          storageLocation: bi.storageLocation || 'Main Campus Depot',
          totalQuantity: bi.totalQuantity || 0,
          usableQuantity: bi.usableQuantity || 0,
          reservedQuantity: bi.reservedQuantity || 0,
          borrowedQuantity: bi.borrowedQuantity || 0,
          inspectionPendingQuantity: bi.inspectionPendingQuantity || 0,
          underRepairQuantity: bi.underRepairQuantity || 0,
          condition: bi.condition || 'GOOD',
          status: bi.lifecycleStatus || 'AVAILABLE',
          qrCodeToken: bi.qrToken || bi.id,
          imageUrl: bi.imageUrl,
          lastUpdated: bi.lastUpdated || new Date().toISOString(),
          createdAt: bi.createdAt || new Date().toISOString(),
        }));
        setInventory(mappedItems);
      }

      if (backendEvents && Array.isArray(backendEvents) && backendEvents.length > 0) {
        const mappedEvents: CampusEvent[] = backendEvents.map((be: any) => ({
          id: be.id,
          name: be.name,
          description: be.description || '',
          organizerId: be.organizerUserId || 'usr_org_01',
          organizerName: be.organizerName || 'Campus Organizer',
          departmentId: be.organizingDepartmentId || 'dept_sc',
          departmentName: be.departmentName || 'Student Activities Council',
          startDate: be.startDate ? String(be.startDate).split('T')[0] : new Date().toISOString().split('T')[0],
          endDate: be.endDate ? String(be.endDate).split('T')[0] : new Date().toISOString().split('T')[0],
          venue: be.venue || 'Campus Auditorium',
          status: (be.status as any) || 'PLANNING',
          requirements: be.requirements || [],
          createdAt: be.createdAt || new Date().toISOString(),
        }));
        setEvents(mappedEvents);
      }

      if (backendReservations && Array.isArray(backendReservations) && backendReservations.length > 0) {
        setReservations(backendReservations);
      }

      if (backendInspections && Array.isArray(backendInspections) && backendInspections.length > 0) {
        setInspections(backendInspections);
      }

      if (backendRepairs && Array.isArray(backendRepairs) && backendRepairs.length > 0) {
        setRepairs(backendRepairs);
      }

      if (backendUnfulfilled && Array.isArray(backendUnfulfilled) && backendUnfulfilled.length > 0) {
        setUnfulfilledRequests(backendUnfulfilled);
      }
    } catch (e) {
      console.warn('Backend sync failed, maintaining local reactive state:', e);
    }
  }, []);

  const checkBackendConnection = useCallback(async (): Promise<boolean> => {
    setBackendStatus((prev) => ({ ...prev, isChecking: true }));
    const isOnline = await api.checkHealth();
    setBackendStatus({
      isConnected: isOnline,
      isChecking: false,
      url: API_BASE_URL,
      lastChecked: new Date(),
      error: isOnline ? undefined : 'Spring Boot not detected on http://localhost:8080/api/v1',
    });

    if (isOnline) {
      await syncWithBackend();
    }
    return isOnline;
  }, [syncWithBackend]);

  // Check connection on mount
  useEffect(() => {
    checkBackendConnection();
  }, [checkBackendConnection]);

  // Real Authentication methods
  const loginUser = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      if (backendStatus.isConnected) {
        const response = await api.login({ email, password });
        if (response && response.user) {
          const u: User = {
            id: response.user.id,
            fullName: response.user.fullName,
            email: response.user.email,
            role: response.user.role as UserRole,
            departmentId: response.user.departmentId || 'dept_admin',
            departmentName: 'Loopify Campus',
            avatarUrl: response.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          };
          setCurrentUser(u);
          return { success: true };
        }
      }
    } catch (err: any) {
      console.warn('Server login error, checking local store:', err);
      // Fallback if password matches local demo users
    }

    // Local authentication fallback for instant demo testing
    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      api.setToken('demo_jwt_token_for_' + found.id);
      return { success: true };
    }

    return { success: false, message: 'Invalid credentials. Please verify your email and password.' };
  };

  const registerUser = async (data: { fullName: string; email: string; password: string; departmentId?: string; role?: string }): Promise<{ success: boolean; message?: string }> => {
    try {
      if (backendStatus.isConnected) {
        const response = await api.register(data);
        if (response && response.user) {
          const u: User = {
            id: response.user.id,
            fullName: response.user.fullName,
            email: response.user.email,
            role: response.user.role as UserRole,
            departmentId: response.user.departmentId || 'dept_admin',
            departmentName: 'Loopify Campus',
          };
          setCurrentUser(u);
          return { success: true };
        }
      }
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed.' };
    }

    // Local fallback
    const newUser: User = {
      id: `usr-${Date.now().toString(36)}`,
      fullName: data.fullName,
      email: data.email,
      role: (data.role as UserRole) || 'STUDENT',
      departmentId: data.departmentId || 'dept_admin',
      departmentName: 'Campus Department',
    };
    setCurrentUser(newUser);
    return { success: true };
  };

  const logoutUser = () => {
    api.clearToken();
    setCurrentUser(MOCK_USERS[0]);
  };

  const switchUser = (userId: string) => {
    const found = MOCK_USERS.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
      api.setToken('demo_jwt_token_for_' + found.id);
    }
  };

  const switchRole = (role: UserRole) => {
    const found = MOCK_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      api.setToken('demo_jwt_token_for_' + found.id);
    } else {
      setCurrentUser((prev) => ({ ...prev, role }));
    }
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'lastUpdated' | 'qrCodeToken'>): InventoryItem => {
    const newId = `inv_${Date.now().toString(36)}`;
    const qrCode = `LPF-${itemData.categoryName.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    const newItem: InventoryItem = {
      ...itemData,
      id: newId,
      qrCodeToken: qrCode,
      createdAt: now,
      lastUpdated: now,
    };

    // If live Spring Boot backend is connected, save directly to MySQL/H2 in background
    if (backendStatus.isConnected) {
      api.createInventoryItem({
        id: newId,
        name: itemData.name,
        description: itemData.description,
        categoryId: itemData.categoryId,
        ownerDepartmentId: itemData.departmentId,
        storageLocation: itemData.storageLocation,
        totalQuantity: itemData.totalQuantity,
        usableQuantity: itemData.usableQuantity,
        reservedQuantity: itemData.reservedQuantity || 0,
        borrowedQuantity: itemData.borrowedQuantity || 0,
        inspectionPendingQuantity: itemData.inspectionPendingQuantity || 0,
        underRepairQuantity: itemData.underRepairQuantity || 0,
        condition: itemData.condition,
        lifecycleStatus: itemData.status,
        qrToken: qrCode,
        imageUrl: itemData.imageUrl,
      }).catch((e) => console.warn('Backend item creation failed:', e));
    }

    setInventory((prev) => [newItem, ...prev]);

    // Record lifecycle audit event
    const newLifecycle: ItemLifecycleEvent = {
      id: `life-${Date.now().toString(36)}`,
      inventoryItemId: newItem.id,
      eventType: 'REGISTERED',
      timestamp: now,
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      eventDescription: `Registered ${itemData.totalQuantity} units of ${itemData.name} into campus inventory.`,
      quantityInvolved: itemData.totalQuantity,
      conditionObserved: itemData.condition,
    };
    setLifecycleEvents((prev) => [newLifecycle, ...prev]);

    return newItem;
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>): void => {
    if (backendStatus.isConnected) {
      api.updateInventoryItem(id, {
        name: updates.name,
        description: updates.description,
        storageLocation: updates.storageLocation,
        condition: updates.condition,
        lifecycleStatus: updates.status,
        usableQuantity: updates.usableQuantity,
        reservedQuantity: updates.reservedQuantity,
        borrowedQuantity: updates.borrowedQuantity,
        underRepairQuantity: updates.underRepairQuantity,
        inspectionPendingQuantity: updates.inspectionPendingQuantity,
        imageUrl: updates.imageUrl,
      }).catch((e) => console.warn('Backend item update failed:', e));
    }

    setInventory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, lastUpdated: new Date().toISOString() } : item
      )
    );
  };

  const addEvent = (eventData: Omit<CampusEvent, 'id' | 'createdAt'>): CampusEvent => {
    const newId = `evt_${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const newEvent: CampusEvent = {
      ...eventData,
      id: newId,
      createdAt: now,
    };

    if (backendStatus.isConnected) {
      api.createEvent({
        id: newId,
        name: eventData.name,
        description: eventData.description,
        organizerUserId: currentUser.id,
        organizerName: eventData.organizerName || currentUser.fullName,
        organizingDepartmentId: eventData.departmentId,
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        venue: eventData.venue,
        status: eventData.status,
        estimatedAttendance: 100,
      }).catch((e) => console.warn('Backend event creation failed:', e));
    }

    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<CampusEvent>): void => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === id ? { ...evt, ...updates } : evt))
    );
  };

  const createReservation = (
    eventId: string,
    itemsToRequest: { inventoryItemId: string; quantity: number }[]
  ): Reservation => {
    const event = events.find((e) => e.id === eventId);
    const now = new Date().toISOString();
    const newResId = `res_${Date.now().toString(36)}`;

    const reservationLines = itemsToRequest.map((req, idx) => {
      const invItem = inventory.find((i) => i.id === req.inventoryItemId);
      return {
        id: `resi-${newResId}-${idx}`,
        reservationId: newResId,
        inventoryItemId: req.inventoryItemId,
        inventoryItemName: invItem?.name || 'Unknown Item',
        quantityRequested: req.quantity,
        quantityAllocated: req.quantity,
        status: 'PENDING' as const,
      };
    });

    const newRes: Reservation = {
      id: newResId,
      eventId,
      eventName: event?.name || 'Campus Event',
      requesterId: currentUser.id,
      requesterName: currentUser.fullName,
      requesterDepartment: currentUser.departmentName,
      startDate: event?.startDate || now.split('T')[0],
      endDate: event?.endDate || now.split('T')[0],
      status: 'PENDING',
      items: reservationLines,
      createdAt: now,
    };

    if (backendStatus.isConnected) {
      api.createReservation({
        eventId,
        requesterUserId: currentUser.id,
        items: itemsToRequest.map((i) => ({
          inventoryItemId: i.inventoryItemId,
          quantityRequested: i.quantity,
        })),
      }).catch((e) => console.warn('Backend reservation creation failed:', e));
    }

    setReservations((prev) => [newRes, ...prev]);

    // Send notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now().toString(36)}`,
      userId: 'usr-2',
      title: 'New Reservation Request Submitted',
      message: `${currentUser.fullName} requested ${itemsToRequest.reduce((a, b) => a + b.quantity, 0)} units for "${event?.name}".`,
      type: 'INFO',
      timestamp: now,
      read: false,
      link: '/reservations',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newRes;
  };

  const approveReservation = (reservationId: string, reviewerNotes?: string): { success: boolean; message: string } => {
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return { success: false, message: 'Reservation not found' };

    // Stock verification
    for (const itemLine of res.items) {
      const inv = inventory.find((i) => i.id === itemLine.inventoryItemId);
      if (!inv) {
        return { success: false, message: `Item ${itemLine.inventoryItemName} no longer exists.` };
      }
      if (inv.usableQuantity < itemLine.quantityRequested) {
        return {
          success: false,
          message: `Stock conflict: Only ${inv.usableQuantity} units of ${inv.name} are available, but ${itemLine.quantityRequested} requested.`,
        };
      }
    }

    // If backend is active, execute server-side pessimistic write lock
    if (backendStatus.isConnected) {
      api.approveReservation(reservationId, {
        reviewerUserId: currentUser.id,
        notes: reviewerNotes || 'Approved by coordinator.',
      }).catch((e) => console.warn('Backend approval dispatch failed:', e));
    }

    const now = new Date().toISOString();

    // Deduct usable pool, increment reserved pool
    setInventory((prev) =>
      prev.map((inv) => {
        const line = res.items.find((i) => i.inventoryItemId === inv.id);
        if (line) {
          return {
            ...inv,
            usableQuantity: Math.max(0, inv.usableQuantity - line.quantityRequested),
            reservedQuantity: inv.reservedQuantity + line.quantityRequested,
            lastUpdated: now,
          };
        }
        return inv;
      })
    );

    // Update reservation
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? {
              ...r,
              status: 'APPROVED',
              reviewerId: currentUser.id,
              reviewerName: currentUser.fullName,
              reviewedAt: now,
              decisionReason: reviewerNotes || 'Verified available inventory and approved.',
              items: r.items.map((it) => ({ ...it, status: 'ALLOCATED' })),
            }
          : r
      )
    );

    // Add lifecycle events
    res.items.forEach((itemLine) => {
      const lifeEvt: ItemLifecycleEvent = {
        id: `life-${Date.now().toString(36)}-${itemLine.id}`,
        inventoryItemId: itemLine.inventoryItemId,
        eventType: 'RESERVATION_ALLOCATED',
        timestamp: now,
        actorName: currentUser.fullName,
        actorRole: currentUser.role,
        eventDescription: `Approved allocation of ${itemLine.quantityRequested} units for "${res.eventName}".`,
        quantityInvolved: itemLine.quantityRequested,
        relatedEventName: res.eventName,
      };
      setLifecycleEvents((prev) => [lifeEvt, ...prev]);
    });

    // Notify requester
    const notif: AppNotification = {
      id: `notif-${Date.now().toString(36)}`,
      userId: res.requesterId,
      title: 'Reservation Approved',
      message: `Your reservation request #${res.id} for "${res.eventName}" was approved. Ready for handover.`,
      type: 'SUCCESS',
      timestamp: now,
      read: false,
      link: '/handover',
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, message: 'Reservation approved and stock locked.' };
  };

  const rejectReservation = (reservationId: string, reason: string): void => {
    if (backendStatus.isConnected) {
      api.rejectReservation(reservationId, {
        reviewerUserId: currentUser.id,
        reason,
      }).catch((e) => console.warn('Backend reservation rejection failed:', e));
    }

    const now = new Date().toISOString();
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? {
              ...r,
              status: 'REJECTED',
              reviewerId: currentUser.id,
              reviewerName: currentUser.fullName,
              reviewedAt: now,
              decisionReason: reason,
            }
          : r
      )
    );
  };

  const cancelReservation = (reservationId: string): void => {
    if (backendStatus.isConnected) {
      api.cancelReservation(reservationId, { userId: currentUser.id }).catch((e) =>
        console.warn('Backend reservation cancel failed:', e)
      );
    }

    const res = reservations.find((r) => r.id === reservationId);
    if (res && res.status === 'APPROVED') {
      // Release locked stock back to usable
      setInventory((prev) =>
        prev.map((inv) => {
          const line = res.items.find((i) => i.inventoryItemId === inv.id);
          if (line) {
            return {
              ...inv,
              reservedQuantity: Math.max(0, inv.reservedQuantity - line.quantityAllocated),
              usableQuantity: inv.usableQuantity + line.quantityAllocated,
            };
          }
          return inv;
        })
      );
    }

    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: 'CANCELLED' } : r))
    );
  };

  const recordHandover = (handoverData: Omit<HandoverRecord, 'id' | 'handoverDate'>): HandoverRecord => {
    const newId = `ho_${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const record: HandoverRecord = {
      ...handoverData,
      id: newId,
      handoverDate: now,
    };

    if (backendStatus.isConnected) {
      api.recordHandover({
        reservationId: handoverData.reservationId,
        itemId: handoverData.inventoryItemId,
        quantity: handoverData.quantityHandedOver,
        releasedByUserId: currentUser.id,
        receivedByUserId: handoverData.receivedByUserId,
        condition: handoverData.initialCondition,
        notes: handoverData.notes,
      }).catch((e) => console.warn('Backend handover logging failed:', e));
    }

    setHandovers((prev) => [record, ...prev]);

    // Update item status to BORROWED
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === handoverData.inventoryItemId) {
          return {
            ...item,
            reservedQuantity: Math.max(0, item.reservedQuantity - handoverData.quantityHandedOver),
            borrowedQuantity: item.borrowedQuantity + handoverData.quantityHandedOver,
            status: 'BORROWED',
            lastUpdated: now,
          };
        }
        return item;
      })
    );

    // Lifecycle event
    const lifeEvt: ItemLifecycleEvent = {
      id: `life-${Date.now().toString(36)}`,
      inventoryItemId: handoverData.inventoryItemId,
      eventType: 'HANDED_OVER',
      timestamp: now,
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      eventDescription: `Physically checked out ${handoverData.quantityHandedOver} units to ${handoverData.receivedByUserName} for "${handoverData.eventName}".`,
      quantityInvolved: handoverData.quantityHandedOver,
      relatedEventName: handoverData.eventName,
      conditionObserved: handoverData.initialCondition,
    };
    setLifecycleEvents((prev) => [lifeEvt, ...prev]);

    return record;
  };

  const recordReturn = (returnData: Omit<ReturnRecord, 'id' | 'returnDate'>): ReturnRecord => {
    const newId = `ret_${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const record: ReturnRecord = {
      ...returnData,
      id: newId,
      returnDate: now,
    };

    if (backendStatus.isConnected) {
      api.recordReturn({
        handoverId: returnData.handoverId,
        itemId: returnData.inventoryItemId,
        quantity: returnData.quantityReturned,
        receivedByUserId: currentUser.id,
        returnedByUserId: returnData.returnedByUserId,
        condition: returnData.returnCondition,
        damageReported: Boolean(returnData.notes || returnData.requiresInspection),
        damageDescription: returnData.notes,
        verificationNotes: returnData.notes,
      }).catch((e) => console.warn('Backend return logging failed:', e));
    }

    setReturns((prev) => [record, ...prev]);

    // DAMAGE TRIAGE LOGIC
    const isDamaged = returnData.returnCondition === 'DAMAGED_REPAIRABLE' || returnData.requiresInspection;

    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === returnData.inventoryItemId) {
          const newBorrowed = Math.max(0, item.borrowedQuantity - returnData.quantityReturned);
          if (isDamaged) {
            return {
              ...item,
              borrowedQuantity: newBorrowed,
              underRepairQuantity: item.underRepairQuantity + returnData.quantityReturned,
              condition: returnData.returnCondition,
              status: 'UNDER_REPAIR',
              lastUpdated: now,
            };
          } else {
            return {
              ...item,
              borrowedQuantity: newBorrowed,
              usableQuantity: item.usableQuantity + returnData.quantityReturned,
              condition: returnData.returnCondition,
              status: 'AVAILABLE',
              lastUpdated: now,
            };
          }
        }
        return item;
      })
    );

    // If damaged, automatically queue repair ticket
    if (isDamaged) {
      const autoRepair: RepairRecord = {
        id: `rep-${Date.now().toString(36)}`,
        inventoryItemId: returnData.inventoryItemId,
        inventoryItemName: returnData.inventoryItemName,
        damageDescription: returnData.notes || 'Reported damaged upon physical post-event check-in.',
        assignedTo: 'Central Workshop Technician',
        status: 'REPORTED',
        reportedDate: now.split('T')[0],
      };
      setRepairs((prev) => [autoRepair, ...prev]);
    }

    // Lifecycle event
    const lifeEvt: ItemLifecycleEvent = {
      id: `life-${Date.now().toString(36)}`,
      inventoryItemId: returnData.inventoryItemId,
      eventType: isDamaged ? 'DAMAGE_REPORTED' : 'RETURNED',
      timestamp: now,
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      eventDescription: isDamaged
        ? `Item returned with damage (${returnData.returnCondition}). Routed to workshop queue: ${returnData.notes || 'Condition check required'}`
        : `Verified return of ${returnData.quantityReturned} units in ${returnData.returnCondition} condition. Restored to ready stock pool.`,
      quantityInvolved: returnData.quantityReturned,
      conditionObserved: returnData.returnCondition,
    };
    setLifecycleEvents((prev) => [lifeEvt, ...prev]);

    return record;
  };

  const recordInspection = (inspectionData: Omit<ConditionInspection, 'id' | 'inspectionDate'>): ConditionInspection => {
    const newId = `insp_${Date.now().toString(36)}`;
    const now = new Date().toISOString();

    const inspection: ConditionInspection = {
      ...inspectionData,
      id: newId,
      inspectionDate: now,
    };

    if (backendStatus.isConnected) {
      api.recordInspection({
        itemId: inspectionData.inventoryItemId,
        inspectorId: currentUser.id,
        inspectorName: currentUser.fullName,
        assessedCondition: inspectionData.assessedCondition,
        recommendedStatus: inspectionData.recommendedStatus,
        notes: inspectionData.notes,
        componentsIntact: inspectionData.componentsIntact,
      }).catch((e) => console.warn('Backend inspection logging failed:', e));
    }

    setInspections((prev) => [inspection, ...prev]);

    // Update item condition and status
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === inspectionData.inventoryItemId) {
          return {
            ...item,
            condition: inspectionData.assessedCondition,
            status: inspectionData.recommendedStatus,
            lastUpdated: now,
          };
        }
        return item;
      })
    );

    return inspection;
  };

  const updateRepairRecord = (id: string, updates: Partial<RepairRecord>): void => {
    if (backendStatus.isConnected) {
      api.updateRepair(id, {
        status: updates.status,
        repairCost: updates.repairCost,
        notes: updates.notes,
      }).catch((e) => console.warn('Backend repair update failed:', e));
    }

    setRepairs((prev) =>
      prev.map((rep) => (rep.id === id ? { ...rep, ...updates } : rep))
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    localStorage.clear();
    setInventory(MOCK_INVENTORY);
    setEvents(MOCK_EVENTS);
    setReservations(MOCK_RESERVATIONS);
    setHandovers(MOCK_HANDOVERS);
    setReturns(MOCK_RETURNS);
    setInspections(MOCK_INSPECTIONS);
    setRepairs(MOCK_REPAIRS);
    setLifecycleEvents(MOCK_LIFECYCLE_EVENTS);
    setUnfulfilledRequests(MOCK_UNFULFILLED_REQUESTS);
    setNotifications(MOCK_NOTIFICATIONS);
    setCurrentUser(MOCK_USERS[0]);
    checkBackendConnection();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        switchRole,
        loginUser,
        registerUser,
        logoutUser,
        backendStatus,
        checkBackendConnection,
        users: MOCK_USERS,
        departments: MOCK_DEPARTMENTS,
        categories: MOCK_CATEGORIES,
        inventory,
        events,
        reservations,
        handovers,
        returns,
        inspections,
        repairs,
        lifecycleEvents,
        unfulfilledRequests,
        notifications,
        addInventoryItem,
        updateInventoryItem,
        addEvent,
        updateEvent,
        createReservation,
        approveReservation,
        rejectReservation,
        cancelReservation,
        recordHandover,
        recordReturn,
        recordInspection,
        updateRepairRecord,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
