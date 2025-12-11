# OgaTicha - Accessible Learning Platform

An accessible education platform built with Next.js 16, React 19, and Tailwind CSS.

## Features

### 🎓 Main Features

- **Classroom**: View and manage lecture notes with PDF support
- **AI Tutor**: Interactive chat interface with file upload support
- **Donate**: Support student goals with progress tracking
- **Authentication**: Login and registration pages
- **Settings**: Customizable user preferences and accessibility options

### ♿ Accessibility

- Voice mode toggle for visual/audio interaction
- High contrast mode
- Adjustable font sizes
- Material Symbols icons for better clarity
- Keyboard navigation support

## Project Structure

```
app/
├── auth/
│   ├── login/          # Login page
│   └── register/       # Registration page
├── classroom/          # Lecture notes feature
├── components/
│   └── BottomNav.tsx   # Shared bottom navigation
├── donate/             # Student goals donation feature
├── settings/           # User settings and preferences
├── tutor/              # AI tutor chat interface
├── globals.css         # Global styles with CSS variables
├── layout.tsx          # Root layout with fonts
└── page.tsx            # Home page with feature links
```

## Routes

- `/` - Home page with feature overview
- `/classroom` - Lecture notes and study materials
- `/tutor` - AI tutor chat interface
- `/donate` - Student fundraising goals
- `/auth/login` - User login
- `/auth/register` - User registration
- `/settings` - User settings and preferences

## Design System

### Colors

- **Primary**: `#f9f506` (Yellow)
- **Brand Purple**: `#4a148c`
- **Background Light**: `#f8f8f5`
- **Background Dark**: `#23220f`
- **Text Dark**: `#181811`
- **Text Light**: `#f5f5f0`

### Typography

- **Font**: Spline Sans (Google Fonts)
- **Icons**: Material Symbols Outlined

### Key UI Patterns

- Rounded corners (default: 1rem)
- Consistent spacing using Tailwind utilities
- Hover states with color transitions
- Focus states for accessibility
- Shadow elevations for depth

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Technologies

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Google Fonts** - Spline Sans typography
- **Material Symbols** - Icon system

## Key Components

### BottomNav

Shared navigation component used across main feature pages. Highlights the active route and provides quick access to Tutor, Classroom, and Donate features.

### Mode Toggle

Each main feature includes a Visual/Voice mode toggle for accessibility, allowing users to switch between visual and audio-based interactions.

### Responsive Design

All pages are mobile-first with responsive breakpoints:

- Mobile: Default
- Desktop: max-w-[580px] to max-w-2xl containers

## Features in Detail

### Classroom Page

- PDF lecture note cards
- Professor information and dates
- "Summarize" action buttons
- Upload new notes (FAB)

### Tutor Page

- Real-time chat interface
- Message history with timestamps
- File upload for homework
- Visual and voice mode support

### Donate Page

- Student fundraising goals
- Progress bars with percentages
- Category badges (Hardware, Software, Classroom)
- Donor count tracking

### Settings Page

- Profile management
- Dark mode toggle
- High contrast mode
- Font size adjustment
- Voice mode preferences
- Notification settings

## Future Enhancements

- Backend API integration
- Real-time chat with WebSocket
- File upload functionality
- Payment processing for donations
- Voice recognition implementation
- Multi-language support
- Progressive Web App (PWA) features

## License

© 2025 OgaTicha. All rights reserved.
