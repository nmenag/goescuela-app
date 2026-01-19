# 🚀 Goescuela LMS - Quick Start Guide

## Installation & Setup

### Prerequisites

- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator or Android Emulator (or Expo Go app on physical device)

### Step 1: Install Dependencies

```bash
cd /home/nmenag/personal-projects/goescuela-app
npm install
```

### Step 2: Start the Development Server

```bash
npm start
# or
expo start
```

### Step 3: Run on Device/Simulator

```bash
# iOS Simulator
press 'i'

# Android Emulator
press 'a'

# Expo Go (scan QR code with Expo Go app)
# Camera will automatically open
```

---

## 🎓 Using the Application

### Login

1. Open the app - you'll see the login screen
2. Use demo credentials:
   - **Email**: sarah@example.com
   - **Password**: password123
3. Tap "Sign In"

### Main Navigation (Bottom Tab Bar)

#### Home Tab

- View personalized welcome message
- See your course in progress with circular progress indicator
- Browse featured course categories
- Discover recommended courses

#### My Courses Tab

- View all available courses
- See course details (thumbnail, title, instructor, rating, price)
- Tap any course to view details

#### Course Detail Page

- Full course information
- Your progress (if enrolled)
- Course statistics
- "Start Learning" button → Opens Learning View
- "Take Quiz" button → Opens Quiz

#### Learning View

- **Curriculum Tab**: Accordion with modules/lessons
  - Expand each module to see lessons
  - Shows duration for each lesson
- **Overview Tab**: Course description and details
- **Resources Tab**: Download course materials (PDFs, links)

#### Quiz

1. **Intro Screen**: Review quiz details and instructions
2. **Questions**: Answer multiple-choice questions
   - Progress bar shows your position
   - Can navigate between questions
   - Can't submit until all answered
3. **Results**: See your score
   - Review all answers with explanations
   - Option to retake

#### Notifications Tab

- View all course notifications
- Color-coded by type
- Shows timestamps

#### Profile Tab

- View your information
- Check your statistics (courses enrolled, average progress)
- Account settings
- Help & support
- Sign out button

---

## 📁 Project Structure Quick Reference

```
goescuela-app/
├── app/
│   ├── _layout.tsx              ← Auth routing
│   ├── login.tsx                ← Login screen
│   ├── course-detail.tsx        ← Course page
│   ├── learning-view.tsx        ← Learning interface
│   ├── quiz.tsx                 ← Quiz system
│   └── (tabs)/
│       ├── _layout.tsx          ← Tab navigation
│       ├── index.tsx            ← Home
│       ├── courses.tsx          ← My Courses
│       ├── notifications.tsx    ← Notifications
│       └── profile.tsx          ← Profile
├── components/                  ← Reusable UI
│   ├── circular-progress.tsx
│   ├── course-card.tsx
│   ├── category-card.tsx
│   ├── accordion.tsx
│   ├── tabs.tsx
│   └── ...others
├── context/
│   └── AuthContext.tsx          ← Auth logic
├── data/
│   └── mockData.ts              ← All app data
├── constants/
│   └── theme.ts
└── hooks/
    └── Color scheme hooks
```

---

## 🎨 Customization Guide

### Change Primary Color

Edit each file and replace `#FAE0F0` with your color:

- [app/login.tsx](app/login.tsx#L1)
- [app/(tabs)/\_layout.tsx](<app/(tabs)/_layout.tsx#L1>)
- [app/(tabs)/index.tsx](<app/(tabs)/index.tsx#L1>)
- And other component files

### Add More Courses

Edit [data/mockData.ts](data/mockData.ts):

```typescript
// Add to mockCourses array
{
  id: 'course-6',
  title: 'Your Course Title',
  description: 'Description...',
  // ... other fields
}
```

### Add Quiz Questions

Edit [data/mockData.ts](data/mockData.ts):

```typescript
mockQuizzes.push({
  id: "quiz-2",
  title: "New Quiz",
  courseId: "course-X",
  questions: [
    {
      id: "q-1",
      question: "Your question?",
      options: ["A", "B", "C", "D"],
      correctAnswer: 0,
      explanation: "Explanation...",
    },
  ],
  duration: 15,
  passingScore: 70,
});
```

### Update User Info

Edit [data/mockData.ts](data/mockData.ts) → `mockStudents` array

### Change Enrollment

Edit student's `enrolledCourses` array in [data/mockData.ts](data/mockData.ts)

---

## 🔍 Key Features Showcase

### Feature: Circular Progress Bar

- **File**: [components/circular-progress.tsx](components/circular-progress.tsx)
- **Usage**: Shows course progress percentage
- **Customizable**: Size, color, stroke width

### Feature: Accordion Curriculum

- **File**: [components/accordion.tsx](components/accordion.tsx)
- **Usage**: Expand/collapse modules and lessons
- **Animated**: Smooth layout transitions

### Feature: Tabbed Content

- **File**: [components/tabs.tsx](components/tabs.tsx)
- **Usage**: Switch between Curriculum, Overview, Resources
- **Smooth**: Content switches without navigation

### Feature: Quiz System

- **File**: [app/quiz.tsx](app/quiz.tsx)
- **3 States**: Intro → Questions → Results
- **Smart**: Validates answers, shows explanation, allows retake

---

## 📊 Data Flow Diagram

```
Login Screen
    ↓
AuthContext.tsx (validates credentials)
    ↓
Home (Tabs)
    ├── Browse Courses (mockData)
    ├── View My Courses (filtered from enrolled)
    └── See Progress (from mockData)

Course Card
    ↓
Course Detail
    ├── View Info (from mockData)
    ├── Check Progress (getStudentCourseProgress)
    ├── Start Learning → Learning View
    └── Take Quiz → Quiz

Learning View
    ├── Video Placeholder
    ├── Accordion (modules → lessons)
    └── Tabs (Overview/Resources/Curriculum)

Quiz
    ├── Intro (quiz info)
    ├── Questions (multiple choice)
    └── Results (score + review)

Profile
    ├── User Info
    ├── Settings
    └── Sign Out → Login
```

---

## 🐛 Troubleshooting

### "Course not found" error

**Solution**: Check that `courseId` param matches a course in `mockData.ts`

### Styles not applying correctly

**Solution**: Verify colors are defined (check COLORS object at top of file)

### Quiz not submitting

**Solution**: Make sure all questions are answered (button disabled otherwise)

### Progress not showing

**Solution**: Verify course is in `mockStudents[0].enrolledCourses` array

---

## ✨ Code Quality

- ✅ **TypeScript** for type safety
- ✅ **Component composition** for reusability
- ✅ **Consistent naming** (camelCase, meaningful names)
- ✅ **Organized structure** (logical file placement)
- ✅ **Accessibility** (44px+ touch targets, high contrast)
- ✅ **Responsive design** (mobile-first approach)
- ✅ **Performance** (optimized renders, proper keys)

---

## 📚 Learning Resources

### React Native Docs

https://reactnative.dev/

### Expo Documentation

https://docs.expo.dev/

### Expo Router (Navigation)

https://docs.expo.dev/routing/introduction/

### React Context API

https://react.dev/reference/react/useContext

---

## 🎯 Next Steps (Optional Enhancements)

1. **Backend Integration**
   - Replace mockData with API calls
   - Add real authentication
   - Store user progress

2. **Advanced Features**
   - Search and filter courses
   - User-to-user messaging
   - Download certificates
   - Real video streaming

3. **Performance**
   - Implement FlatList for large lists
   - Lazy load images
   - Code splitting

4. **Analytics**
   - Track user behavior
   - Monitor quiz performance
   - Course completion rates

---

## 📞 Support

For issues or questions:

1. Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
2. Review [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
3. Check file comments and inline documentation
4. Verify mockData structure

---

## 🎉 You're All Set!

The application is fully functional and ready to use. Start by:

1. Running the app with `npm start`
2. Logging in with the demo credentials
3. Exploring all screens and features
4. Customizing the data and styles as needed

**Happy Learning! 🚀**
