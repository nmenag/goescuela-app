# GoEscuela App Agent Rules 🎓

This document outlines the architectural patterns, styling conventions, developer guidelines, and core rules that must be followed by AI agents when working on the GoEscuela App project.

---

## 🛠️ Tech Stack & Core Libraries

- **Framework**: React Native + Expo (SDK 55)
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: Zustand
- **Local Database**: WatermelonDB (SQLite)
- **Networking**: TanStack Query (React Query)
- **Sync & Connectivity**: NetInfo + Custom Sync Engine

---

## 🏗️ Architecture & Folder Structure

This codebase follows **Clean Architecture** combined with **Feature-based Modularization**. Business logic must always remain separate from presentation logic.

### Directory Structure

```text
src/
├── api/            # Global API config (TanStack Query, Axios)
├── application/    # Global/cross-cutting app coordination & state
├── components/     # Shared Design System (UI Atoms & Reusable Components)
├── core/           # Cross-cutting concerns (DB initialization, Sync, Storage)
├── domain/         # Global entities and repository interfaces
├── infrastructure/ # Global infrastructure logic
├── navigation/     # App routing and navigation structure
└── features/       # Feature-based modules
    └── [feature]/  # e.g., auth, courses, quiz
        ├── application/    # Zustand stores, Use Cases, and app services
        ├── infrastructure/ # Repositories and API client integrations
        └── presentation/   # Screens, Feature-specific Components, and Hooks
```

### The 4 Layers Guidelines

1. **Domain Layer (`src/domain` or `src/features/[feature]/domain`)**
   - Must contain pure data structures (Entities) and Repository interfaces.
   - **Strict Rule**: No UI dependencies, React hooks, or storage-specific logic.

2. **Infrastructure Layer (`src/features/[feature]/infrastructure`)**
   - Contains implementations of Repository interfaces.
   - Handles network requests, API serialization/deserialization, and WatermelonDB queries.

3. **Application Layer (`src/features/[feature]/application`)**
   - Orchestrates data flow between Domain and Presentation.
   - Houses Zustand stores and use-case orchestrators.

4. **Presentation Layer (`src/features/[feature]/presentation`)**
   - Houses Screens, Components, and Hooks.
   - Screens/Components should rely on custom hooks (e.g., `useCourses`) to access state or initiate actions.

---

## 💾 Offline-First & Database Rules

GoEscuela is designed to work reliably in low-connectivity environments using a multi-tiered storage approach.

1. **WatermelonDB Rules**:
   - Use WatermelonDB for structured data (Courses, Modules, Lessons, Progress).
   - Use WatermelonDB **observables** (`@legendapp/state` or Watermelon's standard observation hooks) to ensure the UI updates reactively when DB records change.
   - Do not perform expensive SQL queries directly on the UI thread. Use Repositories.

2. **Expo File System Rules**:
   - Use the Expo File System to manage downloaded binary contents (Videos, PDFs, Audio).
   - Refer to/integrate with the `DownloadManager` for tracking download tasks.
   - Store local filesystem paths in the database so UI components can fallback to local media when offline.

3. **Sync Strategy (Offline-First / Sync Later)**:
   - **Downstream**: Fetch data via TanStack Query -> Persist to WatermelonDB -> UI observes WatermelonDB.
   - **Upstream**: Local modifications must set `sync_status = 'pending'`.
   - **SyncManager**: Ensure actions are queued and automatically pushed when NetInfo detects connectivity.

---

## 🎨 Styling & Premium UI Guidelines

- **NativeWind**: Use NativeWind (Tailwind CSS) for styling. Do not introduce raw inline styles or standard React Native `StyleSheet` unless absolutely necessary for dynamic animations or complex layouts.
- **Aesthetic Excellence**: UI must feel modern, premium, and clean. Use cohesive colors, proper spacing hierarchy, modern typography, and smooth transitions.
- **No Placeholders**: Never use hardcoded placeholders or broken image URLs. If an asset is needed, make sure it is generated, downloaded, or uses an elegant vector icon or fallback indicator.

---

## ⚠️ Core Agent Behavior & Constraints

- **Correctness Over Speed**: Ensure correctness, readability, and reliability. Avoid clever hacks in favor of maintainable patterns.
- **Preserve Existing Behavior**: Do not modify or break working behavior unless explicitly requested.
- **Ambiguity**: If a requirement is ambiguous, ask the user for clarification instead of guessing.
- **Modular Code**: Keep files and functions small and single-purpose. Prefer composition.
- **No Direct Git Operations**: Do not run `git commit`, `git push`, or automatically create branches.
- **Conventional Commits**: When generating commit messages, format them according to `@commitlint/config-conventional` (e.g., `feat: ...`, `fix: ...`). Keep them brief and under 72 characters.
