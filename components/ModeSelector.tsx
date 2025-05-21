import { ChineseMode, EnglishMode, Mode } from '@/app/types';

interface ModeSelectorProps {
  selectedMode: Mode;
  onSelectMode: (mode: Mode) => void;
  darkMode?: boolean;
  language?: string;
}

export default function ModeSelector({ selectedMode, onSelectMode, darkMode = false, language = 'en' }: ModeSelectorProps) {
  const getModes = () => {
    if (language === 'zh') {
      return [
        { id: 'standard', label: '标准' as ChineseMode },
        { id: 'formal', label: '正式' as ChineseMode },
        { id: 'academic', label: '学术' as ChineseMode },
        { id: 'expand', label: '拓展' as ChineseMode },
        { id: 'summary', label: '总结' as ChineseMode },
        { id: 'story', label: '故事化' as ChineseMode },
        { id: 'creative', label: '创意' as ChineseMode },
      ];
    } else {
      return [
        { id: 'standard', label: 'Standard' as EnglishMode },
        { id: 'formal', label: 'Formal' as EnglishMode },
        { id: 'academic', label: 'Academic' as EnglishMode },
        { id: 'expand', label: 'Expanded' as EnglishMode },
        { id: 'summary', label: 'Summary' as EnglishMode },
        { id: 'story', label: 'Narrative' as EnglishMode },
        { id: 'creative', label: 'Creative' as EnglishMode },
      ];
    }
  };

  const modes = getModes();

  return (
    <div className="flex flex-wrap gap-2">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelectMode(mode.label)}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            selectedMode === mode.label
              ? darkMode
                ? 'bg-indigo-700 text-white'
                : 'bg-indigo-600 text-white'
              : darkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
} 