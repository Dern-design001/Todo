import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth';
import { Plus, Trash2, Check, ChevronDown, ChevronRight, LogOut, Pin, X, Settings, Heart } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import LandingPage from './components/LandingPage';
import DashboardView from './components/DashboardView';
import ProfileModal from './components/ProfileModal';

// Firebase configuration - hardcoded for testing
const firebaseConfig = {
  apiKey: "AIzaSyAKo1IuGxHdO-ZLVJYYQCBz9-rhzgF69bM",
  authDomain: "unfold-bab4b.firebaseapp.com",
  projectId: "unfold-bab4b",
  storageBucket: "unfold-bab4b.firebasestorage.app",
  messagingSenderId: "877215334562",
  appId: "1:877215334562:web:1d0e7ef1673b1d687257fb",
  measurementId: "G-DPLM3Q36G3"
};

let app, auth;
try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  console.log('Firebase initialized successfully!');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [user, setUser] = useState(null);
  const [topics, setTopics] = useState([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState({});
  const [subTopicInputs, setSubTopicInputs] = useState({});
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Get storage key based on user email
  const getStorageKey = (userEmail) => {
    return `career-topics-${userEmail}`;
  };

  // Initialize auth listener
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && currentUser.email) {
        // Load profile from localStorage
        const savedProfile = localStorage.getItem(`profile-${currentUser.email}`);
        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          // Merge localStorage data with Firebase user
          const mergedUser = {
            ...currentUser,
            displayName: profileData.displayName || currentUser.displayName,
            photoURL: profileData.photoURL || currentUser.photoURL
          };
          setUser(mergedUser);
        } else {
          setUser(currentUser);
        }
        
        // Load user-specific topics
        const savedTopics = localStorage.getItem(getStorageKey(currentUser.email));
        if (savedTopics) {
          setTopics(JSON.parse(savedTopics));
        } else {
          setTopics([]);
        }
      } else {
        setUser(currentUser);
        setTopics([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Save topics to localStorage whenever they change (user-specific)
  useEffect(() => {
    if (user && user.email) {
      localStorage.setItem(getStorageKey(user.email), JSON.stringify(topics));
    }
  }, [topics, user]);

  const handleGoogleLogin = async () => {
    if (isAuthenticating || !auth) {
      alert('Firebase is not configured. Please add your Firebase config to .env file.');
      return;
    }
    
    setIsAuthenticating(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setCurrentView('dashboard');
    } catch (error) {
      if (error.code !== 'auth/cancelled-popup-request' && error.code !== 'auth/popup-closed-by-user') {
        console.error("Google login failed:", error);
        alert('Login failed. Please check your Firebase configuration.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    
    try {
      await signOut(auth);
      setUser(null);
      setTopics([]);
      setCurrentView('home');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfileUpdate = async () => {
    // Reload the current user to get updated profile
    if (auth && auth.currentUser && auth.currentUser.email) {
      await auth.currentUser.reload();
      
      // Load profile from localStorage
      const savedProfile = localStorage.getItem(`profile-${auth.currentUser.email}`);
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        // Merge localStorage data with Firebase user
        const mergedUser = {
          ...auth.currentUser,
          displayName: profileData.displayName || auth.currentUser.displayName,
          photoURL: profileData.photoURL || auth.currentUser.photoURL
        };
        setUser(mergedUser);
      } else {
        setUser({ ...auth.currentUser });
      }
    }
  };

  const addTopic = async (e) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    
    const newTopic = {
      id: Date.now().toString(),
      text: input,
      completed: false,
      isPinned: false,
      subTopics: [],
      createdAt: Date.now()
    };
    
    setTopics([newTopic, ...topics]);
    setInput('');
  };

  const addSubTopic = async (topicId) => {
    const subText = subTopicInputs[topicId];
    if (!subText?.trim() || !user) return;
    
    setTopics(topics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          subTopics: [...topic.subTopics, { 
            id: Date.now(), 
            text: subText, 
            completed: false, 
            isPinned: false 
          }]
        };
      }
      return topic;
    }));
    
    setSubTopicInputs({ ...subTopicInputs, [topicId]: '' });
  };

  const toggleSubTopic = async (topicId, subId) => {
    if (!user) return;
    
    setTopics(topics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          subTopics: topic.subTopics.map(st => 
            st.id === subId ? { ...st, completed: !st.completed } : st
          )
        };
      }
      return topic;
    }));
  };

  const toggleSubTopicPin = async (topicId, subId) => {
    if (!user) return;
    
    setTopics(topics.map(topic => {
      if (topic.id === topicId) {
        const newSubTopics = topic.subTopics.map(st => 
          st.id === subId ? { ...st, isPinned: !st.isPinned } : st
        );
        // Sort sub-topics: pinned first
        newSubTopics.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return 0;
        });
        return { ...topic, subTopics: newSubTopics };
      }
      return topic;
    }));
  };

  const toggleComplete = async (topic) => {
    if (!user) return;
    
    setTopics(topics.map(t => 
      t.id === topic.id ? { ...t, completed: !t.completed } : t
    ));
  };

  const togglePin = async (topic) => {
    if (!user) return;
    
    const updatedTopics = topics.map(t => 
      t.id === topic.id ? { ...t, isPinned: !t.isPinned } : t
    );
    
    // Sort topics: pinned first, then by creation date
    updatedTopics.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt - a.createdAt;
    });
    
    setTopics(updatedTopics);
  };

  const saveEdit = async (id) => {
    if (!editText.trim() || !user) return;
    
    setTopics(topics.map(topic => 
      topic.id === id ? { ...topic, text: editText } : topic
    ));
    setEditingId(null);
  };

  const deleteTopic = async (id) => {
    if (!user) return;
    
    setTopics(topics.filter(topic => topic.id !== id));
  };

  const deleteSubTopic = async (topicId, subId) => {
    if (!user) return;
    
    setTopics(topics.map(topic => {
      if (topic.id === topicId) {
        return {
          ...topic,
          subTopics: topic.subTopics.filter(st => st.id !== subId)
        };
      }
      return topic;
    }));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617]">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-blue-400 opacity-20"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-slate-300 font-sans selection:bg-blue-500/30">
      <ParticleBackground />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950/40 backdrop-blur-xl border-b border-slate-800/50 px-6 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('home')}>
              <span className="font-black text-2xl tracking-tighter text-white ml-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Unfold
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => setCurrentView('home')} 
                className={`text-xs font-black tracking-widest transition-all hover:scale-110 ${currentView === 'home' ? 'text-blue-400' : 'text-slate-500'}`}
              >
                HOME
              </button>
              <button 
                onClick={() => setCurrentView('dashboard')} 
                className={`text-xs font-black tracking-widest transition-all hover:scale-110 ${currentView === 'dashboard' ? 'text-blue-400' : 'text-slate-500'}`}
              >
                DASHBOARD
              </button>
              <button 
                onClick={() => setCurrentView('zen')} 
                className={`transition-all hover:scale-110 hover:text-red-400 ${currentView === 'zen' ? 'text-red-400 text-shadow-glow' : 'text-slate-500'}`}
                title="Zen Background Mode"
              >
                <Heart size={18} className={currentView === 'zen' ? "fill-current" : ""} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            {user && !user.isAnonymous ? (
              <div className="flex items-center gap-4 bg-slate-900/60 p-2 pr-5 rounded-3xl border border-slate-800 shadow-xl">
                {user.photoURL && (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-9 h-9 rounded-2xl border-2 border-slate-800 shadow-md" />
                )}
                <span className="text-sm text-slate-300 font-medium hidden md:block">
                  {user.displayName || user.email}
                </span>
                <button 
                  onClick={() => setShowProfileModal(true)}
                  className="text-slate-500 hover:text-blue-400 transition-colors"
                  title="Edit Profile"
                >
                  <Settings size={20} />
                </button>
                <button 
                  onClick={handleLogout} 
                  className="text-slate-500 hover:text-red-400 transition-colors transform hover:rotate-12"
                  title="Logout"
                >
                  <LogOut size={22} />
                </button>
              </div>
            ) : (
              <button 
                onClick={handleGoogleLogin} 
                disabled={isAuthenticating}
                className="bg-slate-900/50 border-2 border-slate-800 px-8 py-3 rounded-2xl text-sm font-black text-slate-100 hover:border-blue-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isAuthenticating ? 'SYNCING...' : 'LOGIN'}
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="animate-in fade-in duration-700">
        {currentView === 'home' && <LandingPage />}
        {currentView === 'dashboard' && (
          user ? (
            <DashboardView 
              topics={topics}
              input={input}
              setInput={setInput}
              addTopic={addTopic}
              editingId={editingId}
              setEditingId={setEditingId}
              editText={editText}
              setEditText={setEditText}
              saveEdit={saveEdit}
              toggleComplete={toggleComplete}
              togglePin={togglePin}
              deleteTopic={deleteTopic}
              expandedTopics={expandedTopics}
              setExpandedTopics={setExpandedTopics}
              subTopicInputs={subTopicInputs}
              setSubTopicInputs={setSubTopicInputs}
              addSubTopic={addSubTopic}
            toggleSubTopic={toggleSubTopic}
            toggleSubTopicPin={toggleSubTopicPin}
            deleteSubTopic={deleteSubTopic}
          />
          ) : (
            <div className="min-h-[80vh] flex items-center justify-center px-6">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl font-black text-white mb-4">Login Required</h2>
                <p className="text-lg text-slate-400 mb-8">Please login with Google to access your dashboard and save your progress.</p>
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isAuthenticating}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl text-lg font-black shadow-xl shadow-blue-900/40 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isAuthenticating ? 'SYNCING...' : 'LOGIN WITH GOOGLE'}
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Profile Modal */}
      {showProfileModal && user && (
        <ProfileModal 
          user={user}
          onClose={() => setShowProfileModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-top-4 { from { transform: translateY(-1rem); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-in { animation: fade-in 0.6s ease-out; }
        .slide-in-from-top-4 { animation: slide-in-from-top-4 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
