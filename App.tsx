import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { TrendCard } from './components/TrendCard';
import { ContentEditor } from './components/ContentEditor';
import { AppState, Trend, GeneratedContent, Tone } from './types';
import { scanForTrends, generateContent, generateImage } from './services/geminiService';
import { Search, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [generatedVisual, setGeneratedVisual] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentTone, setCurrentTone] = useState<Tone>('Default');

  const handleScan = async () => {
    setAppState(AppState.SCANNING);
    setError(null);
    try {
      const results = await scanForTrends();
      setTrends(results);
      setAppState(AppState.TRENDS_LOADED);
    } catch (err) {
      setError("Failed to scan for trends. Please check your API Key.");
      setAppState(AppState.IDLE);
    }
  };

  const handleSelectTrend = async (trend: Trend) => {
    setSelectedTrend(trend);
    setAppState(AppState.GENERATING_POST);
    setGeneratedVisual(null); // Reset image on new trend
    setError(null);
    
    try {
      const generated = await generateContent(trend, currentTone);
      setContent(generated);
      setAppState(AppState.POST_READY);
      
      // Auto-trigger image generation
      handleGenerateImage(generated.imagePrompt);
    } catch (err) {
      setError("Failed to generate content.");
      setAppState(AppState.TRENDS_LOADED);
    }
  };

  const handleToneChange = async (tone: Tone) => {
    if (!selectedTrend) return;
    setCurrentTone(tone);
    setAppState(AppState.GENERATING_POST);
    try {
        const generated = await generateContent(selectedTrend, tone);
        setContent(generated);
        setAppState(AppState.POST_READY);
    } catch (err) {
        setError("Failed to refine tone.");
        setAppState(AppState.POST_READY);
    }
  };

  const handleGenerateImage = async (prompt?: string) => {
    const promptToUse = prompt || content?.imagePrompt;
    if (!promptToUse) return;

    setAppState(AppState.GENERATING_IMAGE);
    try {
        const imageUrl = await generateImage(promptToUse);
        setGeneratedVisual(imageUrl);
        setAppState(AppState.POST_READY);
    } catch (err) {
        console.error(err);
        // Don't block the UI, just show no image
        setAppState(AppState.POST_READY);
    }
  };

  return (
    <Layout>
      <div className="flex h-full">
        {/* Left Panel: The Hunt */}
        <div className={`flex flex-col border-r border-border transition-all duration-500 ease-in-out ${content ? 'w-1/3 min-w-[350px]' : 'w-full max-w-4xl mx-auto border-none'}`}>
          <div className="p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-2">The Hunt</h2>
                <p className="text-zinc-400 text-sm">Scan real-time Agentic AI & RAG developments.</p>
            </div>

            {appState === AppState.IDLE && (
                <div className="flex flex-col items-center justify-center py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                    <button 
                        onClick={handleScan}
                        className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-zinc-100 text-zinc-900 rounded-full hover:bg-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900 ring-offset-zinc-900"
                    >
                        <Search className="w-5 h-5 mr-2 -ml-1 transition-transform group-hover:rotate-12" />
                        Scan for Trends
                    </button>
                    <p className="mt-4 text-xs text-zinc-500">Powered by Google Gemini 3 Flash Grounding</p>
                </div>
            )}

            {appState === AppState.SCANNING && (
                <div className="py-20 flex flex-col items-center text-zinc-500">
                    <Loader2 className="w-8 h-8 animate-spin text-accent mb-4" />
                    <p className="text-sm">Scanning Global Tech News...</p>
                </div>
            )}

            {(trends.length > 0) && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono text-zinc-500">TOP 3 SIGNALS FOUND</span>
                        <button onClick={handleScan} className="text-xs text-zinc-400 hover:text-white flex items-center"><RefreshIcon /> Rescan</button>
                     </div>
                    {trends.map(trend => (
                        <TrendCard 
                            key={trend.id} 
                            trend={trend} 
                            onSelect={handleSelectTrend}
                            isSelected={selectedTrend?.id === trend.id}
                        />
                    ))}
                </div>
            )}
            
            {error && (
                <div className="mt-6 p-4 bg-red-900/20 border border-red-900/50 rounded-lg flex items-center text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
            )}
          </div>
        </div>

        {/* Right Panel: The Content Factory */}
        {content && (
             <div className="flex-1 animate-in slide-in-from-right-10 duration-500">
                 {appState === AppState.GENERATING_POST ? (
                     <div className="h-full flex flex-col items-center justify-center bg-zinc-950 text-zinc-500">
                         <Sparkles className="w-10 h-10 text-purple-500 animate-pulse mb-4" />
                         <p className="text-sm font-medium text-zinc-300">Architecting your viral post...</p>
                         <p className="text-xs mt-2">Analyzing business impact & Tone</p>
                     </div>
                 ) : (
                    <ContentEditor 
                        content={content}
                        isGeneratingImage={appState === AppState.GENERATING_IMAGE}
                        generatedImage={generatedVisual}
                        onToneChange={handleToneChange}
                        onGenerateImage={() => handleGenerateImage()}
                        currentTone={currentTone}
                    />
                 )}
             </div>
        )}
      </div>
    </Layout>
  );
};

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
)

export default App;