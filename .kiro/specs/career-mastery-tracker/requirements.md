# Career Mastery Tracker - Requirements

## Overview
A React-based web application that helps users track their career development topics and sub-tasks with Firebase backend integration, featuring an interactive particle background and real-time synchronization.

## User Stories

### 1. User Authentication
**As a user**, I want to authenticate with Google or anonymously so that I can access my personalized task list.

**Acceptance Criteria:**
- 1.1 Anonymous users can use the app without signing in
- 1.2 Users can sign in with Google OAuth
- 1.3 User authentication state persists across sessions
- 1.4 Custom Firebase tokens are supported for initial authentication
- 1.5 Users can log out and return to anonymous mode
- 1.6 User profile photo displays when authenticated with Google

### 2. Topic Management
**As a user**, I want to create, edit, and delete main topics so that I can organize my career development goals.

**Acceptance Criteria:**
- 2.1 Users can add new topics via text input
- 2.2 Topics are stored in Firestore with timestamps
- 2.3 Users can edit topic text inline
- 2.4 Users can delete topics
- 2.5 Topics display in real-time across all sessions
- 2.6 Topics can be marked as complete/incomplete
- 2.7 Topics can be pinned to stay at the top of the list

### 3. Sub-Task Management
**As a user**, I want to add sub-tasks to main topics so that I can break down complex goals into actionable steps.

**Acceptance Criteria:**
- 3.1 Users can expand/collapse topics to view sub-tasks
- 3.2 Users can add sub-tasks to any topic
- 3.3 Sub-tasks can be marked as complete/incomplete
- 3.4 Sub-tasks can be pinned within their parent topic
- 3.5 Users can delete sub-tasks
- 3.6 Sub-tasks are stored as nested data in Firestore

### 4. Progress Tracking
**As a user**, I want to see visual progress indicators so that I can track my completion status.

**Acceptance Criteria:**
- 4.1 Each topic displays a percentage completion badge
- 4.2 Progress bars show visual completion status
- 4.3 Completion percentage includes both main topic and sub-tasks
- 4.4 Completed topics show visual distinction (color change)
- 4.5 Progress updates in real-time

### 5. Visual Design & UX
**As a user**, I want an engaging and modern interface so that using the app is enjoyable.

**Acceptance Criteria:**
- 5.1 Animated particle background with mouse interaction
- 5.2 Dark blue theme with cyan/blue accents
- 5.3 Smooth transitions and animations
- 5.4 Responsive design for mobile and desktop
- 5.5 Loading states for authentication and data fetching
- 5.6 Hover effects and interactive feedback

### 6. Navigation
**As a user**, I want to navigate between landing page and dashboard so that I can access different sections of the app.

**Acceptance Criteria:**
- 6.1 Landing page displays app introduction
- 6.2 Dashboard shows task management interface
- 6.3 Navigation bar allows switching between views
- 6.4 Current view is visually indicated in navigation
- 6.5 Unauthenticated users see landing page when accessing dashboard

## Technical Requirements

### Firebase Configuration
- Firebase app initialization with provided config
- Firestore database for data persistence
- Firebase Authentication for user management
- Support for custom auth tokens and anonymous auth

### Data Structure
```
artifacts/{appId}/users/{userId}/prep_topics/{topicId}
{
  text: string,
  completed: boolean,
  isPinned: boolean,
  subTopics: Array<{
    id: number,
    text: string,
    completed: boolean,
    isPinned: boolean
  }>,
  createdAt: timestamp
}
```

### Performance
- Real-time updates via Firestore snapshots
- Optimized particle rendering with canvas
- Efficient re-renders with React hooks

### Browser Compatibility
- Modern browsers with ES6+ support
- Canvas API support for particle background
- Touch event support for mobile devices
