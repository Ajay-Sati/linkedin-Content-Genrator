import React from 'react';
import { Trend } from '../types';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface TrendCardProps {
  trend: Trend;
  onSelect: (trend: Trend) => void;
  isSelected: boolean;
}

export const TrendCard: React.FC<TrendCardProps> = ({ trend, onSelect, isSelected }) => {
  return (
    <div 
      onClick={() => onSelect(trend)}
      className={`group relative p-5 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden
        ${isSelected 
          ? 'bg-zinc-900 border-accent/50 shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]' 
          : 'bg-zinc-900/40 border-border hover:bg-zinc-800/60 hover:border-zinc-700'
        }`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
         <ArrowRight className={`w-5 h-5 ${isSelected ? 'text-accent' : 'text-zinc-500'}`} />
      </div>

      <div className="flex flex-col h-full space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-accent bg-blue-950/30 px-2 py-1 rounded border border-blue-900/50">
            {trend.source}
          </span>
          {trend.url && (
            <a href={trend.url} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-400 z-10" onClick={(e) => e.stopPropagation()}>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
        
        <h3 className={`font-semibold leading-tight ${isSelected ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>
          {trend.title}
        </h3>
        
        <p className="text-sm text-zinc-400 line-clamp-3">
          {trend.summary}
        </p>
        
        <div className="mt-auto pt-3 border-t border-white/5">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Business Impact</p>
            <p className="text-xs text-zinc-400 italic">"{trend.businessImpact}"</p>
        </div>
      </div>
    </div>
  );
};