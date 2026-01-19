# Goescuela LMS - Quick Reference Guide

## 🎯 Core Screens

### Authentication

- **Login Screen** → `/app/login.tsx`
  - Email/password validation
  - Demo credentials built-in
  - Auto-navigates to Home on success

### Main App (Tabbed Interface)

1. **Home** → `/app/(tabs)/index.tsx`
   - Personalized welcome
   - Course in progress with circular progress
   - Featured categories carousel
   - Recommended courses

2. **My Courses** → `/app/(tabs)/courses.tsx`
   - Complete course catalog
   - Browse all available courses
   - Tap to view course details

3. **Notifications** → `/app/(tabs)/notifications.tsx`
   - Course updates
   - Assignment reminders
   - Certificate notifications

4. **Profile** → `/app/(tabs)/profile.tsx`
   - User info and avatar
   - Account settings
   - Statistics (courses, progress)
   - Sign out button

### Detail Screens

- **Course Detail** → `/app/course-detail.tsx`
  - Full course information
  - Progress tracking
  - CTA buttons: "Start Learning" & "Take Quiz"

- **Learning View** → `/app/learning-view.tsx`
  - Video player placeholder
  - Accordion curriculum (modules/lessons)
  - Overview, Resources, and Curriculum tabs
  - Resource downloads

- **Quiz** → `/app/quiz.tsx`
  - Quiz intro with instructions
  - Multi-step questions with progress bar
  - Answer validation and review
  - Results with detailed feedback

---

## 🎨 Design Tokens

### Colors

```
Primary (Indigo): #FAE0F0
Success: #10B981
Error: #DC2626
Text: #1F2937
Text Light: #6B7280
Border: #E5E7EB
Background: #FFFFFF
```

### Typography

```
H1: 28px, 700 weight
H2: 24px, 700 weight
H3: 18px, 700 weight
Body: 14px, 400-500 weight
Small: 12px, 400 weight
```

### Spacing

```
xs: 8px
sm: 12px
md: 16px
lg: 20px
xl: 24px
xxl: 40px
```

---

## 📦 Component Library

### Layout Components

- **ThemedView** - Container with theme support
- **ThemedText** - Text with theme support
- **Accordion** - Expandable sections
- **Tabs** - Multi-tab navigation

### Feature Components

- **CircularProgressBar** - Animated progress circle
- **CourseCard** - Course preview card
- **CategoryCard** - Category icon card

### Input Components

- **Button** - Primary, secondary, outline variants
- **TextInput** - (React Native native)
- **TouchableOpacity** - Button-like interactions

---

## 🔄 Data Flow

### Mock Data Location: `/data/mockData.ts`

**Key Entities:**

```typescript
mockStudents[]          // Current: 1 student
mockCourses[]           // 5 complete courses
mockCategories[]        // 6 featured categories
mockQuizzes[]           // 1 quiz (more can be added)
```

**Helper Functions:**

```typescript
getCurrentStudent()                    // Returns main user
getCourseById(courseId)               // Get course details
getStudentEnrolledCourses(studentId)  // Get user's courses
getStudentCourseProgress(...)         // Get progress data
getQuizByCourseId(courseId)           // Get course quiz
```

### Course Structure

```
Course
├── id, title, description
├── instructor { id, name, avatar }
├── thumbnail, category, level
├── rating, students, price
├── duration (hours)
└── modules[]
    └── Module
        ├── id, title, duration
        └── lessons[]
            └── Lesson
                ├── id, title, duration
                ├── description
                └── resources[]
                    └── { id, title, type, url }
```

---

## 🔐 Authentication

### Login Flow

1. User enters email & password on login screen
2. Auth context validates credentials
3. On success: Set `isAuthenticated = true`, store user object
4. Navigation automatically switches to tabbed app
5. On logout: Clear auth state, return to login

### Demo Account

```
Email: sarah@example.com
Password: password123
```

---

## 🎬 Navigation Guide

### Expo Router Setup

```typescript
// Root layout (_layout.tsx)
- Shows login screen if !isAuthenticated
- Shows tabbed interface if isAuthenticated

// Tab layout ((tabs)/_layout.tsx)
- 4 tabs: Home, Courses, Notifications, Profile

// Additional routes
- course-detail: [courseId]
- learning-view: [courseId]
- quiz: [courseId]
```

### Navigation Patterns

```typescript
// Go to course detail
router.push({
  pathname: "/course-detail",
  params: { courseId },
});

// Go to learning view
router.push({
  pathname: "/learning-view",
  params: { courseId },
});

// Go back
router.back();
```

---

## 📊 Styling Standards

### Border Radius

- Cards: 12-16px
- Buttons: 10-12px
- Small elements: 8px

### Shadows

```typescript
shadowColor: primaryColor
shadowOffset: { width: 0, height: 4 }
shadowOpacity: 0.1-0.3
shadowRadius: 8
elevation: 3-5  // Android
```

### Touch Targets

- Minimum 44px height
- Minimum 44px width
- activeOpacity: 0.7 for feedback

---

## ✅ Completed Features

- [x] Authentication system
- [x] Tab navigation (Home, Courses, Notifications, Profile)
- [x] Course catalog with cards
- [x] Course detail view
- [x] Learning view with accordion curriculum
- [x] Tabbed content (Overview, Resources, Curriculum)
- [x] Quiz system (intro, questions, results)
- [x] Progress tracking with circular indicator
- [x] Category carousel
- [x] Profile management
- [x] Mock data system
- [x] Responsive design
- [x] Indigo color scheme
- [x] Professional styling

---

## 📝 Adding New Features

### Add a New Course

Edit `/data/mockData.ts`:

```typescript
mockCourses.push({
  id: "course-6",
  title: "New Course Title",
  description: "...",
  instructor: { id: "...", name: "...", avatar: "..." },
  thumbnail: "https://...",
  // ... rest of fields
});
```

### Add a New Category

Edit `/data/mockData.ts`:

```typescript
mockCategories.push({
  id: "cat-7",
  name: "New Category",
  icon: "star", // emoji key
});
```

### Add a Quiz

Edit `/data/mockData.ts`:

```typescript
mockQuizzes.push({
  id: "quiz-2",
  title: "New Quiz",
  courseId: "course-X",
  questions: [
    {
      id: "q-1",
      question: "Question text?",
      options: ["A", "B", "C", "D"],
      correctAnswer: 0,
      explanation: "Explanation...",
    },
  ],
  duration: 15,
  passingScore: 70,
});
```

---

## 🚀 Performance Tips

1. Use `FlatList` instead of map for large lists
2. Memoize heavy components with `React.memo`
3. Optimize images with proper sizing
4. Use `scrollEventThrottle={16}` for scroll events
5. Lazy load course data when possible

---

## 🐛 Common Issues & Solutions

**Issue**: Tab not showing

- **Solution**: Check tab name matches route file name exactly

**Issue**: Navigation not working

- **Solution**: Ensure route exists in \_layout.tsx

**Issue**: Styling looks off

- **Solution**: Check color variables (COLORS object in each file)

**Issue**: Progress not updating

- **Solution**: Verify mockData course ID matches params

---

## 📱 Responsive Behavior

- **Mobile (< 600px)**: Full width, single column
- **Tablet (600-1000px)**: Adjusted padding, wider cards
- **Web (> 1000px)**: Maximum width constraints

All components are optimized for mobile-first design!

---

## 🔗 Useful File References

| File                       | Purpose                            |
| -------------------------- | ---------------------------------- |
| `/data/mockData.ts`        | All data (courses, users, quizzes) |
| `/context/AuthContext.tsx` | Authentication logic               |
| `app/_layout.tsx`          | Root navigation & auth flow        |
| `app/(tabs)/_layout.tsx`   | Tab bar configuration              |
| `components/`              | Reusable UI components             |
| `/constants/theme.ts`      | Theme configuration                |

---

## 💡 Best Practices Used

✅ TypeScript for type safety
✅ Component composition & reusability
✅ Context API for state management
✅ Consistent naming conventions
✅ Organized file structure
✅ Accessible design (touch targets, contrast)
✅ Responsive layouts
✅ Mock data separation
✅ Clean code principles
✅ Performance optimization

---

**Built with ❤️ as a high-fidelity educational LMS application**
