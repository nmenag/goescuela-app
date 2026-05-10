# Application Architecture

This project follows **Clean Architecture** principles combined with **Feature-based Modularization**. This ensure the codebase remains scalable, testable, and maintainable as the LMS grows.

## 🏗️ The 4 Layers

### 1. Domain Layer (`src/domain`)

The heart of the application. It contains the business logic that is independent of any UI or framework.

- **Entities**: Pure data structures (e.g., `Course`, `Lesson`, `Student`).
- **Repositories (Interfaces)**: Contracts that define how data should be fetched or persisted, without specifying the implementation.

### 2. Infrastructure Layer (`src/features/*/infrastructure`)

Contains the implementation details of the repository interfaces.

- **API Clients**: Logic to communicate with the backend.
- **Database (WatermelonDB)**: Logic for local persistence.
- **Repositories (Implementations)**: Concrete classes that fulfill the Domain's repository contracts.

### 3. Application Layer (`src/features/*/application`)

Orchestrates the flow of data between the Domain and Presentation layers.

- **State Management (Zustand)**: Global and feature-specific stores.
- **Use Cases**: Specific business operations (e.g., `LoginUser`, `CompleteLesson`).

### 4. Presentation Layer (`src/features/*/presentation`)

The user interface.

- **Screens**: Higher-level components representing a full view.
- **Components**: Reusable UI atoms (Buttons, Cards).
- **Hooks**: Feature-specific logic tied to React's lifecycle (e.g., `useCourses`).

## 📁 Folder Structure

```text
src/
├── api/            # Global API config (TanStack Query, Axios)
├── components/     # Shared Design System (UI Atoms)
├── core/           # Cross-cutting concerns (DB init, Theme, Sync)
├── domain/         # Global entities and repository interfaces
└── features/       # Feature-based modules
    └── [feature]/  # e.g., auth, courses, quiz
        ├── application/    # Stores and Use Cases
        ├── infrastructure/ # Repositories and API logic
        └── presentation/   # Screens, Components, and Hooks
```

## 🔄 Data Flow

1. **Presentation** calls a **Hook**.
2. The **Hook** accesses the **Store (Application Layer)**.
3. The **Store** calls the **Repository (Infrastructure Layer)**.
4. The **Repository** fetches data (from API or DB) and maps it to **Entities (Domain Layer)**.
5. The **Store** updates, and the **Presentation** re-renders.
