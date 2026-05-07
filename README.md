# GoEscuela App 🎓

A modern, offline-first Learning Management System (LMS) built with React Native and Expo.

## 🚀 Features

- **Offline-First**: Fully functional without internet connection using WatermelonDB.
- **Content Downloads**: Download videos and resources for offline learning.
- **Interactive Quizzes**: Multiple question types (sequence, choice, etc.) with local scoring.
- **Sync Engine**: Automatic background synchronization when connectivity is restored.
- **Premium UX**: Modern, fluid design using NativeWind and specialized UI components.

## 🏗️ Architecture

The project follows **Clean Architecture** and **Feature-based Modularization**. This structure ensures the app is scalable and easy to maintain.

- **Frontend**: React Native + Expo (SDK 55)
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: Zustand
- **Local Database**: WatermelonDB (SQLite)
- **Networking**: TanStack Query (React Query)
- **Persistence**: MMKV

### Detailed Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Offline & Sync Strategy](./docs/OFFLINE_FIRST.md)

## 🛠️ Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Start the App**:
   ```bash
   npx expo start
   ```

## 📂 Structure

```text
src/
├── api/            # API Client & Query Config
├── core/           # DB, Storage, Sync Engine
├── domain/         # Business Entities
└── features/       # Feature Modules (Auth, Courses, Quiz)
```

## 📄 License

Proprietary - GoEscuela 2024.
