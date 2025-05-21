import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiPaperclip } from 'react-icons/fi';

interface FileUploadProps {
  onFileProcessed: (text: string, fileName: string) => void;
  setInputText?: (text: string) => void;
  language?: string;
  darkMode?: boolean;
}

export default function FileUpload({ onFileProcessed, setInputText, language = 'en', darkMode = false }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // 根据文件类型处理
      if (file.type.includes('text/plain')) {
        // 处理TXT文件
        const text = await file.text();
        if (setInputText) setInputText(text);
        onFileProcessed(text, file.name);
      } else if (
        file.type.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
        file.type.includes('application/msword')
      ) {
        // 处理Word文档
        const text = await extractTextFromDoc(file);
        if (setInputText) setInputText(text);
        onFileProcessed(text, file.name);
      } else if (file.type.includes('application/pdf')) {
        // 处理PDF文件
        const text = await extractTextFromPdf(file);
        if (setInputText) setInputText(text);
        onFileProcessed(text, file.name);
      } else {
        throw new Error(
          language === 'zh' 
            ? '不支持的文件类型，请上传TXT、Word或PDF文件' 
            : 'Unsupported file type. Please upload TXT, Word, or PDF files'
        );
      }
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : language === 'zh' 
            ? '处理文件时发生错误' 
            : 'Error processing file'
      );
      console.error(language === 'zh' ? '文件处理错误:' : 'File processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 简化的文档文本提取函数（实际项目中需要实现）
  const extractTextFromDoc = async (file: File): Promise<string> => {
    // 这里应该使用合适的库解析docx文件
    // 简化模拟
    return language === 'zh'
      ? `[从${file.name}中提取的文本]`
      : `[Text extracted from ${file.name}]`;
  };

  // 简化的PDF文本提取函数（实际项目中需要实现）
  const extractTextFromPdf = async (file: File): Promise<string> => {
    // 这里应该使用合适的库解析PDF文件
    // 简化模拟
    return language === 'zh'
      ? `[从${file.name}中提取的文本]`
      : `[Text extracted from ${file.name}]`;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        processFile(file);
      }
    },
    [onFileProcessed, setInputText]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: false
  });

  // 根据语言获取文本
  const getStatusText = () => {
    if (isProcessing) {
      return language === 'zh' ? '处理文件中...' : 'Processing file...';
    }
    
    if (isDragActive) {
      return language === 'zh' ? '放开以上传文件' : 'Drop to upload';
    }
    
    return language === 'zh' ? '上传文件' : 'Upload file';
  };

  const getFormatText = () => {
    return language === 'zh' 
      ? '支持: TXT, DOC, DOCX, PDF'
      : 'Supports: TXT, DOC, DOCX, PDF';
  };

  return (
    <div className="absolute bottom-16 left-3">
      <div
        {...getRootProps()}
        className={`rounded-full w-12 h-12 flex items-center justify-center cursor-pointer shadow-md transition-all ${
          isDragActive
            ? 'bg-indigo-600 text-white scale-110'
            : darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
              : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
        }`}
        title={getStatusText()}
      >
        <input {...getInputProps()} />
        {isProcessing ? (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <FiPaperclip className="w-5 h-5" />
        )}
        
        {/* 工具提示 */}
        <div className={`absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded bg-gray-800 text-white text-xs whitespace-nowrap ${
          error ? 'block opacity-100' : ''
        }`}>
          {error || getFormatText()}
        </div>
      </div>
    </div>
  );
} 