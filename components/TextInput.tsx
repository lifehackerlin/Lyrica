import { useState, useEffect } from 'react';

interface TextInputProps {
  onSubmit: (text: string) => void;
  inputText: string; // 接收父组件传入的文本
  setInputText: (text: string) => void; // 设置父组件的文本
}

export default function TextInput({ onSubmit, inputText, setInputText }: TextInputProps) {
  // 示例文本
  const examples = [
    "人类与AI正在不断融合，彼此协作的能力日益增强。",
    "The collaboration between humans and AI continues to evolve, with their mutual capabilities growing stronger over time.",
    "Technology is transforming education, making learning more accessible and personalized than ever before.",
    "Sustainable development requires balancing economic growth with environmental protection and social equity."
  ];

  // 自动处理文本（如果停止输入1秒后）
  useEffect(() => {
    if (inputText.trim().length > 50) { // 改为50个字符
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

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[180px] resize-none"
            placeholder="请输入您想要改写的文本..."
            value={inputText}
            onChange={handleTextChange}
          />
          {!inputText && (
            <div className="absolute top-1 right-1 bg-gray-50 rounded-md p-1">
              <span className="text-xs text-gray-400 block mb-1 px-1">示例文本:</span>
              <div className="flex flex-col space-y-1">
                {examples.map((example, index) => (
                  <button 
                    key={index}
                    type="button"
                    onClick={() => handleExampleClick(example)}
                    className="text-xs bg-white text-gray-600 px-2 py-1 rounded border border-gray-200 hover:bg-indigo-50 transition-colors text-left overflow-hidden whitespace-nowrap overflow-ellipsis max-w-[200px]"
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
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          开始改写
        </button>
      </form>
      <p className="text-xs text-gray-500">
        提示: 输入超过50个字符并等待1秒后将自动改写
      </p>
    </div>
  );
} 