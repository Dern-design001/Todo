import React, { useState } from 'react';
import { X, Upload, User } from 'lucide-react';
import { updateProfile } from 'firebase/auth';

const ProfileModal = ({ user, onClose, onUpdate }) => {
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.photoURL || '');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setPhotoURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    setIsUploading(true);
    try {
      const newDisplayName = displayName.trim() || user.displayName;
      const newPhotoURL = photoURL.trim() || user.photoURL;
      
      // Update Firebase profile
      await updateProfile(user, {
        displayName: newDisplayName,
        photoURL: newPhotoURL
      });
      
      // Also save to localStorage as backup
      const profileData = {
        displayName: newDisplayName,
        photoURL: newPhotoURL,
        email: user.email
      };
      localStorage.setItem(`profile-${user.email}`, JSON.stringify(profileData));
      
      // Force refresh the auth state
      await user.reload();
      
      // Call the update callback
      await onUpdate();
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Save to localStorage even if Firebase fails
      const profileData = {
        displayName: displayName.trim() || user.displayName,
        photoURL: photoURL.trim() || user.photoURL,
        email: user.email
      };
      localStorage.setItem(`profile-${user.email}`, JSON.stringify(profileData));
      
      await onUpdate();
      onClose();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-3xl border-2 border-slate-800 p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white">Edit Profile</h2>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-2xl border-4 border-slate-800 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl border-4 border-slate-800 bg-slate-950 flex items-center justify-center">
                  <User size={40} className="text-slate-600" />
                </div>
              )}
            </div>
            
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95">
              <Upload size={20} />
              Upload Photo
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            
            <p className="text-xs text-slate-500">Or paste image URL below</p>
          </div>

          {/* Photo URL Input */}
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">
              Photo URL
            </label>
            <input
              type="text"
              value={photoURL}
              onChange={(e) => {
                setPhotoURL(e.target.value);
                setPreviewImage(e.target.value);
              }}
              placeholder="https://example.com/photo.jpg"
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Display Name Input */}
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">
              Email
            </label>
            <input
              type="text"
              value={user?.email || ''}
              disabled
              className="w-full bg-slate-950/50 border-2 border-slate-800/50 rounded-xl py-3 px-4 text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
