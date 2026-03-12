# Career Mastery Tracker - Unfold

A modern React application for tracking career development topics and sub-tasks with real-time Firebase synchronization and an interactive particle background.

## Features

- 🔐 Google OAuth and Anonymous Authentication
- 📝 Create and manage career development topics
- ✅ Track completion with visual progress indicators
- 📌 Pin important topics and sub-tasks
- 🎨 Interactive particle background with mouse interaction
- 🔄 Real-time synchronization across devices
- 📱 Responsive design for mobile and desktop

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase:
   - Copy `.env.example` to `.env`
   - Add your Firebase configuration

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Firebase Configuration

You need to set up a Firebase project with Authentication (Google provider).

### Quick Setup Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Google" provider
   - Add your domain to authorized domains

4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click "Web" icon to add a web app
   - Copy the Firebase configuration object

5. Update your `.env` file:
```env
FIREBASE_CONFIG={"apiKey":"YOUR_API_KEY","authDomain":"YOUR_PROJECT.firebaseapp.com","projectId":"YOUR_PROJECT_ID","storageBucket":"YOUR_PROJECT.appspot.com","messagingSenderId":"YOUR_SENDER_ID","appId":"YOUR_APP_ID"}
APP_ID=mastery-track-001
```

6. Restart the dev server

### Data Storage

- Each user's data is stored in localStorage with their email as the key
- Format: `career-topics-{user-email}`
- Data persists across sessions
- Each Google account has separate, isolated data

## Environment Variables

- `FIREBASE_CONFIG`: Your Firebase configuration object (JSON string)
- `APP_ID`: Application identifier (default: mastery-track-001)
- `INITIAL_AUTH_TOKEN`: Optional custom auth token for initial authentication

## Tech Stack

- React 18
- Firebase Authentication (Google OAuth)
- Vite
- Tailwind CSS
- Lucide React (icons)
- LocalStorage for data persistence

## License

MIT
