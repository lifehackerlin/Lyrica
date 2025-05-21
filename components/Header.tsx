import { FiMoon, FiSun, FiGlobe, FiChevronDown } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}

export default function Header({ darkMode, toggleDarkMode, language, setLanguage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文' }
  ];

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 语言切换处理
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setIsMenuOpen(false);
  };

  // 切换菜单开关状态
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`py-4 px-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-transparent text-gray-800'}`}>
      <div className="container mx-auto max-w-5xl flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Lyrica.ai</span>
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          {/* 语言切换器 */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={toggleMenu}
              className={`p-2 rounded-md focus:outline-none flex items-center transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-300' 
                  : 'hover:bg-gray-100/50 text-gray-700'
              }`}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <FiGlobe className="w-4 h-4" />
              <FiChevronDown className={`ml-1 w-3 h-3 transition-transform ${isMenuOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isMenuOpen && (
              <div 
                className={`absolute right-0 mt-2 py-1 w-36 rounded-md shadow-lg z-20 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'
                }`}
              >
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`block px-4 py-2 text-sm w-full text-left transition-colors ${
                      language === lang.code 
                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' 
                        : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* 暗黑模式切换 */}
          <button 
            onClick={toggleDarkMode} 
            className={`p-2 rounded-md focus:outline-none transition-colors ${
              darkMode 
                ? 'hover:bg-gray-800 text-yellow-300' 
                : 'hover:bg-gray-100/50 text-indigo-600'
            }`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}