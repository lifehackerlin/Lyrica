import { useState, useEffect } from 'react';
import { FiX, FiSend } from 'react-icons/fi';

interface TextInputProps {
  onSubmit: (text: string) => void;
  inputText: string;
  setInputText: (text: string) => void;
  language?: string;
}

export default function TextInput({ onSubmit, inputText, setInputText, language = 'en' }: TextInputProps) {
  // 根据语言选择示例文本
  const getExamples = () => {
    if (language === 'zh') {
      return [
        "人类与AI正在不断融合，彼此协作的能力日益增强。",
        "随着科技的发展，教育变得更加普及和个性化。",
        "可持续发展需要平衡经济增长、环境保护和社会公平。",
        "现代社会中，跨文化交流对增进国际理解至关重要。"
      ];
    } else {
      return [
        "The collaboration between humans and AI continues to evolve, with their mutual capabilities growing stronger.",
        "Technology is transforming education, making learning more accessible and personalized than ever before.",
        "Sustainable development requires balancing economic growth with environmental protection and social equity.",
        "In modern society, cross-cultural communication is vital for enhancing international understanding."
      ];
    }
  };

  const examples = getExamples();

  // 自动处理文本（如果停止输入1秒后）
  useEffect(() => {
    if (inputText.trim().length > 50) { // 50个字符阈值
      const timeoutId = setTimeout(() => {
        onSubmit(inputText);
      }, 1000);
      
      // 清除之前的计时器
      return () => clearTimeout(timeoutId);
    }
  }, [inputText, onSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSubmit(inputText);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleExampleClick = (example: string) => {
    setInputText(example);
  };

  const clearText = () => {
    setInputText('');
  };

  const getPlaceholder = () => {
    return language === 'zh' 
      ? "请输入您想要改写的文本..." 
      : "Enter the text you want to rewrite...";
  };

  const getSubmitButtonText = () => {
    return language === 'zh' ? "开始改写" : "Start Rewriting";
  };

  const getHintText = () => {
    return language === 'zh' 
      ? "提示: 输入超过50个字符并等待1秒后将自动改写" 
      : "Tip: Auto-rewriting will start 1 second after typing more than 50 characters";
  };

  const getExampleTitle = () => {
    return language === 'zh' ? "示例文本:" : "Examples:";
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[250px] resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 transition-all"
            placeholder={getPlaceholder()}
            value={inputText}
            onChange={handleTextChange}
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
          />
          {inputText && (
            <button
              type="button"
              onClick={clearText}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear text"
            >
              <FiX size={20} />
            </button>
          )}
          {!inputText && (
            <div className="absolute top-2 right-2 bg-gray-50 dark:bg-gray-700 rounded-md p-1 transition-opacity">
              <span className="text-xs text-gray-400 dark:text-gray-300 block mb-1 px-1">{getExampleTitle()}</span>
              <div className="flex flex-col space-y-1">
                {examples.map((example, index) => (
                  <button 
                    key={index}
                    type="button"
                    onClick={() => handleExampleClick(example)}
                    className="text-xs bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors text-left overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[200px]"
                  >
                    {example.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center justify-center space-x-2 font-medium"
          style={{ boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)' }}
        >
          <FiSend size={16} />
          <span>{getSubmitButtonText()}</span>
        </button>
      </form>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center italic">
        {getHintText()}
      </p>
    </div>
  );
} 