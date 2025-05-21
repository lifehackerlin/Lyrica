import { FiEdit3, FiMoon, FiSun, FiGlobe, FiChevronDown } from 'react-icons/fi';
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

  // 获取当前显示的站点名称和标签，基于语言
  const getSiteText = () => {
    if (language === 'zh') {
      return {
        siteLabel: 'AI智能文本改写助手',
        helpLabel: '使用说明',
        tagline: '更好的写作体验'
      };
    } else {
      return {
        siteLabel: 'AI Text Rewriting Assistant',
        helpLabel: 'Help',
        tagline: 'Better writing with AI'
      };
    }
  };

  const { siteLabel, helpLabel, tagline } = getSiteText();

  return (
    <header className={`py-4 px-6 shadow-sm border-b ${darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-800'}`}>
      <div className="container mx-auto max-w-5xl flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <FiEdit3 className="text-indigo-600 text-2xl" />
            <h1 className="text-2xl font-bold">
              <span className="text-indigo-600">Lyrica</span>.ai
            </h1>
          </div>
          <span className="hidden sm:inline text-xs text-gray-500 dark:text-gray-400 mt-1 ml-8">{tagline}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden sm:inline text-gray-600 dark:text-gray-300 mr-2">{siteLabel}</span>
          
          {/* 语言切换器 - 改为点击触发 */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={toggleMenu}
              className={`p-2 rounded-full focus:outline-none flex items-center ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <FiGlobe className={darkMode ? 'text-gray-300' : 'text-gray-600'} />
              <FiChevronDown className={`ml-1 w-4 h-4 transition-transform ${isMenuOpen ? 'transform rotate-180' : ''}`} />
            </button>
            {isMenuOpen && (
              <div 
                className={`absolute right-0 mt-2 py-2 w-40 rounded-md shadow-lg z-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`block px-4 py-2 text-sm w-full text-left ${
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
            className={`p-2 rounded-full focus:outline-none ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            {darkMode ? (
              <FiSun className="text-yellow-300" />
            ) : (
              <FiMoon className="text-indigo-600" />
            )}
          </button>
          
          <a 
            href="#" 
            className={`text-sm py-2 px-4 rounded-md shadow-sm transition-colors ${
              darkMode 
                ? 'bg-indigo-700 text-white hover:bg-indigo-800' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {helpLabel}
          </a>
        </div>
      </div>
    </header>
  );
} 