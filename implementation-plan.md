# Baby Sleep Tracker — Implementation Plan (Updated)

## Overview
A mobile‑friendly web application built with **React + TypeScript + Vite**, styled with **Tailwind CSS**, using **Firebase Authentication (Email/Password only in UI)** and **Cloud Firestore** as the backend. The app allows users to record baby sleep cycles with “Asleep” and “Awake” buttons, persists sleep‑in‑progress state, displays a stopwatch, and shows daily sleep records sorted newest → oldest.

The app supports multiple devices signed in simultaneously and uses **NZ timezone** for all date grouping.

Users can **delete** sleep entries and **edit** start/end times to correct mistakes.

---

## Tech Stack
- React + TypeScript + Vite  
- Tailwind CSS  
- Firebase Web SDK (Auth + Firestore)  
- date-fns (or similar) for timezone/date formatting  

---

## Authentication Requirements
- Email/Password login only in UI  
- Google login enabled in Firebase but hidden  
- Auto-create user document on first login  
- Auto-create `sleepState/state` document  
- Persistent login across sessions  
- Multi-device sign-in supported  

---

## Firestore Schema

### `/users/{userId}`
Empty document or minimal metadata.

### `/users/{userId}/sleepState/state`
    {
      "inProgress": false,
      "start": null
    }

### `/users/{userId}/sleepCycles/{cycleId}`
    {
      "start": "Timestamp",
      "end": "Timestamp | null",
      "durationMs": "number | null",
      "date": "YYYY-MM-DD (NZ timezone)",
      "inProgress": true
    }

---

## Firestore Security Rules
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /users/{userId}/{document=**} {
          allow read, write: if request.auth != null && request.auth.uid == userId;
        }
      }
    }

---

## App Screens

### 1. Login Screen
- Email field  
- Password field  
- Sign In button  
- Create Account link  
- No Google login button  

---

### 2. Main Screen

#### Header
- Date picker  
- Left/right arrows  
- Right arrow disabled on “today”  

#### Sleep Controls
- **Asleep** button (enabled when no sleep in progress)  
- **Awake** button (enabled when sleep in progress)  

#### Stopwatch
- Visible only when sleep is in progress  
- Continues across reloads and devices  
- Based on `sleepState.start`  

#### Daily Sleep List
- Sorted newest → oldest  
- Each entry shows:
  - Start time  
  - End time  
  - Duration  
- If none: “No sleeps yet”

#### Sleep Entry Actions
Each sleep entry includes:

- **Delete button**
  - Removes the `sleepCycles` document  
  - If deleted entry was in-progress, reset `sleepState/state`  

- **Edit button**
  - Opens modal or inline editor  
  - Allows editing:
    - Start time  
    - End time  
  - Duration recalculated automatically  
  - Editing into an in-progress state is disallowed  

---

## State Logic

### Sleep Start
Writes sleepState + creates new sleepCycles entry.

### Sleep End
Updates sleepState + updates active sleepCycles entry.

### Delete Sleep
    deleteDoc(doc(db, "users", uid, "sleepCycles", cycleId));

### Edit Sleep
    updateDoc(doc(db, "users", uid, "sleepCycles", cycleId), {
      start: newStart,
      end: newEnd,
      durationMs: newEnd.toMillis() - newStart.toMillis()
    });

---

## Timezone Handling
- All date grouping uses NZ timezone  
- Daily sleeps fetched using `"YYYY-MM-DD"` NZ date string  

---

## Component Structure
    src/
      components/
        LoginForm.tsx
        DatePicker.tsx
        SleepControls.tsx
        Stopwatch.tsx
        SleepList.tsx
        SleepEntry.tsx
        EditSleepModal.tsx
      context/
        AuthContext.tsx
        SleepContext.tsx
      hooks/
        useAuth.ts
        useSleepState.ts
        useSleepCycles.ts
      utils/
        nzTime.ts
        formatDuration.ts
      firebase/
        config.ts
        auth.ts
        firestore.ts
      App.tsx
      main.tsx

---

## Required Features for Copilot to Generate
- Full Vite + React + TS scaffold  
- Tailwind setup  
- Firebase initialization  
- Email/Password auth  
- Auto user document creation  
- Firestore CRUD  
- Stopwatch logic  
- NZ timezone utilities  
- Date picker + arrows  
- Mobile-first layout  
- Real-time listeners  
- Sorting newest → oldest  
- Disabled button logic  
- Delete sleep functionality  
- Edit sleep functionality  
- Modal for editing  
- No Google login UI  
- No password reset  

---

## Non-Goals
- No Google login button  
- No password reset  
- No desktop-specific layout  
- No server-side code  
- No analytics  
- No notifications  
- No admin panel  

---

## Deployment
Handled later. Copilot does not generate deployment config.

---

# End of Implementation Plan
