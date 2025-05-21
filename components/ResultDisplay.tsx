import { FiCopy, FiDownload, FiCheck } from 'react-icons/fi';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph } from 'docx';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { useState } from 'react';

interface ResultDisplayProps {
  text: string;
  loading: boolean;
  fileName?: string;
  isFileResult: boolean;
  darkMode?: boolean;
  language?: string;
}

export default function ResultDisplay({ 
  text, 
  loading, 
  fileName, 
  isFileResult,
  darkMode = false,
  language = 'en'
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error(language === 'zh' ? '复制失败:' : 'Copy failed:', err);
        const message = language === 'zh' ? '复制失败' : 'Copy failed';
        alert(message);
      });
  };

  const handleDownloadWord = async () => {
    try {
      // 创建一个新的Word文档
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: text,
            }),
          ],
        }],
      });

      // 生成文件并下载
      const buffer = await Packer.toBuffer(doc);
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      
      // 使用原始文件名（如果有）
      const wordFileName = fileName 
        ? fileName.replace(/\.[^/.]+$/, '') + '_rewrite.docx' 
        : 'lyrica_ai_rewrite.docx';
        
      saveAs(blob, wordFileName);
    } catch (error) {
      console.error(language === 'zh' ? '下载Word文档时出错:' : 'Error downloading Word document:', error);
      const message = language === 'zh' ? '下载文档失败，请稍后再试。' : 'Failed to download document. Please try again later.';
      alert(message);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // 创建PDF文档
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4尺寸
      
      // 添加字体
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      // 添加文本
      page.drawText(text, {
        x: 50,
        y: 750,
        size: 12,
        font,
        color: rgb(0, 0, 0),
        lineHeight: 18,
        maxWidth: 495,
      });
      
      // 保存PDF文件
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      
      // 使用原始文件名（如果有）
      const pdfFileName = fileName 
        ? fileName.replace(/\.[^/.]+$/, '') + '_rewrite.pdf' 
        : 'lyrica_ai_rewrite.pdf';
        
      saveAs(blob, pdfFileName);
    } catch (error) {
      console.error(language === 'zh' ? '下载PDF文档时出错:' : 'Error downloading PDF document:', error);
      const message = language === 'zh' ? '下载文档失败，请稍后再试。' : 'Failed to download document. Please try again later.';
      alert(message);
    }
  };

  // 获取界面文本
  const getUIText = () => {
    if (language === 'zh') {
      return {
        loading: 'AI正在改写中...',
        copyBtn: '复制',
        copied: '已复制',
        wordBtn: 'Word',
        pdfBtn: 'PDF',
        placeholder: '结果将显示在这里...'
      };
    } else {
      return {
        loading: 'AI is rewriting...',
        copyBtn: 'Copy',
        copied: 'Copied',
        wordBtn: 'Word',
        pdfBtn: 'PDF',
        placeholder: 'Results will appear here...'
      };
    }
  };

  const { loading: loadingText, copyBtn, copied: copiedText, wordBtn, pdfBtn, placeholder } = getUIText();

  return (
    <div className={`border rounded-lg overflow-hidden flex flex-col ${
      darkMode 
        ? 'bg-gray-800 border-gray-700 text-gray-200' 
        : 'bg-white border-gray-300 text-gray-800'
    }`}
    style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.08)', minHeight: '250px' }}>
      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center p-8">
          <div className="relative flex items-center justify-center">
            <div className="absolute animate-ping rounded-full h-16 w-16 border border-indigo-400 opacity-30"></div>
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
              darkMode ? 'border-indigo-400' : 'border-indigo-500'
            }`}></div>
          </div>
          <p className={`mt-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          } font-medium`}>{loadingText}</p>
        </div>
      ) : text ? (
        <>
          <div className="flex-grow p-4 overflow-y-auto scrollbar-thin" style={{ maxHeight: 'calc(100vh - 400px)' }}>
            <div className={`whitespace-pre-wrap ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            } leading-relaxed`}>{text}</div>
          </div>
          <div className={`flex justify-between items-center p-3 border-t ${
            darkMode ? 'border-gray-700 bg-gray-850' : 'border-gray-200 bg-gray-50'
          }`}>
            <div>
              <button
                onClick={handleCopy}
                className={`hover:text-indigo-700 flex items-center transition-colors ${
                  copied 
                    ? (darkMode ? 'text-green-400' : 'text-green-600')
                    : (darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600')
                }`}
                title={language === 'zh' ? '复制到剪贴板' : 'Copy to clipboard'}
              >
                {copied ? (
                  <>
                    <FiCheck className="mr-1" /> {copiedText}
                  </>
                ) : (
                  <>
                    <FiCopy className="mr-1" /> {copyBtn}
                  </>
                )}
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleDownloadWord}
                className={`px-3 py-1 rounded-md flex items-center text-sm transition-colors ${
                  darkMode 
                    ? 'bg-indigo-700 text-white hover:bg-indigo-800' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
                title={language === 'zh' ? '下载Word文档' : 'Download as Word'}
                style={{ boxShadow: darkMode ? 'none' : '0 2px 5px rgba(79, 70, 229, 0.15)' }}
              >
                <FiDownload className="mr-1" /> {wordBtn}
              </button>
              <button
                onClick={handleDownloadPDF}
                className={`px-3 py-1 rounded-md flex items-center text-sm transition-colors ${
                  darkMode 
                    ? 'bg-indigo-700 text-white hover:bg-indigo-800' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
                title={language === 'zh' ? '下载PDF文档' : 'Download as PDF'}
                style={{ boxShadow: darkMode ? 'none' : '0 2px 5px rgba(79, 70, 229, 0.15)' }}
              >
                <FiDownload className="mr-1" /> {pdfBtn}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center p-8">
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>{placeholder}</p>
        </div>
      )}
    </div>
  );
} 