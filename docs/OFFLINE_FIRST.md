# Offline-First Strategy

GoEscuela is designed to work reliably in low-connectivity environments. We achieve this through a multi-tiered storage and synchronization strategy.

## 💾 Storage Tiers

1.  **WatermelonDB (Relational)**:
    - Used for structured data like Courses, Modules, and Lessons.
    - Highly performant for large datasets.
    - Observables-based, ensuring the UI updates automatically when the DB changes.
2.  **MMKV (Key-Value)**:
    - Replaces AsyncStorage for high-speed access to Auth tokens, user preferences, and small app state.
3.  **Expo File System**:
    - Used for binary content (Videos, PDFs, Audio).
    - Managed by the `DownloadManager`.

## 🔄 Synchronization Pattern

We follow an **Offline-First / Sync Later** approach:

### 1. Downstream (Server -> Device)

- Content (Courses/Lessons) is fetched from the API via **TanStack Query**.
- Successfully fetched content is persisted into **WatermelonDB**.
- The UI observes WatermelonDB, providing an instant "cached" view even before the API returns.

### 2. Upstream (Device -> Server)

- User actions (Completing a lesson, submitting a quiz) are recorded in WatermelonDB with a `sync_status = 'pending'`.
- The **SyncManager** detects internet connectivity via `NetInfo`.
- When online, the SyncManager pushes all `pending` records to the server and updates their status to `synced`.

## 📂 Content Downloads

Users can manually download modules for full offline access.

- **DownloadManager** handles the background downloading.
- Paths to local files are stored in the database, allowing the `VideoPlayer` to switch between local and remote URLs seamlessly.
