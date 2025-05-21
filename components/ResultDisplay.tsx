import { FiCopy, FiDownload } from 'react-icons/fi';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph } from 'docx';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

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
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        const message = language === 'zh' ? '文本已复制到剪贴板！' : 'Text copied to clipboard!';
        alert(message);
      })
      .catch(err => {
        console.error('复制失败:', err);
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
      console.error('下载Word文档时出错:', error);
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
      console.error('下载PDF文档时出错:', error);
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
        wordBtn: 'Word',
        pdfBtn: 'PDF',
        placeholder: '结果将显示在这里...'
      };
    } else {
      return {
        loading: 'AI is rewriting...',
        copyBtn: 'Copy',
        wordBtn: 'Word',
        pdfBtn: 'PDF',
        placeholder: 'Results will appear here...'
      };
    }
  };

  const { loading: loadingText, copyBtn, wordBtn, pdfBtn, placeholder } = getUIText();

  return (
    <div className={`border rounded-md p-4 h-full min-h-[200px] flex flex-col ${
      darkMode 
        ? 'bg-gray-700 border-gray-600' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            darkMode ? 'border-indigo-400' : 'border-indigo-500'
          }`}></div>
          <p className={`mt-4 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>{loadingText}</p>
        </div>
      ) : text ? (
        <>
          <div className={`flex-grow mb-4 whitespace-pre-wrap ${
            darkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>{text}</div>
          <div className={`flex justify-between border-t pt-3 ${
            darkMode ? 'border-gray-600' : 'border-gray-200'
          }`}>
            <div>
              <button
                onClick={handleCopy}
                className={`hover:text-indigo-700 flex items-center mr-4 ${
                  darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600'
                }`}
              >
                <FiCopy className="mr-1" /> {copyBtn}
              </button>
            </div>
            {isFileResult && (
              <div className="flex space-x-2">
                <button
                  onClick={handleDownloadWord}
                  className={`px-3 py-1 rounded-md flex items-center text-sm ${
                    darkMode 
                      ? 'bg-indigo-900 text-indigo-300 hover:bg-indigo-800' 
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  <FiDownload className="mr-1" /> {wordBtn}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className={`px-3 py-1 rounded-md flex items-center text-sm ${
                    darkMode 
                      ? 'bg-indigo-900 text-indigo-300 hover:bg-indigo-800' 
                      : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  <FiDownload className="mr-1" /> {pdfBtn}
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{placeholder}</p>
        </div>
      )}
    </div>
  );
} 