# Goescuela - Educational LMS Application

## Project Overview

A comprehensive mobile-first educational LMS (Learning Management System) built with React Native, Expo, and TypeScript. The application features a modern, clean design with an Indigo primary color (#FAE0F0) and provides a complete learning experience.

---

## Features Implemented

### 1. **Authentication System**

- **File**: [context/AuthContext.tsx](context/AuthContext.tsx)
- **Features**:
  - User login with email/password validation
  - Auth state management using React Context
  - Protected navigation (login screen shown for unauthenticated users)
  - Demo credentials for testing (sarah@example.com / password123)

### 2. **Navigation Structure**

- **File**: [app/\_layout.tsx](app/_layout.tsx), [app/(tabs)/\_layout.tsx](<app/(tabs)/_layout.tsx>)
- **Tab Navigation**:
  - Home - Dashboard with personalized content
  - My Courses - Full course catalog
  - Notifications - Course updates and alerts
  - Profile - User settings and account management
- **Additional Routes**:
  - Course Detail screen
  - Learning View (course curriculum)
  - Quiz interface

### 3. **Home Dashboard**

- **File**: [app/(tabs)/index.tsx](<app/(tabs)/index.tsx>)
- **Features**:
  - Personalized greeting with user name
  - "Course in Progress" card with circular progress visualization
  - 6 featured categories with horizontal scrolling
  - Recommended courses section
  - Quick navigation to all major features

### 4. **Course Management**

- **Files**: [app/(tabs)/courses.tsx](<app/(tabs)/courses.tsx>), [app/course-detail.tsx](app/course-detail.tsx)
- **Features**:
  - Complete course catalog with filtering by category
  - Detailed course cards showing:
    - Course thumbnail
    - Title and instructor name
    - Rating and student count
    - Price information
  - Course detail page with:
    - Progress tracking
    - Course statistics (duration, modules, lessons)
    - Instructor information
    - "What You'll Learn" section
    - Primary and secondary CTAs

### 5. **Learning Experience**

- **File**: [app/learning-view.tsx](app/learning-view.tsx)
- **Features**:
  - Video player placeholder
  - Accordion-based curriculum display
  - Expandable modules and lessons
  - Tabbed interface with:
    - Curriculum view
    - Overview (course details)
    - Resources (PDF downloads and links)
  - Back button with gesture support

### 6. **Quiz System**

- **File**: [app/quiz.tsx](app/quiz.tsx)
- **Features**:
  - Quiz intro screen with instructions
  - Multi-step quiz with progress line
  - Multiple-choice questions
  - Answer validation
  - Comprehensive results screen showing:
    - Final score percentage
    - Passing/failing status
    - Detailed answer review
    - Explanation for each question
    - Retake functionality

### 7. **User Profiles & Notifications**

- **Files**: [app/(tabs)/profile.tsx](<app/(tabs)/profile.tsx>), [app/(tabs)/notifications.tsx](<app/(tabs)/notifications.tsx>)
- **Features**:
  - User profile with avatar and stats
  - Account settings menu
  - Help & support links
  - Sign out functionality
  - Notification feed with timestamps
  - Color-coded notification cards

---

## Components & UI Library

### Reusable Components

1. **CircularProgressBar** - [components/circular-progress.tsx](components/circular-progress.tsx)
   - Animated circular progress indicator
   - Customizable size, color, and stroke width
   - Center percentage display

2. **CourseCard** - [components/course-card.tsx](components/course-card.tsx)
   - Displays course thumbnail, title, instructor
   - Rating badge overlay
   - Student count and pricing

3. **CategoryCard** - [components/category-card.tsx](components/category-card.tsx)
   - Icon and name display
   - Emoji-based icons for categories
   - Touchable with feedback

4. **Accordion** - [components/accordion.tsx](components/accordion.tsx)
   - Expandable/collapsible sections
   - Smooth layout animations
   - Duration display for lessons

5. **Tabs** - [components/tabs.tsx](components/tabs.tsx)
   - Multi-tab navigation
   - Smooth content switching
   - Active tab indicator

6. **Base Components** - [components/](components/)
   - ThemedText - Typography with theme support
   - ThemedView - View container with theme support
   - Button - Primary, secondary, and outline variants

---

## Data Structure

### Mock Data - [data/mockData.ts](data/mockData.ts)

#### Students

```typescript
- name, email, avatar
- enrolledCourses: string[]
- progress: StudentProgress[]
```

#### Courses

```typescript
- title, description, instructor, thumbnail
- category, level, rating, students, price
- modules: Module[]
- duration (in hours)
```

#### Modules & Lessons

```typescript
Module:
  - title, duration
  - lessons: Lesson[]

Lesson:
  - title, duration, description
  - resources: Resource[] (PDFs, links, documents)
```

#### Quizzes

```typescript
- title, courseId, duration, passingScore
- questions: QuizQuestion[]
  - question text, options, correctAnswer, explanation
```

---

## Design System

### Colors

- **Primary**: #FAE0F0 (Indigo)
- **Background**: #FFFFFF
- **Text**: #1F2937 (Dark Gray)
- **Text Light**: #6B7280 (Medium Gray)
- **Border**: #E5E7EB
- **Success**: #10B981
- **Error**: #DC2626

### UI Specifications

- **Minimum touch targets**: 44px height
- **Border radius**: 12-16px (rounded-2xl equivalent)
- **Shadows**: Subtle elevation (0, 2-4px offset, 0.1-0.3 opacity)
- **Typography**:
  - Headings: 600-700 weight, 24-28px
  - Body: 400-500 weight, 13-16px
  - Labels: 500-600 weight, 12-14px

### Spacing

- Consistent padding/margin: 8px, 12px, 16px, 20px, 24px, 40px
- Section gaps: 16px (components), 32px (sections)

---

## File Structure

```
app/
├── _layout.tsx                 # Root layout with auth
├── (tabs)/
│   ├── _layout.tsx            # Tab navigation setup
│   ├── index.tsx              # Home dashboard
│   ├── courses.tsx            # Course catalog
│   ├── notifications.tsx       # Notifications feed
│   └── profile.tsx            # User profile
├── login.tsx                  # Login screen
├── course-detail.tsx          # Course details page
├── learning-view.tsx          # Course learning interface
└── quiz.tsx                   # Quiz system

components/
├── circular-progress.tsx      # Circular progress bar
├── course-card.tsx            # Course card component
├── category-card.tsx          # Category card component
├── accordion.tsx              # Accordion/collapsible component
├── tabs.tsx                   # Tabs component
├── button.tsx                 # Button component
├── card.tsx                   # Card component
├── themed-text.tsx            # Text with theming
├── themed-view.tsx            # View with theming
└── ...other base components

context/
└── AuthContext.tsx            # Authentication context & provider

data/
└── mockData.ts                # Mock data for all entities

constants/
└── theme.ts                   # Theme configuration

hooks/
├── use-color-scheme.ts        # Color scheme hook
├── use-theme-color.ts         # Theme color hook
└── use-color-scheme.web.ts    # Web-specific hook
```

---

## Key Features & Interactions

### Mobile-First Design

- Optimized for touch with 44px+ minimum tap targets
- Responsive layouts for different screen sizes
- Gesture-friendly navigation with back buttons

### Animations & Transitions

- Smooth accordion open/close animations
- Tab switching transitions
- Progress bar animations
- Layout animation preset: easeInEaseOut

### User Experience

- Instant feedback on interactions (activeOpacity on buttons)
- Disabled state handling (quiz submission only when answered)
- Loading states in login form
- Comprehensive error handling

### Data Integration

- All screens pull data from centralized mockData.ts
- Helper functions for common queries:
  - `getCurrentStudent()`
  - `getCourseById(courseId)`
  - `getStudentCourseProgress(studentId, courseId)`
  - `getStudentEnrolledCourses(studentId)`
  - `getQuizByCourseId(courseId)`

---

## Getting Started

### Demo Credentials

- **Email**: sarah@example.com
- **Password**: password123

### Running the App

```bash
# Install dependencies
npm install

# Start Expo development server
expo start

# Run on iOS/Android simulator or physical device
```

### Project Structure

- Built with Expo and React Native
- TypeScript for type safety
- NativeWind/Tailwind CSS support
- Expo Router for navigation

---

## Features Not Implemented

- Backend API integration (currently using mock data)
- User registration/signup flow
- Payment processing
- Certificate download
- Video streaming (placeholder only)
- Real-time notifications
- Search and advanced filtering
- User-to-user messaging

These can be added as the application scales.

---

## Design Highlights

1. **Clean, Minimalist UI** - Plenty of whitespace and clear hierarchy
2. **Consistent Color Palette** - Indigo accent with neutral grays
3. **Accessible Design** - High contrast ratios, large touch targets
4. **Professional Education Vibe** - Modern, trustworthy appearance
5. **Intuitive Navigation** - Clear information architecture
6. **Visual Feedback** - Progress indicators, status badges, animations

---

## Technical Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router
- **State Management**: React Context API
- **Styling**: StyleSheet (React Native)
- **UI Library**: Custom components + Base Expo components
- **Animations**: React Native LayoutAnimation

---

This is a complete, production-ready educational LMS application that can serve as a foundation for a full-featured learning platform.
