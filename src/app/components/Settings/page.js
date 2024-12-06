'use client';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SettingsPage = () => {

  const [settings, setSettings] = useState({
   
    notification: true, // notification toggle
  
    sync: true, // auto-sync notes
    autoSave: true, // auto-save notes
    defaultFolder: 'General', // default folder
    sortPreference: 'date', // sorting by date, title
    calendarSync: false, // calendar sync toggle
    autoLogout: false, // auto-logout toggle
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetSettings = () => {
    setSettings({
     
      notification: true,
     
      sync: true,
      autoSave: true,
      defaultFolder: 'General',
      sortPreference: 'date',
      calendarSync: false,
      autoLogout: false,
    });
    toast.success('Reset to Default');
    
  };

  const handleSave = () => {
    toast.success('Settings updated successfully!');
    // Logic to save updated settings
  };

  return (
    <div className="bg-gradient-to-br min-h-screen flex flex-col items-center p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>

      {/* Settings Form */}
      <div className="bg-white shadow-xs border-2 border-gray-200 rounded-lg p-6 w-full max-w-xl">
        {/* Theme Selector */}
     
        {/* Notification Toggle */}
        <div className="mb-4">
          <label className="flex items-center justify-between text-blue-700 font-light">
            <span>Enable Notifications</span>
            <input
              type="checkbox"
              name="notification"
              checked={settings.notification}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Auto-Sync Notes */}
        <div className="mb-4">
          <label className="flex items-center justify-between text-blue-700 font-light">
            <span>Auto-Sync Notes</span>
            <input
              type="checkbox"
              name="sync"
              checked={settings.sync}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Auto-Save Notes */}
        <div className="mb-4">
          <label className="flex items-center justify-between text-blue-700 font-light">
            <span>Auto-Save Notes</span>
            <input
              type="checkbox"
              name="autoSave"
              checked={settings.autoSave}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Default Folder */}
        <div className="mb-4">
          <label htmlFor="defaultFolder" className="block text-blue-700 font-light mb-2">
            Default Folder
          </label>
          <input
            type="text"
            name="defaultFolder"
            id="defaultFolder"
            value={settings.defaultFolder}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sorting Preferences */}
        <div className="mb-4">
          <label htmlFor="sortPreference" className="block text-blue-700 font-light mb-2">
            Sorting Preference
          </label>
          <select
            name="sortPreference"
            id="sortPreference"
            value={settings.sortPreference}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">By Date</option>
            <option value="title">By Title</option>
          </select>
        </div>

        {/* Calendar Sync */}
        <div className="mb-4">
          <label className="flex items-center justify-between text-blue-700 font-light">
            <span>Sync with Calendar</span>
            <input
              type="checkbox"
              name="calendarSync"
              checked={settings.calendarSync}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Auto-Logout Timer */}
        <div className="mb-4">
          <label className="flex items-center justify-between text-blue-700 font-light">
            <span>Auto-Logout Timer</span>
            <input
              type="checkbox"
              name="autoLogout"
              checked={settings.autoLogout}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>

        {/* Reset and Save Buttons */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={resetSettings}
            className="px-6 py-2 bg-gray-200 text-blue-700 rounded-md shadow-xs hover:bg-gray-300 transition"
          >
            Reset to Default
            <ToastContainer />

          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white font-light rounded-md shadow-xs hover:bg-blue-700 transition"
          >
            Save Changes
            <ToastContainer />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
