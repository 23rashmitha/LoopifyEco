# ReLoop Campus: Phase 1 & 4 Verification Test Plan

This document records the formal test matrix covering setup, routing, dashboard behavior, readiness calculation mathematics, responsive UI, accessibility, and code quality.

---

## 1. Project Setup Tests

| Test ID | Description | Preconditions | Expected Result | Status |
|---|---|---|---|---|
| **SETUP-01** | Dependencies install successfully. | Clean repo | `npm install` completes without fatal errors | **PASSED** |
| **SETUP-02** | Vite dev server starts. | Port 3000 free | Vite development server listens on port 3000 | **PASSED** |
| **SETUP-03** | Application loads at local URL. | Dev server running | App renders with React 19 root and ReLoop brand | **PASSED** |
| **SETUP-04** | Code edit triggers successful reload. | Dev server running | Changes update without app crash | **PASSED** |
| **SETUP-05** | Production build completes successfully. | Source files intact | `npm run build` succeeds generating `dist/` | **PASSED** |

---

## 2. Routing Tests

| Test ID | Description | Expected Result | Status |
|---|---|---|---|
| **ROUTE-01** | Landing page opens at `/`. | Marketing landing page with interactive readiness simulator | **PASSED** |
| **ROUTE-02** | Dashboard opens at `/dashboard`. | ReLoop Campus executive dashboard with metrics and cards | **PASSED** |
| **ROUTE-03** | Every navigation link points to a valid route. | Inventory, Events, Reservations, Handover, Passport, Inspections, Repairs, Reports all resolve | **PASSED** |
| **ROUTE-04** | Active sidebar state matches current route. | Highlighted background and lime text on active route | **PASSED** |
| **ROUTE-05** | Unknown routes show a not-found page. | Renders `NotFoundPage` 404 with link to return | **PASSED** |
| **ROUTE-06** | Browser Back and Forward navigation behave correctly. | History state updates seamlessly | **PASSED** |

---

## 3. Dashboard Tests

| Test ID | Description | Expected Result | Status |
|---|---|---|---|
| **DASH-01** | Summary cards display defined labels and valid values. | Registered items, Usable stock, Pending requests, Verified reuses display integer counts | **PASSED** |
| **DASH-02** | Mock data is centrally managed. | Loaded from `src/data/mockData.ts` and managed in `AppContext` | **PASSED** |
| **DASH-03** | Upcoming event list renders correctly. | Displays events with real dates, venue, and live readiness meters | **PASSED** |
| **DASH-04** | Recent activity renders correctly. | Displays timeline of verified handovers, registrations, and returns | **PASSED** |
| **DASH-05** | Empty event and activity lists show empty states. | Displays `EmptyState` component with action button | **PASSED** |
| **DASH-06** | Data errors do not break entire page. | Handled gracefully with fallback values | **PASSED** |
| **DASH-07** | Demo metrics not represented as verified real-world stats. | Labeled clearly as sample verified records | **PASSED** |

---

## 4. Event Reuse Readiness Calculation Tests

| Test ID | Scenario | Calculation Expected | Actual Verified | Status |
|---|---|---|---|---|
| **READY-01** | 6 of 10 required units fulfilled. | (6 / 10) * 100 = 60% | 60% with 4 shortage | **PASSED** |
| **READY-02** | All required units fulfilled (10 / 10). | (10 / 10) * 100 = 100% | 100% with 0 shortage | **PASSED** |
| **READY-03** | Zero required units can be fulfilled (0 / 10). | (0 / 10) * 100 = 0% | 0% with 10 shortage | **PASSED** |
| **READY-04** | Inspection-pending stock does not count as allocatable. | Stock with `INSPECTION_PENDING` excluded from ready stock | Confirmed excluded | **PASSED** |
| **READY-05** | Reserved / overlapping stock does not count as available. | `checkDateOverlap()` excludes approved allocations | Confirmed excluded | **PASSED** |
| **READY-06** | Allocatable units never exceed required units. | Math.min(requested, available) caps allocatable | Capped at requested | **PASSED** |
| **READY-07** | Empty requirements do not cause division by zero. | Returns `status: REQUIREMENTS_NOT_ADDED`, `pct: null` | Safe state rendered | **PASSED** |
| **READY-08** | Display rounding does not alter underlying calculation. | Math.round on percentage, underlying counts preserved | Integer percentage | **PASSED** |
| **READY-09** | Missing or negative quantities handled safely. | Math.max(0, qty) prevents negative values | Handled safely | **PASSED** |

---

## 5. Responsive Layout & Accessibility Tests

| Test ID | Check Description | Result | Status |
|---|---|---|---|
| **RESP-01** | Desktop sidebar and content do not overlap. | Fixed width sidebar on desktop with fluid main viewport | **PASSED** |
| **RESP-02** | Tablet layout remains readable. | Grid collapses cleanly from 4-col to 2-col | **PASSED** |
| **RESP-03** | Mobile navigation usable via drawer. | Hamburger button opens accessible slide-over drawer | **PASSED** |
| **RESP-04** | No horizontal overflow on core pages. | Verified `overflow-x-hidden` and responsive tables | **PASSED** |
| **A11Y-01** | Interactive controls reachable by keyboard. | Tab navigation works across buttons, inputs, links | **PASSED** |
| **A11Y-02** | Focus states visible. | Ring focus states styled on all inputs | **PASSED** |
| **A11Y-03** | Form fields have accessible labels. | Associated `<label>` elements present on all forms | **PASSED** |
| **A11Y-04** | Status communicated by text, not color alone. | All badges pair semantic icons + plain text labels | **PASSED** |
| **A11Y-05** | Progress indicators expose value accessibly. | `aria-valuenow`, `aria-valuemin`, `aria-valuemax` defined | **PASSED** |

---

## 6. Code Quality Tests

| Test ID | Check Description | Result | Status |
|---|---|---|---|
| **QUAL-01** | No broken imports or missing modules. | All relative imports resolved cleanly | **PASSED** |
| **QUAL-02** | No fatal console errors on implemented routes. | Validated in React runtime | **PASSED** |
| **QUAL-03** | Lists use stable React keys. | Stable entity IDs used across all map() calls | **PASSED** |
| **QUAL-04** | Consistent styles and design tokens. | Forest green `#14532D`, warm cream, and semantic colors | **PASSED** |
| **QUAL-05** | No credentials or secrets committed. | Safe placeholders in `.env.example` | **PASSED** |
