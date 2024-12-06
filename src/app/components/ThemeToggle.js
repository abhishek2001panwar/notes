// components/ThemeToggle.js
import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi'; // Import icons

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Set initial theme based on localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button onClick={toggleTheme} className="p-2">
     {theme === 'light' ? (
        <FiSun size={24} className="text-yellow-500" /> // Sun Icon for Light Mode
      ) : (
        <FiMoon size={24} className="text-black" /> // Moon Icon for Dark Mode
      )}
    </button>
  );
}
