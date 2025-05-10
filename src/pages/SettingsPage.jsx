import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Navbar from '../components/Navbar';
import { Settings, Bell, Shield, Monitor, Moon, Sun, Trash2 } from 'lucide-react';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    competition_reminders: true,
    new_features: false
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    show_profile: true,
    show_stats: true,
    show_activity: false
  });
  
  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    code_font_size: 'medium'
  });
  
  const handleToggleNotification = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleTogglePrivacy = (setting) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleAppearanceChange = (setting, value) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const handleSaveSettings = () => {
    // In a real app, save settings to Supabase
    showToast('Settings saved successfully!', 'success');
  };
  
  const handleDeleteAccount = () => {
    // In a real app, show a confirmation modal and then delete the account
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Delete account logic
      logout();
      showToast('Your account has been deleted', 'success');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
          <Settings className="mr-3 text-indigo-500" />
          Settings
        </h1>
        
        <div className="space-y-6">
          {/* Notification Settings */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Bell className="mr-2 text-indigo-400" />
              Notification Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-400">Receive email notifications about your account</p>
                </div>
                <div className="relative inline-block w-12 h-6 ml-4">
                  <input
                    type="checkbox"
                    id="email_notifications"
                    className="opacity-0 w-0 h-0"
                    checked={notificationSettings.email_notifications}
                    onChange={() => handleToggleNotification('email_notifications')}
                  />
                  <label
                    htmlFor="email_notifications"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                      notificationSettings.email_notifications ? 'bg-indigo-600' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                        notificationSettings.email_notifications ? 'transform translate-x-6' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Competition Reminders</h3>
                  <p className="text-sm text-gray-400">Get notified about upcoming competitions</p>
                </div>
                <div className="relative inline-block w-12 h-6 ml-4">
                  <input
                    type="checkbox"
                    id="competition_reminders"
                    className="opacity-0 w-0 h-0"
                    checked={notificationSettings.competition_reminders}
                    onChange={() => handleToggleNotification('competition_reminders')}
                  />
                  <label
                    htmlFor="competition_reminders"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                      notificationSettings.competition_reminders ? 'bg-indigo-600' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                        notificationSettings.competition_reminders ? 'transform translate-x-6' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">New Features</h3>
                  <p className="text-sm text-gray-400">Stay updated on new platform features</p>
                </div>
                <div className="relative inline-block w-12 h-6 ml-4">
                  <input
                    type="checkbox"
                    id="new_features"
                    className="opacity-0 w-0 h-0"
                    checked={notificationSettings.new_features}
                    onChange={() => handleToggleNotification('new_features')}
                  />
                  <label
                    htmlFor="new_features"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                      notificationSettings.new_features ? 'bg-indigo-600' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                        notificationSettings.new_features ? 'transform translate-x-6' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Shield className="mr-2 text-indigo-400" />
              Privacy Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Public Profile</h3>
                  <p className="text-sm text-gray-400">Allow others to view your profile</p>
                </div>
                <div className="relative inline-block w-12 h-6 ml-4">
                  <input
                    type="checkbox"
                    id="show_profile"
                    className="opacity-0 w-0 h-0"
                    checked={privacySettings.show_profile}
                    onChange={() => handleTogglePrivacy('show_profile')}
                  />
                  <label
                    htmlFor="show_profile"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                      privacySettings.show_profile ? 'bg-indigo-600' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                        privacySettings.show_profile ? 'transform translate-x-6' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Public Stats</h3>
                  <p className="text-sm text-gray-400">Show your statistics to other users</p>
                </div>
                <div className="relative inline-block w-12 h-6 ml-4">
                  <input
                    type="checkbox"
                    id="show_stats"
                    className="opacity-0 w-0 h-0"
                    checked={privacySettings.show_stats}
                    onChange={() => handleTogglePrivacy('show_stats')}
                  />
                  <label
                    htmlFor="show_stats"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                      privacySettings.show_stats ? 'bg-indigo-600' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                        privacySettings.show_stats ? 'transform translate-x-6' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-medium">Activity Tracking</h3>
                  <p className="text-sm text-gray-400">Share your recent activities publicly</p>
                </div>
                <div className="relative inline-block w-12 h-6 ml-4">
                  <input
                    type="checkbox"
                    id="show_activity"
                    className="opacity-0 w-0 h-0"
                    checked={privacySettings.show_activity}
                    onChange={() => handleTogglePrivacy('show_activity')}
                  />
                  <label
                    htmlFor="show_activity"
                    className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-colors duration-200 ${
                      privacySettings.show_activity ? 'bg-indigo-600' : 'bg-gray-700'
                    }`}
                  >
                    <span
                      className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${
                        privacySettings.show_activity ? 'transform translate-x-6' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Appearance Settings */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Monitor className="mr-2 text-indigo-400" />
              Appearance
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-medium mb-3">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => handleAppearanceChange('theme', 'light')}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-lg ${
                      appearanceSettings.theme === 'light' ? 'bg-indigo-900 ring-2 ring-indigo-500' : 'bg-gray-800 hover:bg-gray-750'
                    }`}
                  >
                    <Sun className="h-6 w-6 text-yellow-400" />
                    <span className="text-sm">Light</span>
                  </button>
                  
                  <button
                    onClick={() => handleAppearanceChange('theme', 'dark')}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-lg ${
                      appearanceSettings.theme === 'dark' ? 'bg-indigo-900 ring-2 ring-indigo-500' : 'bg-gray-800 hover:bg-gray-750'
                    }`}
                  >
                    <Moon className="h-6 w-6 text-indigo-400" />
                    <span className="text-sm">Dark</span>
                  </button>
                  
                  <button
                    onClick={() => handleAppearanceChange('theme', 'system')}
                    className={`flex flex-col items-center space-y-2 p-4 rounded-lg ${
                      appearanceSettings.theme === 'system' ? 'bg-indigo-900 ring-2 ring-indigo-500' : 'bg-gray-800 hover:bg-gray-750'
                    }`}
                  >
                    <Monitor className="h-6 w-6 text-blue-400" />
                    <span className="text-sm">System</span>
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-medium mb-3">Code Editor Font Size</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleAppearanceChange('code_font_size', 'small')}
                    className={`px-4 py-2 rounded-md ${
                      appearanceSettings.code_font_size === 'small' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    Small
                  </button>
                  <button
                    onClick={() => handleAppearanceChange('code_font_size', 'medium')}
                    className={`px-4 py-2 rounded-md ${
                      appearanceSettings.code_font_size === 'medium' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => handleAppearanceChange('code_font_size', 'large')}
                    className={`px-4 py-2 rounded-md ${
                      appearanceSettings.code_font_size === 'large' ? 'bg-indigo-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    Large
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              className="btn-primary px-6"
            >
              Save Settings
            </button>
          </div>
          
          {/* Danger Zone */}
          <div className="card border border-red-800">
            <h2 className="text-xl font-bold text-red-500 mb-6">Danger Zone</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Delete Account</h3>
                <p className="text-sm text-gray-400">Permanently delete your account and all associated data</p>
              </div>
              <button 
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-all duration-200 flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;