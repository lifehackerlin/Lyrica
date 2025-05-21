"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import debounce from 'lodash/debounce';
import { DebouncedFunc } from 'lodash';
import Header from '@/components/Header';
import TextInput from '@/components/TextInput';
import FileUpload from '@/components/FileUpload';
import ModeSelector from '@/components/ModeSelector';
import Footer from '@/components/Footer';
import { ChineseMode, EnglishMode, Mode } from './types';

const DynamicResultDisplay = dynamic(() => import('@/components/ResultDisplay'), {
  ssr: false,
  loading: () => {
    // 创建一个内部函数来获取适当的加载文本
    const getLoadingText = () => {
      // 尝试从localStorage获取语言设置
      let currentLang = 'en';
      if (typeof window !== 'undefined') {
        const storedLang = localStorage.getItem('language');
        if (storedLang) {
          currentLang = storedLang;
        }
      }
      
      return currentLang === 'zh' 
        ? '加载显示组件中...' 
        : 'Loading result component...';
    };
    
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 h-full min-h-[250px] flex flex-col items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">{getLoadingText()}</p>
      </div>
    );
  }
});

// 定义处理函数的类型
type ProcessWithAIFunction = (
  text: string,
  mode: string,
  setResult: (result: string) => void
) => Promise<void>;

export default function Home() {
  const [inputText, setInputText] = useState<string>('');
  const [resultText, setResultText] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<Mode>('Standard');
  const [loading, setLoading] = useState<boolean>(false);
  const [originalFileName, setOriginalFileName] = useState<string>('');
  const [isFileResult, setIsFileResult] = useState<boolean>(false);
  
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en');
  
  // 改进类型定义，确保类型安全
  const modeMapping: {
    en: Record<ChineseMode, EnglishMode>;
    zh: Record<EnglishMode, ChineseMode>;
  } = {
    en: {
      '标准': 'Standard',
      '正式': 'Formal',
      '学术': 'Academic',
      '拓展': 'Expanded',
      '总结': 'Summary',
      '故事化': 'Narrative',
      '创意': 'Creative'
    },
    zh: {
      'Standard': '标准',
      'Formal': '正式',
      'Academic': '学术',
      'Expanded': '拓展',
      'Summary': '总结',
      'Narrative': '故事化',
      'Creative': '创意'
    }
  };
  
  // 使用useRef存储防抖函数
  const debouncedProcessWithAIRef = useRef<DebouncedFunc<ProcessWithAIFunction>>();
  
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode) {
      setDarkMode(storedDarkMode === 'true');
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
    }
    
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    // 根据当前语言设置初始模式
    const initialMode = storedLanguage === 'zh' ? '标准' : 'Standard';
    setSelectedMode(initialMode as Mode);
  }, []);
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);
  
  useEffect(() => {
    localStorage.setItem('language', language);
    
    // 类型安全的模式转换
    if (language === 'en') {
      // 检查当前模式是否是中文模式
      const isChineseMode = Object.keys(modeMapping.en).includes(selectedMode);
      if (isChineseMode) {
        const chineseMode = selectedMode as ChineseMode;
        setSelectedMode(modeMapping.en[chineseMode]);
      }
    } else if (language === 'zh') {
      // 检查当前模式是否是英文模式
      const isEnglishMode = Object.keys(modeMapping.zh).includes(selectedMode);
      if (isEnglishMode) {
        const englishMode = selectedMode as EnglishMode;
        setSelectedMode(modeMapping.zh[englishMode]);
      }
    }
  }, [language]);
  
  // 初始化防抖函数
  useEffect(() => {
    debouncedProcessWithAIRef.current = debounce(async (text: string, mode: string, setResult: (result: string) => void) => {
      try {
        const response = await fetch('/api/rewrite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, mode, language }),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API错误响应:', errorData);
          throw new Error(errorData.error || (language === 'zh' ? 'API调用失败' : 'API call failed'));
        }
        
        const data = await response.json();
        setResult(data.result);
      } catch (error) {
        console.error(language === 'zh' ? 'API调用错误:' : 'API call error:', error);
        throw error;
      }
    }, 1000);
    
    // 清理函数
    return () => {
      debouncedProcessWithAIRef.current?.cancel();
    };
  }, [language]);
  
  const processWithAI = async (text: string, mode: string): Promise<string> => {
    const debouncedFn = debouncedProcessWithAIRef.current;
    if (!debouncedFn) {
      throw new Error('API processing function not initialized');
    }
    
    return new Promise((resolve, reject) => {
      try {
        debouncedFn(text, mode, resolve).catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const handleModeChange = (mode: Mode) => {
    setSelectedMode(mode);
  };
  
  const handleTextSubmit = async (text: string) => {
    if (!text.trim()) return;
    
    setInputText(text);
    setLoading(true);
    setIsFileResult(false);
    
    try {
      const result = await processWithAI(text, selectedMode);
      setResultText(result);
    } catch (error) {
      console.error(language === 'zh' ? '改写过程中出错:' : 'Error during rewriting:', error);
      const errorMessage = language === 'zh' 
        ? '处理过程中出现错误，请稍后再试。' 
        : 'An error occurred during processing. Please try again later.';
      setResultText(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileUpload = async (text: string, fileName: string) => {
    setInputText(text);
    setOriginalFileName(fileName);
    setLoading(true);
    setIsFileResult(true);
    
    try {
      const result = await processWithAI(text, selectedMode);
      setResultText(result);
    } catch (error) {
      console.error(language === 'zh' ? '文件处理过程中出错:' : 'Error during file processing:', error);
      const errorMessage = language === 'zh' 
        ? '处理过程中出现错误，请稍后再试。' 
        : 'An error occurred during processing. Please try again later.';
      setResultText(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const getUIText = () => {
    if (language === 'zh') {
      return {
        tagline: '用AI提升您的写作',
        inputLabel: '输入',
        resultLabel: '结果',
      };
    } else {
      return {
        tagline: 'Enhance your writing with AI',
        inputLabel: 'Input',
        resultLabel: 'Result',
      };
    }
  };
  
  const { tagline, inputLabel, resultLabel } = getUIText();

  return (
    <main className={`min-h-screen flex flex-col ${
      darkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-b from-indigo-100 via-purple-50 to-white'
    }`}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        language={language} 
        setLanguage={setLanguage} 
      />
      
      <div className="container mx-auto flex-grow px-4 py-6 max-w-6xl">
        <div className={`rounded-xl shadow-2xl overflow-hidden ${
          darkMode ? 'bg-gray-800 text-white border border-gray-700' : 'bg-white border border-gray-100'
        }`}>
          <div className="p-6 md:p-8 pb-4">
            <div className="mb-4 text-center">
              <h1 className={`text-4xl font-bold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              } tracking-tight`}>
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Lyrica.ai</span>
              </h1>
              <p className={`text-lg font-medium tracking-wide ${
                darkMode ? 'text-indigo-300' : 'text-indigo-600'
              } opacity-90`}>{tagline}</p>
            </div>
          </div>
          
          <div className="px-6 md:px-8 py-4">
            <ModeSelector 
              selectedMode={selectedMode} 
              onSelectMode={handleModeChange} 
              darkMode={darkMode}
              language={language}
            />
          </div>
          
          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
            <div className="relative">
              <h3 className={`text-lg font-semibold mb-3 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>{inputLabel}</h3>
              <div className="relative">
                <TextInput 
                  onSubmit={handleTextSubmit} 
                  inputText={inputText} 
                  setInputText={setInputText}
                  language={language}
                />
                <FileUpload 
                  onFileProcessed={handleFileUpload} 
                  setInputText={setInputText}
                  language={language}
                  darkMode={darkMode}
                />
              </div>
            </div>
            
            <div>
              <h3 className={`text-lg font-semibold mb-3 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>{resultLabel}</h3>
              <DynamicResultDisplay 
                text={resultText} 
                loading={loading} 
                fileName={originalFileName}
                isFileResult={isFileResult}
                darkMode={darkMode}
                language={language}
              />
            </div>
          </div>
        </div>
      </div>
      
      <Footer darkMode={darkMode} language={language} />
    </main>
  );
}
