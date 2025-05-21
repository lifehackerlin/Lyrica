import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile } from 'react-icons/fi';

interface FileUploadProps {
  onFileProcessed: (text: string, fileName: string) => void;
  setInputText?: (text: string) => void;
}

export default function FileUpload({ onFileProcessed, setInputText }: FileUploadProps) {
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
        // 这里应该有更复杂的处理Word文档的逻辑
        // 简化版，实际上需要使用库来解析docx或doc文件
        const text = await extractTextFromDoc(file);
        if (setInputText) setInputText(text);
        onFileProcessed(text, file.name);
      } else if (file.type.includes('application/pdf')) {
        // 这里应该有PDF解析逻辑
        // 简化版，实际上需要使用库来解析PDF文件
        const text = await extractTextFromPdf(file);
        if (setInputText) setInputText(text);
        onFileProcessed(text, file.name);
      } else {
        throw new Error('不支持的文件类型，请上传TXT、Word或PDF文件');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理文件时发生错误');
      console.error('文件处理错误:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 简化的文档文本提取函数（实际项目中需要实现）
  const extractTextFromDoc = async (file: File): Promise<string> => {
    // 这里应该使用合适的库解析docx文件
    // 简化模拟
    return `[从${file.name}中提取的文本]`;
  };

  // 简化的PDF文本提取函数（实际项目中需要实现）
  const extractTextFromPdf = async (file: File): Promise<string> => {
    // 这里应该使用合适的库解析PDF文件
    // 简化模拟
    return `[从${file.name}中提取的文本]`;
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

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-3 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
        }`}
        style={{ minHeight: '80px' }}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {isProcessing ? (
            <div className="text-gray-600 text-sm">
              <svg className="animate-spin h-5 w-5 text-indigo-600 mx-auto mb-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              处理文件中...
            </div>
          ) : (
            <>
              <div className="flex items-center text-sm">
                {isDragActive ? (
                  <FiUpload className="text-indigo-600 mr-2" />
                ) : (
                  <FiFile className="text-gray-400 mr-2" />
                )}
                <p className="text-sm text-gray-600 m-0">
                  {isDragActive
                    ? '放开以上传文件'
                    : '拖放或点击上传文件'}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                支持: TXT, DOC, DOCX, PDF
              </p>
            </>
          )}
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
} 