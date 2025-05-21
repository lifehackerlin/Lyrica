interface FooterProps {
  darkMode?: boolean;
  language?: string;
}

export default function Footer({ darkMode = false, language = 'en' }: FooterProps) {
  const getLinks = () => {
    if (language === 'zh') {
      return [
        { label: '关于我们', url: '#' },
        { label: '使用条款', url: '#' },
        { label: '隐私政策', url: '#' }
      ];
    } else {
      return [
        { label: 'About Us', url: '#' },
        { label: 'Terms', url: '#' },
        { label: 'Privacy', url: '#' }
      ];
    }
  };

  const links = getLinks();

  return (
    <footer className={`py-4 border-t mt-8 ${
      darkMode 
        ? 'bg-gray-900 border-gray-800 text-gray-300' 
        : 'bg-white border-gray-200 text-gray-600'
    }`}>
      <div className="container mx-auto max-w-5xl px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm mb-2 md:mb-0">
            © {new Date().getFullYear()} Lyrica.ai - {language === 'zh' ? 'AI文本改写助手' : 'AI Text Rewriting Assistant'}
          </p>
          <div className="flex space-x-4 text-sm">
            {links.map((link, index) => (
              <a 
                key={index} 
                href={link.url} 
                className={`${
                  darkMode ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
} 