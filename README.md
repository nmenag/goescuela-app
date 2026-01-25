# GoEscuela App 📚

A modern educational mobile application built with React Native and Expo, featuring interactive courses, lessons, and advanced quiz functionality.

## Features ✨

### Course Management
- Browse and explore educational courses
- Track progress across modules and lessons
- View course details with rich content

### Interactive Lessons
- Multiple content types: Video, Text, Quiz
- Progress tracking
- Seamless navigation between lessons

### Advanced Quiz System
The app includes a comprehensive quiz system with multiple question types:

#### Question Types
1. **Multiple Choice (Single Select)** - Radio button selection for one correct answer
2. **Multiple Choice (Multi Select)** - Checkbox selection for multiple correct answers
3. **True/False** - Binary choice questions
4. **Text Input** - Free-form text answers with multiple acceptable responses
5. **Sequence/Ordering** - Arrange items in correct order using up/down arrows
6. **Fill-in-the-Blank** - Complete sentences with missing words

#### Quiz Features
- ✅ Answer validation before proceeding
- ✅ Immediate feedback (correct/incorrect with explanations)
- ✅ Visual feedback with color-coded responses
- ✅ Progress tracking with score calculation
- ✅ Timer support per question
- ✅ Point multipliers (normal/double)
- ✅ Customizable passing scores

## Tech Stack 🛠️

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **Language**: TypeScript
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native
- **State Management**: React Hooks (useState, useEffect)

## Project Structure 📁

```
goescuela-app/
├── app/                      # Main application screens
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── index.tsx        # Home/Courses screen
│   │   └── profile.tsx      # Profile screen
│   ├── course/              # Course-related screens
│   │   └── [courseId].tsx   # Course detail view
│   ├── lesson/              # Lesson screens
│   │   └── [lessonId].tsx   # Lesson content viewer
│   ├── quiz/                # Quiz screens
│   │   └── [quizId].tsx     # Interactive quiz player
│   └── _layout.tsx          # Root layout configuration
├── components/              # Reusable components
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── constants/               # App constants
│   └── theme.ts            # Color themes and branding
├── data/                    # Mock data and types
│   └── mockData.ts         # Course, lesson, and quiz data
└── assets/                  # Images and static files
```

## Getting Started 🚀

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd goescuela-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app on your phone

## Development 💻

### Adding New Courses

Edit `data/mockData.ts` to add new courses:

```typescript
export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Your Course Title',
    description: 'Course description',
    // ... other fields
  }
];
```

### Creating Quiz Questions

The quiz system supports various question types. Example:

```typescript
{
  title: 'Question title',
  type: 'multiple-choice',
  allowMultipleAnswers: false, // true for multi-select
  feedback_on_correct: 'Great job!',
  feedback_on_incorrect: 'Try again.',
  answers: [
    { content: 'Answer 1', is_correct: true },
    { content: 'Answer 2', is_correct: false }
  ]
}
```

### Customizing Themes

Update `constants/theme.ts` to modify app colors:

```typescript
export const BrandingColors = {
  hotPink: '#EC4899',
  // Add your brand colors
};
```

## Key Components 🔑

### QuizScreen (`app/quiz/[quizId].tsx`)
- Handles all question types
- Validates user answers
- Provides immediate feedback
- Tracks scoring and progress

### LessonScreen (`app/lesson/[lessonId].tsx`)
- Displays lesson content (video, text, quiz)
- Manages lesson navigation
- Integrates with quiz system

### CourseScreen (`app/course/[courseId].tsx`)
- Shows course modules and lessons
- Displays progress indicators
- Handles course navigation

## Quiz Question Type Details 📝

### Single-Select Multiple Choice
- Uses radio buttons (○)
- Only one answer can be selected
- Set `allowMultipleAnswers: false`

### Multi-Select Multiple Choice
- Uses checkboxes (☐)
- Multiple answers can be selected
- Set `allowMultipleAnswers: true`
- Requires ALL correct answers to be selected

### Sequence Questions
- Items displayed with up/down arrows
- Users reorder items to match correct sequence
- Validates exact order match

### Fill-in-the-Blank
- Template string with `___` placeholders
- Multiple input fields for missing words
- Case-insensitive validation

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License.

## Support 💬

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ using React Native and Expo
