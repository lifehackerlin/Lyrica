import { useState, useEffect, useRef } from 'react';
import { FiX, FiSend, FiClipboard } from 'react-icons/fi';

interface TextInputProps {
  onSubmit: (text: string) => void;
  inputText: string;
  setInputText: (text: string) => void;
  language?: string;
}

export default function TextInput({ onSubmit, inputText, setInputText, language = 'en' }: TextInputProps) {
  // 标记是否已经触发自动改写的状态
  const [autoTriggered, setAutoTriggered] = useState<boolean>(false);
  // 上一次处理的文本长度
  const lastProcessedLength = useRef<number>(0);

  // 根据语言选择示例文本
  const getExamples = () => {
    if (language === 'zh') {
      return [
        "人类与AI正在不断融合，彼此协作的能力日益增强。AI技术的进步使得人机交互变得更加自然流畅，许多复杂任务可以通过人机协作更高效地完成。未来，随着技术的不断发展，人类与AI的边界可能会变得越来越模糊。"
      ];
    } else {
      return [
        "The collaboration between humans and AI continues to evolve, with their mutual capabilities growing stronger. Advances in AI technology have made human-machine interaction more natural and fluid, allowing many complex tasks to be completed more efficiently through collaboration. In the future, as technology continues to develop, the boundaries between humans and AI may become increasingly blurred."
      ];
    }
  };

  const examples = getExamples();

  // 处理粘贴文本
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
    } catch (err) {
      console.error('无法访问剪贴板:', err);
      // 提供后备方案 - 提示用户手动粘贴
      alert(language === 'zh' ? 
        '无法自动粘贴。请使用键盘快捷键(Ctrl+V或Cmd+V)手动粘贴。' : 
        'Cannot paste automatically. Please use keyboard shortcut (Ctrl+V or Cmd+V) to paste manually.'
      );
    }
  };

  // 自动处理文本（如果停止输入1秒后且文本长度超过100个字符）
  useEffect(() => {
    const currentLength = inputText.trim().length;
    
    // 重置自动触发状态的条件：输入内容重新变少或清空
    if (currentLength < lastProcessedLength.current) {
      setAutoTriggered(false);
    }
    
    // 保存当前文本长度
    lastProcessedLength.current = currentLength;
    
    // 仅在文本长度超过100字符且未自动触发过时设置定时器
    if (currentLength > 100 && !autoTriggered) {
      const timeoutId = setTimeout(() => {
        onSubmit(inputText);
        setAutoTriggered(true); // 标记已经触发过
      }, 1000);
      
      // 清除之前的计时器
      return () => clearTimeout(timeoutId);
    }
  }, [inputText, onSubmit, autoTriggered]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSubmit(inputText);
      setAutoTriggered(true); // 手动提交也标记为已触发
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
    setAutoTriggered(false); // 清空文本时重置触发状态
    lastProcessedLength.current = 0;
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
      ? "提示: 输入超过100个字符并等待1秒后将自动改写" 
      : "Tip: Auto-rewriting will start 1 second after typing more than 100 characters";
  };

  const getExampleTitle = () => {
    return language === 'zh' ? "示例文本:" : "Examples:";
  };

  const getPasteButtonText = () => {
    return language === 'zh' ? "粘贴文本" : "Paste Text";
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
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handlePaste}
            className="py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center space-x-2 font-medium"
            style={{ boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)' }}
          >
            <FiClipboard size={16} />
            <span>{getPasteButtonText()}</span>
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center justify-center space-x-2 font-medium"
            style={{ boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)' }}
          >
            <FiSend size={16} />
            <span>{getSubmitButtonText()}</span>
          </button>
        </div>
      </form>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center italic">
        {getHintText()}
      </p>
    </div>
  );
} 