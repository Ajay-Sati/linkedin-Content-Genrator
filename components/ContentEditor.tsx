import React, { useState } from 'react';
import { GeneratedContent, Tone } from '../types';
import { Copy, RefreshCw, Image as ImageIcon, Send, Sparkles, Wand2 } from 'lucide-react';

interface ContentEditorProps {
  content: GeneratedContent;
  isGeneratingImage: boolean;
  generatedImage: string | null;
  onToneChange: (tone: Tone) => void;
  onGenerateImage: () => void;
  currentTone: Tone;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ 
  content, 
  isGeneratingImage, 
  generatedImage,
  onToneChange,
  onGenerateImage,
  currentTone
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content.post);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tones: Tone[] = ['Default', 'Technical', 'Skeptical', 'Beginner-Friendly'];

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-zinc-900/20">
        <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider mr-2">Tone:</span>
            {tones.map(t => (
                <button
                    key={t}
                    onClick={() => onToneChange(t)}
                    className={`px-3 py-1 text-xs rounded-full border transition-all ${
                        currentTone === t 
                        ? 'bg-white text-black border-white font-medium' 
                        : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600'
                    }`}
                >
                    {t}
                </button>
            ))}
        </div>
        <button 
            onClick={handleCopy}
            className="flex items-center space-x-2 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md transition-colors"
        >
            {copied ? <span>Copied!</span> : <><Copy size={14} /><span>Copy Post</span></>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Post Preview */}
        <div className="space-y-2">
            <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center">
                <Send size={12} className="mr-2" /> LinkedIn Post Preview
            </h4>
            <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                    <div>
                        <div className="h-3 w-24 bg-zinc-800 rounded animate-pulse mb-1"></div>
                        <div className="h-2 w-16 bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                </div>
                <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-100">
                    {content.post}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                    {content.hashtags.map(tag => (
                        <span key={tag} className="text-accent text-xs hover:underline cursor-pointer">{tag}</span>
                    ))}
                </div>
            </div>
        </div>

        {/* First Comment Strategy */}
        <div className="space-y-2">
             <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center">
                <Sparkles size={12} className="mr-2" /> Engagement Strategy
            </h4>
            <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-lg p-4">
                <p className="text-xs text-zinc-400 mb-1">Suggested First Comment:</p>
                <p className="text-sm text-zinc-200 italic border-l-2 border-zinc-700 pl-3">
                    {content.firstComment}
                </p>
            </div>
        </div>

        {/* Visual Factory */}
        <div className="space-y-2 pb-6">
            <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center">
                    <ImageIcon size={12} className="mr-2" /> Visual Factory
                </h4>
                {!generatedImage && !isGeneratingImage && (
                    <button 
                        onClick={onGenerateImage}
                        className="text-xs flex items-center space-x-1 text-accent hover:text-blue-400 transition-colors"
                    >
                        <Wand2 size={12} />
                        <span>Generate Image</span>
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-zinc-900 border border-border rounded-lg p-3">
                     <p className="text-[10px] text-zinc-500 uppercase mb-2">Prompt Brief</p>
                     <p className="text-xs text-zinc-400 font-mono leading-relaxed">{content.imagePrompt}</p>
                </div>

                <div className="relative w-full aspect-video rounded-lg border border-border bg-zinc-950 overflow-hidden flex items-center justify-center">
                    {isGeneratingImage ? (
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-2"></div>
                            <span className="text-xs text-zinc-500 animate-pulse">Rendering with Gemini 2.5 Flash...</span>
                        </div>
                    ) : generatedImage ? (
                        <img src={generatedImage} alt="Generated Visual" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    ) : (
                        <div className="text-zinc-700 flex flex-col items-center">
                            <ImageIcon size={32} strokeWidth={1} />
                            <span className="text-xs mt-2">Waiting for generation</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};