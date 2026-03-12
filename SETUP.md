# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Firebase Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable "Google" provider
   - Enable "Anonymous" provider

### Set up Firestore
1. Go to Firestore Database
2. Create database (start in test mode for development)
3. Add security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Get Firebase Config
1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Click "Web" icon to add a web app
4. Copy the Firebase configuration object

## 3. Environment Configuration

Create a `.env` file in the root directory:

```env
FIREBASE_CONFIG={"apiKey":"YOUR_API_KEY","authDomain":"YOUR_PROJECT.firebaseapp.com","projectId":"YOUR_PROJECT_ID","storageBucket":"YOUR_PROJECT.appspot.com","messagingSenderId":"YOUR_SENDER_ID","appId":"YOUR_APP_ID"}
APP_ID=mastery-track-001
```

Replace the values with your actual Firebase configuration.

## 4. Run the Application

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

## 5. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Troubleshooting

### Firebase Authentication Issues
- Make sure Google OAuth is properly configured in Firebase Console
- Check that your domain is authorized in Firebase Authentication settings

### Firestore Permission Errors
- Verify security rules are correctly set
- Ensure user is authenticated before accessing data

### Environment Variables Not Loading
- Make sure `.env` file is in the root directory
- Restart the development server after changing `.env`
