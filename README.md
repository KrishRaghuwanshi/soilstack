# 🌱 SoilStack

> **Turn residue into revenue.** A mobile platform connecting Indian farmers to corporate carbon markets through biochar-based carbon removal credits.

---

## The Problem

Every year, satellite images of North India turn orange — smoke from millions of acres of crop stubble being burned. Farmers aren't doing this out of ignorance. Burning is simply the fastest and cheapest way to clear fields between harvests. Meanwhile, corporations worldwide are under growing pressure to offset and reduce their Scope 3 emissions, actively seeking credible, verifiable carbon removal.

SoilStack bridges this gap: turning a pollution problem into an income stream, and turning corporate climate commitments into on-the-ground agricultural change.

---

## What SoilStack Does

Farmers convert crop residue (wheat straw, rice straw) into **biochar** — a stable, carbon-rich material — and bury it in their fields instead of burning it. This:

- **Sequesters carbon** permanently in the soil (not released as CO₂)
- **Improves soil fertility** over time through increased water retention and microbial activity
- **Generates verifiable carbon removal credits** that companies can purchase to offset emissions

SoilStack handles the entire pipeline: farmer submission → multi-layer verification → credit issuance → payment.

---

## How It Works — The Full Pipeline

```
Farmer makes biochar → Photo + GPS submission → AI quality scoring
       ↓
Satellite cross-check (Sentinel-2 / Landsat 8 / MODIS)
       ↓
Field validator visit (photo checklist + GPS confirmation)
       ↓
Carbon credit minted (on-chain hash generated)
       ↓
Company purchases credit → Farmer receives UPI payment
```

### Verification Layers

| Layer | Method | What it checks |
|---|---|---|
| **AI** | Photo analysis (Claude Vision — planned) | Biochar quality, color, porosity, carbon % estimate |
| **Satellite** | Sentinel-2, Landsat 8, MODIS (FIRMS) | No stubble burn detected at GPS coordinates |
| **Field Validator** | On-site visit with GPS + photos | Physical burial depth, location match |

Each submission passes all three layers before a credit is minted.

---

## User Roles

SoilStack has three distinct user-facing interfaces, each accessed from a single role-selection screen:

### 🌾 Farmer
Smallholder farmers in high-burn regions (Punjab, Haryana).

| Screen | Purpose |
|---|---|
| **Home** | View enrolled campaign, earnings summary, submission history with live status |
| **Submit** | 3-step flow: capture biochar photo → mark GPS burial location + depth → confirm AI score and submit |
| **Guide** | Step-by-step biochar making instructions |
| **Pyrolysis Setup** | Directory of local pyrolysis providers — professional vendors, subsidized NGOs, DIY Kon Tiki kilns |

**Payment**: Farmers receive INR payments via UPI (or M-Pesa for other regions) once their credit is minted.

### 🏢 Company (Buyer)
Corporate sustainability teams purchasing carbon removal.

| Screen | Purpose |
|---|---|
| **Campaigns** | View active campaigns, create new campaigns (set name, region, crop type, price per tonne) |
| **Verify** | Oversee pending validator jobs; can manually start verification workflows |
| **Satellite** | Real-time satellite monitoring dashboard — see which enrolled farms are clear vs. burn detected, with satellite source and confidence level |
| **Partners** | Connect with accredited Validating Authorities (SGS India, Bureau Veritas, Control Union); request partnerships, message partners, view active jobs |

Companies fund campaigns: they set a price per tonne of CO₂ and a maximum capacity, farmers enroll, and the company pays for verified credits.

### 🔍 Authority (Validator)
Accredited third-party oversight bodies.

| Screen | Purpose |
|---|---|
| **Overview** | High-level dashboard: total campaigns, farmers, verified tonnes across all active campaigns |
| **Jobs** | Pending field verification assignments — distance from farm, AI score, submission details |
| **Active** | Manage in-progress verification: arrival confirmation, photo checklist (burial + depth), GPS match |
| **Profile** | Validator stats, rating, completed jobs |

Validators are dispatched per submission after AI and satellite checks pass. They physically visit farms, take photos, confirm burial depth, and approve or flag the submission.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React Native + Expo (SDK 54), file-based routing via Expo Router |
| **Language** | TypeScript |
| **State Management** | Zustand (per-role stores: `farmerStore`, `buyerStore`, `validatorStore`, `authStore`) |
| **Backend / DB** | Supabase (PostgreSQL + Auth + Storage — schema in `/supabase/seed.sql`) |
| **Data Fetching** | TanStack React Query |
| **Maps** | `react-native-maps` |
| **Camera / Media** | `expo-camera`, `expo-image-picker`, `expo-location` |
| **Animations** | `moti`, React Native Reanimated |
| **UI** | Custom design system — "TerraForge Industrial" dark theme |
| **Charts** | `react-native-gifted-charts` |
| **Fonts** | Space Grotesk (display), DM Sans (body), JetBrains Mono (data) |

---

## Project Structure

```
soilstack/
├── app/
│   ├── index.tsx              # Animated splash screen with role-based routing
│   ├── onboarding/
│   │   ├── role.tsx           # Role selection (Farmer / Company / Authority)
│   │   ├── phone.tsx          # Phone number entry
│   │   └── verify.tsx         # OTP verification
│   ├── (farmer)/
│   │   ├── home.tsx           # Dashboard: campaigns, earnings, submissions
│   │   ├── submit.tsx         # 3-step biochar submission flow
│   │   ├── guide.tsx          # How to make biochar
│   │   └── pyrolysis.tsx      # Pyrolysis provider directory
│   ├── (buyer)/
│   │   ├── market.tsx         # Campaign management + creation
│   │   ├── verify.tsx         # Validator job oversight
│   │   ├── satellite.tsx      # Satellite monitoring dashboard
│   │   ├── portfolio.tsx      # Purchased credits portfolio
│   │   └── partners.tsx       # Validating authority directory
│   └── (validator)/
│       ├── jobs.tsx           # Authority overview + campaign listing
│       ├── active.tsx         # Active verification workflow
│       └── profile.tsx        # Validator stats and profile
├── lib/
│   ├── types.ts               # All TypeScript interfaces (Submission, Campaign, Farmer, etc.)
│   ├── theme.ts               # Design tokens — colors, fonts, spacing, radii
│   ├── mockData.ts            # Demo data (campaigns, submissions, satellite checks, etc.)
│   └── supabase.ts            # Supabase client initialization
├── stores/
│   ├── authStore.ts           # Auth state + role-based login helpers
│   ├── farmerStore.ts         # Farmer submissions, campaigns, earnings, pyrolysis providers
│   ├── buyerStore.ts          # Company campaigns, validator jobs, satellite checks, authorities
│   └── validatorStore.ts      # Authority campaign overview and stats
├── components/
│   └── ui/                    # Shared UI components (Card, Button, Badge, Input, QualityDots)
└── supabase/
    ├── seed.sql               # Database schema and seed data
    └── functions/             # Supabase Edge Functions
```

---

## Data Model

The core submission lifecycle is campaign-driven:

```
Company → Campaign → Farmer Submission → Verification → Credit → Payment
```

Key types (see `lib/types.ts`):

- **`Submission`** — A single biochar burial event. Tracks all three verification flags (`ai_verified`, `satellite_verified`, `validator_verified`), carbon tier (`standard` / `premium` / `ultra`), credit hash, and payment status through 9 lifecycle states from `draft` → `paid`.
- **`Campaign`** — A company's buying program. Defines region, crop type, price per tonne, and max capacity. Farmers enroll in campaigns.
- **`SatelliteEvent`** — FIRMS data point: GPS, satellite source (Sentinel-2, Landsat 8, MODIS), confidence, and `burn_detected` / `no_burn_season_clear` result.
- **`ValidationJob`** — Assignment dispatched to a field validator after satellite check passes. Contains GPS, distance, arrival/completion timestamps, and photo evidence URLs.
- **`CreditRegistry`** — Immutable record of a minted carbon credit. Includes credit hash, tonnes, quality score, carbon tier, price, and retirement status.

---

## Carbon Tiers

Biochar quality is scored by AI on photo analysis:

| Tier | Quality Score | Est. Carbon % | Price Range |
|---|---|---|---|
| **Standard** | 1–2 | ~40–60% | $45–55/tonne |
| **Premium** | 3–4 | ~60–75% | $55–70/tonne |
| **Ultra** | 5 | >75% | $70–85/tonne |

---

## Prototype Status

This is a functional MVP with demo data. The following are **not yet integrated**:

- **Claude Vision AI** — Photo analysis currently uses mock scoring. The planned integration will use Claude Vision for real biochar quality assessment (color, porosity, structure). Companies can optionally pay for automated AI verification; otherwise validators review manually.
- **Real satellite data pipeline** — Earth Engine / FIRMS integration is designed but not live; satellite checks use mock data.
- **Supabase backend** — Schema and seed SQL are complete; the app currently runs on local Zustand mock state.
- **Carbon registry integration** — Credit minting uses a hashed ID; full Verra / Gold Standard registry integration is planned.
- **Farmer dispute flow** — Planned: farmers can flag incorrect automatic decisions for human review.
- **Real UPI / M-Pesa disbursement** — Payment records exist in the data model; live payment rails are not yet connected.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Android emulator, iOS simulator, or the [Expo Go](https://expo.dev/go) app

### Install & Run

```bash
# Install dependencies
npm install

# Start the dev server
npx expo start
```

Scan the QR code with Expo Go, or press `a` for Android / `i` for iOS simulator.

### Role Selection

On first launch you'll see the role picker. Select any role to enter the corresponding demo experience — no credentials required in the prototype.

### Environment Variables

Copy `.env` and fill in your Supabase credentials when connecting the live backend:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Roadmap

- [ ] Claude Vision API integration for automated biochar scoring
- [ ] Live Supabase backend (replace mock stores)
- [ ] Google Earth Engine / FIRMS satellite pipeline
- [ ] Real UPI / M-Pesa payment disbursement
- [ ] Verra / Gold Standard carbon registry integration
- [ ] Farmer dispute and appeal flow
- [ ] Multi-language support (Hindi, Punjabi)
- [ ] Pilot with real farmers in Punjab / Haryana
- [ ] Expansion to other soil carbon and land-based climate interventions

---

## License

Private / prototype. Not licensed for production use without permission.
