import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Target, RefreshCw, Star, Info } from 'lucide-react';

interface ResultAnalysisProps {
  scores: Record<string, number>;
  totalBlocks: number;
  onRestart: () => void;
}

export const ResultAnalysis: React.FC<ResultAnalysisProps> = ({ scores, totalBlocks, onRestart }) => {
  const completedCount = Object.keys(scores).length;
  const averageScore = completedCount > 0 
    ? (Object.values(scores) as number[]).reduce((a, b) => a + b, 0) / completedCount 
    : 0;

  const getStatus = () => {
    if (averageScore >= 90) return { label: 'Експерт', color: 'text-yellow-500', icon: '🏆' };
    if (averageScore >= 70) return { label: 'Спеціаліст', color: 'text-green-500', icon: '🎓' };
    return { label: 'Початківець', color: 'text-blue-500', icon: '📚' };
  };

  const status = getStatus();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-5xl mx-auto p-12 bg-white rounded-[2rem] border border-slate-200 mt-12 mb-20 shadow-xl"
    >
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl text-white font-bold">
          {status.icon}
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">АНАЛІТИКА КУРСУ</h2>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Результати навчального циклу</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Обсяг знань</span>
          <div className="text-5xl font-black text-slate-900">{completedCount}/{totalBlocks}</div>
          <span className="text-xs font-bold text-blue-600 mt-2 uppercase tracking-wide">Завершено</span>
        </div>
        <div className="p-8 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Точність</span>
          <div className="text-5xl font-black text-slate-900">{Math.round(averageScore)}%</div>
          <span className="text-xs font-bold text-green-600 mt-2 uppercase tracking-wide">Середній бал</span>
        </div>
        <div className="p-8 bg-slate-900 rounded-2xl flex flex-col items-center text-white">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Статус</span>
          <div className={`text-3xl font-black ${status.color}`}>{status.label}</div>
          <span className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">Кваліфікація</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-12">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Профіль навичок
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.entries(scores) as [string, number][]).map(([blockId, score]) => (
              <div key={blockId} className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${score >= 80 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                  {score}%
                </div>
                <div className="flex-1">
                  <div className="text-xs font-black text-slate-900 uppercase tracking-wide mb-1">
                    {blockId.replace('-', ' ')}
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${score >= 80 ? 'bg-green-500' : 'bg-amber-500'}`} 
                      style={{ width: `${score}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-950 text-white p-10 rounded-[2.5rem] border border-slate-800">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-6">Спеціалізація</h4>
            <div className="space-y-4">
              {(Object.entries(scores) as [string, number][]).filter(([, s]) => s >= 80).map(([id]) => (
                <div key={id} className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span className="text-sm font-bold italic">Висока компетенція: {id}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-6">Рекомендації</h4>
            <div className="space-y-4">
              {(Object.entries(scores) as [string, number][]).filter(([, s]) => s < 80).map(([id]) => (
                <div key={id} className="flex items-center gap-3 text-slate-300">
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span className="text-sm font-bold italic">Повторити: {id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center">
          <button 
            onClick={onRestart}
            className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-blue-500/20"
          >
            Перезапустити Модуль
          </button>
          <div className="mt-8 text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">
            Версія 1.0.4 / СТАБІЛЬНО
          </div>
        </div>
      </div>
    </motion.div>
  );
};
